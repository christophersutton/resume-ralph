import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { JobPosting, JobSummary } from "@/lib/types";
import { useRouter } from "next/router";
import { reducer } from "./reducer";

export interface Store {
  jobPostings: JobPosting[];
}

const init: Store = { jobPostings: [] };

export type Action =
  | { type: "LOAD_ALL_POSTINGS"; payload: JobPosting[] }
  | { type: "ADD_JOB_POSTING"; payload: JobPosting }
  | { type: "REMOVE_JOB_POSTING"; payload: number }
  | { type: "ADD_JOB_SUMMARY"; payload: { jobId: number; summary: JobSummary } }
  | {
      type: "REMOVE_JOB_SUMMARY";
      payload: { jobId: number; summaryId: number };
    }

interface StoreContextType {
  state: Store;
  dispatch: React.Dispatch<Action>;
  loadAllPostings: () => void;
  addJobToStore: (jobPosting: JobPosting) => void;
}

const StoreContext = createContext<StoreContextType>({
  state: init,
  dispatch: () => {},
  loadAllPostings: () => {},
  addJobToStore: () => {},
});

interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, init);
  const router = useRouter();

  const loadAllPostings = useCallback(async () => {
    try {
      const response = await fetch("/api/job_postings/all");
      if (!response.ok) {
        throw new Error("Failed to fetch job postings");
      }
      const jobPostings = await response.json();
      dispatch({ type: "LOAD_ALL_POSTINGS", payload: jobPostings });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const addJobToStore = useCallback(async (jobPosting: JobPosting) => {
    dispatch({
      type: "ADD_JOB_POSTING",
      payload: jobPosting,
    });
    router.push(`/jobs/${jobPosting.id}`);
  }, [router]);

  const value = useMemo(
    () => ({
      state,
      loadAllPostings,
      addJobToStore,
      dispatch,
    }),
    [state, loadAllPostings, dispatch, addJobToStore]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const STORE_CONTEXT = ({ children }: { children: React.ReactNode }) => {
  return <StoreProvider>{children}</StoreProvider>;
};

export const useStore = () => useContext(StoreContext);
