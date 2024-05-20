import { For, Show } from 'solid-js';
import { StarterPromptBubble, Props as StarterPromptProps } from './bubbles/StarterPromptBubble';
import { TextInput, Props as TextInputProps } from './inputs/textInput';

export type Props = StarterPromptProps & TextInputProps;

export const Bottombar = (
  props: TextInputProps &
    Omit<StarterPromptProps, 'prompt'> & {
      starterPrompts: () => string[];
      showStarterPrompts: boolean;
      promptClick: (prompt: string) => void;
      scrollToBottom: () => void;
    },
) => {
  console.log(props);
  return (
    <div class="fixed w-full z-50" style={{ bottom: '0' }}>
      <Show when={props.starterPrompts().length > 0 && props.showStarterPrompts}>
        <div class="flex-1 flex flex-row w-full flex-nowrap overflow-x-scroll ml-2">
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
        onFocusIn={props.scrollToBottom}
      />
    </div>
  );
};
