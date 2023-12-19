import { Action, Store } from "./context";

export const reducer = (state: Store, action: Action): Store => {
  switch (action.type) {
    case "LOAD_ALL_POSTINGS":
      return {
        ...state,
        jobPostings: action.payload,
      };
    case "ADD_JOB_POSTING":
      return {
        ...state,
        jobPostings: [...state.jobPostings, action.payload],
      };
    case "REMOVE_JOB_POSTING":
      return {
        ...state,
        jobPostings: state.jobPostings.filter(
          (jobPosting) => jobPosting.id !== action.payload
        ),
      };
    case "ADD_JOB_SUMMARY":
      return {
        ...state,
        jobPostings: state.jobPostings.map((jobPosting) => {
          if (jobPosting.id === action.payload.jobId) {
            return {
              ...jobPosting,
              summaries: [
                ...(jobPosting.summaries || []),
                action.payload.summary,
              ],
              primarySummary: action.payload.summary,
            };
          }
          return jobPosting;
        }),
      };
    case "REMOVE_JOB_SUMMARY":
      return {
        ...state,
        jobPostings: state.jobPostings.map((jobPosting) => {
          if (jobPosting.id === action.payload.jobId) {
            return {
              ...jobPosting,
              summaries: jobPosting.summaries?.filter(
                (summary) => summary.id !== action.payload.summaryId
              ),
            };
          }
          return jobPosting;
        }),
      };
    default:
      return state;
  }
};
