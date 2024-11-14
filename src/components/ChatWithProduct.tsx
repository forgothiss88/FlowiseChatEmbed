import { Accessor, For, Setter } from 'solid-js';
import { HintBubble } from './bubbles/HintBubble';
import { SendButton } from './SendButton';
import { ShopifyProduct } from './types/product';

export type Props = {
  textColor: string;
  backgroundColor: string;
  hintsBackgroundColor: string;
  isBotOpened: Accessor<boolean>;
  setIsBotOpened: Setter<boolean>;
  product?: ShopifyProduct;
  askQuestion: Setter<string>;
  nextQuestions: Accessor<string[]>;
  summary: Accessor<string>;
};

export const ChatWithProduct = (props: Props) => {
  return (
    <div>
      <p style={{ color: props.textColor, 'font-family': 'unset', 'font-size': 'unset' }}>(based on your recent chat)</p>
      <p style={{ color: props.textColor, 'font-family': 'unset', 'font-size': 'unset' }}>
        {props.summary() ||
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere possimus laudantium similique, tempore inventore necessitatibus nihil?'}
      </p>
      <For each={props.nextQuestions()}>
        {(prompt) => (
          <HintBubble
            actionColor={props.textColor}
            message={prompt}
            textColor={props.textColor}
            backgroundColor={props.hintsBackgroundColor}
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
        class="twi-cursor-pointer twi-bg-white twi-border twi-w-full twi-px-3 twi-py-1 twi-mt-1 twi-rounded-full twi-flex twi-flex-row twi-items-center"
        onClick={props.setIsBotOpened}
        style={{
          'background-color': props.backgroundColor,
          color: props.textColor,
          'border-color': props.textColor,
        }}
      >
        <span class="twi-mr-auto">Continue this conversation...</span>
        <SendButton arrowColor={props.textColor} color="white" isDisabled={false} isLoading={() => false} />
      </button>
    </div>
  );
};

export default ChatWithProduct;
