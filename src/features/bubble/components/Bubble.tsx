import { createSignal, Show, splitProps } from 'solid-js';
import styles from '../../../assets/index.css';
import { Bot, BotProps } from '../../../components/Bot';
import { BubbleParams } from '../types';
import { BubbleButton } from './BubbleButton';

const defaultButtonColor = '#3B81F6';
const defaultIconColor = 'white';

export type BubbleProps = BotProps & BubbleParams;

export const BubbleBot = (props: BubbleProps) => {
  const [bubbleProps] = splitProps(props, ['theme']);

  const [isBotOpened, setIsBotOpened] = createSignal(false);
  const [isBotStarted, setIsBotStarted] = createSignal(false);

  const openBot = () => {
    if (!isBotStarted()) setIsBotStarted(true);
    setIsBotOpened(true);
  };

  const closeBot = () => {
    setIsBotOpened(false);
  };

  const toggleBot = () => {
    isBotOpened() ? closeBot() : openBot();
  };

  return (
    <>
      <style>{styles}</style>
      <BubbleButton {...bubbleProps.theme?.button} toggleBot={toggleBot} isBotOpened={isBotOpened()} />
      <div
        part="bot"
        style={{
          height: bubbleProps.theme?.chatWindow?.height ? `${bubbleProps.theme?.chatWindow?.height.toString()}px` : 'calc(100% - 100px)',
          transition: 'transform 200ms cubic-bezier(0, 1.2, 1, 1), opacity 150ms ease-out',
          'transform-origin': 'bottom right',
          transform: isBotOpened() ? 'scale3d(1, 1, 1)' : 'scale3d(0, 0, 1)',
          'box-shadow': 'rgb(0 0 0 / 16%) 0px 5px 40px',
          background: props.theme?.chatWindow?.backgroundColor + ' fixed',
          'z-index': 42424242,
        }}
        class={
          'fixed sm:right-5 rounded-3xl w-full sm:w-[400px] max-h-[704px]' +
          (isBotOpened() ? ' opacity-1' : ' opacity-0 pointer-events-none') +
          (props.theme?.button?.size === 'large' ? ' bottom-24' : ' bottom-20')
        }
      >
        <Show when={isBotStarted()}>
          <Bot
            badgeBackgroundColor={bubbleProps.theme?.chatWindow?.backgroundColor}
            bubbleButtonColor={bubbleProps.theme?.button?.bubbleButtonColor ?? defaultButtonColor}
            topbarColor={bubbleProps.theme?.button?.topbarColor ?? defaultButtonColor}
            bubbleTextColor={bubbleProps.theme?.button?.iconColor ?? defaultIconColor}
            title={bubbleProps.theme?.chatWindow?.title}
            titleColor={bubbleProps.theme?.chatWindow?.titleColor}
            titleAvatarSrc={bubbleProps.theme?.chatWindow?.titleAvatarSrc}
            welcomeMessage={bubbleProps.theme?.chatWindow?.welcomeMessage}
            poweredByTextColor={bubbleProps.theme?.chatWindow?.poweredByTextColor}
            textInput={bubbleProps.theme?.chatWindow?.textInput}
            botMessage={bubbleProps.theme?.chatWindow?.botMessage}
            userMessage={bubbleProps.theme?.chatWindow?.userMessage}
            fontSize={bubbleProps.theme?.chatWindow?.fontSize}
            chatflowid={props.chatflowid}
            chatflowConfig={props.chatflowConfig}
            apiUrl={props.apiUrl}
            starterPrompts={props.starterPrompts || {}}
            creatorName={props.creatorName}
            firstMessage={bubbleProps.theme?.chatWindow?.firstMessage}
          />
        </Show>
      </div>
    </>
  );
};
