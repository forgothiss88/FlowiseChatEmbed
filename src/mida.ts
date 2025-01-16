// example code to be executed by mida to init twini

import { createSignal, onMount } from "solid-js";

// console.log('[Mida] Initializing Mida A/B testing');
// const twiniGlobalConfig = {
//   isEnabled: true
// }

// console.log('[Mida] Setting window.twiniGlobalConfig:', twiniGlobalConfig);

// window.dispatchEvent(new CustomEvent('twini-mida-config-ready', {
//   detail: twiniGlobalConfig,
// }));


export const [midaConfig, setMidaConfig] = createSignal<TwiniGlobalConfig>({ isEnabled: true });

onMount(() => {
  if (window.twiniGlobalConfig) {
    setMidaConfig(window.twiniGlobalConfig);
  }
  window.addEventListener('twini-mida-config-ready', (event: CustomEvent<TwiniGlobalConfig>) => {
    console.debug('Twini received config from mida:', event.detail);
    setMidaConfig(event.detail);
  });
});