import { For, Show, createEffect, createSignal, onMount } from 'solid-js';
import { StarterPromptBubble, Props as StarterPromptProps } from './bubbles/StarterPromptBubble';
import { TextInput, Props as TextInputProps } from './inputs/textInput';
import { isMobile } from '@/utils/isMobileSignal';
import { AutoGrowTextArea } from './inputs/textInput/components/AutoGrowTextArea';
import { DeleteButton, SendButton } from './SendButton';

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const defaultBackgroundColor = '#ffffff';
const defaultTextColor = '#303235';

export type Props = StarterPromptProps & {
  ref: HTMLTextAreaElement | undefined;
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  sendButtonColor?: string;
  defaultValue?: string;
  fontSize?: number;
  disabled?: boolean;
  isFullPage?: boolean;
  isDeleteEnabled: boolean;
  onSubmit: (value: string) => void;
  clearChat: () => void;
  getInputValue: () => string;
  setInputValue: (value: string) => void;
};

export const Bottombar = (
  props: TextInputProps & {
    starterPrompts: string[];
    showStarterPrompts: boolean;
    promptClick: (prompt: string) => void;
    setBottomSpacerHeight: (height: number) => void;
  },
) => {
  let inputRef: HTMLTextAreaElement | undefined;
  let bar: HTMLDivElement | undefined;

  const [textareaHeight, setTextareaHeight] = createSignal(0);

  const checkIfInputIsValid = () => props.getInputValue() !== '' && inputRef?.reportValidity();

  const submit = () => {
    if (checkIfInputIsValid()) props.onSubmit(props.getInputValue());
    props.setInputValue('');
  };

  const submitWhenEnter = (e: KeyboardEvent) => {
    // Check if IME composition is in progress
    const isIMEComposition = e.isComposing || e.keyCode === 229;
    if (e.key === 'Enter' && !isIMEComposition) submit();
  };

  createEffect(() => {
    if (!props.disabled && !isMobile() && inputRef) inputRef.focus();
  });

  onMount(() => {
    if (!isMobile() && inputRef) inputRef.focus();
  });

  const bb: HTMLDivElement = (
    <div class="fixed flex flex-col left-0 right-0 z-50" style={{ bottom: 0 }}>
      <Show when={props.starterPrompts.length > 0 && props.showStarterPrompts}>
        <div class="flex flex-row w-full flex-nowrap overflow-x-scroll ml-2">
          <For each={[...props.starterPrompts]}>
            {(prompt) => <StarterPromptBubble prompt={prompt} onPromptClick={() => props.promptClick(prompt)} />}
          </For>
        </div>
      </Show>
      <div
        class={(props.isFullPage ? '' : 'rounded-b-3xl') + ' w-full flex flex-row chatbot-input shadow-sm'}
        data-testid="input"
        style={{
          'border-top': '1px solid #eeeeee',
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
        onKeyDown={submitWhenEnter}
      >
        <AutoGrowTextArea
          ref={inputRef}
          setInputValue={props.setInputValue}
          getInputValue={props.getInputValue}
          fontSize={props.fontSize}
          disabled={props.disabled}
          placeholder={props.placeholder ?? 'Type your question'}
          setHeight={setTextareaHeight}
        />
        <SendButton
          sendButtonColor={props.sendButtonColor}
          type="button"
          isDisabled={props.disabled || props.getInputValue() === ''}
          onClick={submit}
        />
        <DeleteButton sendButtonColor={props.sendButtonColor} type="button" isDisabled={!props.isDeleteEnabled} onClick={props.clearChat} />
      </div>
    </div>
  );
  const fixPosition = () => {
    const bt = window.innerHeight - window.visualViewport?.height || 0;
    bb.style.bottom = `${bt}px`;
    props.setBottomSpacerHeight(bb.getBoundingClientRect().height + bt);
  };
  createEffect(() => {
    textareaHeight();
    fixPosition();
  });

  window.visualViewport?.addEventListener('resize', fixPosition);
  onMount(() => {
    fixPosition();
  });
  setTimeout(() => {
    fixPosition();
  }, 10);

  return bb;
};
