import { DeleteButton, SendButton } from '@/components/SendButton';
import { isMobile } from '@/utils/isMobileSignal';
import { createEffect, onMount } from 'solid-js';
import { AutoGrowTextArea } from './AutoGrowTextArea';

const defaultBackgroundColor = '#ffffff';
const defaultTextColor = '#303235';

export type Props = {
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

export const TextInput = (props: Props) => {
  let inputRef: HTMLTextAreaElement | undefined;

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

  return (
    <div
      class={(props.isFullPage ? '' : 'rounded-b-3xl') + ' w-full flex flex-row shadow-sm'}
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
      />
      <SendButton
        sendButtonColor={props.sendButtonColor}
        type="button"
        isDisabled={props.disabled || props.getInputValue() === ''}
        onClick={submit}
      />
      <DeleteButton sendButtonColor={props.sendButtonColor} type="button" isDisabled={!props.isDeleteEnabled} onClick={props.clearChat} />
    </div>
  );
};
