import * as Sentry from '@sentry/solid';
import { createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import customerStyles from './assets/fler.css';
import indexStyles from './assets/index.css';
import ChatWithProduct from './components/ChatWithProduct';
import { ShopifyCart } from './components/types/cart';
import { ShopifyProduct } from './components/types/product';
import { brandColors, flerProps } from './customers/Fler';
import { BubbleBot } from './features/bubble';
import { isMobile } from './utils/isMobileSignal';

const getChatbot = (): HTMLElement => document.getElementsByTagName('twini-chatbot')[0];
const twiniChatbot = getChatbot();
if (!twiniChatbot) {
  console.error('Element with id "twini-chatbot" not found.');
}
const props = flerProps();
// dev
props.apiUrl = 'http://localhost:8001/twini-stream/viron-agents';

const avatarShopifyCdnUrl = twiniChatbot.getAttribute('data-avatar-shopify-cdn-url');
if (avatarShopifyCdnUrl) {
  console.log('Shopify CDN URL:', avatarShopifyCdnUrl);
  props.theme.chatWindow.titleAvatarSrc = avatarShopifyCdnUrl;
  props.theme.chatWindow.botMessage.avatarSrc = avatarShopifyCdnUrl;
  props.theme.chatWindow.botMessage.faviconUrl = avatarShopifyCdnUrl;
} else {
  console.warn('Attribute "data-shopify-cdn-url" not found.');
}
const twiniApiUrl = twiniChatbot.getAttribute('data-twini-api-url');
if (twiniApiUrl) {
  console.log('Twini API URL:', twiniApiUrl);
  props.apiUrl = twiniApiUrl;
} else {
  console.warn('Attribute "data-twini-api-url" not found.');
}
let product: ShopifyProduct | undefined = undefined;
if (twiniChatbot.hasAttribute('data-product')) {
  product = JSON.parse(twiniChatbot.getAttribute('data-product') as string);
} else {
  console.warn('Attribute "data-product" not found. Not on product page?');
}

let cart: ShopifyCart | undefined = undefined;
if (twiniChatbot.hasAttribute('data-cart')) {
  cart = JSON.parse(twiniChatbot.getAttribute('data-cart') as string);
} else {
  console.error('Attribute "data-cart" not found.');
}

// const img = document.querySelector('.page-container .swiper-container');

const [isBotOpened, setIsBotOpened] = createSignal(false);
const [question, askQuestion] = createSignal<string>('');

const [nextQuestions, setNextQuestions] = createSignal<string[]>([
  ...(product ? props.starterPrompts.productPagePrompts : props.starterPrompts.prompts),
]);
const [summary, setSummary] = createSignal<string>('');
const [productHandle, setProductHandle] = createSignal<string>(product?.handle ?? '');

let bodyOverflow = 'unset';

const openBot = () => {
  bodyOverflow = document.body.style.overflow;
  if (isMobile()) document.body.style.overflow = 'hidden';
  setIsBotOpened(true);
  // screen md
};

const closeBot = () => {
  if (isMobile()) document.body.style.overflow = bodyOverflow;
  setIsBotOpened(false);
  // screen md
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

<Portal mount={twiniChatbot} useShadow={true}>
  <style>
    {indexStyles}
    {customerStyles}
  </style>
  <BubbleBot
    {...props}
    customerName={props.shopRef}
    isBotOpened={isBotOpened}
    openBot={openBot}
    closeBot={closeBot}
    question={question}
    askQuestion={askQuestion}
    nextQuestions={nextQuestions}
    setNextQuestions={setNextQuestions}
    setSummary={setSummary}
    productHandle={productHandle}
    setProductHandle={setProductHandle}
    shopifyProduct={product}
    shopifyCart={cart}
    bubbleDrawerMessage={
      <span>
        Hi there!
        <br />
        I’m your personal shopper from Fler 🌱
      </span>
    }
  />
</Portal>;

const chatWithProductWidget = document.getElementsByTagName('twini-chat-with-product')[0];

<Show when={chatWithProductWidget && product}>
  <Portal mount={chatWithProductWidget} useShadow={true}>
    <style>
      {indexStyles}
      {customerStyles}
    </style>
    <ChatWithProduct
      isBotOpened={isBotOpened}
      openBot={openBot}
      textColor={brandColors.actionPrimary}
      backgroundColor={brandColors.secondary}
      hintsBackgroundColor={brandColors.hintsBackgroundColor}
      hintsBorderColor={brandColors.gradient}
      product={product} // is defined when on product page
      productHandle={productHandle}
      setProductHandle={setProductHandle}
      askQuestion={askQuestion}
      nextQuestions={nextQuestions}
      summary={summary}
      setSummary={setSummary}
      shopRef={props.shopRef}
    />
  </Portal>
  ;
</Show>;
