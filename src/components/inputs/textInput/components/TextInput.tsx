import { DeleteButton, SendButton } from '@/components/SendButton';
import { isMobile } from '@/utils/isMobileSignal';
import { createEffect, onMount } from 'solid-js';
import { AutoGrowTextArea } from './AutoGrowTextArea';

type Props = {
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  sendButtonColor?: string;
  defaultValue?: string;
  fontSize?: number;
  disabled?: boolean;
  onSubmit: (value: string) => void;
  isFullPage?: boolean;
  clearChat: () => void;
  isDeleteEnabled: boolean;
  message?: string;
  inputValue: () => string;
  setInputValue: (value: string) => void;
};

const defaultBackgroundColor = '#ffffff';
const defaultTextColor = '#303235';

export const TextInput = (props: Props) => {
  let inputRef: HTMLTextAreaElement | undefined;

  const checkIfInputIsValid = () => props.inputValue() !== '' && inputRef?.reportValidity();

  const submit = () => {
    if (checkIfInputIsValid()) props.onSubmit(props.inputValue());
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

  return (
    <div
      class={(props.isFullPage ? '' : 'rounded-b-3xl') + ' w-full flex flex-row chatbot-input shadow-sm fixed right-0 bottom-0'}
      data-testid="input"
      style={{
        'border-top': '1px solid #eeeeee',
        'z-index': 1000,
        'background-color': props.backgroundColor ?? defaultBackgroundColor,
        color: props.textColor ?? defaultTextColor,
      }}
      onKeyDown={submitWhenEnter}
    >
      <AutoGrowTextArea
        ref={inputRef}
        setValue={props.setInputValue}
        valueGetter={props.inputValue}
        fontSize={props.fontSize}
        disabled={props.disabled}
        placeholder={props.placeholder ?? 'Type your question'}
      />
      <SendButton
        sendButtonColor={props.sendButtonColor}
        type="button"
        isDisabled={props.disabled || props.inputValue() === ''}
        onClick={submit}
      ></SendButton>
      <DeleteButton
        sendButtonColor={props.sendButtonColor}
        type="button"
        isDisabled={!props.isDeleteEnabled}
        onClick={props.clearChat}
      ></DeleteButton>
    </div>
  );
};
