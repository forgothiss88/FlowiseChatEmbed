import { customElement } from 'solid-element';
import { initialBotProps } from './constants';
import { BubbleBot } from './features/bubble';
import { FullBot } from './features/full';

export const registerWebComponents = () => {
  let ref: HTMLElement;
  if (typeof window === 'undefined') return;

  customElement('flowise-fullchatbot', initialBotProps | { element: ref }, FullBot);
  customElement('twini-chatbot', initialBotProps | { element: ref }, BubbleBot);
};
