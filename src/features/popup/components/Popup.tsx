import { isNotDefined } from '@/utils/index';
import { Show, createEffect, createSignal, splitProps } from 'solid-js';

export type PopupProps = {
  value?: any;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export const Popup = (props: PopupProps) => {
  const [popupProps] = splitProps(props, ['onOpen', 'onClose', 'isOpen', 'value']);

  const [isBotOpened, setIsBotOpened] = createSignal(
    // eslint-disable-next-line solid/reactivity
    popupProps.isOpen ?? false,
  );

  createEffect(() => {
    if (isNotDefined(props.isOpen) || props.isOpen === isBotOpened()) return;
    toggleBot();
  });

  const stopPropagation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const openBot = () => {
    setIsBotOpened(true);
    popupProps.onOpen?.();
    document.body.style.overflow = 'hidden';
  };

  const closeBot = () => {
    setIsBotOpened(false);
    popupProps.onClose?.();
    document.body.style.overflow = 'auto';
  };

  const toggleBot = () => {
    isBotOpened() ? closeBot() : openBot();
  };

  return (
    <Show when={isBotOpened()}>
      <div
        class="twi-relative twi-z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        style={{ 'z-index': 9999999999 }}
        on:click={closeBot}
      >
        <div class="twi-fixed twi-inset-0 twi-bg-black twi-bg-opacity-50 twi-transition-opacity twi-animate-fade-in" />
        <div class="twi-fixed twi-inset-0 twi-z-10 twi-overflow-y-auto">
          <div class="twi-flex min-h-full items-center justify-center p-3 text-center sm:p-0">
            <div
              class="twi-relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              style={{
                'background-color': 'transparent',
                'margin-left': '20px',
                'margin-right': '20px',
              }}
              on:click={stopPropagation}
              on:pointerdown={stopPropagation}
            >
              {props.value && (
                <div style={{ background: 'white', margin: 'auto', padding: '7px' }}>
                  <pre ref={preEl} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
