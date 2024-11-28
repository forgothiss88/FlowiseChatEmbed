import { BotProps, FullBotProps } from '@/components/types/botprops';
import { Accessor, createSignal, Show } from 'solid-js';
import { Bot } from '../../../components/Bot';
import { BubbleDrawer } from './BubbleDrawer';
import { BubbleWidget } from './BubbleWidget';

type WidgetsState = 'close' | 'open-drawer' | 'close-drawer' | 'open-bot' | 'close-bot';

export const BubbleBot = (
  props: FullBotProps &
    Omit<BotProps, 'welcomeMessage' | 'closeBot' | 'bot'> & {
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

  let botRef: HTMLDivElement | undefined;
  let bubbleWidgetRef: HTMLDivElement | undefined;

  const [drawerIsOpen, setDrawerIsOpen] = createSignal(false);

  return (
    <>
      <Show when={!props.shopifyProduct && window.outerWidth < 768 && drawerIsOpen()}>
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDrawerIsOpen(false);
            }
          }}
          class="twi-fixed twi-bottom-0 twi-w-full twi-h-[500px] twi-transition-all twi-duration-500"
          style={{
            'z-index': 99999999,
          }}
        >
          <BubbleDrawer
            setDrawerIsOpen={setDrawerIsOpen}
            drawerIsOpen={drawerIsOpen}
            openBot={props.openBot}
            closeBot={props.closeBot}
            handleSubmit={(text: string) => props.askQuestion(text)}
            nextQuestions={props.nextQuestions}
          ></BubbleDrawer>
        </div>
      </Show>
      <Show when={!drawerIsOpen() && !props.shopifyProduct && !props.isBotOpened()}>
        <span ref={bubbleWidgetRef} class=" twi-bubble-widget twi-left-1/2 twi-bottom-5 twi-fixed twi-z-50 -twi-translate-x-1/2">
          <BubbleWidget
            onClick={() => {
              if (window.outerWidth < 768) {
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
          height: props.theme.chatWindow.height ? `${props.theme.chatWindow.height.toString()}px` : '',
          transition: 'transform 200ms cubic-bezier(0, 1.2, 1, 1), opacity 150ms ease-out',
          'transform-origin': 'calc(100% - 32px) calc(100% - 32px)',
          transform: props.isBotOpened() ? 'scale3d(1, 1, 1)' : 'scale3d(0, 0, 1)',
          'box-shadow': 'rgb(0 0 0 / 16%) 0px 5px 40px',
          background: props.theme.chatWindow.backgroundColor + ' fixed',
          'z-index': 9999999999,
        }}
        class={
          'twi-fixed twi-overflow-hidden twi-z-50 twi-right-0 twi-bottom-0 twi-backdrop-blur md:twi-rounded-3xl md:twi-right-4 md:twi-bottom-4 twi-w-full md:twi-max-w-md twi-h-full md:twi-top-auto md:twi-h-[704px]' +
          (props.isBotOpened() ? ' twi-opacity-1' : ' twi-opacity-0 twi-pointer-events-none')
        }
      >
        <Bot
          bot={botRef}
          getElement={props.getElement}
          titleAvatarSrc={props.theme.chatWindow.titleAvatarSrc}
          welcomeMessage={welcomeMessage}
          poweredByTextColor={props.theme.chatWindow.poweredByTextColor}
          textInput={props.theme.chatWindow.textInput}
          botMessage={props.theme.chatWindow.botMessage}
          userMessage={props.theme.chatWindow.userMessage}
          fontSize={props.theme.chatWindow.fontSize}
          shopRef={props.shopRef}
          apiUrl={props.apiUrl}
          starterPrompts={props.starterPrompts || {}}
          isOpened={props.isBotOpened}
          closeBot={props.closeBot}
          question={props.question}
          nextQuestions={props.nextQuestions}
          setNextQuestions={props.setNextQuestions}
          setSummary={props.setSummary}
          shopifyCart={props.shopifyCart}
          shopifyProduct={props.shopifyProduct}
          productHandle={props.productHandle}
          setProductHandle={props.setProductHandle}
        />
      </div>
    </>
  );
};
