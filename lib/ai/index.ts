import { LLMService } from "./llm-service";
import { OpenAIProvider } from "./providers/openai";
import { MistralProvider } from "./providers/mistral";
import { MISTRAL_API_KEY, OLLAMA_ENDPOINT, OPENAI_API_KEY } from "../config";
import { OllamaProvider } from "./providers/ollama";

export function createLLMService() {
  const openAIProvider = new OpenAIProvider(OPENAI_API_KEY);
  const mistralProvider = new MistralProvider(MISTRAL_API_KEY);
  const ollamaProvider = new OllamaProvider(OLLAMA_ENDPOINT);
  return new LLMService(openAIProvider, mistralProvider, ollamaProvider);
}
