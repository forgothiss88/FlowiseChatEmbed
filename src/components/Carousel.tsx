import { Accessor, For, Index, Setter, Show, createEffect, createSignal } from 'solid-js';
import { ProductMetadata, SourceContent, SourceDocument, SourceProduct } from './Bot';
import { LeftArrow, RightArrow, UpArrow } from './icons/Arrow';
import { forEach } from 'lodash';

const ProductCard = (props: { isPrimary: boolean; product: ProductMetadata; onClick?: () => null }) => {
  return props.isPrimary ? (
    <div class="w-3/5 flex flex-col pt-4 pr-2 pl-4" style={{ flex: '0 0 auto' }}>
      <img class="w-full px-6 pt-6 pb-2 aspect-auto object-cover bg-white animate-fade-in" src={props.product.thumbnail_url} alt="" />
      <p class="m-2 text-sm font-normal text-center">{props.product.name}</p>
    </div>
  ) : (
    <div onClick={props.onClick} class="w-2/5 flex flex-col pt-4 pl-2 pr-4" style={{ flex: '0 0 auto' }}>
      <div class="my-auto">
        <img class="w-full p-6 aspect-auto object-cover bg-white opacity-30 grayscale animate-fade-in" src={props.product.thumbnail_url} alt="" />
        <p class="m-2 text-xs opacity-30 text-center">{props.product.name}</p>
      </div>
    </div>
  );
};

export type ProductCarouselProps = {
  backgroundColor: string;
  products: SourceProduct[];
  enableMultipricing: boolean;
  purchaseButtonText: string;
};

export const MultiPriceButton = (props: { purchaseButtonText: string; price: number; url: string; otherPricesUrl: string }) => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  return (
    <div class="ml-4 flex flex-col">
      <div class="flex flex-row bg-black text-white" classList={{ 'rounded-2xl': !isMenuOpen(), 'rounded-tl-2xl rounded-tr-2xl': isMenuOpen() }}>
        <a class="bg-white rounded-2xl w-6 h-6 ml-2 my-auto">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/240px-Amazon_icon.svg.png" class="w-6 h-6 p-1"></img>
        </a>
        <a href={props.url} target="_blank" class="text-sm font-normal text-white pl-3 pr-1 py-2 whitespace-nowrap self-center">
          {props.purchaseButtonText} {Math.round(props.price)}€
        </a>
        <button
          tabindex="0"
          role="button"
          class="height-full content-center px-1 z-10"
          classList={{
            'bg-black text-white rounded-r-full': !isMenuOpen(),
            'rounded-tr-2xl bg-white text-black border border-t-black border-r-black': isMenuOpen(),
          }}
          onClick={() => setIsMenuOpen(!isMenuOpen())}
        >
          <div class="h-6 w-6">
            <UpArrow></UpArrow>
          </div>
        </button>
      </div>
      <div classList={{ hidden: !isMenuOpen() }} class="flex-1 bg-white border border-black rounded-b-xl">
        <a role="button" class="text-center bg-transparent px-2 border border-b-black py-1 block text-black text-sm font-normal">
          ePRICE - {Math.round(props.price + 10)}€
        </a>
        <a role="button" class="text-center bg-transparent px-2 border border-b-black py-1 block text-black text-sm font-normal">
          eBay - {Math.round(props.price + 12)}€
        </a>
        <a
          role="button"
          href={props.otherPricesUrl} // TODO: make this dynamic
          target="_blank"
          class="text-center bg-transparent px-2 py-1 block text-black text-sm font-normal"
        >
          Vedi altri prezzi
        </a>
      </div>
    </div>
  );
};

export const SinglePriceButton = (props: { purchaseButtonText: string; price: number; url: string }) => {
  return (
    <div class="ml-4 flex flex-col">
      <div class="flex flex-row bg-black text-white rounded-full">
        <a class="bg-white rounded-2xl w-6 h-6 ml-1 my-auto">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/240px-Amazon_icon.svg.png" class="w-6 h-6 p-1"></img>
        </a>
        <a href={props.url} target="_blank" class="text-sm font-normal text-white px-3 py-2 whitespace-nowrap self-center">
          {props.purchaseButtonText} {Math.round(props.price)}€
        </a>
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
  const currProduct = props.products[currentSlide()].metadata;
  return (
    <>
      <div class="text-roboto overflow-hidden w-full" style={{ background: props.backgroundColor }}>
        <div ref={carousel} class="flex flex-row overflow-hidden w-full">
          <Show when={numProducts > 0}>
            <ProductCard isPrimary={true} product={props.products[currentSlide()].metadata} />
          </Show>
          <Show when={numProducts > 1 && currentSlide() + 1 < numProducts}>
            <ProductCard isPrimary={false} product={props.products[currentSlide() + 1].metadata} onClick={nextSlide} />
          </Show>
        </div>
      </div>
      <div class="pb-3 px-3 pt-2 flex flex-row w-full">
        <div class="w-3/5 flex flex-row justify-center">
          <Show when={props.enableMultipricing}>
            <MultiPriceButton
              purchaseButtonText={props.purchaseButtonText}
              price={currProduct.price}
              url={currProduct.item_url}
              otherPricesUrl={'https://www.hdblog.it/prezzi/' + currProduct?.slug} // TODO: take multiple prices from API
            />
          </Show>
          <Show when={!props.enableMultipricing}>
            <SinglePriceButton purchaseButtonText={props.purchaseButtonText} price={currProduct.price} url={currProduct.item_url} />
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
