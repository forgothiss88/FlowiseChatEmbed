import { Accessor, For, Setter } from 'solid-js';
import { HintBubble } from './bubbles/HintBubble';
import { SendButton } from './SendButton';
import { ShopifyProduct } from './types/product';

export type Props = {
  textColor: string;
  backgroundColor: string;
  isBotOpened: Accessor<boolean>;
  setIsBotOpened: Setter<boolean>;
  product?: ShopifyProduct;
  askQuestion: Setter<string>;
  nextQuestions: Accessor<string[]>;
  summary: Accessor<string>;
};

export const ChatWithProduct = (props: Props) => {
  return (
    <div class="twi-text-sm twi-text-poppins" style={{ color: props.textColor }}>
      <p class="twi-mb-2">(based on your recent chat)</p>
      <p class="twi-mb-2">
        {props.summary() ||
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere possimus laudantium similique, tempore inventore necessitatibus nihil?'}
      </p>
      <For each={props.nextQuestions()}>
        {(prompt) => (
          <HintBubble
            actionColor={props.textColor}
            message={prompt}
            textColor={props.textColor}
            onClick={() => {
              props.setIsBotOpened(true);
              setTimeout(() => {
                props.askQuestion(prompt);
              }, 200);
            }}
          />
        )}
      </For>
      <button
        class="twi-cursor-pointer twi-bg-white twi-border twi-w-full twi-p-3 twi-mt-1 twi-rounded-full twi-flex twi-flex-row twi-items-center"
        onClick={props.setIsBotOpened}
        style={{
          'background-color': props.backgroundColor,
          color: props.textColor,
          'border-color': props.textColor,
        }}
      >
        <span class="twi-mr-auto">Continue this conversation...</span>
        <SendButton color={props.textColor} />
      </button>
    </div>
  );
};

export default ChatWithProduct;
