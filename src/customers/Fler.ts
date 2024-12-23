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
        "Cosa rende Fler diverso dagli altri?",
        "Quanto costa la spedizione?",
        "Consigliami un prodotto"
      ],
      productPagePrompts: [
        "Come funziona l’abbonamento?",
        "È adatto per pelli sensibili?",
        "Quanto dura una lametta?"
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
        welcomeMessage: 'Ciao!\nSono il tuo personal shopper 🪒',
        templateWelcomeMessageOnProductPage: 'Eccomi!\nChiedimiw di più su **{{product}}**. Come posso aiutarti?',
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        poweredByTextColor: '#333333',
        firstMessage: undefined,
        textInput: {
          placeholder: 'Scrivi qui...',
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
          purchaseButtonText: 'Vai al prodotto',
          askMoreText: 'Chiedi di più...',
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
