import { createSignal } from 'solid-js';

function PersonalShopper() {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <div id="personal-shopper" class="twi-relative">
      {/* Bubble that opens the panel */}
      {!isOpen() && (
        <button
          onClick={() => setIsOpen(true)}
          class="twi-fixed bottom-5 right-1/2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="twi-h-6 twi-w-6 twi-text-white"
            twi-fill="none"
            twi-viewBox="0 twi-0 twi-24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Panel that opens when the bubble is clicked */}
      {isOpen() && (
        <>
          <button
            onClick={() => setIsOpen(false)}
            class="twi-fixed top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="twi-h-5 twi-w-5 twi-text-gray-700"
              twi-fill="none"
              twi-viewBox="0 twi-0 twi-24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            class="twi-fixed twi-bottom-0 twi-w-full twi-h-3/5 twi-bg-red twi-bg-opacity-80 twi-flex twi-flex-col twi-items-center twi-justify-center twi-px-4 twi-py-8"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <div class="twi-w-16 twi-h-16 twi-bg-green-500 twi-rounded-full twi-flex twi-items-center twi-justify-center twi-mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="twi-h-8 twi-w-8 twi-text-white"
                twi-fill="none"
                twi-viewBox="0 twi-0 twi-24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div class="twi-text-center">
              <h2 class="twi-text-2xl twi-font-semibold">Hi there!</h2>
              <p class="twi-text-lg twi-mt-2">I’m your personal shopper from Virón 🌱</p>
            </div>
            <div class="twi-mt-8">
              <button class="twi-flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
                <span>Ask me anything...</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="twi-h-5 twi-w-5 twi-text-white"
                  twi-fill="none"
                  twi-viewBox="0 twi-0 twi-24 24"
                  stroke="currentColor"
                >
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
