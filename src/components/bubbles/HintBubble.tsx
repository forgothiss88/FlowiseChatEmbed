type Props = {
  message: string;
  textColor?: string;
  actionColor?: string;
  onClick: () => void;
};

export const HintBubble = (props: Props) => {
  console.log('HintBubble', props);
  return (
    <div class="flex justify-end items-end guest-container py-1">
      <button
        class={'bg-transparent p-3 rounded-2xl rounded-tr-none whitespace-pre-wrap max-w-full font-light text-sm text-poppins border-dashed border'}
        onClick={props.onClick}
        style={{
          'border-color': props.textColor,
        }}
      >
        <span style={{ color: props.textColor }}>{props.message}</span>
        <span class="font-semibold pl-2 drop-shadow-md" style={{ color: props.actionColor }}>
          Send
        </span>
      </button>
    </div>
  );
};
