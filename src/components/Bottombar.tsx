import { createEffect, createSignal, onMount } from 'solid-js';
import { Badge } from './Badge';
import { DeleteButton } from './SendButton';
import { AutoGrowTextArea } from './inputs/textInput/components/AutoGrowTextArea';

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const defaultBackgroundColor = '#ffffff';
const defaultTextColor = '#303235';

export type Props = {
  ref: HTMLTextAreaElement | undefined;
  placeholder: string;
  backgroundColor: string;
  inputBackgroundColor: string;
  inputBorderColor: string;
  textColor?: string;
  sendButtonColor: string;
  resetButtonColor: string;
  poweredByTextColor: string;
  fontSize?: number;
  disabled?: boolean;
  isFullPage?: boolean;
  isDeleteEnabled: boolean;
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
    <div>
      <div
        class={'shadow-sm' + (props.isFullPage ? '' : ' md:rounded-b-3xl')}
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
          <DeleteButton color={props.resetButtonColor} type="reset" isDisabled={!props.isDeleteEnabled} onClick={props.clearChat} />
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
              inputBackgroundColor={props.inputBackgroundColor}
              inputBorderColor={props.inputBorderColor}
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

  return <div class="fixed bottom-0 w-full h-fit z-50">{bb}</div>;
};
