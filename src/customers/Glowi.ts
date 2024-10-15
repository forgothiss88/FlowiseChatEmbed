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

export const glowiProps = (props: { apiUrl: string }): DefaultBotProps => {
  return {
    apiUrl: props.apiUrl,
    creatorName: 'viron',
    starterPrompts: {
      prompts: ["What's special about the materials used?", 'Can you tell me more about the fit?', 'Are they good for a trip?'],
      background: 'transparent',
    },
    theme: {
      button: {
        topbarColor: '#F8A666',
      },
      chatWindow: {
        title: '',
        titleAvatarSrc: '/public/avatars/viron.png',
        titleColor: 'black',
        welcomeMessage: 'Hey there! I’m Glowi\'s @twini! How can I assist?',
        backgroundColor: 'rgba(51, 51, 51, 0.75)',
        poweredByTextColor: 'black',
        firstMessage: undefined,
        textInput: {
          placeholder: 'Chat with AI...',
          inputBackgroundColor: 'white',
          backgroundColor: undefined,
          textColor: 'black',
          sendButtonColor: 'gray',
          resetButtonColor: 'gray',
        },
        botMessage: {
          backgroundColor: 'white',
          textColor: 'black',
          avatarSrc: '/public/avatars/viron.png',
          avatarPadding: '0px',
          showAvatar: false,
          enableMultipricing: false,
          purchaseButtonText: 'View product',
          purchaseButtonBackgroundColor: '#F8A666',
          purchaseButtonTextColor: 'black',
          faviconUrl: '/public/avatars/viron.png',
        },
        userMessage: {
          backgroundColor: 'black',
          textColor: 'white',
        },
      },
    },
  };
};

export default glowiProps;
