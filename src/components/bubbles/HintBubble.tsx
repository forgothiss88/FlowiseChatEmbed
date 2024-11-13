import { HintStars } from '../icons/HintStars';

type Props = {
  message: string;
  textColor?: string;
  actionColor?: string;
  onClick: () => void;
};

export const HintBubble = (props: Props) => {
  return (
    <div class="twi-flex twi-justify-end twi-guest-container twi-py-1 twi-w-full">
      <button
        class="twi-flex twi-cursor-pointer twi-items-center twi-bg-transparent twi-p-3 twi-max-w-[80%] twi-rounded-2xl twi-rounded-tr-none twi-whitespace-pre-wrap twi-font-light twi-text-sm twi-text-poppins twi-text-left twi-border-dashed twi-border"
        onClick={props.onClick}
        style={{
          'border-color': props.textColor,
        }}
      >
        <span class="twi-mr-2">
          <HintStars color={props.actionColor} width={18} height={18} />
        </span>
        <span
          class="twi-text-justify twi-text-sm"
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
