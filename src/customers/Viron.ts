import { FullBotProps } from '@/components/types/botprops';

export const brandColors = {
  primary: '#333333',
  primaryTextColor: 'white',
  secondary: 'white',
  secondaryTextColor: '#333333',
  actionPrimary: '#007B4B',
  actionPrimaryTextColor: '#333333',
  actionSecondary: '#333333',
  actionSecondaryTextColor: 'white',
  hintsBackgroundColor: 'rgb(0 123 75 / 10%)',
  gradient: '#007B4B', // 'linear-gradient(90deg, #00BF7D 0%, #007B4B 100%)',
  gradientReversed: '#007B4B', // 'linear-gradient(270deg, #00BF7D 0%, #007B4B 100%)',
};

export const vironProps = (): FullBotProps => {
  return {
    apiUrl: 'http://localhost:8000/twini-stream/viron-agents',
    shopRef: 'viron',
    starterPrompts: {
      prompts: [
        "Do you have any shoes for this winter?",
        "What makes your shoes sustainable?",
        "Do you offer international shipping?"
      ],
      productPagePrompts: [
        "How do they fit?",
        "Can you tell me more about the material? ",
        "Are they good for winter?",
      ],
      textColor: brandColors.actionPrimaryTextColor,
      actionColor: brandColors.actionPrimary,
      backgroundColor: 'rgb(0 123 75 / 10%)',
      borderColor: brandColors.gradient,
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
        poweredByTextColor: '#333333',
        firstMessage: undefined,
        textInput: {
          placeholder: 'Ask me anything...',
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
