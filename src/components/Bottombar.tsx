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
        scrollToBottom={props.scrollToBottom}
      />
    </div>
  );
};
