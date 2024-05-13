import { JSX } from 'solid-js';
import { registerWebComponents } from './register';
import { injectChatbotInWindow, parseChatbot } from './window';

registerWebComponents();

const chatbot = parseChatbot();

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

    function getChatflowDefaultProps(chatflowId: string, apiHost: string | null, titleAvatarSrc: string, avatarSrc: string, starterPrompts?: string[]) {
        const customerEmail: string | null = getFromUrlParamOrLocal('customerEmail');
        const customerName: string | null = getFromUrlParamOrLocal('customerName');
        const botUrl: string = apiHost ? apiHost : getFromUrlParamOrLocal('botUrl');

        let cfg, msg: JSX.Element;

        if (customerEmail && customerName) {
            cfg = { // overrideConfig
                "functionInputVariables": {
                    "customerEmail": customerEmail,
                }
            };
            msg = `Ciao ${customerName} :) sono l'assistente virtuale di @holidoit! Come posso aiutarti oggi?`;
        } else {
            cfg = {};
            msg = "🎉 Hi there, I'm Twini, your guide from <a href='https://instgram.com/holidoit'>@holidoit</a>! 🌍 Ready to explore? Share what excites you and let’s dive in! 🎈 Visit <a href='https://holidoit.com'>holidoit.com</a> for more inspiration!";
        }
        return {
            chatflowid: chatflowId,
            apiHost: botUrl,
            chatflowConfig: cfg,
            customerName: customerName,
            customerEmail: customerEmail,
            theme: {
                button: {
                    backgroundColor: "#efedff",
                    right: 20,
                    bottom: 20,
                    size: "medium",
                    iconColor: "white",
                    bubbleButtonColor: "#050a30",
                    topbarColor: "rgba(65,5,132,1)",
                },
                chatWindow: {
                    welcomeMessage: msg,
                    starterPrompts: starterPrompts,
                    backgroundColor: "linear-gradient(180deg, rgba(65,5,132,1) 10%, rgba(245,245,245,1) 72%)",
                    fontSize: 16,
                    poweredByTextColor: "#ffffff",
                    title: '@holidoit',
                    titleAvatarSrc: titleAvatarSrc,
                    titleColor: "#ffffff",
                    botMessage: {
                        backgroundColor: "#ffffff",
                        textColor: "#283E4D",
                        avatarSrc: avatarSrc,
                        showAvatar: true,
                    },
                    userMessage: {
                        backgroundColor: "#202124",
                        textColor: "#ffffff",
                        showAvatar: false,
                    },
                    textInput: {
                        backgroundColor: "#ffffff",
                        textColor: "#283E4D",
                        placeholder: "Write here...",
                        sendButtonColor: "#7f7970",
                    },
                }
            }
        }
    }
    return {
        'init': chatbot.init,
        'initFull': chatbot.initFull,
        'initWithDefaults': (chatflowId: string, apiHost: string, titleAvatarSrc: string, avatarSrc: string, starterPrompts?: string[]) => chatbot.init(getChatflowDefaultProps(chatflowId, apiHost, titleAvatarSrc, avatarSrc, starterPrompts)),
        'initFullWithDefaults': (chatflowId: string, apiHost: string, titleAvatarSrc: string, avatarSrc: string, starterPrompts?: string[]) => chatbot.initFull(getChatflowDefaultProps(chatflowId, apiHost, titleAvatarSrc, avatarSrc, starterPrompts))
    }
}

const bot = createDefaultChatBot();

injectChatbotInWindow(bot);

export default bot;