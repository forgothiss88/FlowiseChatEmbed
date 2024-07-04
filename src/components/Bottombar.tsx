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
};

export const Bottombar = (props: Props) => {
  let bar: HTMLDivElement | undefined;

  const [textareaHeight, setTextareaHeight] = createSignal(0);

  const checkIfInputIsValid = () => props.getInputValue() !== '';

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
    <div class="z-50">
      <Show when={props.starterPrompts.length > 0 && props.showStarterPrompts}>
        <div class="flex flex-row w-full flex-nowrap overflow-x-scroll overflow-y-hidden">
          <div class="ml-1"></div>
          <For each={[...props.starterPrompts]}>
            {(prompt) => <StarterPromptBubble prompt={prompt} onPromptClick={() => props.onSubmit(prompt)} />}
          </For>
        </div>
      </Show>
      <div
        class={'shadow-sm' + (props.isFullPage ? '' : ' rounded-b-3xl')}
        style={{ 'background-color': props.backgroundColor ?? defaultBackgroundColor, 'border-top': '1px solid #eeeeee' }}
      >
        <div
          class={'w-full flex flex-row pt-2 px-2'}
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
              placeholder={props.placeholder}
              setHeight={setTextareaHeight}
              onSubmit={submit}
              sendButtonColor={props.sendButtonColor || 'black'}
              scrollToBottom={props.scrollToBottom}
            />
          </div>
        </div>
        <div class={'w-full text-center py-1'}>
          <Badge poweredByTextColor={props.poweredByTextColor}></Badge>
        </div>
      </div>
    </div>
  );
  onMount(() => {
    createEffect(() => {
      textareaHeight();
      props.setBottomSpacerHeight(bb.getBoundingClientRect().height || bb.clientHeight);
    });
  });

  return <div class="fixed bottom-0 w-full h-fit">{bb}</div>;
};
