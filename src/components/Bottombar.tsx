import { For, Show, onMount } from 'solid-js';
import { StarterPromptBubble, Props as StarterPromptProps } from './bubbles/StarterPromptBubble';
import { TextInput, Props as TextInputProps } from './inputs/textInput';

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export type Props = StarterPromptProps & TextInputProps;

export const Bottombar = (
  props: TextInputProps & {
    starterPrompts: string[];
    showStarterPrompts: boolean;
    promptClick: (prompt: string) => void;
  },
) => {
  const bb: HTMLDivElement = (
    <div class="fixed flex flex-col left-0 right-0 z-50" style={{ bottom: 0 }}>
      <Show when={props.starterPrompts.length > 0 && props.showStarterPrompts}>
        <div class="flex flex-row w-full flex-nowrap overflow-x-scroll ml-2">
          <For each={[...props.starterPrompts]}>
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
  const fixPosition = () => {
    bb.style.bottom = `${window.innerHeight - window.visualViewport?.height - 1 || 0}px`;
  };
  window.visualViewport?.addEventListener('resize', fixPosition);
  onMount(() => {
    fixPosition();
  });

  return bb;
};
