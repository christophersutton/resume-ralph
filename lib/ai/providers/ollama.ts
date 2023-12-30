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
      console.log(response)

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      const usage = {
        promptTokens: responseData.prompt_eval_count,
        completionTokens: responseData.eval_count,
      };
      
      let data = null;
      try {
        if (
          response_format === "json_object" &&
          typeof responseData.response === "string"
        ) {
          data = JSON.parse(responseData.response);
        } else {
          data = responseData.response;
        }
      } catch (error) {
        console.error("Error parsing response:", error);
        return { success: false, error: "Error parsing response", data: null };
      }

      return { success: true, data: data, usage: usage };
    } catch (error) {
      console.error("Error in getCompletion:", error);
      return { success: false, error: "Failed to get completion" };
    }
  }
}
