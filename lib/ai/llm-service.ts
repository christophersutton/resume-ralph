import DatabaseService from "@/lib/db";
import { DB_LOCATION } from "@/lib/config";
import {
  CompletionRequest,
  LLMProvider,
  LLMRequest,
  LLMResponse,
  TaskType,
  ValidatorFunction,
} from "@/lib/ai/types";
import { OpenAIProvider } from "./openai";
import { MistralProvider } from "./mistral";
import { isAssessmentJSON, isJobSummaryJSON } from "@/lib/utils/serverUtils";
import { RESUME_CONTENTS } from "@/lib/constants";
import { PROMPT_TEMPLATES, TemplateFunction } from "./prompts/prompt-templates";

const db = DatabaseService.getInstance(DB_LOCATION);

export class LLMService {
  private validators: { [key: string]: ValidatorFunction };
  private maxRetries: number = 3;
  private promptTemplates: typeof PROMPT_TEMPLATES;
  private openAIProvider: OpenAIProvider;
  private mistralProvider?: MistralProvider;

  constructor(
    openAIProvider: OpenAIProvider,
    mistralProvider?: MistralProvider
  ) {
    this.validators = {
      job_summary: isJobSummaryJSON,
      assessment: isAssessmentJSON,
    };
    this.openAIProvider = openAIProvider;
    this.mistralProvider = mistralProvider;
    this.promptTemplates = PROMPT_TEMPLATES;
  }

  public async makeRequest(request: LLMRequest): Promise<LLMResponse> {
    // Insert initial job record
    const completionId = await this.createCompletionRecord(request);

    // Perform the API call
    const response = await this.dispatchTask(request);
    console.log("llm service response: ", response);

    if (
      response.success &&
      this.isValidOutput(request.taskType, response.data)
    ) {
      await this.finishCompletionRecord(completionId, response);
      return { ...response, completionId };
    } else {
      await this.finishCompletionRecord(completionId, response, "failed");
      // await this.retryJob(jobId, request);
      return {
        success: false,
        error: response.error ?? "Invalid output",
        completionId,
        data: response.data,
      };
    }
  }

  private async dispatchTask(request: LLMRequest): Promise<LLMResponse> {
    let messages, promptTemplateId;
    switch (request.taskType) {
      case "job_summary": {
        const { templateId, templateFunction } = this.getTemplate(
          request.taskType
        );
        promptTemplateId = templateId;
        messages = templateFunction(request.inputData.jobDescription);
        break;
      }
      case "assessment":
        const { templateId, templateFunction } = this.getTemplate(
          request.taskType
        );
        promptTemplateId = templateId;
        messages = templateFunction(
          RESUME_CONTENTS,
          request.inputData.jobDescription
        );
        break;
      default:
        return {
          success: false,
          error: "Unknown task type",
        };
    }
    const completionRequest: CompletionRequest = {
      model: request.model,
      response_format: "json_object",
      messages: messages,
    };
    const response = await this.callProviderApi(
      request.provider,
      completionRequest
    );
    return { ...response, promptTemplateId };
  }

  private getTemplate(
    taskType: TaskType,
    versionId?: string
  ): { templateId: string; templateFunction: TemplateFunction } {
    const templates = this.promptTemplates[taskType];
    const sortedVersions = Object.keys(templates).sort((a, b) =>
      b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" })
    );
    const selectedVersion =
      versionId && templates[versionId] ? versionId : sortedVersions[0];
    return {
      templateId: `${taskType}-${selectedVersion}`,
      templateFunction: templates[selectedVersion],
    };
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
    const { provider, model, taskType, inputData, jobId } = request;
    const completionId = await db.insert("completions", {
      jobId,
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
    response: LLMResponse,
    status: "completed" | "failed" = "completed"
  ): Promise<void> {
    await db.update("completions", completionId, {
      response: response.data,
      promptTemplateId: response.promptTemplateId ?? null,
      promptTokens: response.usage?.prompt_tokens ?? 0,
      completionTokens: response.usage?.completion_tokens ?? 0,
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
