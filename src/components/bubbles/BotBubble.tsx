import { sendFileDownloadQuery } from '@/queries/sendMessageQuery';
import { Marked } from '@ts-stack/markdown';
import { For, Show, createEffect, createMemo, createSignal, onMount } from 'solid-js';
import { MessageType, SourceDocument } from '../Bot';
import ProductInfo from '../ProductInfo';
import { Product, products } from '../Products';
import { Avatar } from '../avatars/Avatar';
import { InstagramSourcesBubble, ProductSourcesBubble } from './SourceBubble';

type Props = {
  getMessage: () => MessageType;
  apiUrl?: string;
  fileAnnotations?: any;
  showAvatar?: boolean;
  avatarSrc?: string;
  backgroundColor: string;
  textColor?: string;
  sourceProducts?: SourceDocument[];
  sourceInstagramPosts?: SourceDocument[];
};

const defaultBackgroundColor = '#f7f8ff';
const defaultTextColor = '#303235';

Marked.setOptions({ isNoP: true });

type MessagePart = { text: string } | { sku: string; product: Product };

export const TabComponent = (props: { backgroundColor: string; sourceProducts?: SourceDocument[]; sourceInstagramPosts?: SourceDocument[] }) => {
  const [activeTab, setActiveTab] = createSignal('products');
  return (
    <div>
      <ul class="flex flex-row flex-nowrap text-center text-gray-500 border-t border-gray-200 mt-4">
        <li class="grow">
          <button
            class={`text-jost p-4 border-b-2 rounded-t-lg ${
              activeTab() === 'products' ? 'text-black border-black font-light' : 'border-transparent hover:text-gray-600 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('products')}
            aria-current={activeTab() === 'products' ? 'page' : undefined}
          >
            Experiences
          </button>
        </li>
        <li class="grow">
          <button
            class={`text-jost p-4 border-b-2 rounded-t-lg ${
              activeTab() === 'posts' ? 'text-black border-black font-light' : 'border-transparent hover:text-gray-600 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            Social Content
          </button>
        </li>
      </ul>
      {props.sourceProducts && props.sourceProducts.length > 0 && activeTab() === 'products' && (
        <ProductSourcesBubble sources={props.sourceProducts} backgroundColor={props.backgroundColor} />
      )}
      {props.sourceInstagramPosts && props.sourceInstagramPosts.length > 0 && activeTab() === 'posts' && (
        <InstagramSourcesBubble sources={props.sourceInstagramPosts} backgroundColor={props.backgroundColor} />
      )}
    </div>
  );
};

export const BotBubble = (props: Props) => {
  console.log(props);
  return (
    <div class="flex justify-start items-start host-container mr-12 mt-5 mb-5 text-roboto">
      <Show when={props.showAvatar}>
        <Avatar initialAvatarSrc={props.avatarSrc} classList={['h-8']} />
      </Show>
      <div
        class="px-4 py-2 ml-2 whitespace-pre-wrap max-w-full rounded-2xl chatbot-host-bubble text-base font-normal"
        data-testid="host-bubble"
        style={{
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
      >
        <span innerHTML={props.getMessage().message} />
        <Show when={props.sourceInstagramPosts || props.sourceProducts}>
          <TabComponent
            backgroundColor={props.backgroundColor}
            sourceInstagramPosts={props.sourceInstagramPosts}
            sourceProducts={props.sourceProducts}
          />
        </Show>
      </div>
    </div>
  );
};
