// example code to be executed by mida to init twini
// console.log('[Mida] Initializing Mida A/B testing');
// const twiniGlobalConfig = {
//   isEnabled: true
// }

// console.log('[Mida] Setting window.sessionStorage["twiniGlobalConfig"]:', twiniGlobalConfig);
// window.sessionStorage.setItem('twiniGlobalConfig', JSON.stringify(twiniGlobalConfig));

// console.log('[Mida] Dispatching event "twini-mida-config-ready"');
// window.dispatchEvent(new CustomEvent('twini-mida-config-ready', {
//   detail: twiniGlobalConfig,
// }));

import { createSignal, onMount } from "solid-js";



export const [midaConfig, setMidaConfig] = createSignal<TwiniMidaConfig>({ isEnabled: false });

onMount(() => {
  const twiniGlobalConfig = window.sessionStorage.getItem('twiniGlobalConfig');
  if (twiniGlobalConfig) {
    console.debug('Twini received config from mida (window.twiniGlobalConfig):', twiniGlobalConfig);
    setMidaConfig(JSON.parse(twiniGlobalConfig));
  }
  window.addEventListener('twini-mida-config-ready', (event: CustomEvent<TwiniMidaConfig>) => {
    console.debug('Twini received config from mida (CustomEvent "twini-mida-config-ready"):', event.detail);
    setMidaConfig(event.detail);
  });

});