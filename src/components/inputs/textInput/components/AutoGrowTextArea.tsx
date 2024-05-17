import { createEffect, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

type ShortTextInputProps = {
  ref: HTMLTextAreaElement | undefined;
  fontSize?: number;
  disabled?: boolean;
  isFullPage?: boolean;
  valueGetter: () => string;
  setValue: (value: string) => void;
} & Omit<JSX.InputHTMLAttributes<HTMLTextAreaElement>, 'onInput'>;

export const AutoGrowTextArea = (props: ShortTextInputProps) => {
  const [local, others] = splitProps(props, ['ref', 'placeholder', 'valueGetter', 'setValue']);
  const textarea: HTMLTextAreaElement = (
    <textarea
      ref={local.ref}
      class="align-bottom overflow-hidden resize-none bg-transparent w-full flex-1 text-base font-normal placeholder:italic placeholder:font-light disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 focus:outline-none"
      aria-placeholder={local.placeholder}
      placeholder={local.placeholder}
      rows="1"
      style={{ 'max-height': '4lh' }}
      value={local.valueGetter()}
      onInput={(e) => local.setValue(e.target.value)}
      {...others}
    />
  );
  const resizeTextarea = createEffect(() => {
    console.debug('resizeTextarea');
    if (local.valueGetter() === '') {
      textarea.style.height = '1lh';
      return;
    }
    textarea.style.height = 'auto';
    const { scrollHeight } = textarea;
    textarea.style.height = `${scrollHeight}px`;
  });

  textarea;

  return <div class="py-2 pl-4 w-full">{textarea}</div>;
};
