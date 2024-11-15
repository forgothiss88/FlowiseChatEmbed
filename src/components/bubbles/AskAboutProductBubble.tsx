import { Accessor, createSignal, Index, onMount, Show } from 'solid-js';
import { HintStars } from '../icons/HintStars';
import { ShopifyProduct } from '../types/product';

const defaultBackgroundColor = '#f7f8ff';
const defaultTextColor = '#303235';

type Product = {
  name: string;
  images: string[];
  price: number;
};

const ImagePlaceholder = () => <Index each={Array(5)}>{() => <div class="twi-w-32 twi-h-32 twi-bg-gray-200 twi-animate-pulse" />}</Index>;

const ProductCarousel = (props: { product: Accessor<Product | undefined> }) => {
  return (
    <div>
      <div class="twi-flex twi-overflow-x-auto twi-space-x-2 twi-rounded-l-lg twi-no-scrollbar-container">
        <Show when={props.product() != null} fallback={<ImagePlaceholder />}>
          {props
            .product()
            ?.images?.map((image) => (
              <img src={image} alt={props.product()?.name || 'Product Image Placeholder'} class="twi-w-32 twi-h-32 twi-object-cover" loading="lazy" />
            ))}
        </Show>
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
        class="twi-p-4 twi-whitespace-pre-wrap twi-rounded-2xl twi-rounded-tl-none twi-chatbot-host-bubble twi-text-sm twi-font-light twi-max-w-full"
        data-testid="host-bubble"
        style={{
          'background-color': 'white',
          color: props.textColor ?? defaultTextColor,
          'box-shadow': '0px 4px 50px 5px rgba(0, 123, 75, 0.4), 0px 10px 20px 5px rgba(0, 191, 125, 0.2)',
        }}
      >
        <div class="twi-pb-4">
          <span>
            <HintStars color="green" class="twi-mr-1" />
            Asking more about...
          </span>
        </div>
        <ProductCarousel product={product} />
      </div>
    </div>
  );
};
