import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Markdown from "react-markdown";
import { Disclosure } from "@headlessui/react";

import { useStore } from "@/context/context";
import { JobPosting } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import JobActionsButton from "@/components/JobActions";

const JobDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { state, dispatch } = useStore();
  const [job, setJob] = useState<JobPosting | null>(null);

  const createSummary = useCallback(
    async (jobId: number, jobDescription: string) => {
      try {
        const response = await fetch("/api/job_summaries/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId,
            jobDescription,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          dispatch({
            type: "ADD_JOB_SUMMARY",
            payload: { jobId: jobId, summary: result },
          });
        } else {
          console.error("Failed to post job summary");
        }
      } catch (error) {
        console.error("An error occurred while posting job summary:", error);
      }
    },
    [dispatch]
  );

  const deletePosting = useCallback(
    async (jobId: number) => {
      try {
        const response = await fetch(`/api/job_postings/${jobId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobId }),
        });
        if (response.ok) {
          dispatch({
            type: "REMOVE_JOB_POSTING",
            payload: jobId,
          });
          router.push("/");
        } else {
          console.error("Failed to delete job posting");
        }
      } catch (error) {
        console.error("An error occurred while deleting job posting:", error);
      }
    },
    [dispatch, router]
  );

  useEffect(() => {
    const idAsNumber = typeof id === "string" ? parseInt(id, 10) : null;
    const fetchedJob = state.jobPostings.find((job) => job.id === idAsNumber);
    if (fetchedJob) setJob(fetchedJob);
    if (fetchedJob && !fetchedJob.primarySummary) {
      createSummary(fetchedJob.id, fetchedJob.markdown);
    }
  }, [id, state.jobPostings, createSummary]);

  if (!job || !job.primarySummary) {
    return (
      <div role="status" className="max-w-2xl animate-pulse">
        <div className="h-12 bg-gray-200 rounded-sm dark:bg-gray-700 w-4/5 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
        <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>

        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h2 className="text-4xl font-bold mb-2 text-slate-200">
            <a href={job.url}>{job.primarySummary.jobTitle} </a>
          </h2>
          <p className=" mb-1">
            {job.primarySummary.companyName} - {job.primarySummary.location}
          </p>
          <p className="italic">
            {job.primarySummary.salaryInfo === "N/A"
              ? "No Salary Info Available"
              : job.primarySummary.salaryInfo}
          </p>
        </div>
        <div>
          <JobActionsButton
            jobId={job.id}
            actions={[
              {
                name: "Regenerate Summary",
                function: () => createSummary(job.id, job.markdown),
              },
              {
                name: "Delete Posting",
                function: () => deletePosting(job.id),
              },
            ]}
          />
        </div>
      </div>
      <div className="flex space-x-10">
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-slate-200">
            Key Technologies
          </h3>
          <ul className="list-disc list-inside">
            {job.primarySummary.keyTechnologies.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-slate-200">Key Skills</h3>
          <ul className="list-disc list-inside">
            {job.primarySummary.keySkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-slate-200">Culture</h3>
        <p>{job.primarySummary.culture}</p>
      </div>

      <Disclosure>
        <Disclosure.Button className="text-lg font-semibold mt-4 text-slate-200 hover:text-slate-400">
          See Full Job Description
        </Disclosure.Button>
        <Disclosure.Panel className="my-3 mr-2 p-4 bg-slate-300 text-slate-800 rounded-lg shadow-lg">
          <Markdown className="prose prose-slate">{job.markdown}</Markdown>
        </Disclosure.Panel>
      </Disclosure>
    </>
  );
};

export default JobDetails;
