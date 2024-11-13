import { createSignal } from 'solid-js';

function PersonalShopper() {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <div id="personal-shopper" class="relative">
      {/* Bubble that opens the panel */}
      {!isOpen() && (
        <button
          onClick={() => setIsOpen(true)}
          class="fixed bottom-5 right-1/2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Panel that opens when the bubble is clicked */}
      {isOpen() && (
        <>
          <button
            onClick={() => setIsOpen(false)}
            class="fixed top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            class="fixed bottom-0 w-full h-3/5 bg-red bg-opacity-80 flex flex-col items-center justify-center px-4 py-8"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div class="text-center">
              <h2 class="text-2xl font-semibold">Hi there!</h2>
              <p class="text-lg mt-2">I’m your personal shopper from Virón 🌱</p>
            </div>
            <div class="mt-8">
              <button class="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
                <span>Ask me anything...</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PersonalShopper;
