import { BotMessageTheme, BubbleParams, TextInputTheme, UserMessageTheme } from '@/features/bubble/types';
import { Accessor, JSXElement, Setter } from 'solid-js';
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
  temporary?: boolean; // if the message is temporary and should be removed if does not start a conversation
  sourceProducts?: SourceProduct[];
  sourceContents?: SourceContent[];
  suggestedProduct?: SourceProduct;
  nextQuestions?: string[];
};

export type StarterPromptsType = {
  prompts: string[];
  productPagePrompts: string[];
  textColor: string;
  actionColor: string;
  backgroundColor: string;
  borderColor: string;
};

export type BotConfig = {
  shopRef: string;
  chatbotUrl: string;
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
  productHandle: Accessor<string>;
  setProductHandle: Setter<string>;
  setSummary: Setter<string>;
  welcomeMessage: string;
  templateWelcomeMessageOnProductPage: string;
  shopifyProduct?: ShopifyProduct;
  bot: HTMLDivElement;
  isOpened: Accessor<boolean>;
  closeBot: () => void;
};

export type FullBotProps = BotConfig & BubbleParams & BrandProps & {
  bubbleDrawerMessage: JSXElement;
};

export type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting';
