import { TypingBubble } from '@/components';

export const LoadingBubble = () => (
  <div class="flex justify-start ml-2 mb-2 my-5 items-start animate-fade-in host-container">
    <span class="px-4 py-4 whitespace-pre-wrap max-w-full rounded-2xl chatbot-host-bubble" data-testid="host-bubble">
      <TypingBubble />
    </span>
  </div>
);
