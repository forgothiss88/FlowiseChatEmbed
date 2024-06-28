import { BotMessageTheme } from '@/features/bubble/types';
import { toNumber } from 'lodash';
import { For, createSignal } from 'solid-js';
import { InstagramMetadata, ProductMetadata, SourceDocument } from '../Bot';
import { LeftArrow, RightArrow, UpArrow } from '../icons/Arrow';

type ItemsProps = {
  sources: SourceDocument[];
} & BotMessageTheme;

type ItemProps = {
  source: SourceDocument;
  backgroundColor: string;
};

export const Slideshow = (props: ItemsProps) => {
  const [currentSlide, setCurrentSlide] = createSignal(0);

  const nextSlide = () => {
    setCurrentSlide((prev: number) => (prev + 1) % props.sources.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev: number) => (prev - 1 + props.sources.length) % props.sources.length);
  };

  return (
    <div class="flex items-center justify-center">
      <button class="p-4 bg-gray-200 hover:bg-gray-300" onClick={prevSlide}>
        ‹
      </button>
      <div class="w-full flex overflow-hidden">
        <For each={props.sources}>
          {(source, index) => (
            <div
              class={`flex-none w-full transition-transform duration-300 ease-in-out ${
                index() === currentSlide() ? 'transform translate-x-0' : 'transform translate-x-full'
              }`}
            >
              <CarouselItem source={source} backgroundColor={props.backgroundColor} />
              <a href="#slide4" class="btn btn-circle">
                ❮
              </a>
              <a href="#slide2" class="btn btn-circle">
                ❯
              </a>
            </div>
          )}
        </For>
      </div>
      <button class="p-4 bg-gray-200 hover:bg-gray-300" onClick={nextSlide}>
        ›
      </button>
    </div>
  );
};

export const IGCarouselItem = (props: { metadata: InstagramMetadata }) => {
  if (!props.metadata.media_url) return <></>;
  return (
    <div class="carousel-item w-full mr-4">
      <iframe
        height={'800px'}
        src={`${props.metadata.media_url}embed/captioned/?rd=https%3A%2F%2Fembedinstagramfeed.com`}
        name={`ig-${props.metadata.pk}`}
      ></iframe>
    </div>
  );
};

export const PrimaryProductCarouselItem = (props: { metadata: ProductMetadata; bg: string }) => {
  return (
    <div
      class="carousel-item overflow-hidden w-3/5 flex flex-col rounded-3xl"
      style={{ background: 'rgb(241, 235, 248)' }}
      onclick={() => window.open(props.metadata.item_url, '_blank')}
    >
      <div>
        <img class="w-full h-full object-cover aspect-square bg-white p-2" src={props.metadata.thumbnail_url} alt={props.metadata.name} />
      </div>
      <div class="px-3 my-4 grow">
        <p class="text-black text-center text-jost font-medium text-sm text-jost mb-2">{props.metadata.name}</p>
        <p class="text-black text-center text-jost font-light text-sm text-jost">Starting at {toNumber(props.metadata.price) | 0}€ per person</p>
      </div>
      <div class="px-3 my-3 flex flex-col w-full mt-auto">
        <span class="rounded-full w-full text-center text-sm text-jost text-white py-3 px-2" style={{ 'background-color': '#202124' }}>
          Book here
        </span>
      </div>
    </div>
  );
};

export const SecondaryProductCarouselItem = (props: { metadata: ProductMetadata; bg: string }) => {
  return (
    <div
      class="carousel-item overflow-hidden w-2/5 flex flex-col rounded-3xl"
      style={{ background: 'rgb(241, 235, 248)' }}
      onclick={() => window.open(props.metadata.item_url, '_blank')}
    >
      <div>
        <img
          class="w-full h-full object-cover aspect-square bg-white opacity-50 blur-sm grayscale p-2"
          src={props.metadata.thumbnail_url}
          alt={props.metadata.name}
        />
      </div>
      <div class="px-3 my-4 grow">
        <p class="text-black text-center text-jost font-medium text-sm text-jost mb-2">{props.metadata.name}</p>
      </div>
    </div>
  );
};

export const CarouselItem = (props: ItemProps) => {
  if (props.source.metadata.resource_url) return IGCarouselItem(props.source.metadata as InstagramMetadata);
  return PrimaryProductCarouselItem(props.source.metadata as ProductMetadata, props.backgroundColor);
};

export const ProductSourcesBubble = (props: ItemsProps) => {
  const [currentSlide, setCurrentSlide] = createSignal(0);

  const nextSlide = () => {
    setCurrentSlide((prev: number) => (prev + 1) % props.sources.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev: number) => (prev - 1 + props.sources.length) % props.sources.length);
  };

  return (
    <div class="mt-5 ml-2 text-roboto overflow-hidden w-full h-full" style={{ background: props.backgroundColor }}>
      <div class="flex flex-row overflow-x-auto overflow-y-hidden flex-nowrap snap-x">
        <div class="w-3/5 flex flex-col py-4 pr-2 pl-4" style={{ flex: '0 0 auto' }}>
          <img class="w-full p-2 aspect-auto object-cover bg-white" src="https://hd2.tudocdn.net/1167540?w=141&h=304" alt="" />
          <p class="m-2 text-sm font-normal">Xiaomi pippo Pro</p>
        </div>
        <div class="w-2/5 flex flex-col py-4 pl-2 pr-4" style={{ flex: '0 0 auto' }}>
          <div class="my-auto">
            <img class="w-full p-2 aspect-auto object-cover bg-white opacity-30 grayscale" src="https://hd2.tudocdn.net/1167540?w=141&h=304" alt="" />
            <p class="m-2 text-xs opacity-30">Xiaomi pippo Pro</p>
          </div>
        </div>
        <div class="w-2/5 flex flex-col py-4 pl-2 pr-4" style={{ flex: '0 0 auto' }}>
          <div class="my-auto">
            <img class="w-full p-2 aspect-auto object-cover bg-white opacity-30 grayscale" src="https://hd2.tudocdn.net/1167540?w=141&h=304" alt="" />
            <p class="m-2 text-xs opacity-30">Xiaomi pippo Pro</p>
          </div>
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="w-3/5 flex flex-row justify-center">
          <div class="flex flex-row dropdown dropdown-top">
            <a class="bg-black text-white text-sm font-normal rounded-l-full pl-3 pr-1 py-2 whitespace-nowrap self-center">Buy now $166</a>
            <a tabindex="0" role="button" class="bg-black rounded-r-full h-auto flex flex-col pr-1">
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
            <button class="opacity-30">
              <LeftArrow classList={['w-6', 'h-6']} width={24} height={24}></LeftArrow>
            </button>
            <button>
              <RightArrow classList={['w-6', 'h-6']} width={24} height={24}></RightArrow>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InstagramSourcesBubble = (props: ItemsProps) => {
  const [currentSlide, setCurrentSlide] = createSignal(0);

  const nextSlide = () => {
    setCurrentSlide((prev: number) => (prev + 1) % props.sources.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev: number) => (prev - 1 + props.sources.length) % props.sources.length);
  };
  return (
    <div
      class="carousel flex host-container mt-5 bg-white"
      style={{
        width: 'min(100%, 300px)',
      }}
    >
      <For each={props.sources}>
        {(source: SourceDocument) => {
          return <IGCarouselItem metadata={source.metadata} backgroundColor={props.backgroundColor} hidden={!props.active} />;
        }}
      </For>
    </div>
  );
};
