import { Accessor, createEffect, createSignal, Index, JSX, on, onMount, Show, splitProps } from 'solid-js';
import { HintStars } from '../icons/HintStars';
import { ShopifyProduct } from '../types/product';

const defaultBackgroundColor = '#f7f8ff';
const defaultTextColor = '#303235';

type Product = {
  name: string;
  images: string[];
  price: number;
};

const ImagesPlaceholder = (props: { n: number } & JSX.HTMLAttributes<HTMLDivElement>) => {
  const [n, otherProps] = splitProps(props, ['n']);
  return <Index each={Array(n.n)}>{() => <div class="twi-block twi-w-32 twi-h-32 twi-bg-gray-200 twi-animate-pulse" {...otherProps} />}</Index>;
};

const ProductCarousel = (props: { product: Accessor<Product | undefined> }) => {
  const [loadedImg, setLoadedImg] = createSignal<boolean[]>([]);

  createEffect(
    on(
      () => props.product(),
      (product) => {
        if (product == null) {
          return;
        }
        setLoadedImg(product.images.map(() => false));
      },
    ),
  );

  const onLoaded = (index: number) => {
    return () => {
      const l = loadedImg();
      l[index] = true;
      setLoadedImg(l);
    };
  };

  return (
    <div>
      <div class="twi-w-full twi-overflow-x-scroll twi-no-scrollbar-container">
        <div class="twi-flex twi-flex-row twi-w-fit twi-overflow-x-auto twi-space-x-2 twi-rounded-l-lg twi-no-scrollbar-container">
          <Show when={props.product() != null} fallback={<ImagesPlaceholder n={5} />}>
            <Index each={loadedImg()}>
              {(isLoaded, index) => (
                <>
                  {/* {!isLoaded() && <ImagesPlaceholder n={1} id={`image-placeholder-${index}`} />} */}
                  <img
                    onLoad={onLoaded(index)}
                    src={props.product()?.images[index]}
                    alt={props.product()?.name || 'Product Image Placeholder'}
                    class="twi-w-32 twi-h-32 twi-object-cover"
                    loading="lazy"
                  />
                </>
              )}
            </Index>
          </Show>
        </div>
      </div>
      <div class="twi-pt-4">
        <span class="twi-text-base twi-font-normal twi-text-start twi-block">{props.product()?.name || 'Title'}</span>
        <span class="twi-text-sm twi-font-light twi-text-start twi-mt-2 twi-block">{props.product()?.price || 'xxx'}€</span>
      </div>
    </div>
  );
};

export const AskMoreAboutProductBubble = (props: {
  productHandle: string;
  product?: ShopifyProduct;
  backgroundColor: string;
  textColor?: string;
}) => {
  const [product, setProduct] = createSignal<Product | undefined>(
    props.product
      ? {
          name: props.product.title,
          images: props.product.images,
          price: Number.parseInt(props.product.price) / 100,
        }
      : undefined,
  );

  onMount(() => {
    if (props.product != null) {
      return;
    }
    fetch(`/products/${props.productHandle}.js`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data: ShopifyProduct) =>
        setProduct({
          name: data.title,
          images: data.images,
          price: Number.parseInt(data.price) / 100,
        }),
      )
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  });

  return (
    <div class="twi-flex twi-flex-row twi-justify-start twi-items-start twi-host-container twi-w-11/12">
      <div
        class="twi-p-4 twi-whitespace-pre-wrap twi-rounded-2xl twi-rounded-bl-none twi-chatbot-host-bubble twi-text-sm twi-font-light twi-max-w-full twi-ai-shadow"
        data-testid="host-bubble"
        style={{
          'background-color': 'white',
          color: props.textColor ?? defaultTextColor,
        }}
      >
        <div class="twi-pb-4">
          <span
            style={{
              color: '#007B4B',
            }}
          >
            <HintStars class="twi-mr-1" fill="#007B4B" />
            Asking more about...
          </span>
        </div>
        <ProductCarousel product={product} />
      </div>
    </div>
  );
};
