import { FullProps } from '@/components/props';
import { BubbleTheme } from '@/features/bubble/types';

export type DefaultBotProps = {
  apiUrl: string;
  creatorName: string;
  starterPrompts?: {
    prompts: string[];
    background: string;
  };
  theme: BubbleTheme;
};

export const brandColors = {
  primary: 'black',
  primaryTextColor: 'white',
  secondary: 'white',
  secondaryTextColor: 'black',
  actionPrimary: '#007B4B',
  actionPrimaryTextColor: 'black',
  actionSecondary: 'black',
  actionSecondaryTextColor: 'white',
}

export const vironProps = (): FullProps => {
  return {
    apiUrl: "http://localhost:8000/twini-stream/viron-agents",
    creatorName: 'viron',
    chatflowid: 'viron',
    starterPrompts: {
      prompts: ["What's special about the materials used?", 'Can you tell me more about the fit?', 'Are they good for a trip?'],
      textColor: 'white',
      actionColor: brandColors.actionPrimary
    },
    theme: {
      button: {
        topbarColor: brandColors.primary,
        size: 'medium',
        iconColor: brandColors.actionSecondary, // color inside the icon
        bubbleButtonColor: brandColors.actionPrimary,
      },
      chatWindow: {
        title: '',
        titleAvatarSrc: '/public/avatars/viron.png',
        titleColor: brandColors.primary,
        welcomeMessage: 'Hey there! I’m here to help you with the <a class="text-black"><b>1970 Black Corn boots</b></a>. How can I assist?',
        backgroundColor: 'rgba(51, 51, 51, 0.75)',
        poweredByTextColor: 'black',
        firstMessage: undefined,
        textInput: {
          placeholder: 'Chat with AI...',
          inputBackgroundColor: '#F9F9F9',
          inputBorderColor: '#e5e5e5',
          backgroundColor: 'white',
          textColor: brandColors.secondaryTextColor,
          sendButtonColor: brandColors.actionPrimary,
          resetButtonColor: brandColors.actionPrimary,
        },
        botMessage: {
          backgroundColor: brandColors.secondary,
          textColor: brandColors.primary,
          showAvatar: false,
          enableMultipricing: false,
          purchaseButtonText: 'View product',
          purchaseButtonBackgroundColor: brandColors.actionPrimary,
          purchaseButtonTextColor: brandColors.primary,
          faviconUrl: '/public/avatars/viron.png',
        },
        userMessage: {
          backgroundColor: brandColors.primary,
          textColor: brandColors.primaryTextColor,
        },
      },
    },
    brandColors: brandColors
  };
};

export default vironProps;
