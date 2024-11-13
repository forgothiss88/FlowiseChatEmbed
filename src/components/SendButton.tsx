import { Show } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { DeleteIcon } from './icons/DeleteIcon';
import { SendIcon } from './icons/SendIcon';
import { Spinner } from './icons/Spinner';

type SendButtonProps = {
  color?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  disableIcon?: boolean;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const SendButton = (props: SendButtonProps) => {
  return (
    <button
      disabled={props.isDisabled || props.isLoading}
      class={
        'twi-cursor-pointer twi-justify-center focus:twi-outline-none twi-flex twi-items-center disabled:twi-opacity-50 disabled:twi-cursor-not-allowed disabled:twi-brightness-100 twi-transition-all twi-filter hover:twi-brightness-90 active:twi-brightness-75 ' +
        props.class
      }
      style={{ background: 'transparent', border: 'none' }}
      {...props}
    >
      <Show when={!props.isLoading} fallback={<Spinner class="twi-text-white" />}>
        <SendIcon color={props.color} class={'twi-send-icon twi-flex ' + (props.disableIcon ? 'twi-hidden' : '')} />
      </Show>
    </button>
  );
};
export const DeleteButton = (props: SendButtonProps) => {
  return (
    <button
      disabled={props.isDisabled || props.isLoading}
      {...props}
      class={
        'twi-cursor-pointer twi-py-2 twi-px-3 twi-justify-center twi-font-semibold twi-text-white focus:twi-outline-none twi-flex twi-items-center disabled:twi-opacity-50 disabled:twi-cursor-not-allowed disabled:twi-brightness-100 twi-transition-all twi-filter hover:twi-brightness-90 active:twi-brightness-75 ' +
        props.class
      }
      style={{ background: 'transparent', border: 'none' }}
      title="New Chat"
    >
      <Show when={!props.isLoading} fallback={<Spinner class="twi-text-white" />}>
        <DeleteIcon color={props.color} class={'twi-send-icon twi-flex ' + (props.disableIcon ? 'twi-hidden' : '')} />
      </Show>
    </button>
  );
};
