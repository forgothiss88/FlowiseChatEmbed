import * as Sentry from '@sentry/solid';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import './assets/index.css';
import ChatWithProduct from './components/ChatWithProduct';
import { ShopifyCart } from './components/types/cart';
import { ShopifyProduct } from './components/types/product';
import { brandColors, vironProps } from './customers/Viron';
import { BubbleBot } from './features/bubble';

const getChatbot = (): HTMLElement => document.getElementsByTagName('twini-chatbot')[0];
const cb = getChatbot();
if (!cb) {
  console.error('Element with id "twini-chatbot" not found.');
}
const props = vironProps();
// dev
props.apiUrl = 'http://localhost:8001/twini-stream/viron-agents';

const avatarShopifyCdnUrl = cb.getAttribute('data-avatar-shopify-cdn-url');
if (avatarShopifyCdnUrl) {
  console.log('Shopify CDN URL:', avatarShopifyCdnUrl);
  props.theme.chatWindow.titleAvatarSrc = avatarShopifyCdnUrl;
  props.theme.chatWindow.botMessage.avatarSrc = avatarShopifyCdnUrl;
  props.theme.chatWindow.botMessage.faviconUrl = avatarShopifyCdnUrl;
} else {
  console.warn('Attribute "data-shopify-cdn-url" not found.');
}
const twiniApiUrl = cb.getAttribute('data-twini-api-url');
if (twiniApiUrl) {
  console.log('Twini API URL:', twiniApiUrl);
  props.apiUrl = twiniApiUrl;
} else {
  console.warn('Attribute "data-twini-api-url" not found.');
}
let product: ShopifyProduct | undefined = undefined;
if (cb.hasAttribute('data-product')) {
  product = JSON.parse(cb.getAttribute('data-product'));
} else {
  console.warn('Attribute "data-product" not found. Not on product page?');
}

let cart: ShopifyCart | undefined = undefined;
if (cb.hasAttribute('data-cart')) {
  cart = JSON.parse(cb.getAttribute('data-cart'));
} else {
  console.warn('Attribute "data-cart" not found. Not on cart page?');
}

// const img = document.querySelector('.page-container .swiper-container');

const [isBotOpened, setIsBotOpened] = createSignal(false);
const [question, askQuestion] = createSignal<string>('');
const [nextQuestions, setNextQuestions] = createSignal<string[]>([...props.starterPrompts.prompts]);
const [summary, setSummary] = createSignal<string>('');
const [productHandle, setProductHandle] = createSignal<string>('');

let bodyOverflow = 'unset';

const openBot = () => {
  setIsBotOpened(true);
  // screen md
  bodyOverflow = document.body.style.overflow;
  if (window.innerWidth < 768) document.body.style.overflow = 'hidden';
};

const closeBot = () => {
  setIsBotOpened(false);
  // screen md
  if (window.innerWidth < 768) document.body.style.overflow = bodyOverflow;
};

if (process.env.NODE_ENV == 'production') {
  Sentry.init({
    dsn: 'https://0e923b8b2f8f5f284443d82e730e5fd8@o4508080401088512.ingest.de.sentry.io/4508132557717584',
    environment: process.env.NODE_ENV,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/twini-be-production\.up\.railway\.app/],
    // Session Replay
    replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

render(
  () => (
    <BubbleBot
      {...props}
      getElement={getChatbot}
      isBotOpened={isBotOpened}
      openBot={openBot}
      closeBot={closeBot}
      question={question}
      nextQuestions={nextQuestions}
      setNextQuestions={setNextQuestions}
      setSummary={setSummary}
      productHandle={productHandle}
      setProductHandle={setProductHandle}
      shopifyProduct={product}
      shopifyCart={cart}
    />
  ),
  cb,
);

const chatWithProductWidget = document.getElementsByTagName('twini-chat-with-product')[0];

if (!chatWithProductWidget) {
  console.warn('Element with id "twini-chat-with-product" not found.');
} else {
  render(() => {
    return (
      <ChatWithProduct
        isBotOpened={isBotOpened}
        openBot={openBot}
        textColor={brandColors.actionPrimary}
        backgroundColor={brandColors.secondary}
        hintsBackgroundColor={brandColors.hintsBackgroundColor}
        product={product} // is defined when on product page
        setProductHandle={setProductHandle}
        askQuestion={askQuestion}
        nextQuestions={nextQuestions}
        summary={summary}
        setSummary={setSummary}
        shopRef={props.shopRef}
      />
    );
  }, chatWithProductWidget);
}
