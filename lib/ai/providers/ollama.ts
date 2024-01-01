import { CompletionRequest, LLMResponse } from "../types";

export class OllamaProvider {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public async getCompletion(request: CompletionRequest): Promise<LLMResponse> {
    try {
      const { messages, response_format, model } = request;

      const requestData = {
        model: model,
        prompt: JSON.stringify(messages),
        stream: false,
        ...(response_format === "json_object" ? { format: "json" } : {}),
      };

      const response = await fetch(`${this.endpoint}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      const usage = {
        prompt_tokens: responseData.prompt_eval_count,
        completion_tokens: responseData.eval_count,
      };
      console.log(usage)
      const data = responseData.response

      return { success: true, data: data, usage: usage };
    } catch (error) {
      console.error("Error in getCompletion:", error);
      return { success: false, error: "Failed to get completion" };
    }
  }
}
