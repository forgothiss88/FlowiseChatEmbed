import { sendFileDownloadQuery } from '@/queries/sendMessageQuery';
import { Marked } from '@ts-stack/markdown';
import { For, Show, createEffect, createSignal, onMount } from 'solid-js';
import { SourceDocument } from '../Bot';
import ProductInfo from '../ProductInfo';
import { Product, products } from '../Products';
import { Avatar } from '../avatars/Avatar';
import { InstagramSourcesBubble, ProductSourcesBubble } from './SourceBubble';

type Props = {
  message: string;
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
  let botMessageEl: HTMLDivElement | undefined;
  const [messageElements, setMessageElements] = createSignal<MessagePart[]>([]);

  const downloadFile = async (fileAnnotation: any) => {
    try {
      const response = await sendFileDownloadQuery({
        apiUrl: props.apiUrl,
        body: { input: { input: '', chat_history: [] }, fileName: fileAnnotation.fileName },
      });
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileAnnotation.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const updateMessageElementsWithProducts = (prevEls: MessagePart[]) => {
    const ps = products();
    const newEls = prevEls.map((el) => {
      if ('sku' in el) {
        return { sku: el.sku, product: ps.get(el.sku) };
      } else {
        return { text: el.text };
      }
    });
    return [...newEls];
  };

  onMount(() => {
    const msgString = Marked.parse(props.message);
    const rgx = /<pr sku=(\d+)><\/pr>/;
    const parts = msgString.split(rgx);

    const els = parts.map((p, idx) => {
      if ((idx + 1) % 2 === 0) {
        return { sku: p };
      } else {
        return { text: p };
      }
    });

    setMessageElements(els);
    setMessageElements(updateMessageElementsWithProducts);

    if (props.fileAnnotations && props.fileAnnotations.length) {
      for (const annotations of props.fileAnnotations) {
        const button = document.createElement('button');
        button.textContent = annotations.fileName;
        button.className =
          'p-3 mb-2 justify-center font-semibold text-white focus:outline-none flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 transition-all filter hover:brightness-90 active:brightness-75 file-annotation-button';
        button.addEventListener('click', function () {
          downloadFile(annotations);
        });
        const svgContainer = document.createElement('div');
        svgContainer.className = 'ml-2';
        svgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg>`;

        button.appendChild(svgContainer);
        botMessageEl.appendChild(button);
      }
    }
  });

  const reactivityForProducts = createEffect(() => {
    setMessageElements(updateMessageElementsWithProducts);
  });

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
        <For each={messageElements()}>
          {(el) => {
            if ('sku' in el) {
              return <ProductInfo key={el.sku} product={el.product} />;
            } else {
              return <span innerHTML={el.text} />;
            }
          }}
        </For>
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
