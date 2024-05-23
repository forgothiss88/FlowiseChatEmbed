import { createEffect, onMount } from 'solid-js';

export type Props = {
  ref: HTMLTextAreaElement | undefined;
  id: string;
  fontSize?: number;
  disabled: boolean;
  isFullPage: boolean;
  placeholder: string;
  getInputValue: () => string;
  setInputValue: (value: string) => void;
  scrollToBottom: () => void;
};

export const AutoGrowTextArea = (props: Props) => {
  const textarea: HTMLTextAreaElement = (
    <textarea
      ref={props.ref}
      id={props.id}
      class="align-bottom overflow-hidden resize-none bg-transparent w-full flex-1 text-base font-normal placeholder:italic placeholder:font-light disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 focus:outline-none focus:animate-fade-in"
      aria-placeholder={props.placeholder}
      placeholder={props.placeholder}
      rows="1"
      style={{ 'max-height': '4lh' }}
      value={props.getInputValue()}
      onInput={(e) => props.setInputValue(e.target.value)}
      disabled={props.disabled}
    />
  );

  return (
      <div class="fixed bottom-0 w-full ml-3 my-2 w-fullpl-3 pr-2 py-2 rounded-xl bg-gray-200">{textarea}</div>
  );
};
