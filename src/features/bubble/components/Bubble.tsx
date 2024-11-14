import { BotProps, FullBotProps } from '@/components/types/botprops';
import { Accessor, Setter, Show } from 'solid-js';
import { Bot } from '../../../components/Bot';
import { BubbleWidget } from './BubbleWidget';

export const BubbleBot = (
  props: FullBotProps &
    Omit<BotProps, 'welcomeMessage' | 'closeBot'> & {
      isBotOpened: Accessor<boolean>;
      setIsBotOpened: Setter<boolean>;
    },
) => {
  let bodyOverflow = '';

  const openBot = () => {
    props.setIsBotOpened(true);
    bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  };

  const closeBot = () => {
    props.setIsBotOpened(false);
    document.body.style.overflow = bodyOverflow;
  };

  const toggleBot = () => {
    props.isBotOpened() ? closeBot() : openBot();
  };

  const welcomeMessage =
    props.shopifyProduct != null
      ? props.theme.chatWindow.templateWelcomeMessageOnProductPage.replace('{{product}}', props.shopifyProduct.title)
      : props.theme.chatWindow.welcomeMessage;

  console.log(welcomeMessage);

  return (
    <>
      <Show when={!props.isBotOpened()}>
        {/* <BubbleButton {...props.theme?.button} toggleBot={toggleBot} isBotOpened={props.isBotOpened} /> */}
        <span
          class="twi-bubble-widget twi-left-1/2 twi-bottom-0 twi-fixed twi-animate-fade-in twi-z-50"
          style={{
            transform: 'translateX(-50%)', // Center the button horizontally and vertically
          }}
        >
          <BubbleWidget toggleBot={toggleBot} isBotOpened={props.isBotOpened}></BubbleWidget>
        </span>
      </Show>
      <div
        part="bot"
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
          'twi-fixed twi-z-50 twi-right-0 twi-bottom-0 twi-backdrop-blur md:twi-rounded-3xl lg:twi-right-4 lg:twi-bottom-4 twi-w-full lg:twi-max-w-md twi-top-0 lg:twi-top-auto lg:twi-h-[704px]' +
          (props.isBotOpened() ? ' twi-opacity-1' : ' twi-opacity-0 twi-pointer-events-none')
        }
      >
        <Bot
          getElement={props.getElement}
          titleAvatarSrc={props.theme.chatWindow.titleAvatarSrc}
          welcomeMessage={welcomeMessage}
          poweredByTextColor={props.theme.chatWindow.poweredByTextColor}
          textInput={props.theme.chatWindow.textInput}
          botMessage={props.theme.chatWindow.botMessage}
          userMessage={props.theme.chatWindow.userMessage}
          fontSize={props.theme.chatWindow.fontSize}
          chatflowid={props.chatflowid}
          apiUrl={props.apiUrl}
          starterPrompts={props.starterPrompts || {}}
          creatorName={props.creatorName}
          closeBot={closeBot}
          question={props.question}
          nextQuestions={props.nextQuestions}
          setNextQuestions={props.setNextQuestions}
          setSummary={props.setSummary}
          shopifyCart={props.shopifyCart}
          shopifyProduct={props.shopifyProduct}
        />
      </div>
    </>
  );
};
