import { SendButton } from '@/components/SendButton';
import { createEffect, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export type Props = {
  ref: HTMLTextAreaElement | undefined;
  fontSize?: number;
  disabled?: boolean;
  isFullPage?: boolean;
  getInputValue: () => string;
  setInputValue: (value: string) => void;
  setHeight: (height: number) => void;
  scrollToBottom: () => void;
  onSubmit: () => void;
  sendButtonColor: string;
  inputBackgroundColor: string;
  inputBorderColor: string;
} & Omit<JSX.InputHTMLAttributes<HTMLTextAreaElement>, 'onInput'>;

export const AutoGrowTextArea = (props: Props) => {
  const [local, others] = splitProps(props, ['ref', 'placeholder', 'getInputValue', 'setInputValue', 'scrollToBottom']);
  const textarea: HTMLTextAreaElement = (
    <textarea
      ref={local.ref}
      class="twi-overflow-hidden twi-resize-none twi-bg-transparent twi-w-full twi-my-auto twi-text-poppins twi-text-base twi-font-normal placeholder:twi-italic placeholder:twi-font-light disabled:twi-opacity-50 disabled:twi-cursor-not-allowed disabled:twi-brightness-100 twi-outline-none focus:twi-ring-0 focus:twi-animate-fade-in"
      aria-placeholder={local.placeholder}
      placeholder={local.placeholder}
      rows="1"
      style={{ 'max-height': '4lh' }}
      value={local.getInputValue()}
      onInput={(e) => local.setInputValue(e.target.value)}
      onFocus={(e) => local.scrollToBottom()}
      {...others}
    />
  );
  const resizeTextarea = () => {
    if (local.getInputValue() === '') {
      textarea.style.height = '1lh';
      props.setHeight(textarea.clientHeight);
      return;
    }
    textarea.style.height = 'auto';
    const { scrollHeight } = textarea;
    textarea.style.height = `${scrollHeight}px`;
    props.setHeight(scrollHeight);
  };

  createEffect(resizeTextarea);

  return (
    <div
      class="twi-flex twi-flex-row twi-pl-3 twi-py-1 twi-rounded-2xl twi-bg-gray-200 twi-border"
      style={{ 'background-color': props.inputBackgroundColor, 'border-color': props.inputBorderColor }}
    >
      {textarea}
      <div class="twi-my-auto twi-py-2 twi-pr-3">
        <SendButton
          color={props.sendButtonColor}
          type="button"
          isDisabled={props.disabled || props.getInputValue() === ''}
          onClick={props.onSubmit}
        />
      </div>
    </div>
  );
};
