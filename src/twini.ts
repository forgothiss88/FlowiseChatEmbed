import { createSignal } from 'solid-js';
import { ShopifyProduct } from './components/types/product';
import { isMobile } from './utils/isMobileSignal';

export const getChatbot = (): HTMLElement => document.getElementsByTagName('twini-chatbot')[0];

export const twiniChatbot = getChatbot();
export const twiniApiUrl = twiniChatbot.getAttribute('data-twini-api-url');

export const [isBotOpened, setIsBotOpened] = createSignal(false);
export const [question, askQuestion] = createSignal<string>('');
export const [summary, setSummary] = createSignal<string>('');

if (!twiniChatbot) {
  console.error('Element with id "twini-chatbot" not found.');
}

export let product: ShopifyProduct | undefined = undefined;
if (twiniChatbot.hasAttribute('data-product')) {
  product = JSON.parse(twiniChatbot.getAttribute('data-product') as string);
} else {
  console.warn('Attribute "data-product" not found. Not on product page?');
}
export const [productHandle, setProductHandle] = createSignal<string>(product?.handle ?? '');

let bodyOverflow = 'unset';

export const openBot = () => {
  bodyOverflow = document.body.style.overflow;
  if (isMobile()) document.body.style.overflow = 'hidden';
  setIsBotOpened(true);
  // screen md
};

export const closeBot = () => {
  if (isMobile()) document.body.style.overflow = bodyOverflow;
  setIsBotOpened(false);
  // screen md
};

export const chatWithProductWidget = document.getElementsByTagName('twini-chat-with-product')[0];
