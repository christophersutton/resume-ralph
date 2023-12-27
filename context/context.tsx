import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Assessment, Job, JobPosting, JobSummary } from "@/lib/types";
import { useRouter } from "next/router";
import { reducer } from "./reducer";
import { LLMProvider, MistralModel, OpenAIModel } from "@/lib/ai/types";

export interface Store {
  jobs: Job[];
}
interface createCompletionProps {
  jobId: number;
  jobDescription: string;
  provider?: LLMProvider;
  model?: MistralModel | OpenAIModel;
}

const init: Store = { jobs: [] };

export type Action =
  | { type: "LOAD_ALL_JOBS"; payload: Job[] }
  | { type: "ADD_JOB_POSTING"; payload: JobPosting }
  | { type: "REMOVE_JOB_POSTING"; payload: number }
  | {
      type: "ADD_JOB_SUMMARY";
      payload: { jobId: number; summary: JobSummary; isPrimary: boolean };
    }
  | {
      type: "REMOVE_JOB_SUMMARY";
      payload: { jobId: number; summaryId: number };
    }
  | {
      type: "ADD_ASSESSMENT";
      payload: { jobId: number; assessment: Assessment };
    };

const StoreContext = createContext<{
  state: Store;
  dispatch: React.Dispatch<Action>;
  loadAllJobs: () => void;
  addJobToStore: (jobPosting: JobPosting) => void;
  deleteJob: (jobId: number) => void;
  createSummary: ({}: createCompletionProps) => Promise<{
    success: boolean;
    summary?: JobSummary;
  }>;
  createAssessment: ({}: createCompletionProps) => Promise<{
    success: boolean;
    assessment?: Assessment;
  }>;
}>({
  state: init,
  dispatch: () => {},
  loadAllJobs: () => {},
  addJobToStore: () => {},
  deleteJob: () => {},
  createSummary: async () => ({ success: false }),
  createAssessment: async () => ({ success: false }),
});

interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, init);
  const router = useRouter();

  // Generalized API request function
  const apiRequest = async (
    url: string | URL | Request,
    method: string,
    body: {
      provider?: LLMProvider;
      model?: MistralModel | OpenAIModel;
      jobId?: any;
      jobDescription?: string;
    },
    actionType: string
  ) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Failed to ${method} at ${url}`);

      const result = await response.json();
      dispatch({
        type: actionType as Action["type"],
        payload: { jobId: body.jobId, ...result },
      });

      return { success: true, ...result };
    } catch (error) {
      console.error(`An error occurred while processing ${url}:`, error);
      return { success: false };
    }
  };

  const createSummary = useCallback((props: createCompletionProps) => {
    return apiRequest(
      "/api/job_summaries/new",
      "POST",
      {
        ...props,
        provider: props.provider ?? "openai",
        model: props.model ?? "gpt-3.5-turbo-1106",
      },
      "ADD_JOB_SUMMARY"
    );
  }, []);

  const createAssessment = useCallback((props: createCompletionProps) => {
    return apiRequest(
      "/api/assessments/new",
      "POST",
      {
        ...props,
        provider: props.provider ?? "openai",
        model: props.model ?? "gpt-3.5-turbo-1106",
      },
      "ADD_ASSESSMENT"
    );
  }, []);

  const deleteJob = useCallback((jobId: number) => {
    return apiRequest(
      `/api/job_postings/${jobId}`,
      "DELETE",
      { jobId },
      "REMOVE_JOB_POSTING"
    );
  }, []);

  const loadAllJobs = useCallback(async () => {
    try {
      const response = await fetch("/api/job_postings/all");
      if (!response.ok) {
        throw new Error("Failed to fetch job postings");
      }
      const jobs = await response.json();
      dispatch({ type: "LOAD_ALL_JOBS", payload: jobs });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const addJobToStore = useCallback(
    async (jobPosting: JobPosting) => {
      dispatch({
        type: "ADD_JOB_POSTING",
        payload: jobPosting,
      });
      router.push(`/jobs/${jobPosting.id}`);
    },
    [router]
  );

  const value = useMemo(
    () => ({
      state,
      loadAllJobs,
      addJobToStore,
      createSummary,
      deleteJob,
      createAssessment,
      dispatch,
    }),
    [
      state,
      loadAllJobs,
      addJobToStore,
      createSummary,
      deleteJob,
      createAssessment,
      dispatch,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const STORE_CONTEXT = ({ children }: { children: React.ReactNode }) => (
  <StoreProvider>{children}</StoreProvider>
);

export const useStore = () => useContext(StoreContext);
