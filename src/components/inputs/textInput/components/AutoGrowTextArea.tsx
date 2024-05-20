import { createEffect } from 'solid-js';

export type Props = {
  ref: HTMLTextAreaElement | undefined;
  fontSize?: number;
  disabled: boolean;
  isFullPage: boolean;
  getInputValue: () => string;
  setInputValue: (value: string) => void;
  placeholder: string;
  onFocusIn: () => void;
};

export const AutoGrowTextArea = (props: Props) => {
  const textarea: HTMLTextAreaElement = (
    <textarea
      ref={props.ref}
      class="align-bottom overflow-hidden resize-none bg-transparent w-full flex-1 text-base font-normal placeholder:italic placeholder:font-light disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 focus:outline-none focus:animate-fade-in"
      aria-placeholder={props.placeholder}
      placeholder={props.placeholder}
      rows="1"
      style={{ 'max-height': '4lh' }}
      value={props.getInputValue()}
      onInput={(e) => props.setInputValue(e.target.value)}
      onFocusIn={props.onFocusIn}
      disabled={props.disabled}
    />
  );
  const resizeTextarea = createEffect(() => {
    console.debug('resizeTextarea');
    if (props.getInputValue() === '') {
      textarea.style.height = '1lh';
      return;
    }
    textarea.style.height = 'auto';
    const { scrollHeight } = textarea;
    textarea.style.height = `${scrollHeight}px`;
    textarea.focus();
  });

  return (
    <div class="ml-3 my-2 w-full">
      <div class="pl-3 pr-2 py-2 rounded-xl bg-gray-200">{textarea}</div>
    </div>
  );
};
