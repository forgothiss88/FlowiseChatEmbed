import { Accessor, createEffect, createSignal, For, on, onMount, Setter, Show } from 'solid-js';
import { HintBubble } from './bubbles/HintBubble';
import { SendIcon } from './icons/SendIcon';
import { ShopifyProduct } from './types/product';

export type Props = {
  askMeMessage?: string;
  textColor: string;
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

async function writeTo(el: HTMLElement, txt: string) {
  let baseSpeed = 50; /* The speed/duration of the effect in milliseconds */
  let step = 5;
  const write = (txt: string) => {
    el.innerHTML += txt;
  };
  for (let i = 0; i < txt.length; i += step) {
    write(txt.slice(i, i + step));
    await wait(baseSpeed + Math.random() * 10);
  }
}

export const ChatWithProduct = (props: Props) => {
  let summaryParagraph: HTMLElement | undefined = undefined;

  const [onMountSummary, setOnMountSummary] = createSignal('');

  const getStorageKey = () => {
    console.debug('getStorageKey - Product handle:', props.productHandle());
    if (props.productHandle()) {
      return `twini-${props.shopRef}-summary-${props.productHandle()}`;
    }
    return null;
  };

  const restoreSummaryFromLocalStorage = () => {
    const key = getStorageKey();
    if (!key) {
      return;
    }
    const summary = localStorage.getItem(key);
    if (summary) {
      setOnMountSummary(summary);
    }
  };

  createEffect(
    on(props.summary, (summary: string) => {
      const key = getStorageKey();
      if (!summary || !key) {
        return;
      }
      localStorage.setItem(key, summary);
    }),
  );

  createEffect(
    on(props.isBotOpened, () => {
      // console.debug('isBotOpened:', props.isBotOpened());
      // console.debug('summary:', props.summary().trim());
      // console.debug('summaryParagraph:', summaryParagraph?.innerText.trim());
      // console.debug('productHandle:', props.productHandle());
      // console.debug('props.product.handle:', props.product.handle);
      // console.debug('summaryParagraph:', summaryParagraph);
      // console.debug('props.summary().trim() != summaryParagraph?.innerText.trim():', props.summary().trim() != summaryParagraph?.innerText.trim());

      if (
        !props.isBotOpened() &&
        summaryParagraph &&
        props.summary() != '' &&
        props.summary().trim() != summaryParagraph?.innerText.trim() &&
        props.productHandle() == props.product.handle
      ) {
        console.debug('Writing summary to product description');
        summaryParagraph.innerHTML = '<br/>';
        writeTo(summaryParagraph, props.summary());
      } else {
        console.debug('Not writing summary to product description');
      }
    }),
  );

  onMount(() => {
    restoreSummaryFromLocalStorage();
  });

  return (
    <div class="twini-base">
      <p
        ref={summaryParagraph}
        style={{
          color: props.textColor,
          'font-family': 'inherit',
          'font-weight': 'inherit',
          'line-height': 'inherit',
        }}
      >
        <br />
        {onMountSummary()}
      </p>
      <Show when={onMountSummary() || props.summary()}>
        <br />
      </Show>
      <div class="twi-flex twi-flex-col twi-gap-2">
        <Show when={onMountSummary() == '' && props.summary() == '' && props.nextQuestions()}>
          <For each={props.nextQuestions().toSorted((a, b) => a.length - b.length)}>
            {(prompt, i) => (
              <HintBubble
                class="twi-text-brand-action-secondary"
                message={prompt}
                delayMilliseconds={200 + i() * 400}
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
          class="twi-cursor-pointer twi-h-11 twi-bg-brand-action-secondary twi-border-2 twi-border-brand-action-primary twi-text-brand-action-secondary twi-w-full twi-px-3 twi-py-1 twi-rounded-full twi-flex twi-flex-row twi-items-center"
          onClick={() => {
            props.openBot();
          }}
        >
          <span class="twi-w-full twi-text-left twi-text-sm" style={'font-weight: bold !important;'}>
            {props.askMeMessage || 'Ask me anything...'}
          </span>
          <SendIcon class="twi-fill-brand-action-primary" />
        </button>
      </div>
    </div>
  );
};

export default ChatWithProduct;
