import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { Assessment, Job, JobPosting, JobSummary } from "@/lib/types";
import { useRouter } from "next/router";
import { reducer } from "./reducer";

export interface Store {
  jobs: Job[];
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
}>({
  state: init,
  dispatch: () => {},
  loadAllJobs: () => {},
  addJobToStore: () => {},
});

interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, init);
  const router = useRouter();

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
      dispatch,
    }),
    [state, loadAllJobs, dispatch, addJobToStore]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const STORE_CONTEXT = ({ children }: { children: React.ReactNode }) => {
  return <StoreProvider>{children}</StoreProvider>;
};

export const useStore = () => useContext(StoreContext);
