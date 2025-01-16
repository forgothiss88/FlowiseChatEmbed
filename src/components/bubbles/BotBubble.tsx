import { accessFullBotProps } from '@/context';
import { Marked } from '@ts-stack/markdown';
import { Accessor, createSignal, onMount, Setter, Show } from 'solid-js';
import { HintStars } from '../icons/HintStars';
import { MessageType } from '../types/botprops';
import { SourceContent, SourceProduct } from '../types/documents';
import { ShopifyProduct } from '../types/product';
import { ProductClickedPayload } from '../types/productclick';

export type PurchaseButtonAspect = {
  purchaseButtonText: string;
  purchaseButtonBackgroundColor: string;
  purchaseButtonTextColor: string;
  askMoreText?: string;
};

export const SingleProductShowcase = (
  props: { setProductHandle: Setter<string>; product: SourceProduct; chatRef: Accessor<string>; cartToken: Accessor<string> } & PurchaseButtonAspect,
) => {
  const botConfig = accessFullBotProps();

  const [product, setProduct] = createSignal<ShopifyProduct>();
  const baseUrl = botConfig.shopRef == 'fler' ? `/it/products` : `/products`;

  onMount(async () => {
    await fetch(`${baseUrl}/${props.product.metadata.slug}.js`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((p: ShopifyProduct) => {
        setProduct(p);
      })
      .catch((error) => {
        console.error('Could not fetch product:', error);
        return null;
      });
  });

  const [isLoaded, setLoaded] = createSignal(false);

  return (
    <div class=" twi-flex twi-flex-row twi-p-3 twi-overflow-visible">
      <div
        class="twi-flex twi-flex-col twi-bg-white twi-rounded-lg -twi-rotate-3 twi-max-w-36 twi-overflow-hidden twi-shadow-brand-ai"
        style={{
          flex: '0 0 auto',
        }}
      >
        <div
          class="twi-w-36 twi-h-36 twi-bg-gray-200"
          classList={{
            'twi-animate-pulse': !isLoaded(),
          }}
        >
          <img
            loading="lazy"
            class="twi-w-full twi-h-full twi-object-cover twi-animate-fade-in twi-border-gray-500"
            onLoad={() => setLoaded(true)}
            src={props.product.metadata.thumbnail_url}
            alt={product()?.title || props.product.metadata.name}
            classList={{
              'twi-animate-pulse': !isLoaded(),
            }}
          />
        </div>
        <div class="twi-px-4 twi-py-3">
          <span class="twi-text-base twi-font-normal twi-text-start twi-block">{product()?.title || props.product.metadata.name}</span>
          <span class="twi-text-xs twi-font-normal twi-text-start twi-mt-2 twi-block">
            {product()?.price ? (product()?.price / 100).toFixed(2) : Number.parseFloat(props.product.metadata.price).toFixed(2)}€
          </span>
        </div>
      </div>
      <div class="twi-flex twi-flex-col twi-self-center twi-h-full twi-ml-7">
        <a
          href={product()?.url || `${baseUrl}/${props.product.metadata.slug}`}
          class="twi-bg-brand-action-primary twi-text-brand-action-primary twi-animate-fade-in twi-w-full twi-rounded-md twi-my-2 twi-text-sm twi-font-normal twi-px-4 twi-py-2 twi-whitespace-nowrap twi-self-center twi-block twi-text-center"
          style={{
            // background: props.purchaseButtonBackgroundColor,
            // color: props.purchaseButtonTextColor,
            // 'border-color': props.purchaseButtonBackgroundColor,
            'animation-delay': '0.5s',
          }}
          onClick={() => {
            const payload: ProductClickedPayload = {
              shopifyProductId: product()?.id.toString(),
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
          {props.purchaseButtonText}
        </a>
        <button
          class="twi-bg-brand-action-secondary twi-text-brand-action-secondary twi-animate-fade-in twi-inline-flex twi-w-full twi-rounded-md twi-my-2 twi-text-sm twi-font-normal twi-px-4 twi-py-2 twi-whitespace-nowrap twi-cursor-pointer"
          style={{
            // background: props.purchaseButtonTextColor,
            //color: props.purchaseButtonBackgroundColor,
            //'border-color': props.purchaseButtonTextColor,
            'animation-delay': '0.5s',
          }}
          onClick={() => {
            props.setProductHandle(props.product.metadata.slug);
          }}
        >
          <HintStars class="twi-mr-1 twi-fill-brand-action-primary" />
          {botConfig.theme.chatWindow.botMessage.askMoreText}
        </button>
      </div>
    </div>
  );
};

type Props = {
  getMessage: () => MessageType;
  ref?: HTMLDivElement | undefined;
  backgroundColor: string;
  textColor?: string;
  sourceProducts?: SourceProduct[];
  sourceContent?: SourceContent[];
  enableMultipricing: boolean;
  faviconUrl?: string;
  suggestedProduct?: SourceProduct;
  setProductHandle: Setter<string>;
  chatRef: Accessor<string>;
  cartToken: Accessor<string>;
} & PurchaseButtonAspect;

const defaultBackgroundColor = '#f7f8ff';
const defaultTextColor = '#303235';

export const BotBubble = (props: Props) => {
  let msgRef: HTMLDivElement | undefined;

  return (
    <div ref={props.ref} class="twi-flex twi-flex-row twi-justify-start twi-items-start twi-host-container">
      <div
        class="twi-rounded-2xl rounded-bl-none twi-chatbot-host-bubble twi-text-sm twi-font-normal twi-max-w-full"
        data-testid="host-bubble"
        style={{
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
      >
        <div>
          <span ref={msgRef} innerHTML={Marked.parse(props.getMessage().message, { isNoP: true })}></span>
        </div>
        <Show when={props.suggestedProduct != null}>
          <SingleProductShowcase
            chatRef={props.chatRef}
            cartToken={props.cartToken}
            purchaseButtonText={props.purchaseButtonText}
            purchaseButtonBackgroundColor={props.purchaseButtonBackgroundColor}
            purchaseButtonTextColor={props.purchaseButtonTextColor}
            product={props.suggestedProduct as SourceProduct}
            setProductHandle={props.setProductHandle}
          />
        </Show>
      </div>
    </div>
  );
};
