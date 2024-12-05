import { HintStars } from '../icons/HintStars';

type Props = {
  message: string;
  starsColor?: string;
  delayMilliseconds?: number;
  onClick: () => void;
  class?: string;
};

export const HintBubble = (props: Props) => {
  console.log('HintBubble', props);
  return (
    <div class="twi-flex twi-justify-end twi-guest-container twi-w-full">
      <button
        class={
          'twi-animate-fade-in twi-bg-brand-action-primary/10 twi-border-brand-action-primary twi-flex twi-cursor-pointer twi-items-center twi-p-2 twi-max-w-[80%] twi-rounded-l-4xl twi-rounded-tr-2xl twi-rounded-br-none twi-whitespace-pre-wrap twi-font-normal twi-text-sm twi-text-left twi-border-dashed twi-border ' +
          props.class
        }
        onClick={props.onClick}
        classList={{
          'twi-opacity-0': (props.delayMilliseconds || 0) > 0,
        }}
        style={{
          'animation-delay': `${props.delayMilliseconds || 0}ms`,
        }}
      >
        <span class="twi-mr-2">
          <HintStars fill={props.starsColor} width={18} height={18} />
        </span>
        <span class="twi-text-left twi-text-sm">{props.message}</span>
      </button>
    </div>
  );
};
