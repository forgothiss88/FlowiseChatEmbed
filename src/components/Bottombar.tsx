import { For, Show, onMount } from 'solid-js';
import { StarterPromptBubble, Props as StarterPromptProps } from './bubbles/StarterPromptBubble';
import { TextInput, Props as TextInputProps } from './inputs/textInput';

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export type Props = StarterPromptProps & TextInputProps;

export const Bottombar = (
  props: TextInputProps &
    StarterPromptProps & {
      starterPrompts: () => string[];
      showStarterPrompts: boolean;
      promptClick: (prompt: string) => void;
    },
) => {
  console.log(props);
  const bb: HTMLDivElement = (
    <div class="fixed flex flex-col bottom-0 left-0 right-0 z-50 h-40">
      <div class="grow" />
      <Show when={props.starterPrompts().length > 0 && props.showStarterPrompts}>
        <div class="flex flex-row w-full flex-nowrap overflow-x-scroll ml-2">
          <For each={[...props.starterPrompts()]}>
            {(prompt) => <StarterPromptBubble prompt={prompt} onPromptClick={() => props.promptClick(prompt)} />}
          </For>
        </div>
      </Show>
      <TextInput
        ref={props.ref}
        fontSize={props.fontSize}
        disabled={props.disabled}
        isFullPage={props.isFullPage}
        getInputValue={props.getInputValue}
        setInputValue={props.setInputValue}
        placeholder={props.placeholder}
        onSubmit={props.onSubmit}
        clearChat={props.clearChat}
        isDeleteEnabled={props.isDeleteEnabled}
        backgroundColor={props.backgroundColor}
        textColor={props.textColor}
        sendButtonColor={props.sendButtonColor}
      />
    </div>
  );
  const vv = window.visualViewport;
  const fixPosition = () => {
    const rect = bb.getBoundingClientRect();
    console.log(rect);
    bb.style.top = `${vv.height - rect.height}px`;
  };
  vv.addEventListener('resize', fixPosition);
  return bb;
};
