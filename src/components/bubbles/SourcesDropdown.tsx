import { BotMessageTheme } from '@/features/bubble/types';
import { toNumber } from 'lodash';
import { For, Show, createEffect, createSignal } from 'solid-js';
import { ContentMetadata, ProductMetadata, SourceContent, SourceDocument } from '../Bot';
import { DownArrow, Hamburger, LeftArrow, RightArrow, UpArrow } from '../icons/Arrow';

type ItemsProps = {
  sources: SourceContent[];
} & BotMessageTheme;

type ItemProps = {
  source: SourceContent;
  backgroundColor: string;
};

const getFavicon = (url: string) => {
  // Create a new URL object to easily extract components of the provided URL
  const parsedUrl = new URL(url);

  // Assume the favicon is at the root directory and named 'favicon.ico'
  return `${parsedUrl.origin}/favicon.ico`;
};

const SourceCard = (props: { index: number; source: SourceContent }) => {
  // rounded card with title favicon of the website and a link to the website
  const [favicon, setFavicon] = createSignal('');
  createEffect(() => {
    setFavicon(getFavicon(props.source.metadata.media_url));
  });
  return (
    <a
      class="bg-white rounded-lg p-4 max-w-sm shadow-sm border w-full"
      href={props.source.metadata.media_url}
      target="_blank"
      role="menuitem"
      tabindex="-1"
      id={'menu-item-' + props.index}
    >
      <div class="flex flex-col w-full">
        <p
          class="text-sm font-medium text-gray-900"
          style={{
            display: '-webkit-box',
            '-webkit-line-clamp': 3,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            'text-overflow': 'ellipsis',
          }}
        >
          {props.source.metadata.title}
        </p>
        <div class="w-full inline-flex items-start pt-2">
          <img src={favicon()} alt="HDBlog logo" class="w-4 h-4" />
          <p class="pl-1 text-xs font-light text-gray-600">Youtube channel</p>
        </div>
      </div>
    </a>
  );
};

export const SourcesDropdown = (props: ItemsProps) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const sources = props.sources || [
    {
      metadata: {
        media_url: 'https://www.youtube.com',
        website: 'youtube',
        title: 'Best phones under 200$',
      },
    },
    {
      metadata: {
        media_url: 'https://hdblog.it',
        website: 'hdblog',
        title: 'What i liked about Samsung s21',
      },
    },
    {
      metadata: {
        media_url: 'https://tiktok.com',
        website: 'tiktok',
        title: 'What i liked about Samsung s21',
      },
    },
  ];
  return (
    <div class="relative inline-block w-full bg-gray-100 rounded-md">
      <button role="button" tabIndex={2} class="inline-flex w-full px-2 py-1 text-sm font-medium" onClick={() => setIsOpen(!isOpen())}>
        <div class="w-4 h-4 my-auto">
          <Hamburger />
        </div>
        <span class="my-auto mx-2 font-normal text-sm">Fonti</span>
        <div class="flex-1"></div>
        <div class="my-auto">
          <DownArrow />
        </div>
      </button>
      <Show when={sources.length > 0}>
        <div
          tabIndex={-1}
          role="menu"
          class="dropdown-content menu rounded-md z-50 self-center transition overflow-auto no-scrollbar-container"
          classList={{ hidden: !isOpen(), 'ease-out': isOpen(), 'duration-100': isOpen(), 'ease-in': !isOpen(), 'duration-75': !isOpen() }}
          onFocusOut={() => setIsOpen(false)}
        >
          <div class="no-scrollbar-container inline-flex">
            <For each={props.sources}>
              {(source, index) => (
                <li class="mr-2" style={{ width: '12rem' }}>
                  <SourceCard index={index()} source={source}></SourceCard>
                </li>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
};
