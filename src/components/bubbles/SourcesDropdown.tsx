import { For, Show, createEffect, createSignal } from 'solid-js';
import { DownArrow, Hamburger } from '../icons/Arrow';
import { InstagramIcon, TikTokIcon, YoutubeIcon } from '../icons/SocialNetwork';
import { SourceContent } from '../types/documents';

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
      <i class="twi-w-8 twi-h-8">
        <YoutubeIcon></YoutubeIcon>
      </i>
    ),
    'ig-video': () => (
      <i class="twi-w-8 twi-h-8">
        <InstagramIcon></InstagramIcon>
      </i>
    ),
    'tiktok-video': () => (
      <i class="twi-w-8 twi-h-8">
        <TikTokIcon></TikTokIcon>
      </i>
    ),
    article: () => <img src={favicon()} alt="logo" class="twi-w-8 twi-h-8" />,
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
    <a class="twi-bg-white twi-rounded-lg twi-p-4 twi-shadow-sm twi-border twi-flex twi-flex-col twi-w-full" href={url} target="_blank">
      <p
        class="twi-text-sm twi-font-medium twi-text-gray-900 twi-w-full"
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
      <div class="twi-w-full twi-inline-flex twi-self-stretch twi-items-start twi-pt-2">
        {kindToIcon[props.source.metadata.kind]()}
        <p class="twi-pl-1 twi-text-xs twi-font-light twi-text-gray-600 twi-my-auto twi-overflow-x-hidden">
          {sourceMap[props.source.metadata.kind]()}
        </p>
      </div>
    </a>
  );
};

export const SourcesDropdown = (props: { sources: SourceContent[]; faviconUrl?: string }) => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <Show when={props.sources.length > 0}>
      <div class="twi-inline-block twi-w-full twi-bg-gray-100 twi-rounded-md">
        <button
          tabIndex={2}
          class="twi-cursor-pointer twi-inline-flex twi-w-full twi-px-2 twi-py-1 twi-text-sm twi-font-medium"
          onClick={() => setIsOpen(!isOpen())}
        >
          <div class="twi-w-4 twi-h-4 twi-my-auto">
            <Hamburger />
          </div>
          <span class="twi-my-auto twi-mx-2 twi-font-normal twi-text-sm">Sources</span>
          <div class="twi-flex-1"></div>
          <div class="twi-my-auto">
            <DownArrow />
          </div>
        </button>
        <Show when={props.sources.length > 0}>
          <div
            class="twi-rounded-md twi-z-10 twi-self-center twi-transition twi-overflow-auto twi-no-scrollbar-container"
            classList={{
              hidden: !isOpen(),
              'twi-ease-out': isOpen(),
              'twi-duration-100': isOpen(),
              'twi-ease-in': !isOpen(),
              'twi-duration-75': !isOpen(),
            }}
            onFocusOut={() => setIsOpen(false)}
          >
            <div class="twi-no-scrollbar-container twi-inline-flex">
              <For each={props.sources}>
                {(source, index) => (
                  <div class="twi-mx-2 twi-mb-2 twi-w-40">
                    <SourceCard index={index()} source={source} faviconUrl={props.faviconUrl}></SourceCard>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
};
