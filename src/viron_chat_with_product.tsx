import * as Sentry from '@sentry/solid';
import { render } from 'solid-js/web';
import ChatWithProduct from './components/ChatWithProduct';
import { brandColors } from './customers/Viron';

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

render(() => {
  return <ChatWithProduct textColor={brandColors.actionPrimary} backgroundColor={brandColors.secondary} />;
}, document.getElementsByTagName('twini-chat-with-product')[0]);
