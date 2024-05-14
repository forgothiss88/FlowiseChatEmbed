import { splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

type ShortTextInputProps = {
  ref: HTMLInputElement | undefined;
  onInput: (value: string) => void;
  fontSize?: number;
  disabled?: boolean;
  isFullPage?: boolean;
} & Omit<JSX.InputHTMLAttributes<HTMLTextAreaElement>, 'onInput'>;

export const ShortTextInput = (props: ShortTextInputProps) => {
  const [local, others] = splitProps(props, ['ref', 'onInput']);

  return (
    <textarea
      name={props.name}
      ref={props.ref}
      class="focus:outline-none bg-transparent flex-1 overflow-auto resize-y pl-6 py-4 w-full text-input text-base font-normal disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100"
      disabled={props.disabled}
      style={{ 'font-size': props.fontSize ? `${props.fontSize}px` : '16px', 'min-height': '24px', 'max-height': '128px', 'field-sizing': 'content' }}
      onInput={(e) => local.onInput(e.currentTarget.value)}
      {...others}
    />
  );
};
