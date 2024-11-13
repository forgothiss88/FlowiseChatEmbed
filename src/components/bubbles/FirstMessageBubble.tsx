import { For, JSXElement } from 'solid-js';

const cartIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="twi-w-6 twi-h-6">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
};

const DiscountIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="twi-w-6 twi-h-6">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
};

const MoreContentIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="twi-w-6 twi-h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
      />
    </svg>
  );
};

const MessagePart = (props: {
  title: string;
  subtitle: string;
  getIcon: () => JSXElement;
  background: string;
  userInput: string;
  setUserInput: (message: string) => void;
  focusOnInput: () => void;
}) => {
  const scrollAndSetUserInput = () => {
    props.setUserInput(props.userInput);
    props.focusOnInput();
  };
  return (
    <button
      class="twi-rounded-2xl twi-flex twi-flex-row twi-p-4 twi-mt-3 twi-w-full"
      onClick={scrollAndSetUserInput}
      style={{
        background: props.background,
      }}
    >
      <div>
        <div class="twi-flex twi-flex-row twi-pb-2 twi-items-center">
          <div class="twi-flex twi-items-center twi-flex-nowrap twi-space-x-1">
            <p class="twi-font-medium twi-text-start twi-text-base twi-break-words">{props.title}</p>
            <div class="twi-my-auto">{props.getIcon() || ''}</div>
          </div>
        </div>
        <p class="twi-font-light twi-text-start twi-text-sm twi-text-gray-700">{props.subtitle}</p>
      </div>
      <div class="twi-flex-grow" />
      <div class="twi-p-4 twi-content-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="twi-w-6 twi-h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
      </div>
    </button>
  );
};

const iconsMap = {
  cart: cartIcon,
  discount: DiscountIcon,
  'more-content': MoreContentIcon,
  web: () => <span>🌐</span>,
  ciak: () => <span>🎬</span>,
  'shopping-bag': () => <span>🛍️</span>,
  'green-heart': () => <span>💚</span>,
  smile: () => <span>😊</span>,
  lotion: () => <span>🧴</span>,
  doctor: () => <span>👩‍⚕️</span>,
};

export type FirstMessageConfig = {
  text: string;
  background: string;
  actionsBackground: string;
  actions: {
    title: string;
    subtitle: string;
    prompt: string;
    icon: keyof typeof iconsMap;
  }[];
};

const FirstMessageBubble = (
  props: FirstMessageConfig & {
    textColor: string;
    setUserInput: (message: string) => void;
    focusOnInput: () => void;
  },
) => {
  return (
    <div class="twi-my-5 twi-text-jost">
      <div
        class="twi-p-3 twi-whitespace-pre-wrap twi-max-w-full twi-rounded-3xl twi-chatbot-host-bubble"
        data-testid="host-bubble"
        style={{
          background: props.background,
          color: props.textColor,
        }}
      >
        <span class="twi-font-bold twi-text-lg twi-pl-2">{props.text}</span>
        <div class="">
          <For each={props.actions}>
            {(action, index) => (
              <MessagePart
                title={action.title}
                subtitle={action.subtitle}
                userInput={action.prompt}
                getIcon={iconsMap[action.icon]}
                setUserInput={props.setUserInput}
                focusOnInput={props.focusOnInput}
                background={props.actionsBackground}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default FirstMessageBubble;
