import { Accessor, Setter } from 'solid-js';
import styles from '../assets/index.css';
import { SendButton } from './SendButton';
export type Props = {
  textColor: string;
  backgroundColor: string;
  isBotOpened: Accessor<boolean>;
  setIsBotOpened: Setter<boolean>;
};

export const ChatWithProduct = (props: Props) => {
  return (
    <div>
      <style>{styles}</style>
      <div class="text-sm text-poppins" style={{ color: props.textColor }}>
        <p class="mb-2">(based on your recent chat)</p>
        <p class="mb-2">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere possimus laudantium similique, tempore inventore necessitatibus nihil? Nam,
          amet quas ut, rerum fugiat ducimus mollitia nostrum laborum excepturi, optio illo similique.
        </p>
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
