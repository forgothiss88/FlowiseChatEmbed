export const LoadingBubble = () => (
  <div class="twi-flex twi-justify-start twi-mb-2 twi-mt-5 twi-items-start twi-animate-fade-in twi-host-container">
    <span class="twi-px-4 twi-py-4 twi-whitespace-pre-wrap twi-max-w-full twi-bg-white twi-rounded-2xl twi-rounded-bl-none" data-testid="host-bubble">
      <div class="twi-flex twi-items-center">
        <div class="twi-w-1 twi-h-1 twi-bg-black twi-mr-1 twi-rounded-full twi-bubble1" style={{ display: 'block' }} />
        <div class="twi-w-1 twi-h-1 twi-bg-black twi-mr-1 twi-rounded-full twi-bubble2" style={{ display: 'block' }} />
        <div class="twi-w-1 twi-h-1 twi-bg-black twi-rounded-full twi-bubble3" style={{ display: 'block' }} />
      </div>
    </span>
  </div>
);
