import { Job } from "@/lib/types";
import DatabaseService from "@/lib/db";
import { DB_LOCATION, MISTRAL_API_KEY, OPENAI_API_KEY } from "@/lib/config";
import { systemPrompts } from "./prompts/systemPrompts";
import {
  CompletionRequest,
  LLMProvider,
  LLMRequest,
  LLMResponse,
  MessageObject,
  ValidatorFunction,
} from "@/lib/ai/types";
import { OpenAIProvider } from "./openai";
import { MistralProvider } from "./mistral";
import { isJobSummary } from "@/lib/utils/serverUtils";

const db = DatabaseService.getInstance(DB_LOCATION);

export class LLMService {
  private validators: { [key: string]: ValidatorFunction };
  private maxRetries: number = 3;
  private openAIProvider: OpenAIProvider;
  private mistralProvider?: MistralProvider;

  constructor(
    openAIProvider: OpenAIProvider,
    mistralProvider?: MistralProvider
  ) {
    this.validators = {
      summarize: isJobSummary,
    };
    this.openAIProvider = openAIProvider;
    this.mistralProvider = mistralProvider;
  }

  public async makeRequest(request: LLMRequest): Promise<LLMResponse> {
    // Insert initial job record
    const completionId = await this.createCompletionRecord(request);

    // Perform the API call
    const response = await this.dispatchTask(request);

    if (
      response.success &&
      this.isValidOutput(request.taskType, response.data)
    ) {
      await this.finishCompletionRecord(completionId, response);
      return response;
    } else {
      // await this.retryJob(jobId, request);
      return { success: false, error: "Request failed or invalid output" };
    }
  }

  private async dispatchTask(request: LLMRequest): Promise<LLMResponse> {
    switch (request.taskType) {
      case "job_summary":
        return this.handleSummaryTask(request);
      case "assessment":
        return this.handleAssessmentTask(request);
      default:
        return { success: false, error: "Unknown task type" };
    }
  }
  private async handleSummaryTask(request: LLMRequest): Promise<LLMResponse> {
    const messages: MessageObject[] = [
      {
        role: "system",
        content: systemPrompts["job_summary"],
      },
      {
        role: "user",
        content: `Here is the job description: ${request.inputData.jobDescription}`,
      },
    ];
    let completionRequest: CompletionRequest = {
      model: request.model,
      response_format: "json_object",
      messages: messages,
    };

    const response = await this.callProviderApi(
      request.provider,
      completionRequest
    );
    return response;
  }
  private async handleAssessmentTask(
    request: LLMRequest
  ): Promise<LLMResponse> {
    const messages: MessageObject[] = [
      {
        role: "system",
        content: systemPrompts["assessment"],
      },
      {
        role: "user",
        content: `Here is the job description: ${request.inputData.jobDescription} 
        Here is the job summary: ${request.inputData.jobSummary}`,
      },
    ];
    let completionRequest: CompletionRequest = {
      model: request.model,
      response_format: "json_object",
      messages: messages,
    };

    const response = await this.callProviderApi(
      request.provider,
      completionRequest
    );
    return response;
  }

  private async callProviderApi(
    provider: LLMProvider,
    request: CompletionRequest
  ): Promise<LLMResponse> {
    switch (provider) {
      case "openai":
        return this.openAIProvider.getCompletion(request);
      case "mistral":
        if (!this.mistralProvider) {
          throw Error("Mistral provider not initialized");
        }
        return this.mistralProvider.getCompletion(request);
      default:
        return { success: false, error: "Unknown provider" };
    }
  }

  private async createCompletionRecord(request: LLMRequest): Promise<number> {
    const { provider, model, taskType, inputData } = request;
    const completionId = await db.insert("completions", {
      model,
      provider,
      taskType,
      inputData,
      status: "pending",
      retries: 0,
    });
    return completionId;
  }
  private async finishCompletionRecord(
    completionId: number,
    response: LLMResponse
  ): Promise<void> {
    await db.update("completions", completionId, {
      response,
      status: "completed",
    });
  }

  private async retryCompletion(
    completionId: number,
    request: LLMRequest
  ): Promise<void> {
    const job = await db.getById("completions", completionId.toString());
    if (job && job.retries < this.maxRetries) {
      await db.update("completions", completionId, {
        retries: job.retries + 1,
      });
      // Implement the actual retry logic here
    } else if (job) {
      await this.updateCompletionStatus(completionId, "failed");
    }
  }

  private async updateCompletionStatus(
    completionId: number,
    status: "pending" | "completed" | "failed"
  ): Promise<void> {
    await db.update("completions", completionId, { status });
  }

  private isValidOutput(taskType: string, data: any): boolean {
    const validator = this.validators[taskType];
    return validator ? validator(data) : true;
  }
}

export function createLLMService() {
  const openAIProvider = new OpenAIProvider(OPENAI_API_KEY);
  //const mistralProvider = new MistralProvider(MISTRAL_API_KEY);
  return new LLMService(openAIProvider);
}
