import { CompletionRequest, LLMResponse } from "./types";
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

      let data = null;
      try {
        data = response?.choices[0]?.message?.content
          ? JSON.parse(response.choices[0].message.content)
          : null;
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return { success: false, error: "Model didn't output JSON", data: data };
      }

      const usage = response?.usage;
      return { success: true, data: data, ...(usage ? { usage } : {}) };
    } catch (error) {
      // Handle errors appropriately
      console.error("Error in getCompletion:", error);
      return { success: false, error: "Failed to get completion" };
    }
  }
}
