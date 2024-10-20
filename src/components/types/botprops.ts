import { BotMessageTheme, BubbleParams, TextInputTheme, UserMessageTheme } from '@/features/bubble/types';
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
};

export type BotProps = {
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
  getElement: () => HTMLElement;
  closeBot: () => void;
};

export type FullBotProps = BotProps & BubbleParams & BrandProps; export type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting';