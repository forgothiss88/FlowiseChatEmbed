import { isNotEmpty } from '@/utils/index';
import { isMobile } from '@/utils/isMobileSignal';
import { createEffect, createSignal, Show } from 'solid-js';
import { DefaultAvatar } from './DefaultAvatar';

export const Avatar = (props: { src?: string; padding?: string; classList?: string[]; isImgRounded?: boolean }) => {
  const [avatarSrc, setAvatarSrc] = createSignal(props.src);
  const classList = props.classList || [];

  createEffect(() => {
    if (avatarSrc()?.startsWith('{{') && props.src?.startsWith('http')) setAvatarSrc(props.src);
  });

  return (
    <Show when={isNotEmpty(avatarSrc())} keyed fallback={<DefaultAvatar />}>
      <figure
        class={
          'flex justify-center items-center rounded-full relative flex-shrink-0' +
          ' ' +
          (isMobile() ? 'text-sm' : 'text-xl') +
          ' ' +
          classList.join(' ')
        }
        style={{
          padding: props.padding,
        }}
      >
        <img
          src={avatarSrc()}
          alt="Bot avatar"
          class="object-cover w-auto h-full"
          classList={{
            'rounded-full': props.isImgRounded,
          }}
        />
      </figure>
    </Show>
  );
};
