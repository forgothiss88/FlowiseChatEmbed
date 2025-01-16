import { Bot } from '@/components/Bot';
import { BotProps, FullBotProps } from '@/components/types/botprops';
import { isMobile } from '@/utils/isMobileSignal';
import { Accessor, createEffect, createSignal, Show } from 'solid-js';
import { BubbleDrawer } from './BubbleDrawer';
import { BubbleWidget } from './BubbleWidget';

export const BubbleBot = (
  props: FullBotProps &
    Omit<BotProps, 'welcomeMessage' | 'closeBot' | 'bot'> & {
      disableDrawer?: boolean;
      customerName: string;
      isBotOpened: Accessor<boolean>;
      openBot: () => void;
      closeBot: () => void;
      askQuestion: (question: string) => void;
    },
) => {
  const welcomeMessage =
    props.shopifyProduct != null
      ? props.theme.chatWindow.templateWelcomeMessageOnProductPage.replace('{{product}}', props.shopifyProduct.title)
      : props.theme.chatWindow.welcomeMessage;

  const [drawerIsOpen, setDrawerIsOpen] = createSignal(false);
  let botRef: HTMLDivElement | undefined;
  let bubbleWidgetRef: HTMLDivElement | undefined;
  let bubbleDrawerRef: HTMLDivElement | undefined;

  const handleClickOutside = (event: Event) => {
    event.preventDefault();
    if (bubbleDrawerRef && !bubbleDrawerRef.contains(event.target as Node)) {
      setDrawerIsOpen(false);
      event.stopPropagation();
    }
  };

  createEffect(() => {
    if (drawerIsOpen()) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  });

  return (
    <div class="twini-base">
      <Show when={!props.disableDrawer && !props.shopifyProduct && isMobile()}>
        <div
          ref={bubbleDrawerRef}
          class="twi-fixed twi-bottom-0 twi-w-full twi-h-1/2 twi-z-max twi-transition-all twi-duration-500"
          classList={{ 'twi-translate-y-0': drawerIsOpen(), 'twi-translate-y-[120%] twi-pointer-events-none': !drawerIsOpen() }}
        >
          <BubbleDrawer
            customerName={props.customerName}
            bubbleDrawerMessage={props.bubbleDrawerMessage}
            setDrawerIsOpen={setDrawerIsOpen}
            drawerIsOpen={drawerIsOpen}
            openBot={props.openBot}
            closeBot={props.closeBot}
            handleSubmit={(text: string) => props.askQuestion(text)}
            nextQuestions={props.nextQuestions}
            askMeMessage={props.theme.chatWindow.botMessage.askMoreText}
          ></BubbleDrawer>
        </div>
      </Show>
      <Show when={!props.disableDrawer && !drawerIsOpen() && !props.shopifyProduct && !props.isBotOpened()}>
        <span ref={bubbleWidgetRef} class=" twi-bubble-widget twi-left-1/2 twi-bottom-5 twi-fixed twi-z-50 -twi-translate-x-1/2">
          <BubbleWidget
            customerName={props.customerName}
            onClick={() => {
              if (isMobile()) {
                setDrawerIsOpen(true);
              } else {
                props.openBot();
              }
            }}
          ></BubbleWidget>
        </span>
      </Show>
      <div
        part="bot"
        ref={botRef}
        style={{
          height: props.theme.chatWindow.height ? `${props.theme.chatWindow.height.toString()}px` : undefined,
          background: props.theme.chatWindow.backgroundColor + ' fixed',
        }}
        class={
          'twi-fixed twi-transition-all twi-duration-200 twi-shadow-md twi-overflow-hidden twi-z-max twi-right-0 twi-bottom-0 twi-backdrop-blur md:twi-rounded-3xl md:twi-right-4 md:twi-bottom-4 twi-w-full md:twi-max-w-md twi-h-full md:twi-top-auto md:twi-h-[704px]' +
          (props.isBotOpened() ? ' twi-opacity-1' : ' twi-opacity-0 twi-pointer-events-none')
        }
      >
        <Bot
          bot={botRef as HTMLDivElement}
          titleAvatarSrc={props.theme.chatWindow.titleAvatarSrc}
          welcomeMessage={welcomeMessage}
          templateWelcomeMessageOnProductPage={props.theme.chatWindow.templateWelcomeMessageOnProductPage}
          poweredByTextColor={props.theme.chatWindow.poweredByTextColor}
          textInput={props.theme.chatWindow.textInput}
          botMessage={props.theme.chatWindow.botMessage}
          userMessage={props.theme.chatWindow.userMessage}
          fontSize={props.theme.chatWindow.fontSize}
          shopRef={props.shopRef}
          chatbotUrl={props.chatbotUrl}
          starterPrompts={props.starterPrompts || {}}
          isOpened={props.isBotOpened}
          closeBot={props.closeBot}
          question={props.question}
          nextQuestions={props.nextQuestions}
          setNextQuestions={props.setNextQuestions}
          setSummary={props.setSummary}
          shopifyProduct={props.shopifyProduct}
          productHandle={props.productHandle}
          setProductHandle={props.setProductHandle}
        />
      </div>
    </div>
  );
};
