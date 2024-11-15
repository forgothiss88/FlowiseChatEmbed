import { HintStars } from '../icons/HintStars';

type Props = {
  message: string;
  textColor: string;
  actionColor: string;
  backgroundColor: string;
  onClick: () => void;
};

export const HintBubble = (props: Props) => {
  return (
    <div class="twi-flex twi-justify-end twi-guest-container twi-py-1 twi-w-full">
      <button
        class="twi-flex twi-cursor-pointer twi-items-center twi-bg-transparent twi-p-2 twi-pr-3 twi-max-w-[80%] twi-rounded-2xl twi-rounded-br-none twi-whitespace-pre-wrap twi-font-light twi-text-sm twi-text-left twi-border-dashed twi-border"
        onClick={props.onClick}
        style={{
          'border-color': props.actionColor,
          'background-color': props.backgroundColor,
        }}
      >
        <span class="twi-mr-2">
          <HintStars color={props.actionColor} width={18} height={18} />
        </span>
        <span class="twi-text-left twi-text-sm" style={{ color: props.textColor }}>
          {props.message}
        </span>
      </button>
    </div>
  );
};
