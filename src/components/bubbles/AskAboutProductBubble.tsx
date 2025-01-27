import { accessFullBotProps } from '@/context';
import { Accessor, createEffect, createSignal, Index, JSX, on, onMount, Show, splitProps } from 'solid-js';
import { HintStars } from '../icons/HintStars';
import { FullBotProps } from '../types/botprops';
import { ShopifyProduct } from '../types/product';
import { ProductClickedPayload } from '../types/productclick';

const defaultTextColor = '#303235';

type Product = {
  name: string;
  images: string[];
  price: number;
  url: string;
  shopifyProductId: string;
};

const ImagesPlaceholder = (props: { n: number } & JSX.HTMLAttributes<HTMLDivElement>) => {
  const [n, otherProps] = splitProps(props, ['n']);
  return <Index each={Array(n.n)}>{() => <div class="twi-block twi-w-32 twi-h-32 twi-bg-gray-200 twi-animate-pulse" {...otherProps} />}</Index>;
};

export type ProductCarouselProps = {
  product: Accessor<Product | undefined>;
  showViewProductButton: boolean;
  chatRef: Accessor<string>;
  cartToken: Accessor<string>;
};

export const ProductCarousel = (props: ProductCarouselProps) => {
  const [loadedImg, setLoadedImg] = createSignal<boolean[]>([]);

  const botConfig: FullBotProps = accessFullBotProps();

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
      setLoadedImg([...l]);
    };
  };

  return (
    <div>
      <div class="twi-w-full twi-overflow-x-scroll twi-no-scrollbar-container">
        <div class="twi-flex twi-flex-row twi-w-fit twi-overflow-x-auto twi-space-x-2 twi-rounded-l-lg twi-no-scrollbar-container">
          <Show when={props.product() != null} fallback={<ImagesPlaceholder n={5} />}>
            <Index each={loadedImg()}>
              {(isLoaded, index) => (
                <div
                  class="twi-w-32 twi-h-32 twi-bg-gray-200"
                  classList={{
                    'twi-animate-pulse': !isLoaded(),
                  }}
                >
                  <img
                    onLoad={onLoaded(index)}
                    src={props.product()?.images[index]}
                    alt={props.product()?.name || 'Product Image Placeholder'}
                    class="twi-w-full twi-h-full twi-object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </Index>
          </Show>
        </div>
      </div>
      <div class="twi-pt-4 twi-w-full twi-flex twi-flex-row twi-justify-between twi-font-normal twi-text-start">
        <Show
          when={props.product()}
          fallback={
            <div>
              <span class="twi-text-base twi-block twi-text-transparent twi-bg-gray-200 twi-animate-pulse twi-rounded-lg">Product Title</span>
              <span class="twi-text-sm twi-mt-2 twi-block twi-text-transparent twi-bg-gray-200 twi-animate-pulse twi-rounded-lg">1234€</span>
            </div>
          }
        >
          <div>
            <span class="twi-text-base twi-block twi-font-medium twi-text-brand-primary">{props.product()?.name}</span>
            <span class="twi-text-sm twi-mt-2 twi-block twi-text-brand-primary">{props.product()?.price.toFixed(2)}€</span>
          </div>
        </Show>
        <Show when={props.showViewProductButton}>
          <a
            href={props.product()?.url}
            class="twi-bg-brand-action-primary twi-text-brand-action-primary twi-rounded-md twi-mt-auto twi-text-sm twi-font-normal twi-px-4 twi-py-2 twi-whitespace-nowrap twi-self-center twi-block twi-text-center"
            onClick={() => {
              const payload: ProductClickedPayload = {
                shopifyProductId: props.product()?.shopifyProductId.toString(),
                chatRef: props.chatRef(),
                cartToken: props.cartToken(),
              };
              fetch(`${botConfig.apiUrl}/shopify/${botConfig.shopRef}/product-clicked`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                mode: 'cors',
              });
            }}
          >
            {botConfig.theme.chatWindow.botMessage.purchaseButtonText}
          </a>
        </Show>
      </div>
    </div>
  );
};

export const AskMoreAboutProductBubble = (props: {
  productHandle: string;
  product?: ShopifyProduct; // if on product page will be passed
  backgroundColor: string;
  textColor?: string;
  showViewProductButton: boolean;
  askMoreText?: string;
  chatRef: Accessor<string>;
  cartToken: Accessor<string>;
}) => {
  const botConfig: FullBotProps = accessFullBotProps();

  const getPriceWithDiscount = (product: ShopifyProduct) => {
    // apply discount only for viron shop

    if (botConfig.shopRef != 'viron') {
      return product.price / 100; // price is in cents
    }

    const discountTag = product.tags?.find((tag) => tag.length === 2); // will be 50 for 50% discount
    const percDiscount = discountTag ? (100 - Number.parseInt(discountTag)) / 100 : 1; // 0. - 1.
    return (product.price * percDiscount) / 100; // price is in cents
  };

  const [product, setProduct] = createSignal<Product | undefined>(
    props.product
      ? {
          name: props.product.title,
          images: props.product.images,
          price: getPriceWithDiscount(props.product),
          url: props.product.url,
          shopifyProductId: props.product.id.toString(),
        }
      : undefined,
  );

  onMount(() => {
    if (props.product != null) {
      return;
    }
    const baseUrl = botConfig.shopRef == 'fler' ? `/it/products` : `/products`;

    fetch(`${baseUrl}/${props.productHandle}.js`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((p: ShopifyProduct) => {
        return setProduct({
          name: p.title,
          images: p.images,
          price: getPriceWithDiscount(p),
          url: p.url,
          shopifyProductId: p.id.toString(),
        });
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  });

  return (
    <div class="twi-flex twi-flex-row twi-justify-start twi-items-start twi-host-container">
      <div
        class="twi-p-4 twi-whitespace-pre-wrap twi-rounded-2xl twi-rounded-bl-none twi-chatbot-host-bubble twi-text-sm twi-font-normal twi-max-w-full twi-shadow-brand-ai"
        data-testid="host-bubble"
        style={{
          'background-color': 'white',
          color: props.textColor ?? defaultTextColor,
        }}
      >
        <span class="twi-pb-4 twi-inline-flex twi-text-sm twi-font-normal twi-text-brand-action-secondary">
          <HintStars class="twi-mr-1 twi-fill-brand-action-primary" />
          {props.askMoreText || 'Asking more about...'}
        </span>
        <ProductCarousel product={product} showViewProductButton={props.showViewProductButton} chatRef={props.chatRef} cartToken={props.cartToken} />
      </div>
    </div>
  );
};
