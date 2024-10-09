import { Marked } from '@ts-stack/markdown';

type Props = {
  message: string;
  showAvatar?: boolean;
  avatarSrc?: string;
  background?: string;
  textColor?: string;
  onClick: () => void;
};
Marked.setOptions({ isNoP: true });

export const HintBubble = (props: Props) => {
  return (
    <div class="flex justify-end items-end guest-container py-1">
      <span
        class={`p-3 mx-2 rounded-2xl rounded-tr-none whitespace-pre-wrap max-w-full chatbot-guest-bubble font-light text-sm text-roboto border-dashed border border-white`}
        data-testid="guest-bubble"
        style={{
          background: props.background,
        }}
        onClick={props.onClick}
      >
        <span style={{ color: props.textColor }}>{props.message}</span>
        <span class="text-green-700 font-semibold pl-2">Send</span>
      </span>
    </div>
  );
};
