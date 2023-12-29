import { LLMService } from "./llm-service";
import { OpenAIProvider } from "./openai";
import { MistralProvider } from "./mistral";
import { MISTRAL_API_KEY, OPENAI_API_KEY } from "../config";

export function createLLMService() {
  const openAIProvider = new OpenAIProvider(OPENAI_API_KEY);
  const mistralProvider = new MistralProvider(MISTRAL_API_KEY);
  return new LLMService(openAIProvider, mistralProvider);
}
