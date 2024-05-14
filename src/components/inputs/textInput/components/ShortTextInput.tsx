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
    <input
      name={props.name}
      ref={props.ref}
      class="my-2 ml-2 bg-transparent flex-1 w-full h-9 align-middle text-base overflow-x-auto font-normal disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 focus:outline-none"
      disabled={props.disabled}
      onInput={(e) => local.onInput(e.currentTarget.value)}
      aria-placeholder={props.placeholder}
      placeholder={props.placeholder}
      {...others}
    />
  );
};
