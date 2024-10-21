import { Show, createSignal } from 'solid-js';
import { DownArrow, LeftArrow, RightArrow, UpArrow } from './icons/Arrow';
import { ProductMetadata, SourceProduct } from './types/documents';

const ProductCard = (props: { isPrimary: boolean; product: ProductMetadata; onClick?: () => null }) => {
  return props.isPrimary ? (
    <div>
      <img class="w-full rounded-2xl aspect-auto object-cover bg-white animate-fade-in" src={props.product.thumbnail_url} alt="" />
      <p class="text-xs font-normal text-start p-1">{props.product.name}</p>
      <p class="text-base font-normal text-start p-1">{Math.round(props.product.price)}€</p>
    </div>
  ) : (
    <div class="content-center h-full" onClick={props.onClick}>
      <img
        class="w-full rounded-2xl aspect-auto object-cover bg-white opacity-30 grayscale animate-fade-in"
        src={props.product.thumbnail_url}
        alt=""
      />
      <p class="m-2 text-xs opacity-30 text-start">{props.product.name}</p>
    </div>
  );
};

export type PurchaseButtonAspect = {
  purchaseButtonText: string;
  purchaseButtonBackgroundColor: string;
  purchaseButtonTextColor: string;
};

export type ProductCarouselProps = {
  backgroundColor: string;
  products: SourceProduct[];
  enableMultipricing: boolean;
} & PurchaseButtonAspect;

