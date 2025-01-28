import { createSignal } from 'solid-js';
import { ShopifyProduct } from './components/types/product';
import { isMobile } from './utils/isMobileSignal';

export const getChatbot = (): HTMLElement => document.getElementsByTagName('twini-chatbot')[0];

export const twiniChatbot = getChatbot();
if (!twiniChatbot) {
  throw new Error('Element with id "twini-chatbot" not found.')
}

console.log(window.twiniConfig)

export const customerName = window.twiniConfig.customerName;
export const apiUrl = window.twiniConfig.apiUrl;
if (!apiUrl) {
  console.warn('Attribute "data-twini-api-url" not found. Using localhost.');
}

export const [isBotOpened, setIsBotOpened] = createSignal(false);
export const [question, askQuestion] = createSignal<string>('');
export const [summary, setSummary] = createSignal<string>('');

export let product: ShopifyProduct | undefined = undefined;
if (window.twiniConfig.shopifyProduct) {
  product = window.twiniConfig.shopifyProduct;
} else {
  console.warn('Attribute "data-shopify-product" not found. Not on product page?');
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
