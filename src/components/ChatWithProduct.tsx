import { Accessor, createEffect, For, onMount, Setter, Show } from 'solid-js';
import { render } from 'solid-js/web';
import { HintBubble } from './bubbles/HintBubble';
import { HintStars } from './icons/HintStars';
import { SendButton } from './SendButton';
import { ShopifyProduct } from './types/product';

export type Props = {
  textColor: string;
  backgroundColor: string;
  hintsBackgroundColor: string;
  hintsBorderColor: string;
  isBotOpened: Accessor<boolean>;
  openBot: () => void;
  product: ShopifyProduct;
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

    if (descElement && props.summary() != '') {
      descElement.style.color = props.textColor;
      descElement.innerHTML = '';
      render(
        () => (
          <>
            <br />
            <p
              style={{
                color: props.textColor,
              }}
            >
              {props.summary()}
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
    props.setProductHandle(props.product.handle);
  });

  return (
    <div class="twi-flex twi-flex-col twi-gap-2">
      <Show when={props.summary() != ''}>
        <p
          class="twi-inline-flex twi-items-center twi-w-full twi-text-sm twi-font-normal twi-justify-center"
          style={{
            color: props.textColor,
          }}
        >
          <HintStars class="twi-mr-1" fill={props.textColor} />
          Summary of your recent chat
        </p>
      </Show>
      <br />
      <Show when={props.summary() == '' && props.nextQuestions()}>
        <For each={props.nextQuestions()}>
          {(prompt) => (
            <HintBubble
              actionColor={props.textColor}
              message={prompt}
              textColor={props.textColor}
              backgroundColor={props.hintsBackgroundColor}
              borderColor={props.hintsBorderColor}
              onClick={() => {
                props.openBot();
                setTimeout(() => {
                  props.askQuestion(prompt);
                }, 200);
              }}
            />
          )}
        </For>
      </Show>
      <button
        class="twi-cursor-pointer twi-bg-white twi-border twi-w-full twi-px-3 twi-py-1 twi-rounded-full twi-flex twi-flex-row twi-items-center"
        onClick={() => {
          props.openBot();
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
