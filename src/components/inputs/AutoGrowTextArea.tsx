import { SendButton } from '@/components/SendButton';
import { Accessor, createEffect, on, splitProps } from 'solid-js';
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
  isLoading: Accessor<boolean>;
  isOpened: Accessor<boolean>;
  sendButtonColor: string;
  inputBackgroundColor: string;
  inputBorderColor: string;
} & Omit<JSX.InputHTMLAttributes<HTMLTextAreaElement>, 'onInput'>;

export const AutoGrowTextArea = (props: Props) => {
  const [local, others] = splitProps(props, [
    'ref',
    'placeholder',
    'getInputValue',
    'setInputValue',
    'scrollToBottom',
    'isOpened',
    'setHeight',
    'onSubmit',
    'isLoading',
    'sendButtonColor',
    'inputBackgroundColor',
    'inputBorderColor',
  ]);
  const textarea: HTMLTextAreaElement = (
    <textarea
      ref={local.ref}
      class="twi-overflow-hidden twi-resize-none twi-bg-transparent twi-w-full twi-my-auto twi-text-sm twi-font-normal placeholder:twi-italic placeholder:twi-font-normal disabled:twi-opacity-50 disabled:twi-cursor-not-allowed disabled:twi-brightness-100 twi-outline-none focus:twi-ring-0"
      aria-placeholder={local.placeholder}
      placeholder={local.placeholder}
      rows="1"
      style={{ 'max-height': '4lh', 'font-size': '16px' }}
      value={local.getInputValue()}
      onInput={(e) => local.setInputValue(e.target.value)}
      onFocus={(e) => local.scrollToBottom()}
      onSubmit={local.onSubmit}
      {...others}
    />
  );
  const resizeTextarea = () => {
    if (local.getInputValue() === '') {
      textarea.style.height = '1lh';
      local.setHeight(textarea.clientHeight);
      return;
    }
    textarea.style.height = 'auto';
    const { scrollHeight } = textarea;
    textarea.style.height = `${scrollHeight}px`;
    local.setHeight(scrollHeight);
  };

  createEffect(on(() => [local.isOpened(), local.getInputValue()], resizeTextarea));

  return (
    <div class="twi-inline-flex twi-w-full">
      <div
        class="twi-flex-1 twi-flex twi-flex-row twi-pl-3 twi-pr-2 twi-py-1 twi-rounded-3xl twi-bg-gray-200 twi-border twi-w-full"
        style={{ 'background-color': local.inputBackgroundColor, 'border-color': local.inputBorderColor }}
      >
        {textarea}
      </div>
      <div class="twi-my-auto twi-pl-3">
        <SendButton
          color={local.sendButtonColor}
          arrowColor="white"
          type="button"
          isLoading={local.isLoading}
          isDisabled={others.disabled || local.getInputValue() === ''}
          onClick={local.onSubmit}
        />
      </div>
    </div>
  );
};
