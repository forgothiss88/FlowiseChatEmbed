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
        'justify-center focus:outline-none flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 transition-all filter hover:brightness-90 active:brightness-75 ' +
        props.class
      }
      style={{ background: 'transparent', border: 'none' }}
      {...props}
    >
      <Show when={!props.isLoading} fallback={<Spinner class="text-white" />}>
        <SendIcon color={props.color} class={'send-icon flex ' + (props.disableIcon ? 'hidden' : '')} />
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
        'py-2 px-3 justify-center font-semibold text-white focus:outline-none flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 transition-all filter hover:brightness-90 active:brightness-75 ' +
        props.class
      }
      style={{ background: 'transparent', border: 'none' }}
      title="New Chat"
    >
      <Show when={!props.isLoading} fallback={<Spinner class="text-white" />}>
        <DeleteIcon color={props.color} class={'send-icon flex ' + (props.disableIcon ? 'hidden' : '')} />
      </Show>
    </button>
  );
};
