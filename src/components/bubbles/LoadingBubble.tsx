export const LoadingBubble = () => (
  <div class="flex justify-start mb-2 mt-5 items-start animate-fade-in host-container">
    <span class="px-4 py-4 whitespace-pre-wrap max-w-full bg-white rounded-2xl rounded-tl-none" data-testid="host-bubble">
      <div class="flex items-center">
        <div class="w-1 h-1 bg-black mr-1 rounded-full bubble1" />
        <div class="w-1 h-1 bg-black mr-1 rounded-full bubble2" />
        <div class="w-1 h-1 bg-black rounded-full bubble3" />
      </div>
    </span>
  </div>
);
