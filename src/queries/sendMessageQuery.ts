import { MessageType } from '@/components/Bot';
import { sendRequest } from '@/utils/index';

export type MessageTypeBE = 'ai' | 'human' | 'system';

export type MessageBE = {
  type: string;
  content: string;
};

export type RunBody = {
  input: string;
  chat_history: MessageBE[];
};

export type RunInput = {
  input: RunBody;
  config?: Record<string, unknown>;
  user: string;
  // overrideConfig?: Record<string, unknown>;
  // socketIOClientId?: string;
  // chatId?: string;
  // fileName?: string; // Only for assistant
};

export type MessageRequest = {
  apiUrl?: string;
  body?: RunInput;
};

export const sendFileDownloadQuery = ({ apiUrl = 'http://localhost:3000', body }: MessageRequest) =>
  sendRequest<any>({
    method: 'POST',
    url: `${apiUrl}/api/v1/openai-assistants-file`,
    body,
    type: 'blob',
  });
