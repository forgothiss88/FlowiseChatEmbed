import { For, Show, createEffect, createSignal } from 'solid-js';
import { SourceContent } from '../Bot';
import { DownArrow, Hamburger } from '../icons/Arrow';
import { InstagramIcon, TikTokIcon, YoutubeIcon } from '../icons/SocialNetwork';

const getFavicon = (url: string) => {
  // Create a new URL object to easily extract components of the provided URL
  const parsedUrl = new URL(url);

  // Assume the favicon is at the root directory and named 'favicon.ico'
  return `${parsedUrl.origin}/favicon.ico`;
};

const urlToDomain = (url: string) => {
  // Create a new URL object to easily extract components of the provided URL
  const parsedUrl = new URL(url);

  // Return the domain name
  return parsedUrl.hostname;
};

const SourceCard = (props: { index: number; faviconUrl?: string; source: SourceContent }) => {
  // rounded card with title favicon of the website and a link to the website
  const [favicon, setFavicon] = createSignal('');
  const url = props.source.metadata?.media_url || props.source.metadata?.url;
  const kindToIcon = {
    'youtube-video': () => (
      <i class="w-8 h-8">
        <YoutubeIcon></YoutubeIcon>
      </i>
    ),
    'ig-video': () => (
      <i class="w-8 h-8">
        <InstagramIcon></InstagramIcon>
      </i>
    ),
    'tiktok-video': () => (
      <i class="w-8 h-8">
        <TikTokIcon></TikTokIcon>
      </i>
    ),
    article: () => <img src={favicon()} alt="logo" class="w-8 h-8" />,
  };
  if (props.source.metadata.kind == 'article') {
    createEffect(() => {
      if (props.faviconUrl) {
        setFavicon(props.faviconUrl);
      } else {
        setFavicon(getFavicon(url));
      }
    });
  }

  const sourceMap = {
    'youtube-video': () => 'Youtube',
    'ig-video': () => 'Instagram',
    'tiktok-video': () => 'TikTok',
    video: () => 'Video',
    article: () => urlToDomain(url),
  };
  return (
    <a
      class="bg-white rounded-lg p-4 max-w-sm shadow-sm border w-full flex-1"
      href={url}
      target="_blank"
      role="menuitem"
      tabindex="-1"
      id={'menu-item-' + props.index}
    >
      <div class="flex flex-col w-full">
        <p
          class="text-sm font-medium text-gray-900 grid"
          style={{
            display: '-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            'text-overflow': 'ellipsis',
            height: '2lh',
          }}
        >
          {props.source.metadata?.title || props.source.metadata?.caption}
        </p>
        <div class="w-full inline-flex self-stretch items-start pt-2">
          {kindToIcon[props.source.metadata.kind]()}
          <p class="pl-1 text-xs font-light text-gray-600 my-auto overflow-x-hidden">{sourceMap[props.source.metadata.kind]()}</p>
        </div>
      </div>
    </a>
  );
};

export const SourcesDropdown = (props: { sources: SourceContent[]; faviconUrl?: string }) => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <Show when={props.sources.length > 0}>
      <div class="relative inline-block w-full bg-gray-100 rounded-md">
        <button role="button" tabIndex={2} class="inline-flex w-full px-2 py-1 text-sm font-medium" onClick={() => setIsOpen(!isOpen())}>
          <div class="w-4 h-4 my-auto">
            <Hamburger />
          </div>
          <span class="my-auto mx-2 font-normal text-sm">Sources</span>
          <div class="flex-1"></div>
          <div class="my-auto">
            <DownArrow />
          </div>
        </button>
        <Show when={props.sources.length > 0}>
          <div
            tabIndex={-1}
            role="menu"
            class="dropdown-content menu rounded-md z-10 self-center transition overflow-auto no-scrollbar-container"
            classList={{ hidden: !isOpen(), 'ease-out': isOpen(), 'duration-100': isOpen(), 'ease-in': !isOpen(), 'duration-75': !isOpen() }}
            onFocusOut={() => setIsOpen(false)}
          >
            <div class="no-scrollbar-container inline-flex">
              <For each={props.sources}>
                {(source, index) => (
                  <li class="mr-2" style={{ width: '12rem' }}>
                    <SourceCard index={index()} source={source} faviconUrl={props.faviconUrl}></SourceCard>
                  </li>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
};
