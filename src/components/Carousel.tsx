import { Accessor, For, Index, Setter, Show, createEffect, createSignal } from 'solid-js';
import { ProductMetadata, SourceDocument } from './Bot';
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
  products: SourceDocument[];
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
          <div class="flex flex-row dropdown dropdown-top bg-black text-white rounded-full">
            <a class="rounded-full w-6 h-6 ml-1 my-auto bg-white">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/240px-Amazon_icon.svg.png"
                class="w-6 h-6 p-1"
              ></img>
            </a>
            <a
              href={props.products[currentSlide()].metadata.item_url}
              target="_blank"
              class="text-sm font-normal text-white pl-3 pr-1 py-2 whitespace-nowrap self-center"
            >
              Buy now {props.products[currentSlide()].metadata.price}€
            </a>
            <a tabindex="0" role="button" class="h-auto flex flex-col pr-1">
              <div class="grow"></div>
              <div class="h-6 w-6">
                <UpArrow width={24} height={24} classList={['w-6', 'h-6']}></UpArrow>
              </div>
              <div class="grow"></div>
            </a>
            <ul tabindex="0" class="dropdown-content menu rounded-md bg-white shadow-md z-50 self-center">
              <li>
                <a class=" text-black text-sm font-normal">Buy on Amazon</a>
              </li>
              <li>
                <a class=" text-black text-sm font-normal">Buy on ebay</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="w-2/5 flex flex-row justify-end pr-2">
          <div class="flex flex-row text-black">
            <button class={isStart() ? 'opacity-30' : ''} disabled={isStart()} onClick={prevSlide}>
              <LeftArrow classList={['w-6', 'h-6']} width={24} height={24}></LeftArrow>
            </button>
            <button class={isEnd() ? 'opacity-30' : ''} disabled={isEnd()} onClick={nextSlide}>
              <RightArrow classList={['w-6', 'h-6']} width={24} height={24}></RightArrow>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
