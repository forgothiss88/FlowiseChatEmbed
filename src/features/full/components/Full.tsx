import { Bot } from '@/components/Bot';
import { FullBotProps } from '@/components/types/botprops';
import { Show, createSignal, onMount } from 'solid-js';

const defaultButtonColor = '#3B81F6';
const defaultIconColor = 'white';

export const FullBot = (props: FullBotProps & { getElement: () => HTMLElement }) => {
  const [isBotDisplayed, setIsBotDisplayed] = createSignal(false);

  onMount(() => {
    setIsBotDisplayed(true);
  });
  return (
    <>
      <Show when={isBotDisplayed()}>
        <div
          class="w-full h-full z-50 backdrop-blur"
          id="twini-chatbot"
          style={{
            background: props.theme?.chatWindow?.backgroundColor + ' fixed',
          }}
        >
          <Bot
            getElement={props.getElement}
            bubbleButtonColor={props.theme?.button?.bubbleButtonColor ?? defaultButtonColor}
            topbarColor={props.theme?.button?.topbarColor ?? defaultButtonColor}
            bubbleTextColor={props.theme?.button?.iconColor ?? defaultIconColor}
            title={props.theme?.chatWindow?.title}
            titleColor={props.theme?.chatWindow?.titleColor}
            titleAvatarSrc={props.theme?.chatWindow?.titleAvatarSrc}
            welcomeMessage={props.theme?.chatWindow?.welcomeMessage}
            poweredByTextColor={props.theme?.chatWindow?.poweredByTextColor}
            textInput={props.theme?.chatWindow?.textInput}
            botMessage={props.theme?.chatWindow?.botMessage}
            userMessage={props.theme?.chatWindow?.userMessage}
            fontSize={props.theme?.chatWindow?.fontSize}
            chatflowid={props.chatflowid}
            apiUrl={props.apiUrl}
            isFullPage={true}
            starterPrompts={props.starterPrompts || {}}
            creatorName={props.creatorName}
            firstMessage={props.theme?.chatWindow?.firstMessage}
            closeBot={() => null} // closeBot is not needed in full mode
          />
        </div>
      </Show>
    </>
  );
};
