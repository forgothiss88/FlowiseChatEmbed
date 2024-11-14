import { Accessor, Show } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { DeleteIcon } from './icons/DeleteIcon';
import { SendIcon } from './icons/SendIcon';
import { Spinner } from './icons/Spinner';

type SendButtonProps = {
  color: string;
  arrowColor: string;
  isDisabled: boolean;
  isLoading: Accessor<boolean>;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const SendButton = (props: SendButtonProps) => {
  return (
    <button
      disabled={props.isDisabled || props.isLoading()}
      class={
        'twi-cursor-pointer twi-p-2 twi-rounded-full twi-justify-center focus:twi-outline-none twi-flex twi-items-center disabled:twi-opacity-20 disabled:twi-grayscale disabled:twi-cursor-not-allowed disabled:twi-brightness-100 twi-transition-all twi-filter hover:twi-brightness-90 active:twi-brightness-75 ' +
        props.class
      }
      style={{ background: props.color, border: 'none' }}
      {...props}
    >
      <Show when={!props.isLoading()} fallback={<Spinner class="twi-text-white" />}>
        <SendIcon width={24} height={24} color={props.arrowColor} class={'twi-send-icon twi-flex'} />
      </Show>
    </button>
  );
};
export const DeleteButton = (
  props: {
    color: string;
    isDisabled: boolean;
    isLoading: Accessor<boolean>;
  } & JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <button
      disabled={props.isDisabled || props.isLoading()}
      class={
        'twi-cursor-pointer twi-px-3 twi-justify-center twi-font-semibold twi-text-white focus:twi-outline-none twi-flex twi-items-center disabled:twi-opacity-50 disabled:twi-cursor-not-allowed disabled:twi-brightness-100 twi-transition-all twi-filter hover:twi-brightness-90 active:twi-brightness-75 ' +
        props.class
      }
      style={{ background: 'transparent', border: 'none' }}
      title="New Chat"
      {...props}
    >
      <Show when={!props.isLoading()} fallback={<Spinner class="twi-text-white" />}>
        <DeleteIcon color={props.color} class="twi-send-icon twi-flex" />
      </Show>
    </button>
  );
};
