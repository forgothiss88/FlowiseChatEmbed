import { createSignal } from 'solid-js';
import styles from '../assets/index.css';
import { SendButton } from './SendButton';
export type Props = {
  textColor: string;
  backgroundColor: string;
};

export const ChatWithProduct = (props: Props) => {
  const [showChat, setShowChat] = createSignal(false);

  const handleChatClick = () => {
    setShowChat(true);
    // Add any logic to start or continue the chat
  };

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
          onClick={handleChatClick}
          style={{
            'background-color': props.backgroundColor,
            color: props.textColor,
            'border-color': props.textColor,
          }}
        >
          <span class="mr-auto">Continue this conversation...</span>
          <SendButton color={props.textColor} />
        </button>
        {showChat() && <p>Chat window will be opened here...</p>}
      </div>
    </div>
  );
};

export default ChatWithProduct;
