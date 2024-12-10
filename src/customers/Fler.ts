import { FullBotProps } from '@/components/types/botprops';

export const brandColors = {
  primary: '#333333',
  primaryTextColor: 'white',
  secondary: 'white',
  secondaryTextColor: '#333333',
  actionPrimary: 'rgb(207 90 46)',
  actionPrimaryTextColor: '#333333',
  actionSecondary: '#333333',
  actionSecondaryTextColor: 'white',
  hintsBackgroundColor: 'rgb(207 90 46 / 10%)',
  gradient: 'rgb(207 90 46)', // 'linear-gradient(90deg, #E2511B 0%, #923F20 100%)',
  gradientReversed: 'rgb(207 90 46)', // 'linear-gradient(270deg, #E2511B 0%, #923F20 100%)',
};

export const flerProps = (): FullBotProps => {
  return {
    apiUrl: 'http://localhost:8000/twini-stream/fler-agents',
    shopRef: 'fler',
    starterPrompts: {
      prompts: [
        "Are Fler products suited for sensitive skin?",
        "How often can I receive new razor cartridges?",
        "What are fler advantages over other razors?"
      ],
      productPagePrompts: [
        "How do I use it for optimal results?",
        "How can I prevent irritations?",
        "Is is suitable for sensitive skin?",
      ],
      textColor: brandColors.actionPrimaryTextColor,
      actionColor: brandColors.actionPrimary,
      backgroundColor: brandColors.hintsBackgroundColor,
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
        welcomeMessage: 'Hey there!\nI’m your personal shopper from Fler 🌱',
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
          faviconUrl: '/public/avatars/fler.png',
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

export default flerProps;
