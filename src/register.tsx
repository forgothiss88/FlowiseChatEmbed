import { customElement } from 'solid-element';
import { initialBotProps } from './constants';
import { Bubble } from './features/bubble';
import { Full } from './features/full';

export const registerWebComponents = () => {
  if (typeof window === 'undefined') return;
  // @ts-expect-error element incorect type
  customElement('flowise-fullchatbot', initialBotProps, Full);
  customElement('flowise-chatbot', initialBotProps, Bubble);
};
