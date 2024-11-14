export type Props = {
  prompt: string;
  bg: string;
  onPromptClick?: () => void;
};
export const StarterPromptBubble = (props: Props) => (
  <>
    <div
      data-modal-target="defaultModal"
      data-modal-toggle="defaultModal"
      class="twi-flex twi-border twi-border-black twi-border-solid twi-justify-start twi-mb-2 twi-ml-2 twi-items-start twi-animate-fade-in twi-host-container hover:twi-brightness-90 active:twi-brightness-75 rounded-2xl"
      onClick={() => props.onPromptClick?.()}
    >
      <span
        class="twi-py-1 twi-pr-2 twi-pl-3 twi-whitespace-pre-wrap twi-max-w-full twi-chatbot-host-bubble twi-text-base twi-font-normal twi-rounded-full twi-w-max twi-cursor-pointer"
        data-testid="host-bubble"
        style={{ 'background-color': props.bg }}
      >
        {props.prompt}
      </span>
    </div>
  </>
);
