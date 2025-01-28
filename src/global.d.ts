declare module '*.css';

type TwiniMidaConfig = {
    isEnabled: boolean;
}

type TwiniConfig = {
    shopifyProduct?: ShopifyProduct;
    apiUrl?: string;
    customerName?: string;
}

interface Window {
    twiniConfig: TwiniConfig
}

interface WindowEventMap {
    'twini-mida-config-ready': CustomEvent<TwiniMidaConfig>;
}