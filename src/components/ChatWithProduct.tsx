import { Accessor, Setter } from 'solid-js';
import { SendButton } from './SendButton';
import { ShopifyProduct } from './types/product';

export type Props = {
  textColor: string;
  backgroundColor: string;
  isBotOpened: Accessor<boolean>;
  setIsBotOpened: Setter<boolean>;
  product?: ShopifyProduct;
  askQuestion: Setter<string>;
};

export const ChatWithProduct = (props: Props) => {
  return (
    <div>
      <div class="text-sm text-poppins" style={{ color: props.textColor }}>
        <p class="mb-2">(based on your recent chat)</p>
        <p class="mb-2">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere possimus laudantium similique, tempore inventore necessitatibus nihil? Nam,
          amet quas ut, rerum fugiat ducimus mollitia nostrum laborum excepturi, optio illo similique.
        </p>
        {/* <button
          class="bg-white border w-full p-3 rounded-full rounded-bl-none flex flex-row items-center"
          onClick={() => {
            props.setIsBotOpened(true);
            setTimeout(() => {
              props.askQuestion('ask this question');
            }, 1000);
          }}
          style={{
            'background-color': props.backgroundColor,
            color: props.textColor,
            'border-color': props.textColor,
          }}
        >
          <span class="mr-auto">Ask this question</span>
          <SendButton color={props.textColor} />
        </button> */}
        <button
          class="bg-white border w-full p-3 rounded-full rounded-bl-none flex flex-row items-center"
          onClick={props.setIsBotOpened}
          style={{
            'background-color': props.backgroundColor,
            color: props.textColor,
            'border-color': props.textColor,
          }}
        >
          <span class="mr-auto">Continue this conversation...</span>
          <SendButton color={props.textColor} />
        </button>
      </div>
    </div>
  );
};

export default ChatWithProduct;
