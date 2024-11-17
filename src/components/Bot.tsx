import { Popup } from '@/features/popup';
import { MessageBE, RunInput } from '@/queries/sendMessageQuery';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Accessor, For, Setter, Show, createEffect, createSignal, on, onMount } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { StarsAvatar } from './avatars/StarsAvatar';
import { Bottombar } from './Bottombar';
import { AskMoreAboutProductBubble } from './bubbles/AskAboutProductBubble';
import { BotBubble } from './bubbles/BotBubble';
import { GuestBubble } from './bubbles/GuestBubble';
import { HintBubble } from './bubbles/HintBubble';
import { LoadingBubble } from './bubbles/LoadingBubble';
import { XIcon } from './icons/XIcon';
import { BotConfig, BotProps, MessageType, messageType } from './types/botprops';
import { storedChat } from './types/chat';
import { SourceContent, SourceProduct } from './types/documents';
import {
  AnswerEvent,
  ChatSummaryGeneratedEvent,
  ContextEvent,
  FourSuggestionsGeneratedEvent,
  IncrementalAnswerEvent,
  MessageChunkGeneratedEvent as MessageChunkStreamedEvent,
  MetadataEvent,
  NextQuestionsGeneratedEvent,
  SuggestionGeneratedEvent,
} from './types/events';

