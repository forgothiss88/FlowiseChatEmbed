
export type MessageTypeBE = 'ai' | 'human' | 'system';

export type MessageBE = {
  type: string;
  role: string;
  content: string;
};

export type RunBody = {
  input: string;
  chat_history: MessageBE[];
  username: string;
  chat_ref: string;
  cart_token: string;
  product_handle: string;
};

export type RunInput = {
  input: RunBody;
  config?: Record<string, unknown>;
};

export type MessageRequest = {
  apiUrl?: string;
  body?: RunInput;
};
