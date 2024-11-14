import { BotMessageTheme, BubbleParams, TextInputTheme, UserMessageTheme } from '@/features/bubble/types';
import { Accessor, Setter } from 'solid-js';
import { ShopifyCart } from './cart';
import { SourceContent, SourceProduct } from './documents';

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
  creatorName: string;
  chatflowid: string;
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
  cart?: ShopifyCart;
  getElement: () => HTMLElement;
  closeBot: () => void;
};

export type FullBotProps = BotConfig & BubbleParams & BrandProps;

export type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting';
