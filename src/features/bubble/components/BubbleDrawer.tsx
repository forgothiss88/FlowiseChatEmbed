import { HintBubble } from '@/components/bubbles/HintBubble';
import { SendIcon } from '@/components/icons/SendIcon';
import { Accessor, For, Setter } from 'solid-js';
import { BubbleWidget } from './BubbleWidget';

export const BubbleDrawer = (props: {
  customerName: string;
  nextQuestions: Accessor<string[]>;
  closeBot: () => void;
  drawerIsOpen: Accessor<boolean>;
  setDrawerIsOpen: Setter<boolean>;
  openBot: () => void;
  handleSubmit: (text: string) => void;
}) => {
  let ref: HTMLDivElement | undefined;

  return (
    <>
      <div
        class="twi-absolute twi-z-max twi-top-0 twi-right-1/2 twi-translate-x-1/2 -twi-translate-y-1/2 twi-transition-all twi-duration-200"
        classList={{ 'twi-opacity-0': !props.drawerIsOpen() }} // Hide the drawer quicker than the drawer animation
      >
        <BubbleWidget
          customerName={props.customerName}
          onClick={() => {
            props.setDrawerIsOpen(false);
          }}
        ></BubbleWidget>
      </div>
      <div
        class="twi-w-full twi-h-full twi-shadow-sm twi-px-8 twi-pb-8 twi-flex twi-flex-col twi-items-center twi-justify-between twi-transition-all twi-duration-500 twi-bg-brand-primary/65 twi-backdrop-blur-lg"
        style={{
          // 'clip-path': 'circle(100% at 50% 100%)', // not working for some fuckin reason
          'clip-path': 'ellipse(100% 100% at 50% 100%)',
        }}
      >
        <p class="twi-text-left twi-text-sm twi-mt-14">
          Hi there!
          <br />
          I’m your personal shopper from Virón 🌱
        </p>
        <div class="twi-w-full twi-flex twi-flex-col twi-space-y-2">
          <For each={props.nextQuestions().toSorted((a, b) => a.length - b.length)}>
            {(prompt, i) => (
              <HintBubble
                message={prompt}
                delayMilliseconds={200 + i() * 400}
                class="twi-text-brand-action-secondary"
                onClick={() => {
                  props.setDrawerIsOpen(false);
                  props.openBot();
                  setTimeout(() => {
                    props.handleSubmit(prompt);
                  }, 200);
                }}
              />
            )}
          </For>
        </div>
        <button
          class="twi-cursor-pointer twi-h-11 twi-bg-brand-action-secondary twi-border-2 twi-border-brand-action-primary twi-text-brand-action-secondary twi-w-full twi-px-3 twi-py-1 twi-rounded-full twi-flex twi-flex-row twi-items-center"
          onClick={() => {
            props.setDrawerIsOpen(false);
            props.openBot();
          }}
        >
          <span class="twi-w-full twi-text-left twi-text-sm twi-font-bold">Ask me anything...</span>
          <span>
            <SendIcon class="twi-fill-brand-action-primary" />
          </span>
        </button>
      </div>
    </>
  );
};
