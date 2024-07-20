import { Show, createSignal, onCleanup, onMount } from 'solid-js';
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
      class={(props.isFullPage ? 'fixed' : 'absolute rounded-t-3xl') + ' flex flex-row items-center top-0 w-full z-50 h-16'}
    >
      <Show when={props.titleAvatarSrc}>
        <div class="grow-0 ml-4">
          <Avatar src={props.titleAvatarSrc} classList={['h-8']} />
        </div>
      </Show>
      <div class="grow"></div>
      <div class="grow-0 order-last mr-4  bg-white rounded-full h-8 flex">
        <a
          href="https://www.twini.span "
          target="_blank"
          class="px-4 whitespace-pre-wrap font-semibold text-sm max-w-full text-black text-jost my-auto"
        >
          Create your @Twini
        </a>
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
};

export default Topbar;
