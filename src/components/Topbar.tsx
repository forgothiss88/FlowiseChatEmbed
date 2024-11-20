import { Show } from 'solid-js';
import { Avatar } from './avatars/Avatar';

const Topbar = (props: {
  title?: string;
  titleColor?: string;
  titleAvatarSrc?: string;
  bubbleTextColor?: string;
  bubbleButtonColor?: string;
  topbarColor?: string;
  isFullPage?: boolean;
}) => {
  return (
    <div
      style={{
        background: props.topbarColor,
        color: props.bubbleTextColor,
        'border-bottom-color': props.bubbleButtonColor,
      }}
      class={
        (props.isFullPage ? '' : 'twi-rounded-t-3xl ') + 'twi-absolute twi-flex twi-flex-row twi-items-center twi-top-0 twi-w-full twi-z-50 twi-h-16'
      }
    >
      <Show when={props.titleAvatarSrc}>
        <div class="twi-grow-0 twi-ml-4">
          <Avatar src={props.titleAvatarSrc} classList={['twi-h-8']} />
        </div>
      </Show>
      <div class="twi-grow"></div>
      <div class="twi-grow-0 twi-order-last twi-mr-4  twi-bg-white twi-rounded-full twi-h-8 twi-flex">
        <a
          href="https://www.twini.ai"
          target="_blank"
          class="twi-px-4 twi-whitespace-pre-wrap twi-font-semibold twi-text-sm twi-max-w-full  twi-my-auto"
        >
          Create your @Twini
        </a>
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
};

export default Topbar;
