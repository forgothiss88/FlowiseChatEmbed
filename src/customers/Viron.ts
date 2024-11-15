import { FullBotProps } from '@/components/types/botprops';

export const brandColors = {
  primary: 'black',
  primaryTextColor: 'white',
  secondary: 'white',
  secondaryTextColor: 'black',
  actionPrimary: '#007B4B',
  actionPrimaryTextColor: 'black',
  actionSecondary: 'black',
  actionSecondaryTextColor: 'white',
  hintsBackgroundColor: 'rgb(0 123 75 / 10%)',
};

export const vironProps = (): FullBotProps => {
  return {
    apiUrl: 'http://localhost:8000/twini-stream/viron-agents',
    shopRef: 'viron',
    starterPrompts: {
      prompts: ["What's special about the materials used?", 'Can you tell me more about the fit?', 'Are they good for a trip?'],
      textColor: 'black',
      actionColor: brandColors.actionPrimary,
      backgroundColor: 'rgb(0 123 75 / 10%)',
    },
    theme: {
      button: {
        topbarColor: brandColors.primary,
        size: 'medium',
        iconColor: brandColors.actionSecondary, // color inside the icon
        bubbleButtonColor: 'white',
      },
      chatWindow: {
        title: '',
        titleAvatarSrc: '/public/avatars/viron.png',
        titleColor: brandColors.primary,
        welcomeMessage: 'Hey there!\nI’m your personal shopper from Virón 🌱',
        templateWelcomeMessageOnProductPage: 'Hey there 🌱\nI’m here to help you with the **{{product}}**. How can I help you?',
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
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
          backgroundColor: 'transparent',
          textColor: brandColors.primary,
          showAvatar: false,
          enableMultipricing: false,
          purchaseButtonText: 'View product',
          purchaseButtonBackgroundColor: brandColors.actionPrimary,
          purchaseButtonTextColor: brandColors.primaryTextColor,
          faviconUrl: '/public/avatars/viron.png',
        },
        userMessage: {
          backgroundColor: brandColors.actionPrimary,
          textColor: brandColors.primaryTextColor,
        },
      },
    },
    brandColors: brandColors,
  };
};

export default vironProps;
