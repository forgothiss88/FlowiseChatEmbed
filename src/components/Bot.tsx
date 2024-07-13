import { BotMessageTheme, TextInputTheme, UserMessageTheme } from '@/features/bubble/types';
import { Popup } from '@/features/popup';
import { MessageBE, RunInput } from '@/queries/sendMessageQuery';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { For, Show, createEffect, createSignal, onMount } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { Bottombar } from './Bottombar';
import { products, setProducts, updateProducts } from './Products';
import Topbar from './Topbar';
import { BotBubble } from './bubbles/BotBubble';
import FirstMessageBubble, { FirstMessageConfig } from './bubbles/FirstMessageBubble';
import { GuestBubble } from './bubbles/GuestBubble';
import { LoadingBubble } from './bubbles/LoadingBubble';
import bot from '@/web';
import { forEach } from 'lodash';

type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting';

export type ContentMetadata = {
  kind: 'instagram-video' | 'youtube-video' | 'video' | 'article';
  caption: string;
  pk: number;
  resource_url: string;
  media_url: string;
  subtitles: string;
};

export type ProductMetadata = {
  kind: 'product';
  name: string;
  price: string;
  item_url: string;
  thumbnail_url: string;
};

// bind K to be of type ProductMetadata or InstagramMetadata
export type SourceDocument<K extends ProductMetadata | ContentMetadata> = {
  page_content: string;
  metadata: K;
  type: 'Document';
};

export type SourceProduct = SourceDocument<ProductMetadata>;
export type SourceContent = SourceDocument<ContentMetadata>;

export type ContextEvent = {
  context: SourceDocument<ProductMetadata | ContentMetadata>[]; // JSON string of source documents
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
  sourceProducts?: SourceProduct[];
  sourceContents?: SourceContent[];
  fileAnnotations?: any;
};

export type BotProps = {
  creatorName: string;
  chatflowid: string;
  apiUrl: string;
  chatflowConfig?: Record<string, unknown>;
  starterPrompts: string[];
  welcomeMessage?: string;
  botMessage?: BotMessageTheme;
  userMessage?: UserMessageTheme;
  firstMessage?: FirstMessageConfig;
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
  ref: HTMLElement;
};

const defaultWelcomeMessage = 'Hi there! How can I help?';

