import { isMobile } from '@/utils/isMobileSignal';
import { Accessor, createSignal, Setter, Show, splitProps } from 'solid-js';
import styles from '../../../assets/index.css';
import { Bot, BotProps } from '../../../components/Bot';
import { BubbleParams } from '../types';
import { BubbleButton } from './BubbleButton';

const defaultButtonColor = '#3B81F6';
const defaultIconColor = 'white';

export type BubbleProps = BotProps & BubbleParams;

export const BubbleBot = (
  props: BubbleProps & { getElement: () => HTMLElement; isBotOpened: Accessor<boolean>; setIsBotOpened: Setter<boolean> },
) => {
  const [bubbleProps] = splitProps(props, ['theme']);

  const [isBotStarted, setIsBotStarted] = createSignal(false);

  let bodyOverflow = '';

  const openBot = () => {
    if (!isBotStarted()) setIsBotStarted(true);
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
  isMobile();

  return (
    <>
      <style>{styles}</style>
      <Show when={!props.isBotOpened()}>
        <BubbleButton {...bubbleProps.theme?.button} toggleBot={toggleBot} isBotOpened={props.isBotOpened} />
      </Show>
      <div
        part="bot"
        style={{
          height: bubbleProps.theme?.chatWindow?.height ? `${bubbleProps.theme?.chatWindow?.height.toString()}px` : '',
          transition: 'transform 200ms cubic-bezier(0, 1.2, 1, 1), opacity 150ms ease-out',
          'transform-origin': 'calc(100% - 32px) calc(100% - 32px)',
          transform: props.isBotOpened() ? 'scale3d(1, 1, 1)' : 'scale3d(0, 0, 1)',
          'box-shadow': 'rgb(0 0 0 / 16%) 0px 5px 40px',
          background: props.theme?.chatWindow?.backgroundColor + ' fixed',
        }}
        class={
          'fixed z-50 right-0 bottom-0 backdrop-blur md:rounded-3xl lg:right-4 lg:bottom-4 w-full lg:max-w-md top-0 lg:top-auto lg:h-[704px]' +
          (props.isBotOpened() ? ' opacity-1' : ' opacity-0 pointer-events-none')
        }
      >
        <Show when={isBotStarted()}>
          <Bot
            getElement={props.getElement}
            titleAvatarSrc={bubbleProps.theme?.chatWindow?.titleAvatarSrc}
            welcomeMessage={bubbleProps.theme?.chatWindow?.welcomeMessage}
            poweredByTextColor={bubbleProps.theme?.chatWindow?.poweredByTextColor}
            textInput={bubbleProps.theme?.chatWindow?.textInput}
            botMessage={bubbleProps.theme?.chatWindow?.botMessage}
            userMessage={bubbleProps.theme?.chatWindow?.userMessage}
            fontSize={bubbleProps.theme?.chatWindow?.fontSize}
            chatflowid={props.chatflowid}
            apiUrl={props.apiUrl}
            starterPrompts={props.starterPrompts || {}}
            creatorName={props.creatorName}
            closeBot={closeBot}
          />
        </Show>
      </div>
    </>
  );
};