export const Bot = (props: BotConfig & BotProps) => {
  let chatContainer: HTMLDivElement | undefined;
  let textareaRef: HTMLTextAreaElement | undefined;
  let hintsRef: HTMLDivElement | undefined;
  let lastBotMessageRef: HTMLDivElement | undefined;

  const [userInput, setUserInput] = createSignal<string>('');
  const [sourcePopupOpen, setSourcePopupOpen] = createSignal<boolean>(false);
  const [sourcePopupSrc, setSourcePopupSrc] = createSignal({});

  const [lastBotResponse, setLastBotResponse] = createSignal<MessageType | null>(null);
  const [messages, setMessages] = createSignal<MessageType[]>(
    [
      {
        type: 'apiMessage',
        message: props.welcomeMessage,
        nextQuestions: [...props.starterPrompts.prompts],
        productHandle: props.shopifyProduct?.handle,
      },
    ],
    { equals: false },
  );

  const [isBusy, setBusy] = createSignal(true);
  const [isWaitingForResponse, setWaitingForResponse] = createSignal(false);

  const [chatRef, setChatRef] = createSignal<string | null>(null);
  const [cartToken, setCartToken] = createSignal<string | null>(null);

  const storageKey = `twini-${props.shopRef}`;

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
    localStorage.setItem(storageKey, JSON.stringify({ chatRef: chatRef(), chatHistory: messages() }));
  };

  const restoreChatFromStorage = (): boolean => {
    const data = localStorage.getItem(storageKey) as string;
    if (data == null) {
      console.warn('No chat data found in storage for key ', storageKey);
      return false;
    }
    const localChats: storedChat = JSON.parse(data);
    console.log('Restoring chats with chatRef', localChats.chatRef);
    setChatRef(localChats.chatRef);
    setMessages([...localChats.chatHistory]);
    props.setNextQuestions(localChats.chatHistory[localChats.chatHistory.length - 1].nextQuestions ?? []);

    const lastProductHandle = localChats.chatHistory.findLast((msg) => msg.productHandle != null)?.productHandle;
    if (lastProductHandle != null) {
      props.setProductHandle(lastProductHandle);
    }
    return true;
  };

  const moveLastMessageToMessages = () => {
    const msg = lastBotResponse();
    if (msg == null) return;
    setMessages([...messages(), msg]);
    setLastBotResponse(null);
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
    if (value.trim() === '') {
      return;
    }

    setWaitingForResponse(true);
    setBusy(true);
    setUserInput(value);
    props.setNextQuestions([]);
    scrollToBottom();
    setMessages([...messages(), { message: value, type: 'userMessage' }]);
    saveChatToLocalStorage();

    // Send user question and history to API
    const messageList: MessageBE[] = messages().map((message) => {
      return { content: message.message, type: messageTypeFEtoBE(message.type) };
    });

    if (chatRef() == null) {
      console.error('chatRef is null');
      return;
    }
    // if (cartToken() == null) {
    //   console.error('cartToken is null');
    //   return;
    // }

    const body: RunInput = {
      input: {
        input: value,
        chat_history: messageList,
        username: props.shopRef,
        chat_ref: chatRef(),
        cart_token: cartToken() || 'fake_cart_token',
        // TODO: product: props.shopifyProduct,
      },
      config: {},
    };

    const abortCtrl = new AbortController();

    let sourceProducts: SourceProduct[] = [];
    let sourceContents: SourceContent[] = [];
    let suggestedProductSlugs: string[] | null = null;

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
        throw err;
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
        } else if (ev.event === 'suggestion_generated') {
          const data: SuggestionGeneratedEvent = JSON.parse(ev.data);
          suggestedProductSlugs = [data['suggestion_slug']];
        } else if (ev.event === 'four_suggestions_generated') {
          const data: FourSuggestionsGeneratedEvent = JSON.parse(ev.data);
          suggestedProductSlugs = data.suggestion_slugs;
        } else if (ev.event === 'incremental_message_streamed') {
          setWaitingForResponse(false);
          const data: IncrementalAnswerEvent = JSON.parse(ev.data);
          setLastBotResponse({ type: 'apiMessage', message: data.message });
        } else if (ev.event === 'message_chunk_streamed') {
          setWaitingForResponse(false);
          const data: MessageChunkStreamedEvent = JSON.parse(ev.data);
          console.log('message_chunk_streamed', data);
          const response = lastBotResponse() as MessageType;
          const streamingAnswer = (response?.message || '') + data.chunk;
          setLastBotResponse({ ...response, type: 'apiMessage', message: streamingAnswer });
        } else if (ev.event === 'next_questions_generated') {
          const data: NextQuestionsGeneratedEvent = JSON.parse(ev.data);
          props.setNextQuestions(data.questions);
        } else if (ev.event === 'chat_summary_generated') {
          const data: ChatSummaryGeneratedEvent = JSON.parse(ev.data);
          props.setSummary(data.summary);
        } else if (ev.event === 'message_context_streamed') {
          const data: ContextEvent = JSON.parse(ev.data);
          data.context.forEach((item) => {
            if (item.metadata.kind === 'product') {
              sourceProducts.push(item as SourceProduct);
            } else if (['youtube-video', 'ig-video', 'tiktok-video', 'article'].includes(item.metadata.kind)) {
              sourceContents.push(item as SourceContent);
            }
          });
        } else if (ev.event === 'data') {
          const data: AnswerEvent = JSON.parse(ev.data);
          if (data.answer) {
            setWaitingForResponse(false);
            const response = lastBotResponse() as MessageType;
            const streamingAnswer = (response?.message || '') + data.answer;
            setLastBotResponse({ ...response, type: 'apiMessage', message: streamingAnswer });
          }
        }
        scrollToBottom();
      },
    }).catch((err) => {});

    if (abortCtrl.signal.aborted) {
      console.log('abortCtrl', abortCtrl);
      setUserInput('');
      scrollToBottom();
      setLastBotResponse(null);
      setWaitingForResponse(false);
      setBusy(false);
    }

    let suggestedProducts: SourceProduct[] | undefined = undefined;
    if (suggestedProductSlugs != null) {
      suggestedProducts = sourceProducts.filter((product) => suggestedProductSlugs?.includes(product.metadata.slug));
      if (suggestedProducts == null) {
        console.error('Suggested product with slug ', suggestedProductSlugs, 'not found among ', sourceProducts);
      }
    }
    if (suggestedProducts?.length == 1) {
      setLastBotResponse({
        ...(lastBotResponse() as MessageType),
        suggestedProduct: suggestedProducts[0],
        sourceProducts: [],
        sourceContents: sourceContents,
        nextQuestions: props.nextQuestions(),
      });
    } else if (suggestedProducts?.length == 4) {
      setLastBotResponse({
        ...(lastBotResponse() as MessageType),
        suggestedProduct: undefined,
        sourceProducts: suggestedProducts,
        sourceContents: sourceContents,
        nextQuestions: props.nextQuestions(),
      });
    } else {
      setLastBotResponse({
        ...(lastBotResponse() as MessageType),
        suggestedProduct: undefined,
        sourceProducts: [],
        sourceContents: sourceContents,
        nextQuestions: props.nextQuestions(),
      });
    }

    moveLastMessageToMessages();
    saveChatToLocalStorage();
    setUserInput('');
    scrollToBottom();
    setWaitingForResponse(false);
    setBusy(false);
  };

  const clearChat = () => {
    try {
      localStorage.removeItem(`twini-${props.shopRef}`);
      setChatRef(uuidv4());
      setMessages([
        {
          message: props.welcomeMessage,
          type: 'apiMessage',
          nextQuestions: [...props.starterPrompts.prompts],
          productHandle: props.shopifyProduct?.handle,
        },
      ]);
      props.setNextQuestions([...(props.starterPrompts.prompts ?? [])]);
      saveChatToLocalStorage();
    } catch (error: any) {
      const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`;
      console.error(`error: ${errorData}`);
    }
  };

  onMount(async () => {
    if (!restoreChatFromStorage()) {
      setChatRef(uuidv4());
    }

    // Scroll to bottom on first render if there are messages
    messages().length > 1 ? scrollToBottom(100) : scrollToTop(100);

    setUserInput('');
    setWaitingForResponse(false);
    setBusy(false);
  });

  onMount(async () => {
    const cartToken = await fetch('/cart.js')
      .then(async (res) => await res.json())
      .then((data) => data.token);
    if (cartToken != null) {
      setCartToken(cartToken);
    } else {
      console.error('cartToken is null');
      setCartToken('fake_cart_token');
    }
  });

  createEffect(
    on(props.question, (question) => {
      if (question != '') {
        handleSubmit(question);
      }
    }),
  );

  createEffect(
    on(props.productHandle, (handle) => {
      const lastProductHandleFromMessages = messages().findLast((msg) => msg.productHandle != null)?.productHandle;
      console.log('lastProductHandleFromMessages', lastProductHandleFromMessages);
      console.log('new productHandle', handle);
      // if chat is already about this product, don't start a new conversation
      if (handle == null || lastProductHandleFromMessages == handle) return;
      setMessages([
        ...messages(),
        {
          type: 'apiMessage',
          message: "Let's talk about this product",
          nextQuestions: [...props.starterPrompts.prompts],
          productHandle: handle,
        },
      ]);

      setTimeout(() => {
        const lastBotMessage = document.querySelector('#twini-message-container')?.lastElementChild?.previousElementSibling;
        setChatSpacerHeight(props.bot.clientHeight - (bottomSpacerHeight() + (lastBotMessage?.clientHeight || 0) + (hintsRef?.clientHeight || 0)));
        scrollToBottom();
      }, 100);
    }),
  );

  const [bottomSpacerHeight, setBottomSpacerHeight] = createSignal(0);
  const [chatSpacerHeight, setChatSpacerHeight] = createSignal(0);

  const focusOnTextarea = () => {
    textareaRef?.focus();
  };

  return (
    <div
      class="twi-relative twi-flex twi-flex-col twi-z-0 twi-h-full twi-w-full twi-overflow-hidden"
      style={{
        'font-family': 'Poppins, sans-serif',
      }}
    >
      <div class="twi-relative twi-flex twi-h-full twi-w-full twi-flex-1 twi-flex-col twi-overflow-hidden">
        <div class="twi-flex twi-w-full twi-items-center twi-justify-center twi-overflow-hidden"></div>
        <main class="twi-relative twi-h-full twi-w-full twi-flex-1 twi-overflow-hidden twi-transition-width">
          <div id="twini-topbar" class="twi-absolute twi-top-0 twi-left-0 twi-w-full">
            <div class="twi-absolute twi-inset-0 twi-blur-lg"></div>
            <div class="twi-relative twi-flex twi-items-center twi-bg-gradient-to-t twi-from-transparent twi-via-white/70 twi-to-white">
              <button
                class="twi-cursor-pointer twi-absolute twi-pl-7 twi-py-7 twi-rounded-full twi-bg-transparent twi-z-10"
                onClick={props.closeBot}
                style={{ 'line-height': 0 }}
              >
                <XIcon fill="black" width={24} height={24}></XIcon>
              </button>
              <div class="twi-flex-1 twi-flex twi-py-7 twi-justify-center">
                <StarsAvatar width={24} height={24} />
              </div>
            </div>
          </div>
          <div role="presentation" tabindex="0" class="twi-flex twi-h-full twi-flex-col twi-focus-visible:outline-0 twi-overflow-hidden">
            <div ref={chatContainer} class="twi-flex-1 twi-overflow-auto twi-scroll-smooth twi-no-scrollbar-container">
              <div class="twi-overflow-hidden twi-px-3" id="twini-message-container">
                <div class="twi-py-10 twi-block"></div>
                <For each={messages()}>
                  {(message, i) => {
                    return (
                      <div class="twi-w-full twi-my-4" id={`twini-message-${i()}`}>
                        {message.type === 'userMessage' && (
                          <GuestBubble
                            message={message.message}
                            backgroundColor={props.userMessage?.backgroundColor}
                            textColor={props.userMessage?.textColor}
                            showAvatar={false}
                            avatarSrc={undefined}
                          />
                        )}
                        {message.type === 'apiMessage' && message.productHandle == null && (
                          <BotBubble
                            getMessage={() => message}
                            backgroundColor={props.botMessage?.backgroundColor || 'black'}
                            textColor={props.botMessage?.textColor}
                            faviconUrl={props.botMessage?.faviconUrl}
                            sourceProducts={message.sourceProducts}
                            sourceContent={message.sourceContents}
                            suggestedProduct={message.suggestedProduct || undefined}
                            enableMultipricing={props.botMessage?.enableMultipricing}
                            purchaseButtonText={props.botMessage?.purchaseButtonText}
                            purchaseButtonBackgroundColor={props.botMessage?.purchaseButtonBackgroundColor}
                            purchaseButtonTextColor={props.botMessage?.purchaseButtonTextColor}
                            setProductHandle={props.setProductHandle as Setter<string>}
                          />
                        )}
                        {message.type === 'apiMessage' && message.productHandle != null && (
                          <div ref={lastBotMessageRef}>
                            <div
                              classList={{
                                'twi-py-10 twi-block': i() != 0,
                              }}
                            ></div>
                            <AskMoreAboutProductBubble
                              productHandle={message.productHandle} // TODO: use handle from Ask more about product
                              product={message.productHandle == props.shopifyProduct?.handle ? props.shopifyProduct : undefined} // if NOT on product page will be undefined
                              backgroundColor={props.botMessage?.backgroundColor || 'black'}
                              textColor={props.botMessage?.textColor}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }}
                </For>
                <Show when={isWaitingForResponse()}>
                  <LoadingBubble />
                </Show>
                <Show when={!isWaitingForResponse() && lastBotResponse()?.message}>
                  <BotBubble
                    getMessage={lastBotResponse as Accessor<MessageType>}
                    backgroundColor={props.botMessage?.backgroundColor || 'black'}
                    textColor={props.botMessage?.textColor}
                    faviconUrl={props.botMessage?.faviconUrl}
                    sourceProducts={lastBotResponse()?.sourceProducts}
                    sourceContent={lastBotResponse()?.sourceContents}
                    suggestedProduct={lastBotResponse()?.suggestedProduct}
                    enableMultipricing={props.botMessage?.enableMultipricing || false}
                    purchaseButtonText={props.botMessage?.purchaseButtonText}
                    purchaseButtonBackgroundColor={props.botMessage?.purchaseButtonBackgroundColor}
                    purchaseButtonTextColor={props.botMessage?.purchaseButtonTextColor}
                    setProductHandle={props.setProductHandle as Setter<string>}
                  />
                </Show>
                <div ref={hintsRef}>
                  <Show when={!isBusy()}>
                    <For each={props.nextQuestions()}>
                      {(prompt, _) => (
                        <HintBubble
                          actionColor={props.starterPrompts.actionColor}
                          message={prompt}
                          textColor={props.starterPrompts.textColor}
                          backgroundColor={props.starterPrompts.backgroundColor}
                          onClick={() => handleSubmit(prompt)}
                        />
                      )}
                    </For>
                  </Show>
                </div>
              </div>
              <div class="twi-w-full" style={{ display: 'block', height: chatSpacerHeight() + 'px' }}></div>
              <div class="twi-w-full" style={{ display: 'block', height: bottomSpacerHeight() + 'px' }}></div>
            </div>
          </div>

          <Bottombar
            ref={textareaRef}
            backgroundColor={props.textInput.backgroundColor}
            inputBackgroundColor={props.textInput.inputBackgroundColor}
            textColor={props.textInput.textColor}
            placeholder={props.textInput.placeholder}
            sendButtonColor={props.textInput.sendButtonColor}
            resetButtonColor={props.textInput.resetButtonColor}
            fontSize={props.fontSize}
            disabled={isBusy()}
            getInputValue={userInput}
            setInputValue={setUserInput}
            onSubmit={handleSubmit}
            isFullPage={props.isFullPage}
            clearChat={clearChat}
            isDeleteEnabled={messages().length > 1}
            setBottomSpacerHeight={setBottomSpacerHeight}
            poweredByTextColor={props.poweredByTextColor ?? 'black'}
            inputBorderColor={props.textInput.inputBorderColor}
            scrollToBottom={scrollToBottom}
            isLoading={isBusy}
          />
        </main>
        {sourcePopupOpen() && <Popup isOpen={sourcePopupOpen()} value={sourcePopupSrc()} onClose={() => setSourcePopupOpen(false)} />}
      </div>
    </div>
  );
};
