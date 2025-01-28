import { createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import customerStyles from './assets/fler.css';
import indexStyles from './assets/index.css';
import ChatWithProduct from './components/ChatWithProduct';
import { CustomerProvider } from './context';
import { brandColors, flerProps, isUrlIgnored } from './customers/Fler';
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

const props = flerProps();

if (apiUrl) {
  console.log('Twini API URL:', apiUrl);
  props.chatbotUrl = apiUrl;
}

const [nextQuestions, setNextQuestions] = createSignal<string[]>([
  ...(product ? props.starterPrompts.productPagePrompts : props.starterPrompts.prompts),
]);

<Show when={midaConfig().isEnabled && !isUrlIgnored()}>
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

<Show when={midaConfig().isEnabled && !isUrlIgnored() && chatWithProductWidget && product}>
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
