import { BotMessageTheme, TextInputTheme, UserMessageTheme } from '@/features/bubble/types';
import { Popup } from '@/features/popup';
import { MessageBE, RunInput } from '@/queries/sendMessageQuery';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { For, createEffect, createSignal, onMount } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { Bottombar } from './Bottombar';
import { products, setProducts, updateProducts } from './Products';
import Topbar from './Topbar';
import { BotBubble } from './bubbles/BotBubble';
import FirstMessageBubble from './bubbles/FirstMessageBubble';
import { GuestBubble } from './bubbles/GuestBubble';
import { LoadingBubble } from './bubbles/LoadingBubble';

type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting';

export type InstagramMetadata = {
  caption: string;
  kind: string;
  pk: number;
  resource_url: string;
  media_url: string;
  subtitles: string;
};

export type ProductMetadata = {
  name: string;
  price: string;
  item_url: string;
  thumbnail_url: string;
};

export type SourceDocument = {
  page_content: string;
  metadata: ProductMetadata | InstagramMetadata;
  type: 'Document';
};

export type ContextEvent = {
  context: SourceDocument[]; // JSON string of source documents
};

export type AnswerEvent = {
  answer: string;
};

export type MetadataEvent = {
  run_id: string;
};

export type MessageType = {
  message: string;
  type: messageType;
  sourceProducts?: SourceDocument[];
  sourceInstagramPosts?: SourceDocument[];
  fileAnnotations?: any;
};

export type UserProps = {
  customerEmail: string;
  customerName: string;
};

export type BotProps = {
  chatflowid: string;
  apiHost: string;
  chatflowConfig?: Record<string, unknown>;
  starterPrompts?: string[];
  welcomeMessage?: string;
  botMessage?: BotMessageTheme;
  userMessage?: UserMessageTheme;
  textInput?: TextInputTheme;
  poweredByTextColor?: string;
  badgeBackgroundColor?: string;
  bubbleButtonColor?: string;
  topbarColor?: string;
  bubbleTextColor?: string;
  titleColor?: string;
  title?: string;
  titleAvatarSrc?: string;
  fontSize?: number;
  isFullPage?: boolean;
};

const defaultWelcomeMessage = 'Hi there! How can I help?';

