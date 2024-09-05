import { JSX } from 'solid-js';
import { registerWebComponents } from './register';
import { injectChatbotInWindow, parseChatbot } from './window';
import { BotProps } from './components/Bot';
import { BubbleParams, BubbleTheme } from './features/bubble/types';

registerWebComponents();

const chatbot = parseChatbot();

type DefaultBotProps = {
  apiUrl: string | null;
  creatorName: string;
  titleAvatarSrc: string;
  avatarSrc: string;
  starterPrompts: string[];
  theme: BubbleTheme;
};

const createDefaultChatBot = () => {
  function getFromUrlParamOrLocal(key: string): string | null {
    // Assuming you're working with the current page's URL
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(key);
    if (value !== null) {
      localStorage.setItem(key, value);
      return value;
    }
    return localStorage.getItem(key);
  }

  function getChatflowDefaultProps(props: DefaultBotProps): BotProps & BubbleParams {
    const botUrl: string = props.apiUrl ? props.apiUrl : getFromUrlParamOrLocal('botUrl');
    console.log(props);
    const msg: JSX.Element =
      "🎉 Hi there, I'm Twini, your guide from <a href='https://instgram.com/holidoit'>@holidoit</a>! 🌍 Ready to explore? Share what excites you and let’s dive in! 🎈 Visit <a href='https://holidoit.com'>holidoit.com</a> for more inspiration!";
    return {
      ref: undefined,
      creatorName: props.creatorName,
      chatflowid: `${props.creatorName}-twini`,
      apiUrl: botUrl,
      starterPrompts: props.starterPrompts || {},
      chatflowConfig: {},
      theme: {
        button: {
          right: props.theme?.button?.right || 20,
          bottom: props.theme?.button?.bottom || 20,
          size: props.theme?.button?.size || 'medium',
          iconColor: props.theme?.button?.iconColor || 'white',
          bubbleButtonColor: props.theme?.button?.bubbleButtonColor || '#050a30',
          topbarColor: props.theme?.button?.topbarColor,
          customIconSrc: props.theme?.button?.customIconSrc || '',
        },
        chatWindow: {
          welcomeMessage: props.theme?.chatWindow?.welcomeMessage || msg,
          backgroundColor: props.theme?.chatWindow?.backgroundColor,
          fontSize: props.theme?.chatWindow?.fontSize || 16,
          poweredByTextColor: props.theme?.chatWindow?.poweredByTextColor || '#283E4D',
          title: props.theme?.chatWindow?.title || '@holidoit',
          titleAvatarSrc: props.theme?.chatWindow?.titleAvatarSrc || props.titleAvatarSrc,
          titleColor: props.theme?.chatWindow?.titleColor || '#ffffff',
          botMessage: {
            backgroundColor: props.theme?.chatWindow?.botMessage?.backgroundColor || '#ffffff',
            textColor: props.theme?.chatWindow?.botMessage?.textColor || '#283E4D',
            avatarSrc: props.theme?.chatWindow?.botMessage?.avatarSrc || props.avatarSrc,
            avatarPadding: props.theme?.chatWindow?.botMessage?.avatarPadding || '8px',
            showAvatar: props.theme?.chatWindow?.botMessage?.showAvatar || true,
            enableMultipricing: props.theme?.chatWindow?.botMessage?.enableMultipricing || false,
            purchaseButtonText: props.theme?.chatWindow?.botMessage?.purchaseButtonText || 'Buy now',
            purchaseButtonBackgroundColor: props.theme?.chatWindow?.botMessage?.purchaseButtonBackgroundColor || '#283E4D',
            purchaseButtonTextColor: props.theme?.chatWindow?.botMessage?.purchaseButtonTextColor || '#ffffff',
            faviconUrl: props.theme?.chatWindow?.botMessage?.faviconUrl || undefined,
          },
          userMessage: {
            backgroundColor: props.theme?.chatWindow?.userMessage?.backgroundColor || '#202124',
            textColor: props.theme?.chatWindow?.userMessage?.textColor || '#ffffff',
          },
          textInput: {
            backgroundColor: props.theme?.chatWindow?.textInput?.backgroundColor || '#ffffff',
            inputBackgroundColor: props.theme?.chatWindow?.textInput?.inputBackgroundColor || undefined,
            textColor: props.theme?.chatWindow?.textInput?.textColor || '#283E4D',
            placeholder: props.theme?.chatWindow?.textInput?.placeholder || 'Ask me (almost) anything...',
            sendButtonColor: props.theme?.chatWindow?.textInput?.sendButtonColor || '#7f7970',
            resetButtonColor: props.theme?.chatWindow?.textInput?.resetButtonColor || '#7f7970',
          },
          firstMessage: props.theme?.chatWindow?.firstMessage || {},
        },
      },
    };
  }
  return {
    init: chatbot.init,
    initFull: chatbot.initFull,
    initWithDefaults: (props: DefaultBotProps) => chatbot.init(getChatflowDefaultProps(props)),
    initFullWithDefaults: (props: DefaultBotProps) => chatbot.initFull(getChatflowDefaultProps(props)),
  };
};

const bot = createDefaultChatBot();

injectChatbotInWindow(bot);

export default bot;
