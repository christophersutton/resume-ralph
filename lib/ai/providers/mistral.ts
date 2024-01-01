import { extractJSON, isValidJSONString } from "@/lib/utils/serverUtils";
import { CompletionRequest, LLMResponse } from "../types";
// @ts-ignore
import MistralClient from "@mistralai/mistralai";

export class MistralProvider {
  private mistral;

  constructor(apiKey: string) {
    this.mistral = new MistralClient(apiKey);
  }

  public async getCompletion(request: CompletionRequest): Promise<LLMResponse> {
    try {
      const { messages, model, response_format, temperature } = request;

      const response = await this.mistral.chat({
        messages: messages,
        stream: false,
        model: model,
        response_format: { type: response_format },
      });

      const content = response?.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content in response");
      }

      const usage = response?.usage;
      return { success: true, data: content, ...(usage ? { usage } : {}) };
    } catch (error) {
      // Handle errors appropriately
      console.error("Error in getCompletion:", error);
      return { success: false, error: "Failed to get completion" };
    }
  }
}
