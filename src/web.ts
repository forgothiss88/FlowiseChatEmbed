import { JSX } from 'solid-js';
import { registerWebComponents } from './register';
import { injectChatbotInWindow, parseChatbot } from './window';
import { BotProps } from './components/Bot';
import { BubbleParams } from './features/bubble/types';

registerWebComponents();

const chatbot = parseChatbot();

type DefaultBotProps = {
  apiUrl: string | null;
  creatorName: string;
  titleAvatarSrc: string;
  avatarSrc: string;
  starterPrompts: string[];
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
      creatorName: props.creatorName,
      chatflowid: `${props.creatorName}-twini`,
      apiUrl: botUrl,
      starterPrompts: props.starterPrompts || [],
      chatflowConfig: {},
      theme: {
        button: {
          right: 20,
          bottom: 20,
          size: 'medium',
          iconColor: 'white',
          bubbleButtonColor: '#050a30',
          topbarColor: 'rgba(65,5,132,1)',
        },
        chatWindow: {
          welcomeMessage: msg,
          backgroundColor: 'linear-gradient(180deg, rgba(65,5,132,1) 10%, rgba(245,245,245,1) 72%)',
          fontSize: 16,
          poweredByTextColor: '#ffffff',
          title: '@holidoit',
          titleAvatarSrc: props.titleAvatarSrc,
          titleColor: '#ffffff',
          botMessage: {
            backgroundColor: '#ffffff',
            textColor: '#283E4D',
            avatarSrc: props.avatarSrc,
            showAvatar: true,
          },
          userMessage: {
            backgroundColor: '#202124',
            textColor: '#ffffff',
            showAvatar: false,
          },
          textInput: {
            backgroundColor: '#ffffff',
            textColor: '#283E4D',
            placeholder: 'Ask me (almost) anything...',
            sendButtonColor: '#7f7970',
          },
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
