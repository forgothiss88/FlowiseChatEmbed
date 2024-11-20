import { Accessor, createEffect, For, on, onMount, Setter, Show } from 'solid-js';
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
  productHandle: Accessor<string>;
  setProductHandle: Setter<string>;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeWriter(el: HTMLElement, txt: string) {
  let baseSpeed = 50; /* The speed/duration of the effect in milliseconds */
  let step = 5;
  const write = (txt: string) => {
    console.debug('writing:', txt);
    el.innerHTML += txt;
  };
  for (let i = 0; i < txt.length; i += step) {
    write(txt.slice(i, i + step));
    await wait(baseSpeed + Math.random() * 10);
  }
}

export const ChatWithProduct = (props: Props) => {
  let summaryParagraph: HTMLElement | undefined = undefined;
  let descElement: HTMLParagraphElement | null = null;

  const getStorageKey = () => {
    console.debug('getStorageKey - Product handle:', props.productHandle());
    if (props.productHandle()) {
      return `twini-${props.shopRef}-summary-${props.productHandle()}`;
    }
    return `twini-${props.shopRef}-summary`;
  };

  const restoreSummaryFromLocalStorage = () => {
    const summary = localStorage.getItem(getStorageKey());
    if (summary) {
      props.setSummary(summary);
    }
  };

  const saveSummaryToLocalStorage = () => {
    localStorage.setItem(getStorageKey(), props.summary());
  };

  createEffect(
    on(props.summary, (summary: string) => {
      if (!summary) {
        return;
      }
      saveSummaryToLocalStorage();
    }),
  );

  createEffect(
    on(props.isBotOpened, async () => {
      console.debug('triggered isBotOpened effect');
      console.debug('isBotOpened:', props.isBotOpened());
      console.debug('summary:', props.summary());
      console.debug('productHandle:', props.productHandle());
      console.debug('summaryParagraph:', summaryParagraph);

      if (!props.isBotOpened() && props.summary() != '' && props.productHandle() == props.product.handle && summaryParagraph) {
        if (props.productHandle() != props.product.handle) {
          console.debug("Product handle doesn't match, not updating product page");
          return;
        }
        summaryParagraph.innerHTML = '';
        await typeWriter(summaryParagraph, props.summary());
      }
    }),
  );

  onMount(() => {
    descElement = document.querySelector('p[id="twini-product-description"]');
    if (!descElement) {
      console.error('Product description element not found');
      return;
    }
    restoreSummaryFromLocalStorage();
    render(
      () => (
        <>
          <br />
          <p
            ref={summaryParagraph}
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
        <For each={props.nextQuestions().toSorted((a, b) => b.length - a.length)}>
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
