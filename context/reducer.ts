import { Action, Store } from "./context";

export const reducer = (state: Store, action: Action): Store => {
  switch (action.type) {
    case "LOAD_ALL_JOBS":
      return {
        ...state,
        jobs: action.payload,
      };
    case "ADD_JOB_POSTING":
      return {
        ...state,
        jobs: [
          ...state.jobs,
          {
            ...action.payload,
            summaries: [],
            primarySummary: null,
            assessments: [],
            primaryAssessment: null,
          },
        ],
      };
    case "REMOVE_JOB_POSTING":
      return {
        ...state,
        jobs: state.jobs.filter(
          (jobPosting) => jobPosting.id !== action.payload
        ),
      };
    case "ADD_JOB_SUMMARY":
      return {
        ...state,
        jobs: state.jobs.map((jobPosting) => {
          if (jobPosting.id === action.payload.jobId) {
            return {
              ...jobPosting,
              summaries: [
                ...(jobPosting.summaries || []),
                action.payload.summary,
              ],
              primarySummary: action.payload.isPrimary
                ? action.payload.summary
                : jobPosting.primarySummary,
            };
          }
          return jobPosting;
        }),
      };
    case "REMOVE_JOB_SUMMARY":
      return {
        ...state,
        jobs: state.jobs.map((jobPosting) => {
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
