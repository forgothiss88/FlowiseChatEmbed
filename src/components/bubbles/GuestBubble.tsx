import { Marked } from '@ts-stack/markdown';
import { onMount } from 'solid-js';

type Props = {
  message: string;
  showAvatar?: boolean;
  avatarSrc?: string;
  backgroundColor?: string;
  textColor?: string;
};

const defaultBackgroundColor = '#3B81F6';
const defaultTextColor = '#ffffff';

Marked.setOptions({ isNoP: true });

export const GuestBubble = (props: Props) => {
  let userMessageEl: HTMLDivElement | undefined;

  onMount(() => {
    if (userMessageEl) {
      userMessageEl.innerHTML = Marked.parse(props.message);
    }
  });

  return (
    <div class="flex justify-end items-end guest-container text-roboto">
      <span
        ref={userMessageEl}
        class="p-3 mx-2 rounded-xl whitespace-pre-wrap max-w-full chatbot-guest-bubble font-light"
        data-testid="guest-bubble"
        style={{
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
      />
    </div>
  );
};
