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
  const [isVisible, setIsVisible] = createSignal(true);

  // Function to handle scroll event
  const handleScroll = () => {
    const scrolledTop = window.scrollY || document.documentElement.scrollTop;
    setIsVisible(scrolledTop <= 0 || scrolledTop < lastScrollTop());
  };

  // Function to get last scroll position
  const lastScrollTop = (() => {
    let st = window.scrollY || document.documentElement.scrollTop;
    return () => {
      const scroll = window.scrollY || document.documentElement.scrollTop;
      const scrollDelta = Math.abs(scroll - st);
      st = scroll;
      return scrollDelta;
    };
  })();

  // Add scroll event listener on mount
  onMount(() => {
    window.addEventListener('scroll', handleScroll);
  });

  // Remove scroll event listener on component cleanup
  onCleanup(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return (
    <div
      style={{
        background: props.topbarColor,
        color: props.bubbleTextColor,
        'border-bottom-color': props.bubbleButtonColor,
      }}
      class={(props.isFullPage ? 'fixed' : 'absolute rounded-t-3xl') + ' flex flex-row items-center top-0 left-0 w-full z-50 h-16'}
    >
      <div class="w-2" />

      <Show when={props.title}>
        <div class="grow-0">
          <span class="px-4 mr-2 whitespace-pre-wrap font-bold text-xl tracking-wider max-w-full text-jost" style={{ color: props.titleColor }}>
            TWINI
          </span>
        </div>
      </Show>
      <Show when={props.titleAvatarSrc}>
        <Avatar initialAvatarSrc={props.titleAvatarSrc} />
      </Show>
      <div class="grow"></div>
      <div class="grow-0 order-last mr-4">
        <a
          href="https://www.twini.ai"
          target="_blank"
          class="px-4 py-2 whitespace-pre-wrap font-semibold text-sm max-w-full bg-white rounded-full text-black text-jost"
        >
          Create your @Twini
        </a>
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
};

export default Topbar;
