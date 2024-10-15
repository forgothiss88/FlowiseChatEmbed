import { render } from 'solid-js/web';
import { FullProps } from './components/props';
import { DefaultBotProps, glowiProps } from './customers/Glowi';
import { BubbleBot } from './features/bubble';

const getFullProps = (props: DefaultBotProps): FullProps => {
  return {
    creatorName: props.creatorName,
    chatflowid: `${props.creatorName}-twini`,
    apiUrl: props.apiUrl,
    starterPrompts: props.starterPrompts,
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
        welcomeMessage: props.theme?.chatWindow?.welcomeMessage,
        backgroundColor: props.theme?.chatWindow?.backgroundColor,
        fontSize: props.theme?.chatWindow?.fontSize || 16,
        poweredByTextColor: props.theme?.chatWindow?.poweredByTextColor || '#283E4D',
        title: props.theme?.chatWindow?.title || '',
        titleAvatarSrc: props.theme?.chatWindow?.titleAvatarSrc || props.titleAvatarSrc,
        titleColor: props.theme?.chatWindow?.titleColor || '#ffffff',
        botMessage: {
          backgroundColor: props.theme?.chatWindow?.botMessage?.backgroundColor || '#ffffff',
          textColor: props.theme?.chatWindow?.botMessage?.textColor || '#283E4D',
          avatarSrc: props.theme?.chatWindow?.botMessage?.avatarSrc || props.avatarSrc,
          avatarPadding: props.theme?.chatWindow?.botMessage?.avatarPadding || '8px',
          showAvatar: props.theme?.chatWindow?.botMessage?.showAvatar,
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
};

render(() => {
  const getChatbot = (): HTMLElement => document.getElementsByTagName('twini-chatbot')[0];
  if (!getChatbot()) {
    console.error('Element with id "twini-chatbot" not found.');
    return;
  }
  const props = glowiProps({ apiUrl: 'http://localhost:8000/twini-stream/viron-agents' });
  const avatarShopifyCdnUrl = getChatbot().getAttribute('data-avatar-shopify-cdn-url');
  if (avatarShopifyCdnUrl) {
    console.log('Shopify CDN URL:', avatarShopifyCdnUrl);
    props.theme.chatWindow.titleAvatarSrc = avatarShopifyCdnUrl;
    props.theme.chatWindow.botMessage.avatarSrc = avatarShopifyCdnUrl;
    props.theme.chatWindow.botMessage.faviconUrl = avatarShopifyCdnUrl;
  } else {
    console.error('Attribute "data-shopify-cdn-url" not found.');
  }

  const botProps = getFullProps(props);
  const bot = <BubbleBot {...botProps} getElement={getChatbot} />;
  return bot;
}, document.getElementsByTagName('twini-chatbot')[0]);
