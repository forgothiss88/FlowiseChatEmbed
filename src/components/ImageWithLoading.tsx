import { JSX, createSignal, splitProps } from 'solid-js';

export const ImageWithLoading = (props: { src: string; containerClass: string; imgClass: string } & JSX.HTMLAttributes<HTMLImageElement>) => {
  const [loaded, setLoaded] = createSignal(false);

  const [classProps, otherProps] = splitProps(props, ['containerClass', 'imgClass']);

  return (
    <div
      class={classProps.containerClass}
      classList={{
        'twi-animate-pulse': !loaded(),
      }}
    >
      <img {...otherProps} onLoad={() => setLoaded(true)} class={classProps.imgClass} loading="lazy" />
    </div>
  );
};
