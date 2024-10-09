import { BotMessageTheme, TextInputTheme, UserMessageTheme } from '@/features/bubble/types';
import { Popup } from '@/features/popup';
import { MessageBE, RunInput } from '@/queries/sendMessageQuery';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { For, Show, createSignal, onMount } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { Bottombar } from './Bottombar';
import { Avatar } from './avatars/Avatar';
import { BotBubble } from './bubbles/BotBubble';
import { FirstMessageConfig } from './bubbles/FirstMessageBubble';
import { GuestBubble } from './bubbles/GuestBubble';
import { HintBubble } from './bubbles/HintBubble';
import { LoadingBubble } from './bubbles/LoadingBubble';
import { XIcon } from './icons/Ics';

type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting';

export type ContentMetadata = {
  kind: 'ig-video' | 'youtube-video' | 'tiktok-video' | 'article';
  pk: number;
  resource_url: string;
  media_url: string;
  subtitles: string;
  title?: string;
  caption?: string;
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

export type StarterPromptsType = {
  prompts: string[];
  backgroundColor: string;
  textColor: string;
};

export type BotProps = {
  creatorName: string;
  chatflowid: string;
  apiUrl: string;
  chatflowConfig?: Record<string, unknown>;
  starterPrompts: StarterPromptsType;
  welcomeMessage: string;
  botMessage: BotMessageTheme;
  userMessage: UserMessageTheme;
  firstMessage: FirstMessageConfig;
  textInput: TextInputTheme;
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
  getElement: () => HTMLElement;
  closeBot: () => void;
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

  const [lastBotResponse, setLastMessage] = createSignal<MessageType | null>(null);
  const [isChatFlowAvailableToStream, setIsChatFlowAvailableToStream] = createSignal(false);

  const [chatRef, setChatRef] = createSignal<string | null>(null);

  const [config, setConfig] = createSignal({
    apiUrl: props.apiUrl,
  });

  onMount(() => {
    const apiUrl = props.getElement()?.getAttribute('data-twini-api-url');
    if (apiUrl) {
      setConfig({
        apiUrl,
      });
    }
  });

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
    localStorage.setItem(`${props.chatflowid}_EXTERNAL`, JSON.stringify({ chatRef: chatRef(), chatHistory: messages() }));
  };

  const updateLastMessageSources = (sourceProducts?: SourceProduct[], sourceContents?: SourceContent[]) => {
    setLastMessage({
      ...lastBotResponse(),
      sourceProducts: sourceProducts || item.sourceProducts,
      sourceContents: sourceContents || item.sourceContents,
    });
  };

  const moveLastMessageToMessages = () => {
    const msg = lastBotResponse();
    console.log('moveLastMessageToMessages', msg);
    if (!msg) return;
    setLastMessage(null);
    setMessages([...messages(), msg]);
  };

  const addMessage = (msg: MessageType) => {
    setMessages([...messages(), msg]);
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
    setUserInput(value);

    if (value.trim() === '') {
      return;
    }

    setLoading(true);
    scrollToBottom();
    console.log('handleSubmit', value);
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
        username: props.creatorName,
        chat_ref: chatRef(),
      },
      config: {},
    };

    setIsChatFlowAvailableToStream(false);
    const abortCtrl = new AbortController();

    let waitingFirstToken = true;
    let sourceProducts: SourceProduct[] = [];
    let sourceContents: SourceContent[] = [];

    await fetchEventSource(`${config().apiUrl}/stream`, {
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
        } else if (ev.event === 'close') {
          abortCtrl.abort();
        } else if (ev.event === 'data') {
          const data: ContextEvent | AnswerEvent = JSON.parse(ev.data);
          if (data.answer) {
            if (waitingFirstToken) {
              waitingFirstToken = false;
              setLoading(false);
            }
            const streamingAnswer = (lastBotResponse()?.message || '') + data.answer;
            setLastMessage({ type: 'apiMessage', message: streamingAnswer });
          } else if (data.context) {
            const ctx = data as ContextEvent;
            ctx.context.map((item) => {
              if (item.metadata.kind === 'product') {
                sourceProducts.push(item as SourceProduct);
              } else if (['youtube-video', 'ig-video', 'tiktok-video', 'article'].includes(item.metadata.kind)) {
                sourceContents.push(item as SourceContent);
              }
            });
          }
        }
      },
    }).catch((err) => {
      console.error('Network error:', err);
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
      setChatRef(uuidv4());
      setMessages([
        {
          message: props.welcomeMessage ?? defaultWelcomeMessage,
          type: 'apiMessage',
        },
      ]);
      saveChatToLocalStorage();
    } catch (error: any) {
      const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`;
      console.error(`error: ${errorData}`);
    }
  };

  onMount(async () => {
    const localChatsData = localStorage.getItem(`${props.chatflowid}_EXTERNAL`);
    if (localChatsData) {
      const localChats: { chatHistory: MessageType[]; chatRef: string } = JSON.parse(localChatsData);
      setChatRef(localChats.chatRef);
      setMessages([...localChats.chatHistory]);
    } else {
      setMessages([
        {
          message: props.welcomeMessage ?? defaultWelcomeMessage,
          type: 'apiMessage',
        },
      ]);
    }
    setLastMessage(null);
    setIsChatFlowAvailableToStream(true);
    messages().length > 1 ? scrollToBottom(100) : scrollToTop(100);
    setUserInput('');
    setLoading(false);
    // eslint-disable-next-line solid/reactivity
    return;
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
        <div class="flex w-full items-center justify-center bg-token-main-surface-primary overflow-hidden"></div>
        <main class={'relative h-full w-full flex-1 overflow-hidden transition-width'}>
          <div role="presentation" tabindex="0" class="flex h-full flex-col focus-visible:outline-0 overflow-hidden">
            <div
              ref={chatContainer}
              class="flex-1 overflow-auto scroll-smooth no-scrollbar-container"
              style={{
                'min-height': '100vh',
              }}
            >
              <div class="w-full h-16"></div>
              <div class="overflow-hidden px-3">
                <div class="fixed top-4 right-4 rounded-full bg-white p-4 shadow-lg shadow-black z-10" onClick={props.closeBot}>
                  <XIcon color="black" width={16} height={16}></XIcon>
                </div>
                <div class="flex justify-center py-10">
                  <Avatar src={props.titleAvatarSrc} classList={['h-1/4', 'w-1/4', 'shadow-lg', 'shadow-black']} />
                </div>
                <For each={messages()}>
                  {(message, index) => {
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
                            backgroundColor={props.botMessage?.backgroundColor || 'white'}
                            textColor={props.botMessage?.textColor}
                            showAvatar={props.botMessage?.showAvatar}
                            avatarSrc={props.botMessage?.avatarSrc}
                            avatarPadding={props.botMessage?.avatarPadding}
                            faviconUrl={props.botMessage?.faviconUrl}
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
                <Show when={lastBotResponse()?.message}>
                  <BotBubble
                    getMessage={lastBotResponse}
                    fileAnnotations={lastBotResponse()?.fileAnnotations}
                    backgroundColor={props.botMessage?.backgroundColor || 'white'}
                    textColor={props.botMessage?.textColor}
                    showAvatar={props.botMessage?.showAvatar}
                    avatarSrc={props.botMessage?.avatarSrc}
                    avatarPadding={props.botMessage?.avatarPadding}
                    faviconUrl={props.botMessage?.faviconUrl}
                    sourceProducts={lastBotResponse()?.sourceProducts || []}
                    sourceContent={lastBotResponse()?.sourceContents || []}
                    enableMultipricing={props.botMessage?.enableMultipricing || false}
                    purchaseButtonText={props.botMessage?.purchaseButtonText}
                    purchaseButtonBackgroundColor={props.botMessage?.purchaseButtonBackgroundColor}
                    purchaseButtonTextColor={props.botMessage?.purchaseButtonTextColor}
                  />
                </Show>
                <Show when={messages().length == 1 && props.starterPrompts?.prompts}>
                  <For each={props.starterPrompts.prompts}>
                    {(prompt, index) => (
                      <HintBubble message={prompt} background="transparent" textColor="white" onClick={() => handleSubmit(prompt)} />
                    )}
                  </For>
                </Show>
              </div>
              <div class="w-full" style={{ height: bottomSpacerHeight() + 'px' }}></div>
            </div>
          </div>
          <Bottombar
            ref={textareaRef}
            backgroundColor={props.textInput?.backgroundColor}
            inputBackgroundColor={props.textInput?.inputBackgroundColor}
            textColor={props.textInput?.textColor}
            placeholder={props.textInput?.placeholder}
            sendButtonColor={props.textInput?.sendButtonColor}
            resetButtonColor={props.textInput?.resetButtonColor}
            fontSize={props.fontSize}
            disabled={loading()}
            getInputValue={userInput}
            setInputValue={setUserInput}
            onSubmit={handleSubmit}
            isFullPage={props.isFullPage}
            clearChat={clearChat}
            isDeleteEnabled={messages().length > 1}
            showStarterPrompts={props.starterPrompts.prompts.length > 0 && messages().length <= 1}
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
