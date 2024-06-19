import { For, Show, createEffect, createSignal, onMount } from 'solid-js';
import { StarterPromptBubble, Props as StarterPromptProps } from './bubbles/StarterPromptBubble';
import { AutoGrowTextArea } from './inputs/textInput/components/AutoGrowTextArea';
import { DeleteButton, SendButton } from './SendButton';
import { Badge } from './Badge';

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const defaultBackgroundColor = '#ffffff';
const defaultTextColor = '#303235';

export type Props = StarterPromptProps & {
  ref: HTMLTextAreaElement | undefined;
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  sendButtonColor?: string;
  defaultValue?: string;
  fontSize?: number;
  disabled?: boolean;
  isFullPage?: boolean;
  isDeleteEnabled: boolean;
  onSubmit: (value: string) => void;
  clearChat: () => void;
  getInputValue: () => string;
  setInputValue: (value: string) => void;
};

export const Bottombar = (props: {
  ref: HTMLTextAreaElement | undefined;
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  sendButtonColor?: string;
  poweredByTextColor: string;
  defaultValue?: string;
  fontSize?: number;
  disabled?: boolean;
  isFullPage?: boolean;
  isDeleteEnabled: boolean;
  starterPrompts: string[];
  showStarterPrompts: boolean;
  onSubmit: (value: string) => void;
  clearChat: () => void;
  getInputValue: () => string;
  setInputValue: (value: string) => void;
  setBottomSpacerHeight: (height: number) => void;
  scrollToBottom: () => void;
}) => {
  let bar: HTMLDivElement | undefined;

  const [textareaHeight, setTextareaHeight] = createSignal(0);

  const checkIfInputIsValid = () => props.getInputValue() !== '' && props.ref?.reportValidity();

  const submit = () => {
    if (checkIfInputIsValid()) props.onSubmit(props.getInputValue());
    props.setInputValue('');
  };

  const submitWhenEnter = (e: KeyboardEvent) => {
    // Check if IME composition is in progress
    const isIMEComposition = e.isComposing || e.keyCode === 229;
    if (e.key === 'Enter' && !isIMEComposition) submit();
  };

  const bb: HTMLDivElement = (
    <div class="fixed bottom-0 left-0 right-0">
      <Show when={props.starterPrompts.length > 0 && props.showStarterPrompts}>
        <div class="flex flex-row w-full flex-nowrap overflow-x-scroll overflow-y-hidden ml-2">
          <For each={[...props.starterPrompts]}>
            {(prompt) => <StarterPromptBubble prompt={prompt} onPromptClick={() => props.onSubmit(prompt)} />}
          </For>
        </div>
      </Show>
      <div class="shadow-sm" style={{ 'background-color': props.backgroundColor ?? defaultBackgroundColor, 'border-top': '1px solid #eeeeee' }}>
        <div
          class={(props.isFullPage ? '' : 'rounded-b-3xl') + ' w-full flex flex-row pt-2 px-2'}
          data-testid="input"
          style={{
            color: props.textColor ?? defaultTextColor,
          }}
          onKeyDown={submitWhenEnter}
        >
          <DeleteButton sendButtonColor={props.sendButtonColor} type="button" isDisabled={!props.isDeleteEnabled} onClick={props.clearChat} />
          <div class="mr-2 w-full">
            <AutoGrowTextArea
              ref={props.ref}
              setInputValue={props.setInputValue}
              getInputValue={props.getInputValue}
              fontSize={props.fontSize}
              disabled={props.disabled}
              placeholder={props.placeholder ?? 'Type your question'}
              setHeight={setTextareaHeight}
              scrollToBottom={props.scrollToBottom}
              submit={submit}
              sendButtonColor={props.sendButtonColor}
            />
          </div>
        </div>
        <div class="w-full text-center py-1">
          <Badge poweredByTextColor={props.poweredByTextColor}></Badge>
        </div>
      </div>
    </div>
  );
  onMount(() => {
    createEffect(() => {
      textareaHeight();
      console.debug('effect bb.getBoundingClientRect().height', bb.getBoundingClientRect().height);
      props.setBottomSpacerHeight(bb.getBoundingClientRect().height);
    });
  });

  return bb;
};
