import { PurchaseButtonAspect } from '@/components/Carousel';
import { FirstMessageConfig } from '@/components/bubbles/FirstMessageBubble';

export type BubbleParams = {
  theme: BubbleTheme;
};

export type BubbleTheme = {
  chatWindow: ChatWindowTheme;
  button: ButtonTheme;
};

export type TextInputTheme = {
  backgroundColor: string;
  textColor: string;
  placeholder: string;
  sendButtonColor: string;
  inputBackgroundColor: string;
  resetButtonColor: string;
};

export type UserMessageTheme = {
  backgroundColor: string;
  textColor: string;
};

export type BotMessageTheme = {
  backgroundColor: string;
  textColor: string;
  showAvatar: boolean;
  avatarSrc: string;
  avatarPadding: string;
  enableMultipricing: boolean;
  faviconUrl?: string;
} & PurchaseButtonAspect;

export type ChatWindowTheme = {
  title: string;
  titleColor: string;
  titleAvatarSrc: string;
  welcomeMessage: string;
  backgroundColor: string;
  height?: number;
  width?: number;
  fontSize: number;
  textInput: TextInputTheme;
  firstMessage: FirstMessageConfig;
  poweredByTextColor: string;
};

export type ButtonTheme = {
  size: 'medium' | 'large';
  bubbleButtonColor: string;
  topbarColor: string;
  iconColor: string;
  customIconSrc: string;
  bottom?: number;
  right?: number;
};
