import { Marked } from '@ts-stack/markdown';

type Props = {
  message: string;
  showAvatar?: boolean;
  avatarSrc?: string;
  backgroundColor?: string;
  textColor?: string;
};

const defaultBackgroundColor = '#3B81F6';
const defaultTextColor = '#ffffff';

export const GuestBubble = (props: Props) => {
  let userMessageEl: HTMLDivElement | undefined;

  return (
    <div class="twi-flex twi-justify-end twi-items-end twi-guest-container ">
      <span
        ref={userMessageEl}
        class="twi-p-3 twi-rounded-2xl twi-rounded-tr-none twi-whitespace-pre-wrap twi-max-w-full twi-chatbot-guest-bubble twi-text-sm twi-font-light"
        data-testid="guest-bubble"
        style={{
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
        innerHTML={Marked.parse(props.message, { isNoP: true })}
      />
    </div>
  );
};
