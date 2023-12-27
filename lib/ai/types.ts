import OpenAI from "openai";

export type TaskType = "job_summary" | "assessment";
export type LLMProvider = "openai" | "mistral";
export type OpenAIModel =
  | "gpt-3.5-turbo-0613" // current gpt-3.5-turbo, does not accept json mode
  | "gpt-3.5-turbo-1106" // latest model, accepts json mode
  | "gpt-4-1106-preview"
  | "gpt-4-0613";
export type MistralModel = "mistral-tiny" | "mistral-small" | "mistral-medium";
export type CompletionStatus = "pending" | "completed" | "failed";
export type ValidatorFunction = (data: any) => boolean;
export type ResponseFormat = "json_object" | "text";

export interface Completion {
  id: number;
  model: MistralModel | OpenAIModel;
  provider: LLMProvider;
  inputData: any;
  taskType: TaskType;
  response?: LLMResponse;
  status: CompletionStatus;
  retries: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompletionRequest {
  messages: MessageObject[];
  model: MistralModel | OpenAIModel;
  response_format: ResponseFormat;
  temperature?: number;
}

export interface MessageObject {
  role: "user" | "system";
  content: string;
}

export interface LLMRequest {
  provider: LLMProvider;
  model: MistralModel | OpenAIModel;
  taskType: TaskType;
  inputData: any;
}
export interface LLMResponse {
  success: boolean;
  data?: any;
  usage?: OpenAI.Completions.CompletionUsage | { string: number };
  error?: string;
}