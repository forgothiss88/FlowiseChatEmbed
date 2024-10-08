import { Marked } from '@ts-stack/markdown';
import { Show } from 'solid-js';
import { MessageType, SourceContent, SourceProduct } from '../Bot';
import { ProductCarousel, PurchaseButtonAspect } from '../Carousel';
import { Avatar } from '../avatars/Avatar';
import { SourcesDropdown } from './SourcesDropdown';

type Props = {
  getMessage: () => MessageType;
  fileAnnotations?: any;
  showAvatar?: boolean;
  avatarSrc?: string;
  avatarPadding?: string;
  backgroundColor: string;
  textColor?: string;
  sourceProducts: SourceProduct[];
  sourceContent: SourceContent[];
  enableMultipricing: boolean;
  faviconUrl?: string;
} & PurchaseButtonAspect;

const defaultBackgroundColor = '#f7f8ff';
const defaultTextColor = '#303235';

Marked.setOptions({ isNoP: true });

export const BotBubble = (props: Props) => {
  console.log('BotBubble', props);
  let msgRef: HTMLDivElement | undefined;
  return (
    <div class="flex flex-row justify-start items-start host-container text-roboto w-11/12">
      <Show when={props.showAvatar}>
        <Avatar src={props.avatarSrc} padding={props.avatarPadding} classList={['h-10', 'w-10', 'bg-transparent', 'mr-2']} isImgRounded={true} />
      </Show>
      <div
        class="overflow-hidden whitespace-pre-wrap rounded-2xl rounded-tl-none chatbot-host-bubble text-sm font-light max-w-full"
        data-testid="host-bubble"
        style={{
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
      >
        <div class="p-3">
          <Show when={props.sourceContent}>
            <div class="w-full mb-3">
              <SourcesDropdown sources={props.sourceContent} faviconUrl={props?.faviconUrl} />
            </div>
          </Show>
          <span ref={msgRef} innerHTML={props.getMessage().message} />
        </div>
        <Show when={props.sourceProducts?.length > 0}>
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