export const Bot = (props: BotProps & { class?: string }) => {
  let chatContainer: HTMLDivElement | undefined;
  let textareaRef: HTMLTextAreaElement | undefined;

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
  const [lastMessage, setLastMessage] = createSignal<MessageType | null>(null);
  const [isChatFlowAvailableToStream, setIsChatFlowAvailableToStream] = createSignal(false);

  const [chatId, setChatId] = createSignal(props.chatflowid);

  const scrollToBottom = (timeout?: number) => {
    setTimeout(() => {
      if (props.isFullPage) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      else chatContainer?.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
    }, timeout || 50);
  };

  const scrollToTop = (timeout?: number) => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, timeout || 50);
  };

  /**
   * Add each chat message into localStorage
   */
  const saveChatToLocalStorage = () => {
    localStorage.setItem(`${props.chatflowid}_EXTERNAL`, JSON.stringify({ chatId: chatId(), chatHistory: messages() }));
  };

  const addEmptyMessage = () =>
    setMessages((prevMessages) => {
      const messages: MessageType[] = [...prevMessages, { message: '', type: 'apiMessage' }];
      return messages;
    });

  const updateLastMessageSources = (sourceProducts?: SourceProduct[], sourceContents?: SourceContent[]) => {
    setLastMessage({
      ...lastMessage(),
      sourceProducts: sourceProducts || item.sourceProducts,
      sourceContents: sourceContents || item.sourceContents,
    });
  };

  const moveLastMessageToMessages = () => {
    const msg = lastMessage();
    if (!msg) return;
    setLastMessage(null);
    setMessages((prevMessages) => {
      return [...prevMessages, msg];
    });
  };

  const addMessage = (msg: MessageType) => {
    setMessages((prevMessages) => {
      return [...prevMessages, msg];
    });
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
    addMessage({ message: value, type: 'userMessage' });
    saveChatToLocalStorage();

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
      user: props.creatorName,
    };

    setIsChatFlowAvailableToStream(false);
    const abortCtrl = new AbortController();

    let waitingFirstToken = true;
    let sourceProducts: SourceProduct[] = [];
    let sourceContents: SourceContent[] = [];

    await fetchEventSource(`${props.apiUrl}/stream`, {
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
            if (waitingFirstToken) {
              waitingFirstToken = false;
              setLoading(false);
            }
            setLastMessage({ type: 'apiMessage', message: (lastMessage()?.message || '') + data.answer });
          } else if (data.context) {
            let ctx: (SourceProduct | SourceContent)[] = data.context;
            sourceContents = ctx.filter((doc) => ['youtube-video', 'article'].includes(doc.metadata?.kind));
            sourceProducts = ctx.filter((doc) => doc.metadata?.kind === 'product');
          }
        }
      },
    });

    setIsChatFlowAvailableToStream(true);
    updateLastMessageSources(sourceProducts, sourceContents);
    moveLastMessageToMessages();
    setLoading(false);
    setUserInput('');
    scrollToBottom();
    saveChatToLocalStorage();
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

  onMount(async () => {
    const localChatsData = localStorage.getItem(`${props.chatflowid}_EXTERNAL`);
    if (localChatsData) {
      const localChats: { chatHistory: MessageType[]; chatId: string } = JSON.parse(localChatsData);
      setChatId(localChats.chatId);
      const msgs: MessageType[] = [];
      localChats.chatHistory.forEach((message: MessageType) => {
        msgs.push(message);
        setMessages([...msgs]);
        setLastMessage(null);
      });
    } else {
      setMessages([
        {
          message: props.welcomeMessage ?? defaultWelcomeMessage,
          type: 'apiMessage',
        },
      ]);
      setLastMessage(null);
    }
    setIsChatFlowAvailableToStream(true);
    messages().length > 1 ? scrollToBottom(100) : scrollToTop(100);
    // eslint-disable-next-line solid/reactivity
    return () => {
      setUserInput('');
      setLoading(false);
    };
  });

  const isValidURL = (url: string): URL | undefined => {
    try {
      return new URL(url);
    } catch (err) {
      return undefined;
    }
  };

  const [bottomSpacerHeight, setBottomSpacerHeight] = createSignal(0);
  const focusOnTextarea = () => {
    textareaRef?.focus();
  };

  return (
    <div class="relative flex flex-col z-0 h-full w-full overflow-hidden">
      <div class="relative flex max-h-full flex-1 flex-col overflow-hidden">
        <Topbar
          title={props.title}
          titleColor={props.titleColor}
          titleAvatarSrc={props.titleAvatarSrc}
          bubbleTextColor={props.bubbleTextColor}
          bubbleButtonColor={props.bubbleButtonColor}
          topbarColor={props.topbarColor}
          isFullPage={props.isFullPage}
        />
        <div class="flex w-full items-center justify-center bg-token-main-surface-primary overflow-hidden"></div>
        <main class={'relative h-full w-full flex-1 overflow-hidden transition-width'}>
          <div role="presentation" tabindex="0" class="flex h-full flex-col focus-visible:outline-0 overflow-hidden">
            <div ref={chatContainer} class="flex-1 overflow-auto scroll-smooth no-scrollbar-container">
              <div class="w-full h-16"></div>
              <div class="overflow-hidden px-3">
                <div class="w-full">
                  <p class="m-5 text-xl font-bold text-white text-jost">{props.title}</p>
                </div>
                <div class="w-full">
                  <FirstMessageBubble
                    background={props.firstMessage?.background}
                    textColor={props.botMessage?.textColor}
                    actions={props.firstMessage?.actions}
                    text={props.firstMessage?.text}
                    actionsBackground={props.firstMessage?.actionsBackground}
                    setUserInput={setUserInput}
                    focusOnInput={focusOnTextarea}
                  />
                </div>
                <For each={[...messages()]}>
                  {(message, index) => {
                    const isLast = index() === messages().length - 1;
                    return (
                      <div class="w-full my-4">
                        {message.type === 'userMessage' && (
                          <GuestBubble
                            message={message.message}
                            backgroundColor={props.userMessage?.backgroundColor}
                            textColor={props.userMessage?.textColor}
                            showAvatar={false}
                            avatarSrc={undefined}
                          />
                        )}
                        {message.type === 'apiMessage' && (
                          <BotBubble
                            getMessage={() => message}
                            fileAnnotations={message.fileAnnotations}
                            apiUrl={props.apiUrl}
                            backgroundColor={props.botMessage?.backgroundColor || 'white'}
                            textColor={props.botMessage?.textColor}
                            showAvatar={props.botMessage?.showAvatar}
                            avatarSrc={props.botMessage?.avatarSrc}
                            sourceProducts={message.sourceProducts}
                            sourceContent={message.sourceContents}
                            enableMultipricing={props.botMessage?.enableMultipricing}
                            purchaseButtonText={props.botMessage?.purchaseButtonText}
                            purchaseButtonBackgroundColor={props.botMessage?.purchaseButtonBackgroundColor}
                            purchaseButtonTextColor={props.botMessage?.purchaseButtonTextColor}
                          />
                        )}
                      </div>
                    );
                  }}
                </For>
                <Show when={loading()}>
                  <LoadingBubble />
                </Show>
                <Show when={lastMessage()?.message}>
                  <BotBubble
                    getMessage={lastMessage}
                    fileAnnotations={lastMessage()?.fileAnnotations}
                    apiUrl={props.apiUrl}
                    backgroundColor={props.botMessage?.backgroundColor || 'white'}
                    textColor={props.botMessage?.textColor}
                    showAvatar={props.botMessage?.showAvatar}
                    avatarSrc={props.botMessage?.avatarSrc}
                    sourceProducts={lastMessage()?.sourceProducts}
                    sourceContent={lastMessage()?.sourceContents}
                    enableMultipricing={props.botMessage?.enableMultipricing}
                    purchaseButtonText={props.botMessage?.purchaseButtonText}
                    purchaseButtonBackgroundColor={props.botMessage?.purchaseButtonBackgroundColor}
                    purchaseButtonTextColor={props.botMessage?.purchaseButtonTextColor}
                  />
                </Show>
              </div>
              <div class="w-full" style={{ height: bottomSpacerHeight() + 'px' }}></div>
            </div>
          </div>
          <Bottombar
            ref={textareaRef}
            backgroundColor={props.textInput?.backgroundColor}
            textColor={props.textInput?.textColor}
            placeholder={props.textInput?.placeholder}
            sendButtonColor={props.textInput?.sendButtonColor}
            fontSize={props.fontSize}
            disabled={loading()}
            getInputValue={userInput}
            setInputValue={setUserInput}
            onSubmit={handleSubmit}
            isFullPage={props.isFullPage}
            clearChat={clearChat}
            isDeleteEnabled={messages().length > 1}
            showStarterPrompts={props.starterPrompts.length > 0 && messages().length <= 1}
            starterPrompts={props.starterPrompts}
            setBottomSpacerHeight={setBottomSpacerHeight}
            poweredByTextColor={props.poweredByTextColor || 'black'}
            scrollToBottom={scrollToBottom}
          />
        </main>
        {sourcePopupOpen() && <Popup isOpen={sourcePopupOpen()} value={sourcePopupSrc()} onClose={() => setSourcePopupOpen(false)} />}
      </div>
    </div>
  );
};
