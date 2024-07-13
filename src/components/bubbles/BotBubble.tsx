import { sendFileDownloadQuery } from '@/queries/sendMessageQuery';
import { Marked } from '@ts-stack/markdown';
import { For, Show, createEffect, createMemo, createSignal, onMount } from 'solid-js';
import { MessageType, SourceDocument, SourceContent, SourceProduct } from '../Bot';
import ProductInfo from '../ProductInfo';
import { Product, products } from '../Products';
import { Avatar } from '../avatars/Avatar';
import { SourcesDropdown } from './SourcesDropdown';
import { ProductCarousel, PurchaseButtonAspect } from '../Carousel';

type Props = {
  getMessage: () => MessageType;
  apiUrl?: string;
  fileAnnotations?: any;
  showAvatar?: boolean;
  avatarSrc?: string;
  backgroundColor: string;
  textColor?: string;
  sourceProducts: SourceProduct[];
  sourceContent: SourceContent[];
  enableMultipricing: boolean;
} & PurchaseButtonAspect;

const defaultBackgroundColor = '#f7f8ff';
const defaultTextColor = '#303235';

Marked.setOptions({ isNoP: true });

export const BotBubble = (props: Props) => {
  console.log(props);
  return (
    <div class="flex flex-row justify-start items-start host-container text-roboto w-full">
      <Show when={props.showAvatar}>
        <Avatar initialAvatarSrc={props.avatarSrc} classList={['h-8']} />
      </Show>
      <div
        class="mx-2 overflow-hidden whitespace-pre-wrap rounded-2xl chatbot-host-bubble text-base font-light max-w-full"
        data-testid="host-bubble"
        style={{
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
      >
        <div class="p-3">
          <Show when={props.sourceContent}>
            <div class="w-full mb-3">
              <SourcesDropdown sources={props.sourceContent} />
            </div>
          </Show>
          <span innerHTML={props.getMessage().message} />
        </div>
        <Show when={props.sourceProducts}>
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
