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

export const vironProps = (props: { apiUrl: string }): DefaultBotProps => {
  return {
    apiUrl: props.apiUrl,
    creatorName: 'viron',
    starterPrompts: {
      prompts: ["What's special about the materials used?", 'Can you tell me more about the fit?', 'Are they good for a trip?'],
      background: 'rgba(51, 51, 51, 0.75)',
    },
    theme: {
      button: {
        topbarColor: '#007B4B',
      },
      chatWindow: {
        title: '',
        titleAvatarSrc: '/public/avatars/viron.png',
        titleColor: 'black',
        welcomeMessage: 'Hey there! I’m here to help you with the <a class="text-black"><b>1970 Black Corn boots</b></a>. How can I assist?',
        backgroundColor: 'rgba(51, 51, 51, 0.75)',
        poweredByTextColor: 'black',
        firstMessage: {
          text: 'Ciao, sono la dott.ssa Maria Priore 😊',
          background: 'white',
          // actionsBackground: '#F1E3FF',
          // actionsBackground: '#9AFEBB',
          actionsBackground: '#FFECF4',
          actions: [
            {
              title: 'Personalizza la tua skincare routine',
              subtitle: 'Raccontami di te e della tua pelle per ricevere i miei consigli personalizzati',
              prompt: 'Aiutami a fare una skincare routine',
              icon: 'lotion',
            },
            {
              title: 'Carica un selfie per un’analisi dettagliata',
              subtitle: 'La nostra AI darà un voto da 0 a 100 a parametri come rossori, lucidità e acne.',
              prompt: 'Analizza la mia pelle',
              icon: 'doctor',
            },
            {
              title: 'Informati con la nostra skin academy',
              subtitle: 'Informati con le nostre guide per sfatare miti e approfondire le tematiche della skincare.',
              prompt: 'Vorrei approfondire le tematiche della skincare',
              icon: 'smile',
            },
          ],
        },
        textInput: {
          placeholder: 'Chat with AI...',
          // inputBackgroundColor: 'white',
          // backgroundColor: '#F1E3FF',
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
          purchaseButtonText: 'Buy now',
          purchaseButtonBackgroundColor: '#007B4B',
          purchaseButtonTextColor: 'black',
          faviconUrl: '/public/avatars/viron.png',
        },
        userMessage: {
          backgroundColor: 'black',
          textColor: 'white',
          showAvatar: false,
        },
      },
    },
  };
};

export default vironProps;
