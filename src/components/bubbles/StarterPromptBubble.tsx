type Props = {
  prompt: string;
  onPromptClick?: () => void;
};
export const StarterPromptBubble = (props: Props) => (
  <>
    <div
      data-modal-target="defaultModal"
      data-modal-toggle="defaultModal"
      class="flex border border-black border-solid justify-start mb-2 ml-2 items-start animate-fade-in host-container hover:brightness-90 active:brightness-75 rounded-2xl"
      onClick={() => props.onPromptClick?.()}
    >
      <span
        class="py-1 pr-2 pl-3 whitespace-pre-wrap max-w-full chatbot-host-bubble text-base font-normal rounded-full w-max cursor-pointer"
        data-testid="host-bubble"
      >
        {props.prompt}
      </span>
    </div>
  </>
);