export const Bot = (props: BotProps & { class?: string } & UserProps) => {
  let chatContainer: HTMLDivElement | undefined;
  let bottomSpacer: HTMLDivElement | undefined;
  let botContainer: HTMLDivElement | undefined;
  console.log('props', props);

  const [userInput, setUserInput] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [sourcePopupOpen, setSourcePopupOpen] = createSignal(false);
  const [sourcePopupSrc, setSourcePopupSrc] = createSignal({});
  const [messages, setMessages] = createSignal<MessageType[]>(
    [
      {
        message: props.welcomeMessage ?? defaultWelcomeMessage,
        type: 'apiMessage',
      },
    ],
    { equals: false },
  );
  const [isChatFlowAvailableToStream, setIsChatFlowAvailableToStream] = createSignal(false);

  const [chatId, setChatId] = createSignal(props.customerEmail);
  const [starterPrompts, setStarterPrompts] = createSignal<string[]>(props.starterPrompts || [], { equals: false });

  onMount(() => {
    if (!bottomSpacer) return;
    setTimeout(() => {
      chatContainer?.scrollTo(0, chatContainer.scrollHeight);
    }, 50);
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      chatContainer?.scrollTo(0, chatContainer.scrollHeight);
    }, 50);
  };

  /**
   * Add each chat message into localStorage
   */
  const addChatMessage = (allMessage: MessageType[]) => {
    localStorage.setItem(`${props.chatflowid}_EXTERNAL`, JSON.stringify({ chatId: chatId(), chatHistory: allMessage }));
  };

  const getSkus = (message: string) => {
    return [...message.matchAll(/<pr sku=(\d+)><\/pr>/g)].map((m) => m[1]);
  };

  const addEmptyMessage = () =>
    setMessages((prevMessages) => {
      const messages: MessageType[] = [...prevMessages, { message: '', type: 'apiMessage' }];
      return messages;
    });

  const updateLastMessage = (new_token: string) => {
    setMessages((data) => {
      const lastMsg = data[data.length - 1].message;

      const skus = getSkus(lastMsg);

      skus.forEach((sku) => {
        if (products().has(sku)) {
          return;
        }
        updateProducts(sku);
        setProducts((prevProducts) => {
          const newProducts = new Map(prevProducts);
          newProducts.set(sku, { loading: true });
          return newProducts;
        });
        return;
      });

      const updated = data.map((item, i) => {
        if (i === data.length - 1) {
          return { ...item, message: item.message + new_token };
        }
        return item;
      });
      addChatMessage(updated);
      return [...updated];
    });
  };

  const updateLastMessageSources = (sourceProducts?: SourceDocument[], sourceInstagramPosts?: SourceDocument[]) => {
    setMessages((data) => {
      const updated = data.map((item, i) => {
        if (i === data.length - 1) {
          return {
            ...item,
            sourceProducts: sourceProducts || item.sourceProducts,
            sourceInstagramPosts: sourceInstagramPosts || item.sourceInstagramPosts,
          };
        }
        return item;
      });
      addChatMessage(updated);
      return [...updated];
    });
  };

  // Handle errors
  const handleError = (message = 'Oops! There seems to be an error. Please try again.') => {
    setMessages((prevMessages) => {
      const messages: MessageType[] = [...prevMessages, { message, type: 'apiMessage' }];
      addChatMessage(messages);
      return messages;
    });
    setLoading(false);
    setUserInput('');
    scrollToBottom();
  };

  const messageTypeFEtoBE = (msg: messageType) => {
    switch (msg) {
      case 'apiMessage':
        return 'ai';
      case 'userMessage':
        return 'human';
      case 'usermessagewaiting':
        return 'human';
      default:
        return 'system';
    }
  };

  // Handle form submission
  const handleSubmit = async (value: string) => {
    console.log('handleSubmit', value);
    setUserInput(value);

    if (value.trim() === '') {
      return;
    }

    setLoading(true);
    scrollToBottom();

    setMessages((prevMessages) => {
      const messages: MessageType[] = [...prevMessages, { message: value, type: 'userMessage' }];
      addChatMessage(messages);
      return messages;
    });

    // Send user question and history to API
    const messageList: MessageBE[] = messages().map((message) => {
      return { content: message.message, type: messageTypeFEtoBE(message.type) };
    });
    const body: RunInput = {
      input: {
        input: value,
        chat_history: messageList,
      },
      config: {},
    };

    setIsChatFlowAvailableToStream(false);
    const abortCtrl = new AbortController();

    let currMsg = '';
    let sourceProducts: SourceDocument[] = [];
    let sourceInstagramPosts: SourceDocument[] = [];

    await fetchEventSource(`${props.apiHost}/${props.chatflowid}/stream`, {
      signal: abortCtrl.signal,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      openWhenHidden: true,
      onclose: () => {
        console.log('EventSource closed');
      },
      onerror: (err) => {
        console.error('EventSource error:', err);
        abortCtrl.abort();
      },
      onopen: async (response) => {
        console.log('EventSource opened', response);
      },
      onmessage(ev) {
        console.log('EventSource message:', ev.data);
        if (ev.event === 'metadata') {
          const data: MetadataEvent = JSON.parse(ev.data);
          setChatId(data.run_id);
        } else if (ev.event === 'close') {
          abortCtrl.abort();
        } else if (ev.event === 'data') {
          const data: ContextEvent | AnswerEvent = JSON.parse(ev.data);
          if (data.answer) {
            if (currMsg === '') {
              addEmptyMessage();
            }
            currMsg += data.answer;
            updateLastMessage(data.answer);
          } else if (data.context) {
            let ctx: SourceDocument[] = data.context;
            sourceInstagramPosts = ctx.filter((doc) => doc.metadata?.media_url);
            sourceProducts = ctx.filter((doc) => doc.metadata?.item_url);
          }
        }
      },
    });

    setIsChatFlowAvailableToStream(true);
    updateLastMessageSources(sourceProducts, sourceInstagramPosts);
    setLoading(false);
    setUserInput('');
    scrollToBottom();

    setMessages((prevMessages) => {
      const messages: MessageType[] = [...prevMessages];
      addChatMessage(messages);
      return messages;
    });
  };

  const clearChat = () => {
    try {
      localStorage.removeItem(`${props.chatflowid}_EXTERNAL`);
      setChatId(uuidv4());
      setMessages([
        {
          message: props.welcomeMessage ?? defaultWelcomeMessage,
          type: 'apiMessage',
        },
      ]);
    } catch (error: any) {
      const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`;
      console.error(`error: ${errorData}`);
    }
  };

  // Auto scroll chat to bottom
  createEffect(() => {
    if (messages()) scrollToBottom();
  });

  createEffect(() => {
    if (props.fontSize && botContainer) botContainer.style.fontSize = `${props.fontSize}px`;
  });

  createEffect(async () => {
    const localChatsData = localStorage.getItem(`${props.chatflowid}_EXTERNAL`);
    if (localChatsData) {
      const localChats: { chatHistory: MessageType[]; chatId: string } = JSON.parse(localChatsData);
      setChatId(localChats.chatId);
      const msgs: MessageType[] = [];
      localChats.chatHistory.forEach((message: MessageType) => {
        msgs.push(message);
        setMessages([...msgs]);
        updateLastMessage('');
      });
    }
    setIsChatFlowAvailableToStream(true);

    // eslint-disable-next-line solid/reactivity
    return () => {
      setUserInput('');
      setLoading(false);
      setMessages([
        {
          message: props.welcomeMessage ?? defaultWelcomeMessage,
          type: 'apiMessage',
        },
      ]);
    };
  });

  const isValidURL = (url: string): URL | undefined => {
    try {
      return new URL(url);
    } catch (err) {
      return undefined;
    }
  };

  return (
    <>
      <div
        ref={botContainer}
        class={'relative flex w-full h-full text-base overflow-hidden bg-cover bg-center flex-col items-center chatbot-container ' + props.class}
      >
        <div class="flex w-full h-full justify-center pb-14 pt-14">
          <div
            ref={chatContainer}
            class="overflow-y-scroll min-w-full w-full min-h-full px-3 relative scrollable-container chatbot-chat-view scroll-smooth"
          >
            <p class="m-5 text-2xl font-bold text-white text-jost">Welcome to my @Twini :)</p>
            <FirstMessageBubble
              backgroundColor={props.botMessage?.backgroundColor}
              textColor={props.botMessage?.textColor}
              scrollToBottom={scrollToBottom}
              setUserInput={setUserInput}
            />
            <For each={messages()}>
              {(message, index) => (
                <>
                  {message.type === 'userMessage' && (
                    <GuestBubble
                      message={message.message}
                      backgroundColor={props.userMessage?.backgroundColor}
                      textColor={props.userMessage?.textColor}
                      showAvatar={props.userMessage?.showAvatar}
                      avatarSrc={props.userMessage?.avatarSrc}
                    />
                  )}
                  {message.type === 'apiMessage' && (
                    <BotBubble
                      message={message.message}
                      fileAnnotations={message.fileAnnotations}
                      apiHost={props.apiHost}
                      backgroundColor={props.botMessage?.backgroundColor}
                      textColor={props.botMessage?.textColor}
                      showAvatar={props.botMessage?.showAvatar}
                      avatarSrc={props.botMessage?.avatarSrc}
                      sourceProducts={message.sourceProducts}
                      sourceInstagramPosts={message.sourceInstagramPosts}
                    />
                  )}
                  {message.type === 'userMessage' && loading() && index() === messages().length - 1 && <LoadingBubble />}
                </>
              )}
            </For>
          </div>
        </div>
        <Topbar
          title={props.title}
          titleColor={props.titleColor}
          titleAvatarSrc={props.titleAvatarSrc}
          bubbleTextColor={props.bubbleTextColor}
          bubbleButtonColor={props.bubbleButtonColor}
          topbarColor={props.topbarColor}
          isFullPage={props.isFullPage}
        />
      </div>
      <div class="fixed w-full z-50" style={{ bottom: '0' }}>
        <span>CIAO</span>
        <textarea></textarea>
      </div>
      {sourcePopupOpen() && <Popup isOpen={sourcePopupOpen()} value={sourcePopupSrc()} onClose={() => setSourcePopupOpen(false)} />}
    </>
  );
};

type BottomSpacerProps = {
  ref: HTMLDivElement | undefined;
};
const BottomSpacer = (props: BottomSpacerProps) => {
  return <div ref={props.ref} class="w-full h-16" />;
};
