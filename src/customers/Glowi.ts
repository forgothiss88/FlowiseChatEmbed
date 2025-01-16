import { FullBotProps } from '@/components/types/botprops';

export const brandColors = {
  primary: '#FFD9C2',
  primaryTextColor: 'black',
  secondary: 'white',
  secondaryTextColor: 'black',
  actionPrimary: '#D97635',
  actionPrimaryTextColor: 'white',
  actionSecondary: '#FFD9C2',
  actionSecondaryTextColor: 'black',
};

export const glowiProps = (): FullBotProps => {
  return {
    chatbotUrl: 'http://localhost:8000/twini-stream/glowi-agents',
    shopRef: 'glowi',
    starterPrompts: {
      prompts: ["What's special about the materials used?", 'Can you tell me more about the fit?', 'Are they good for a trip?'],
      textColor: brandColors.actionPrimaryTextColor,
      actionColor: brandColors.actionPrimary,
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
        titleAvatarSrc: '/public/avatars/glowi.png',
        titleColor: brandColors.primary,
        welcomeMessage: 'Hey there! I’m here to help you with the <a class="text-black"><b>1970 Black Corn boots</b></a>. How can I assist?',
        templateWelcomeMessageOnProductPage:
          'Hey there I’m here to help you with the <a class="text-black"><b>{{product}}</b></a>. How can I assist?',
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
          faviconUrl:
            'https://glowi-test-store.myshopify.com/cdn/shop/files/GLOWI_logo_claim_29169491-1eea-431a-9df0-2103f73f5678.png?v=1729063336&width=240',
        },
        userMessage: {
          backgroundColor: brandColors.primary,
          textColor: brandColors.primaryTextColor,
        },
      },
    },
    brandColors: brandColors,
  };
};

export default glowiProps;
