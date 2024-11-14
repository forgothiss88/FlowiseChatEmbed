import { ContentMetadata, ProductMetadata, SourceDocument } from './documents';

export type ContextEvent = {
  context: SourceDocument<ProductMetadata | ContentMetadata>[]; // JSON string of source documents
};

export type AnswerEvent = {
  answer: string;
};

export type MetadataEvent = {
  run_id: string;
};

export type ServerSentEvent = {
  event_name: string;
};

export type IncrementalAnswerEvent = ServerSentEvent & {
  message: string;
};

export type MessageChunkGeneratedEvent = ServerSentEvent & {
  chunk: string;
};

export type SuggestionGeneratedEvent = ServerSentEvent & {
  suggestion_slug: string;
};

export type FourSuggestionsGeneratedEvent = ServerSentEvent & {
  suggestion_slugs: string[];
};

export type NextQuestionsGeneratedEvent = ServerSentEvent & {
  questions: string[];
};

export type ChatSummaryGeneratedEvent = ServerSentEvent & {
  summary: string;
};
