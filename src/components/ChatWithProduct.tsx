import { Accessor, createEffect, For, onMount, Setter } from 'solid-js';
import { render } from 'solid-js/web';
import { HintBubble } from './bubbles/HintBubble';
import { HintStars } from './icons/HintStars';
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
  setSummary: Setter<string>;
  shopRef: string;
  setProductHandle: Setter<string>;
};

export const ChatWithProduct = (props: Props) => {
  const restoreSummaryFromLocalStorage = () => {
    const summary = localStorage.getItem(`twini-${props.shopRef}-summary-${props.product?.handle}`);
    if (summary) {
      props.setSummary(summary);
    }
  };

  const saveSummaryToLocalStorage = () => {
    localStorage.setItem(`twini-${props.shopRef}-summary-${props.product?.handle}`, props.summary());
  };

  createEffect(() => {
    const descElement: HTMLParagraphElement | null = document.querySelector('p[id="twini-product-description"]');
    if (descElement) {
      descElement.style.color = props.textColor;
      descElement.innerHTML = '';
      const text =
        props.summary() ||
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere possimus laudantium similique, tempore inventore necessitatibus nihil?';
      render(
        () => (
          <>
            <br />
            <p
              style={{
                color: props.textColor,
              }}
            >
              {text}
            </p>
            <br />
          </>
        ),
        descElement,
      );
    }
    saveSummaryToLocalStorage();
  });

  createEffect(saveSummaryToLocalStorage);

  onMount(() => {
    restoreSummaryFromLocalStorage();
  });

  return (
    <div>
      <p
        class="twi-text-center twi-w-full twi-text-sm twi-font-light"
        style={{
          color: props.textColor,
        }}
      >
        <HintStars class="twi-mr-1" fill={props.textColor} />
        Summary of your recent chat
      </p>
      <br />
      <For each={props.nextQuestions()}>
        {(prompt) => (
          <HintBubble
            actionColor={props.textColor}
            message={prompt}
            textColor={props.textColor}
            backgroundColor={props.hintsBackgroundColor}
            onClick={() => {
              props.setIsBotOpened(true);
              props.setProductHandle(props.product?.handle ?? '');
              setTimeout(() => {
                props.askQuestion(prompt);
              }, 200);
            }}
          />
        )}
      </For>
      <button
        class="twi-cursor-pointer twi-bg-white twi-border twi-w-full twi-px-3 twi-py-1 twi-mt-1 twi-rounded-full twi-flex twi-flex-row twi-items-center"
        onClick={() => {
          props.setIsBotOpened(true);
          props.setProductHandle(props.product?.handle ?? '');
        }}
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
