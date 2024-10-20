import * as Sentry from '@sentry/solid';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import styles from './assets/index.css';
import ChatWithProduct from './components/ChatWithProduct';
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
props.apiUrl = 'http://localhost:8000/twini-stream/viron-agents';

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

const [isBotOpened, setIsBotOpened] = createSignal(false);
const [question, askQuestion] = createSignal<string>('');

Sentry.init({
  dsn: 'https://0e923b8b2f8f5f284443d82e730e5fd8@o4508080401088512.ingest.de.sentry.io/4508132557717584',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/twini-be-production\.up\.railway\.app/],
  // Session Replay
  replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

render(
  () => (
    <>
      <style>{{ styles }}</style>
      <BubbleBot {...props} getElement={getChatbot} isBotOpened={isBotOpened} setIsBotOpened={setIsBotOpened} product={product} question={question} />
    </>
  ),
  cb,
);

const chatWithProductWidget = document.getElementsByTagName('twini-chat-with-product')[0];

if (!chatWithProductWidget) {
  console.warn('Element with id "twini-chat-with-product" not found.');
} else {
  render(() => {
    return (
      <>
        <style>{{ styles }}</style>
        <ChatWithProduct
          isBotOpened={isBotOpened}
          setIsBotOpened={setIsBotOpened}
          textColor={brandColors.actionPrimary}
          backgroundColor={brandColors.secondary}
          product={product}
          askQuestion={askQuestion}
        />
      </>
    );
  }, chatWithProductWidget);
}
