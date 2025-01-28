import * as Sentry from '@sentry/solid';
import { createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import indexStyles from './assets/index.css';
import customerStyles from './assets/viron.css';
import ChatWithProduct from './components/ChatWithProduct';
import { CustomerProvider } from './context';
import { brandColors, vironProps } from './customers/Viron';
import { BubbleBot } from './features/bubble';
import { midaConfig } from './mida';
import {
  apiUrl,
  askQuestion,
  chatWithProductWidget,
  closeBot,
  isBotOpened,
  openBot,
  product,
  productHandle,
  question,
  setProductHandle,
  setSummary,
  summary,
  twiniChatbot,
} from './twini';

export const props = vironProps();

if (apiUrl) {
  console.log('Twini API URL:', apiUrl);
  props.chatbotUrl = apiUrl;
}

const [nextQuestions, setNextQuestions] = createSignal<string[]>([
  ...(product ? props.starterPrompts.productPagePrompts : props.starterPrompts.prompts),
]);

if (process.env.NODE_ENV == 'production') {
  Sentry.init({
    dsn: 'https://0e923b8b2f8f5f284443d82e730e5fd8@o4508080401088512.ingest.de.sentry.io/4508132557717584',
    environment: process.env.NODE_ENV,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/twini-be-production\.up\.railway\.app/],
    // set allow url with a regex pattern grabbing the domain and the filename of the script
    // https://cdn.shopify.com/extensions/cfc2d806-0be7-4192-93af-058ab641220c/twini-for-viron-207/assets/viron.js
    // allowUrls: [/^https:\/\/cdn\.shopify\.com\/extensions\/[a-f0-9-]+\/[a-f0-9-]+\/assets\/viron\.js/],
    // Session Replay
    replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

<Show when={midaConfig().isEnabled}>
  <Portal mount={twiniChatbot} useShadow={true}>
    <style>
      {indexStyles}
      {customerStyles}
    </style>
    <CustomerProvider {...props}>
      <BubbleBot
        {...props}
        disableDrawer={true}
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
            Hi there!
            <br />
            Welcome to Viron 🌱 How can I assist you today?
          </span>
        }
      />
    </CustomerProvider>
  </Portal>
</Show>;

<Show when={midaConfig().isEnabled && chatWithProductWidget && product}>
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
