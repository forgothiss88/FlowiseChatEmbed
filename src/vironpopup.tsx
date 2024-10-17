import * as Sentry from '@sentry/solid';
import { render } from 'solid-js/web';
import { vironProps } from './customers/Viron';
import { BubbleBot } from './features/bubble';

render(() => {
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

  const getChatbot = (): HTMLElement => document.getElementsByTagName('twini-chatbot')[0];
  if (!getChatbot()) {
    console.error('Element with id "twini-chatbot" not found.');
    return;
  }
  const props = vironProps();
  props.apiUrl = 'http://localhost:8000/twini-stream/viron-agents';
  const avatarShopifyCdnUrl = getChatbot().getAttribute('data-avatar-shopify-cdn-url');
  if (avatarShopifyCdnUrl) {
    console.log('Shopify CDN URL:', avatarShopifyCdnUrl);
    props.theme.chatWindow.titleAvatarSrc = avatarShopifyCdnUrl;
    props.theme.chatWindow.botMessage.avatarSrc = avatarShopifyCdnUrl;
    props.theme.chatWindow.botMessage.faviconUrl = avatarShopifyCdnUrl;
  } else {
    console.error('Attribute "data-shopify-cdn-url" not found.');
  }

  // const botProps = getAllProps(props);
  const bot = <BubbleBot {...props} getElement={getChatbot} />;
  return bot;
}, document.getElementsByTagName('twini-chatbot')[0]);
