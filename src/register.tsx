import { customElement } from 'solid-element';
import { initialBotProps } from './constants';
import { BubbleBot } from './features/bubble';
import { FullBot } from './features/full';

export const registerWebComponents = () => {
  let ref: HTMLElement | undefined;
  if (typeof window === 'undefined') return;
  // @ts-expect-error element incorect type
  customElement('flowise-fullchatbot', initialBotProps, FullBot);
  customElement('flowise-chatbot', initialBotProps, BubbleBot);
};
