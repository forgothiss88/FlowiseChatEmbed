import { isMobile } from '@/utils/isMobileSignal';
import { createSignal, Show, splitProps } from 'solid-js';
import styles from '../../../assets/index.css';
import { Bot, BotProps } from '../../../components/Bot';
import { BubbleParams } from '../types';
import { BubbleButton } from './BubbleButton';

const defaultButtonColor = '#3B81F6';
const defaultIconColor = 'white';

export type BubbleProps = BotProps & BubbleParams;

export const BubbleBot = (props: BubbleProps & { getElement: () => HTMLElement }) => {
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
  isMobile();

  return (
    <>
      <style>{styles}</style>
      <BubbleButton {...bubbleProps.theme?.button} toggleBot={toggleBot} isBotOpened={isBotOpened} />
      <div
        part="bot"
        style={{
          height: bubbleProps.theme?.chatWindow?.height ? `${bubbleProps.theme?.chatWindow?.height.toString()}px` : '100%',
          transition: 'transform 200ms cubic-bezier(0, 1.2, 1, 1), opacity 150ms ease-out',
          // 'transform-origin': 'bottom right',
          'transform-origin': 'calc(100% - 32px) calc(100% - 32px)', // Adjust transform-origin 16px inside
          transform: isBotOpened() ? 'scale3d(1, 1, 1)' : 'scale3d(0, 0, 1)',
          'box-shadow': 'rgb(0 0 0 / 16%) 0px 5px 40px',
          background: props.theme?.chatWindow?.backgroundColor + ' fixed',
          'z-index': 42424242,
        }}
        class={
          'fixed right-0 md:rounded-3xl w-full sm:w-full md:max-w-md lg:max-h-[704px]' +
          (isBotOpened() ? ' opacity-1' : ' opacity-0 pointer-events-none')
        }
      >
        <Show when={isBotStarted()}>
          <Bot
            getElement={props.getElement}
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
            closeBot={closeBot}
          />
        </Show>
      </div>
    </>
  );
};
