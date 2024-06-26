import { BotMessageTheme } from '@/features/bubble/types';
import { toNumber } from 'lodash';
import { For, createSignal } from 'solid-js';
import { InstagramMetadata, ProductMetadata, SourceDocument } from '../Bot';

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

export const ProductCarouselItem = (props: { metadata: ProductMetadata; bg: string }) => {
  return (
    <div
      class="carousel-item mr-6 overflow-hidden w-4/5 flex flex-col rounded-3xl"
      style={{ background: 'rgb(241, 235, 248)' }}
      onclick={() => window.open(props.metadata.item_url, '_blank')}
    >
      <div>
        <img class="w-full h-full object-cover aspect-square bg-white" src={props.metadata.thumbnail_url} alt={props.metadata.name} />
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

export const CarouselItem = (props: ItemProps) => {
  if (props.source.metadata.resource_url) return IGCarouselItem(props.source.metadata as InstagramMetadata);
  return ProductCarouselItem(props.source.metadata as ProductMetadata, props.backgroundColor);
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
    <div class="carousel flex host-container mt-5 ml-2" hidden={!props.active} style={{ background: props.backgroundColor }}>
      <For each={props.sources}>
        {(source: SourceDocument, index) => {
          return <ProductCarouselItem metadata={source.metadata} backgroundColor={props.backgroundColor} active={index() === currentSlide()} />;
        }}
      </For>
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
