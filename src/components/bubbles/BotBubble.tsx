import { Marked } from '@ts-stack/markdown';
import { Setter, Show } from 'solid-js';
import { PurchaseButtonAspect, SingleProductShowcase } from '../Carousel';
import { MessageType } from '../types/botprops';
import { SourceContent, SourceProduct } from '../types/documents';
import { ProductCarousel } from './AskAboutProductBubble';

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
            purchaseButtonText={props.purchaseButtonText}
            purchaseButtonBackgroundColor={props.purchaseButtonBackgroundColor}
            purchaseButtonTextColor={props.purchaseButtonTextColor}
            product={props.suggestedProduct as SourceProduct}
            setProductHandle={props.setProductHandle}
          />
        </Show>
        <Show when={props.suggestedProduct == null && props.sourceProducts?.length > 0}>
          <ProductCarousel
            enableMultipricing={props.enableMultipricing}
            purchaseButtonText={props.purchaseButtonText}
            purchaseButtonBackgroundColor={props.purchaseButtonBackgroundColor}
            purchaseButtonTextColor={props.purchaseButtonTextColor}
            backgroundColor={props.backgroundColor}
            products={props.sourceProducts}
          />
        </Show>
      </div>
    </div>
  );
};
