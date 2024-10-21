import { BotProps, FullBotProps } from '@/components/types/botprops';
import { ShopifyProduct } from '@/components/types/product';
import { Accessor, Setter, Show } from 'solid-js';
import { Bot } from '../../../components/Bot';
import { BubbleButton } from './BubbleButton';

export const BubbleBot = (
  props: FullBotProps &
    Omit<BotProps, "welcomeMessage" | "closeBot"> & {
      isBotOpened: Accessor<boolean>;
      setIsBotOpened: Setter<boolean>;
      product?: ShopifyProduct;
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
    props.product != null
      ? props.theme.chatWindow.templateWelcomeMessageOnProductPage.replace('{{product}}', props.product.title)
      : props.theme.chatWindow.welcomeMessage;

  return (
    <>
      <Show when={!props.isBotOpened()}>
        <BubbleButton {...props.theme?.button} toggleBot={toggleBot} isBotOpened={props.isBotOpened} />
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
        }}
        class={
          'fixed z-50 right-0 bottom-0 backdrop-blur md:rounded-3xl lg:right-4 lg:bottom-4 w-full lg:max-w-md top-0 lg:top-auto lg:h-[704px]' +
          (props.isBotOpened() ? ' opacity-1' : ' opacity-0 pointer-events-none')
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
        />
      </div>
    </>
  );
};
