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
          'twi-flex twi-justify-center twi-items-center twi-rounded-full twi-relative twi-flex-shrink-0' +
          ' ' +
          (isMobile() ? 'twi-text-sm' : 'twi-text-xl') +
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
          class="twi-object-cover twi-w-auto twi-h-full"
          classList={{
            'twi-rounded-full': props.isImgRounded,
          }}
        />
      </figure>
    </Show>
  );
};
