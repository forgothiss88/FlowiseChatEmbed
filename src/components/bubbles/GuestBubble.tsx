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
  console.log('GuestBubble', props);
  let userMessageEl: HTMLDivElement | undefined;

  onMount(() => {
    if (userMessageEl) {
      userMessageEl.innerHTML = Marked.parse(props.message);
    }
  });

  return (
    <div class="flex justify-end items-end guest-container text-poppins">
      <span
        ref={userMessageEl}
        class="p-3 rounded-2xl rounded-tr-none whitespace-pre-wrap max-w-full chatbot-guest-bubble text-sm font-light"
        data-testid="guest-bubble"
        style={{
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
      />
    </div>
  );
};
