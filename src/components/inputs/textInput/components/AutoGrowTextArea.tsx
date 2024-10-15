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
      class="overflow-hidden resize-none bg-transparent w-full my-auto text-poppins text-base font-normal placeholder:italic placeholder:font-light disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 outline-none focus:ring-0 focus:animate-fade-in"
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
      class="flex flex-row pl-3 py-1 rounded-2xl bg-gray-200 border"
      style={{ 'background-color': props.inputBackgroundColor, 'border-color': props.inputBorderColor }}
    >
      {textarea}
      <div class="my-auto">
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
