import { Show, createSignal } from 'solid-js';
import { DownArrow, UpArrow } from './icons/Arrow';
import { ProductMetadata, SourceProduct } from './types/documents';

const ProductCard = (props: { isPrimary: boolean; product: ProductMetadata; onClick?: () => null }) => {
  return props.isPrimary ? (
    <div>
      <img
        class="twi-w-full twi-rounded-2xl twi-aspect-auto twi-object-cover twi-bg-white twi-animate-fade-in"
        src={props.product.thumbnail_url}
        alt=""
      />
      <p class="twi-text-xs twi-font-normal twi-text-start twi-p-1">{props.product.name}</p>
      <p class="twi-text-base twi-font-normal twi-text-start twi-p-1">{Math.round(props.product.price)}€</p>
    </div>
  ) : (
    <div class="twi-content-center twi-h-full" onClick={props.onClick}>
      <img
        class="twi-w-full twi-rounded-2xl twi-aspect-auto twi-object-cover twi-bg-white twi-opacity-30 twi-grayscale twi-animate-fade-in"
        src={props.product.thumbnail_url}
        alt=""
      />
      <p class="twi-m-2 twi-text-xs twi-opacity-30 twi-text-start">{props.product.name}</p>
    </div>
  );
};

export type PurchaseButtonAspect = {
  purchaseButtonText: string;
  purchaseButtonBackgroundColor: string;
  purchaseButtonTextColor: string;
  askMoreText: string;
};

export type ProductCarouselProps = {
  backgroundColor: string;
  products: SourceProduct[];
  enableMultipricing: boolean;
} & PurchaseButtonAspect;

export const MultiPriceButton = (props: { price: number; url: string; otherPricesUrl: string } & PurchaseButtonAspect) => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  return (
    <div class="twi-ml-4 twi-flex twi-flex-col">
      <div
        class="twi-flex twi-flex-row"
        classList={{ 'twi-rounded-2xl': !isMenuOpen(), 'twi-rounded-tl-2xl twi-rounded-tr-2xl': isMenuOpen() }}
        style={{
          background: props.purchaseButtonBackgroundColor,
          color: props.purchaseButtonTextColor,
          'border-color': props.purchaseButtonBackgroundColor,
        }}
      >
        <a class="twi-bg-white twi-rounded-2xl twi-w-6 twi-h-6 twi-ml-2 twi-my-auto">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/240px-Amazon_icon.svg.png"
            class="twi-w-6 twi-h-6 twi-p-1"
          ></img>
        </a>
        <a
          href={props.url}
          target="_blank"
          class="twi-text-sm twi-text-inherit twi-font-normal twi-pl-3 twi-pr-1 twi-py-2 twi-whitespace-nowrap twi-self-center"
        >
          {props.purchaseButtonText} {Math.round(props.price)}€
        </a>
        <button
          tabindex="0"
          role="button"
          class="twi-cursor-pointer twi-height-full twi-content-center twi-px-1 twi-z-10 twi-border-inherit"
          classList={{
            'twi-rounded-r-full': !isMenuOpen(),
            'twi-rounded-tr-2xl twi-border': isMenuOpen(),
          }}
          onClick={() => setIsMenuOpen(!isMenuOpen())}
          style={
            isMenuOpen()
              ? {
                  'background-color': 'white',
                  color: props.purchaseButtonTextColor,
                }
              : {
                  'background-color': props.purchaseButtonBackgroundColor,
                  color: props.purchaseButtonTextColor,
                }
          }
        >
          <div class="twi-h-6 twi-w-6">
            <Show when={!isMenuOpen()}>
              <DownArrow></DownArrow>
            </Show>
            <Show when={isMenuOpen()}>
              <UpArrow></UpArrow>
            </Show>
          </div>
        </button>
      </div>
      <div
        classList={{ 'twi-hidden': !isMenuOpen() }}
        class="twi-flex-1 twi-border twi-border-inherit twi-rounded-b-xl"
        style={
          isMenuOpen()
            ? {
                'background-color': 'white',
                color: 'black',
                'border-color': props.purchaseButtonBackgroundColor,
              }
            : {
                'background-color': props.purchaseButtonBackgroundColor,
                color: props.purchaseButtonTextColor,
                'border-color': props.purchaseButtonBackgroundColor,
              }
        }
      >
        <a
          role="button"
          class="twi-text-center twi-text-inherit twi-bg-transparent twi-px-2 twi-border-b twi-border-inherit twi-py-1 twi-block twi-text-sm twi-font-normal"
        >
          ePRICE - {Math.round(props.price + 10)}€
        </a>
        <a
          role="button"
          class="twi-text-center twi-text-inherit twi-bg-transparent twi-px-2 twi-border-b twi-border-inherit twi-py-1 twi-block twi-text-sm twi-font-normal"
        >
          eBay - {Math.round(props.price + 12)}€
        </a>
        <a
          role="button"
          href={props.otherPricesUrl} // TODO: make this dynamic
          target="_blank"
          class="twi-text-center twi-text-inherit twi-bg-transparent twi-px-2 twi-py-1 twi-block twi-text-sm twi-font-normal"
        >
          Vedi altri prezzi
        </a>
      </div>
    </div>
  );
};

export const SinglePriceButton = (props: { purchaseButtonText: string; price: number; url: string } & PurchaseButtonAspect) => {
  return (
    <div class="twi-flex twi-flex-row twi-w-full twi-pr-3">
      <Show when={props.url.includes('amazon') || props.url.includes('amzn')}>
        <a class="twi-bg-white twi-rounded-2xl twi-w-6 twi-h-6 twi-my-auto">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/240px-Amazon_icon.svg.png"
            class="twi-w-6 twi-h-6 twi-p-1"
          ></img>
        </a>
      </Show>
      <a
        href={props.url}
        target="_blank"
        class="twi-w-full twi-text-sm twi-font-normal twi-px-4 twi-py-2 twi-whitespace-nowrap twi-self-center twi-block twi-text-center"
        style={{
          background: props.purchaseButtonBackgroundColor,
          color: props.purchaseButtonTextColor,
          'border-color': props.purchaseButtonBackgroundColor,
        }}
      >
        {props.purchaseButtonText}
      </a>
    </div>
  );
};
