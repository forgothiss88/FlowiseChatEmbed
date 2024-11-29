import { createSignal } from 'solid-js';

export const [isMobile, setIsMobile] = createSignal<boolean>(window.innerWidth < 768);

const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
};

window.addEventListener("resize", handleResize);