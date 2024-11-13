import { Marked } from '@ts-stack/markdown';
import { onMount, Show } from 'solid-js';
import { ProductCarousel, PurchaseButtonAspect, SingleProductShowcase } from '../Carousel';
import { MessageType } from '../types/botprops';
import { SourceContent, SourceProduct } from '../types/documents';
import { SourcesDropdown } from './SourcesDropdown';

type Props = {
  getMessage: () => MessageType;
  backgroundColor: string;
  textColor?: string;
  sourceProducts?: SourceProduct[];
  sourceContent?: SourceContent[];
  enableMultipricing: boolean;
  faviconUrl?: string;
  suggestedProduct?: SourceProduct;
} & PurchaseButtonAspect;

const defaultBackgroundColor = '#f7f8ff';
const defaultTextColor = '#303235';

Marked.setOptions({ isNoP: true });

export const BotBubble = (props: Props) => {
  let msgRef: HTMLDivElement | undefined;

  onMount(() => {
    if (msgRef) {
      msgRef.innerHTML = Marked.parse(props.getMessage().message);
    }
  });

  return (
    <div class="flex flex-row justify-start items-start host-container text-poppins w-11/12">
      <div
        class="overflow-hidden whitespace-pre-wrap rounded-2xl rounded-tl-none chatbot-host-bubble text-sm font-light max-w-full"
        data-testid="host-bubble"
        style={{
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
      >
        <div class="p-3">
          <Show when={props.sourceContent != null && props.sourceContent?.length > 0}>
            <div class="w-full mb-3">
              <SourcesDropdown sources={props.sourceContent} faviconUrl={props?.faviconUrl} />
            </div>
          </Show>
          <span ref={msgRef} innerHTML={props.getMessage().message} />
        </div>
        <Show when={props.suggestedProduct != null}>
          <SingleProductShowcase
            purchaseButtonText={props.purchaseButtonText}
            purchaseButtonBackgroundColor={props.purchaseButtonBackgroundColor}
            purchaseButtonTextColor={props.purchaseButtonTextColor}
            product={props.suggestedProduct as SourceProduct}
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
