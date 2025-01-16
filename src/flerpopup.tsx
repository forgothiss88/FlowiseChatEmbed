import { createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import customerStyles from './assets/fler.css';
import indexStyles from './assets/index.css';
import ChatWithProduct from './components/ChatWithProduct';
import { ShopifyProduct } from './components/types/product';
import { CustomerProvider } from './context';
import { brandColors, flerProps } from './customers/Fler';
import { BubbleBot } from './features/bubble';
import { isMobile } from './utils/isMobileSignal';

const getChatbot = (): HTMLElement => document.getElementsByTagName('twini-chatbot')[0];
const twiniChatbot = getChatbot();
if (!twiniChatbot) {
  console.error('Element with id "twini-chatbot" not found.');
}
const props = flerProps();

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
  props.chatbotUrl = twiniApiUrl;
} else {
  console.warn('Attribute "data-twini-api-url" not found.');
}
let product: ShopifyProduct | undefined = undefined;
if (twiniChatbot.hasAttribute('data-product')) {
  product = JSON.parse(twiniChatbot.getAttribute('data-product') as string);
} else {
  console.warn('Attribute "data-product" not found. Not on product page?');
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

const ignoredUrls = [
  '/it/pages/contatti',
  '/it/pages/loyalty',
  '/it/pages/rewards',
  '/it/pages/blog',
  '/it/pages/store-locator-fler',
  '/it/pages/signup',
  '/it/pages/welcome',
  '/it/pages/referral',
  '/it/pages/cookie-policy',
  '/a/loop_subscriptions',
  '/it/policies/privacy-policy',
  '/it/policies/terms-of-service',
  '/it/cart',
];

const ignoredRegex = [/\/it\/account.*/, /\/it\/policies.*/, /\/it\/pages\/lp.*/];

const isUrlIgnored = () => {
  return (
    !window.location.pathname.startsWith('/it') ||
    ignoredRegex.some((regex) => regex.test(window.location.pathname)) ||
    ignoredUrls.includes(window.location.pathname)
  );
};

const chatWithProductWidget = document.getElementsByTagName('twini-chat-with-product')[0];

<Show when={!isUrlIgnored()}>
  <Portal mount={twiniChatbot} useShadow={true}>
    <style>
      {indexStyles}
      {customerStyles}
    </style>
    <CustomerProvider {...props}>
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
        bubbleDrawerMessage={
          <span>
            Ciao!
            <br />
            Sono Twini, il tuo personal shopper Fler 🪒
          </span>
        }
      />
    </CustomerProvider>
  </Portal>
</Show>;
<Show when={!isUrlIgnored() && chatWithProductWidget && product}>
  <Portal mount={chatWithProductWidget} useShadow={true}>
    <style>
      {indexStyles}
      {customerStyles}
    </style>
    <CustomerProvider {...props}>
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
        askMeMessage={props.theme.chatWindow.botMessage.askMoreText}
      />
    </CustomerProvider>
  </Portal>
</Show>;
