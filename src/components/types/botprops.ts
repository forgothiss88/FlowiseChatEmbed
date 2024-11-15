import { BotMessageTheme, BubbleParams, TextInputTheme, UserMessageTheme } from '@/features/bubble/types';
import { Accessor, Setter } from 'solid-js';
import { ShopifyCart } from './cart';
import { SourceContent, SourceProduct } from './documents';
import { ShopifyProduct } from './product';

type BrandProps = {
  brandColors: {
    primary: string;
    secondary: string;
    actionPrimary: string;
    actionSecondary: string;
  };
};

export type MessageType = {
  message: string;
  type: messageType;
  productHandle?: string; // if the message starts a new product conversation
  sourceProducts?: SourceProduct[];
  sourceContents?: SourceContent[];
  suggestedProduct?: SourceProduct;
  nextQuestions?: string[];
};

export type StarterPromptsType = {
  prompts: string[];
  textColor: string;
  actionColor: string;
  backgroundColor: string;
};

export type BotConfig = {
  shopRef: string;
  apiUrl: string;
  starterPrompts: StarterPromptsType;
  botMessage: BotMessageTheme;
  userMessage: UserMessageTheme;
  textInput: TextInputTheme;
  poweredByTextColor?: string;
  titleAvatarSrc?: string;
  fontSize?: number;
  isFullPage?: boolean;
};

export type BotProps = {
  question: Accessor<string>;
  nextQuestions: Accessor<string[]>;
  setNextQuestions: Setter<string[]>;
  setSummary: Setter<string>;
  welcomeMessage: string;
  shopifyCart?: ShopifyCart;
  shopifyProduct?: ShopifyProduct;
  bot: HTMLDivElement;
  getElement: () => HTMLElement;
  closeBot: () => void;
};

export type FullBotProps = BotConfig & BubbleParams & BrandProps;

export type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting';
