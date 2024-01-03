import OpenAI from "openai";

export type TaskType = "job_summary" | "assessment" | "assessmentFromSummary";
export type LLMProvider = "openai" | "mistral" | "ollama";
export type LLMModel = OllamaModel | OpenAIModel | MistralModel;
export type OpenAIModel =
  | "gpt-3.5-turbo-0613" // current gpt-3.5-turbo, does not accept json mode
  | "gpt-3.5-turbo-1106" // latest model, accepts json mode
  | "gpt-4-1106-preview"
export type MistralModel = "mistral-tiny" | "mistral-small" | "mistral-medium";
export type OllamaModel = "llama2" | "mistral" | "mixtral";
export type CompletionStatus = "pending" | "completed" | "failed";
export type ValidatorFunction = (data: any) => boolean;
export type ResponseFormat = "json_object" | "text";

export interface Completion {
  id: number;
  model: LLMModel;
  provider: LLMProvider;
  promptTemplateId: string | null;
  inputData: any;
  taskType: TaskType;
  response?: LLMResponse;
  status: CompletionStatus;
  promptTokens: number;
  completionTokens: number;
  retries: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompletionRequest {
  messages: MessageObject[];
  model: LLMModel;
  response_format: ResponseFormat;
  temperature?: number;
}

export interface MessageObject {
  role: "user" | "system";
  content: string;
}

export interface LLMRequest {
  jobId: number;
  provider: LLMProvider;
  model: LLMModel;
  taskType: TaskType;
  inputData: any;
}
export interface LLMResponse {
  success: boolean;
  data?: any;
  promptTemplateId?: string;
  completionId?: number;
  usage?: any;
  error?: string;
}
export type Models = Record<LLMProvider, LLMModel[]>;

export const models: Models = {
  openai: [
    // "gpt-3.5-turbo-0613", // current gpt-3.5-turbo, does not accept json mode
    "gpt-3.5-turbo-1106", // latest model, accepts json mode
    "gpt-4-1106-preview",
  ],
  mistral: ["mistral-tiny", "mistral-small", "mistral-medium"],
  ollama: ["llama2", "mistral"],
};
