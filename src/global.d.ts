declare module '*.css';

type TwiniGlobalConfig = {
    isEnabled: boolean;
}

interface Window {
    twiniGlobalConfig?: TwiniGlobalConfig;
}

interface WindowEventMap {
    'twini-mida-config-ready': CustomEvent<TwiniGlobalConfig>;
}