export const MultiPriceButton = (props: { price: number; url: string; otherPricesUrl: string } & PurchaseButtonAspect) => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  return (
    <div class="ml-4 flex flex-col">
      <div
        class="flex flex-row"
        classList={{ 'rounded-2xl': !isMenuOpen(), 'rounded-tl-2xl rounded-tr-2xl': isMenuOpen() }}
        style={{
          background: props.purchaseButtonBackgroundColor,
          color: props.purchaseButtonTextColor,
          'border-color': props.purchaseButtonBackgroundColor,
        }}
      >
        <a class="bg-white rounded-2xl w-6 h-6 ml-2 my-auto">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/240px-Amazon_icon.svg.png" class="w-6 h-6 p-1"></img>
        </a>
        <a href={props.url} target="_blank" class="text-sm text-inherit font-normal pl-3 pr-1 py-2 whitespace-nowrap self-center">
          {props.purchaseButtonText} {Math.round(props.price)}€
        </a>
        <button
          tabindex="0"
          role="button"
          class="height-full content-center px-1 z-10 border-inherit"
          classList={{
            'rounded-r-full': !isMenuOpen(),
            'rounded-tr-2xl border': isMenuOpen(),
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
          <div class="h-6 w-6">
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
        classList={{ hidden: !isMenuOpen() }}
        class="flex-1 border border-inherit rounded-b-xl"
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
        <a role="button" class="text-center text-inherit bg-transparent px-2 border-b border-inherit py-1 block text-sm font-normal">
          ePRICE - {Math.round(props.price + 10)}€
        </a>
        <a role="button" class="text-center text-inherit bg-transparent px-2 border-b border-inherit py-1 block text-sm font-normal">
          eBay - {Math.round(props.price + 12)}€
        </a>
        <a
          role="button"
          href={props.otherPricesUrl} // TODO: make this dynamic
          target="_blank"
          class="text-center text-inherit bg-transparent px-2 py-1 block text-sm font-normal"
        >
          Vedi altri prezzi
        </a>
      </div>
    </div>
  );
};

export const SinglePriceButton = (props: { purchaseButtonText: string; price: number; url: string } & PurchaseButtonAspect) => {
  return (
    <div class="flex flex-row w-full pr-3">
      <Show when={props.url.includes('amazon') || props.url.includes('amzn')}>
        <a class="bg-white rounded-2xl w-6 h-6 my-auto">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/240px-Amazon_icon.svg.png" class="w-6 h-6 p-1"></img>
        </a>
      </Show>
      <a
        href={props.url}
        target="_blank"
        class="w-full text-sm font-normal px-4 py-2 whitespace-nowrap self-center block text-center"
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

export const SingleProductShowcase = (props: { product: SourceProduct } & PurchaseButtonAspect) => {
  return (
    <div class="text-poppins overflow-hidden flex flex-col p-3" style={{ 'max-width': '208px' }}>
      <div class="flex flex-col pt-4 w-full" style={{ flex: '0 0 auto' }}>
        <img
          class="aspect-auto object-cover bg-white animate-fade-in rounded-lg border-gray-500 bottom-1"
          src={props.product.metadata.thumbnail_url}
          alt=""
        />
        <p class="text-xs font-normal text-start p-1">{props.product.metadata.name}</p>
        <p class="text-base font-normal text-start p-1">{Math.round(props.product.metadata.price)}€</p>
        <div class="pb-3 pt-1">
          <a
            href={props.product.metadata.item_url}
            target="_blank"
            class="w-full text-sm font-normal px-4 py-2 whitespace-nowrap self-center block text-center"
            style={{
              background: props.purchaseButtonBackgroundColor,
              color: props.purchaseButtonTextColor,
              'border-color': props.purchaseButtonBackgroundColor,
            }}
          >
            {props.purchaseButtonText}
          </a>
        </div>
      </div>
    </div>
  );
};

export const ProductCarousel = (props: ProductCarouselProps) => {
  let carousel: HTMLDivElement | undefined;
  const [currentSlide, setCurrentSlide] = createSignal(0);
  const numProducts = props.products.length;
  const nextSlide = () => {
    setCurrentSlide((prev: number) => Math.min(prev + 1, numProducts));
  };

  const prevSlide = () => {
    setCurrentSlide((prev: number) => Math.max(prev - 1, 0));
  };

  const isStart = () => currentSlide() === 0;
  const isEnd = () => currentSlide() + 1 === numProducts;
  return (
    <>
      <div class="text-poppins overflow-hidden w-full" style={{ background: props.backgroundColor }}>
        <div ref={carousel} class="flex flex-row overflow-hidden w-full p-3">
          <Show when={numProducts > 0}>
            <div class="w-3/5 pr-3">
              <ProductCard isPrimary={true} product={props.products[currentSlide()].metadata} />
            </div>
          </Show>
          <Show when={numProducts > 1 && currentSlide() + 1 < numProducts}>
            <div class="w-2/5">
              <ProductCard isPrimary={false} product={props.products[currentSlide() + 1].metadata} onClick={nextSlide} />
            </div>
          </Show>
        </div>
      </div>
      <div class="pb-3 px-3 pt-2 flex flex-row w-full">
        <div class="w-3/5">
          <Show when={props.enableMultipricing}>
            <MultiPriceButton
              purchaseButtonText={props.purchaseButtonText}
              purchaseButtonBackgroundColor={props.purchaseButtonBackgroundColor}
              purchaseButtonTextColor={props.purchaseButtonTextColor}
              price={props.products[currentSlide()].metadata.price}
              url={props.products[currentSlide()].metadata.item_url}
              otherPricesUrl={'https://www.hdblog.it/prezzi/' + props.products[currentSlide()].metadata?.slug} // TODO: take multiple prices from API
            />
          </Show>
          <Show when={!props.enableMultipricing}>
            <SinglePriceButton
              purchaseButtonBackgroundColor={props.purchaseButtonBackgroundColor}
              purchaseButtonTextColor={props.purchaseButtonTextColor}
              purchaseButtonText={props.purchaseButtonText}
              price={props.products[currentSlide()].metadata.price}
              url={props.products[currentSlide()].metadata.item_url}
            />
          </Show>
        </div>
        <div class="w-2/5 flex flex-row justify-end pr-2">
          <div class="flex flex-row text-black">
            <button class={isStart() ? 'opacity-30' : ''} disabled={isStart()} onClick={prevSlide}>
              <LeftArrow></LeftArrow>
            </button>
            <button class={isEnd() ? 'opacity-30' : ''} disabled={isEnd()} onClick={nextSlide}>
              <RightArrow></RightArrow>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
