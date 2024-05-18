import { createEffect, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export type Props = {
  ref: HTMLTextAreaElement | undefined;
  fontSize?: number;
  disabled?: boolean;
  isFullPage?: boolean;
  getInputValue: () => string;
  setInputValue: (value: string) => void;
} & Omit<JSX.InputHTMLAttributes<HTMLTextAreaElement>, 'onInput'>;

export const AutoGrowTextArea = (props: Props) => {
  const [local, others] = splitProps(props, ['ref', 'placeholder', 'getInputValue', 'setInputValue']);
  const textarea: HTMLTextAreaElement = (
    <textarea
      ref={local.ref}
      class="align-bottom overflow-hidden resize-none bg-transparent w-full flex-1 text-base font-normal placeholder:italic placeholder:font-light disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 focus:outline-none focus:animate-fade-in"
      aria-placeholder={local.placeholder}
      placeholder={local.placeholder}
      rows="1"
      style={{ 'max-height': '4lh' }}
      value={local.getInputValue()}
      onInput={(e) => local.setInputValue(e.target.value)}
      {...others}
    />
  );
  const resizeTextarea = createEffect(() => {
    console.debug('resizeTextarea');
    if (local.getInputValue() === '') {
      textarea.style.height = '1lh';
      return;
    }
    textarea.style.height = 'auto';
    const { scrollHeight } = textarea;
    textarea.style.height = `${scrollHeight}px`;
    textarea.focus();
  });

  textarea;

  return (
    <div class="ml-3 my-2 w-full">
      <div class="pl-3 pr-2 py-2 rounded-xl bg-gray-200">{textarea}</div>
    </div>
  );
};