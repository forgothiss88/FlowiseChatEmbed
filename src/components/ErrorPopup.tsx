import { Setter } from 'solid-js';

export const ErrorPopup = (props: { restartChat: () => void; setError: Setter<boolean> }) => {
  return (
    <div class="twi-bg-brand-primary twi-flex twi-flex-col twi-space-y-4 twi-rounded-lg twi-p-6 twi-shadow-lg twi-text-center twi-max-w-72">
      <div class="twi-text-brand-primary twi-flex twi-justify-center">
        <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.01472 0.10051L22.1066 19.1924L20.6924 20.6066L18.6782 18.5924C18.003 18.8556 17.2684 19 16.5 19H6.5C3.18629 19 0.5 16.3137 0.5 13C0.5 10.3846 2.17346 8.16 4.50804 7.33857C4.5027 7.22639 4.5 7.11351 4.5 7C4.5 6.22228 4.62683 5.47418 4.86094 4.77527L1.60051 1.51472L3.01472 0.10051ZM6.5 7C6.5 7.08147 6.50193 7.16263 6.50578 7.24344L6.57662 8.7309L5.17183 9.2252C3.5844 9.7837 2.5 11.2889 2.5 13C2.5 15.2091 4.29086 17 6.5 17H16.5C16.6858 17 16.8687 16.9873 17.0478 16.9628L6.53043 6.44519C6.51032 6.62736 6.5 6.81247 6.5 7ZM11.5 0C15.366 0 18.5 3.13401 18.5 7C18.5 7.11351 18.4973 7.22639 18.492 7.33857C20.8265 8.16 22.5 10.3846 22.5 13C22.5 14.0883 22.2103 15.1089 21.7037 15.9889L20.2111 14.4955C20.3974 14.0335 20.5 13.5287 20.5 13C20.5 10.79 18.71 9 16.5 9C15.9711 9 15.4661 9.1027 15.0039 9.2892L13.5111 7.7964C14.3912 7.28978 15.4118 7 16.5 7C16.5 4.23858 14.2614 2 11.5 2C10.4295 2 9.43766 2.33639 8.62428 2.90922L7.19418 1.48056C8.38169 0.55284 9.8763 0 11.5 0Z"
            fill="#333333"
          />
        </svg>
      </div>
      <div class="twi-px-2">
        <h2 class="twi-text-base twi-font-semibold twi-text-brand-primary">Oops, something went wrong!</h2>
        <p class="twi-text-brand-primary twi-mt-2 twi-text-sm">Please restart the chat</p>
      </div>
      <div>
        <button
          onClick={() => {
            props.restartChat();
            props.setError(false);
          }}
          class="twi-bg-brand-action-primary twi-text-brand-action-primary twi-px-6 twi-py-3 twi-rounded-md hover:twi-bg-gray-800"
        >
          Restart
        </button>
      </div>
    </div>
  );
};
