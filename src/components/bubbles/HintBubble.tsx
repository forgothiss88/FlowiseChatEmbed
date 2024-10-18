import { HintStars } from '../icons/HintStars';

type Props = {
  message: string;
  textColor?: string;
  actionColor?: string;
  onClick: () => void;
};

export const HintBubble = (props: Props) => {
  return (
    <div class="flex justify-end guest-container py-1 w-full">
      <button
        class={
          'flex items-center bg-transparent p-3 max-w-[80%] rounded-2xl rounded-tr-none whitespace-pre-wrap font-light text-sm text-poppins text-left border-dashed border'
        }
        onClick={props.onClick}
        style={{
          'border-color': props.textColor,
        }}
      >
        <span class="mr-2">
          <HintStars color={props.actionColor} width={18} height={18} />
        </span>
        <span
          class="text-justify text-sm"
          style={{
            'text-align-last': 'left',
            color: props.textColor,
          }}
        >
          {props.message}
        </span>
      </button>
    </div>
  );
};
