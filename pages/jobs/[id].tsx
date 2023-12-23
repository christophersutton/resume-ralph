import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Markdown from "react-markdown";
import { Disclosure } from "@headlessui/react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

import { useStore } from "@/context/context";
import { Job } from "@/lib/types";
import JobActionsButton from "@/components/JobActions";
import JobSkeleton from "@/components/JobSkeleton";

const JobDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { state, dispatch } = useStore();
  const [job, setJob] = useState<Job | null>(null);
  const lastSummaryIdRef = useRef<number | null>(null);
  const [initialSummaryCreated, setInitialSummaryCreated] = useState(false);

  const createSummary = useCallback(
    async (jobId: number, jobDescription: string) => {
      try {
        const response = await fetch("/api/job_summaries/new", {
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
            payload: {
              jobId: jobId,
              summary: result,
              isPrimary: result.isPrimary,
            },
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
    const fetchedJob = state.jobs.find((job) => job.id === idAsNumber);
    if (fetchedJob) setJob(fetchedJob);
    if (
      fetchedJob &&
      !fetchedJob.primarySummary &&
      lastSummaryIdRef.current !== idAsNumber
    ) {
      createSummary(fetchedJob.id, fetchedJob.markdown);
      lastSummaryIdRef.current = idAsNumber;
    }
  }, [id, state.jobs, initialSummaryCreated, createSummary]);

  if (!job) {
    <JobSkeleton />;
  } else if (!job.primarySummary) {
    <>
    <h1>Summarizing Job Description</h1>
    </>
  } else
    return (
      <>
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 text-slate-200">
              <a
                className="flex space-x-2 items-center group hover:text-slate-400 mr-4"
                href={job.url}
                target="_blank"
              >
                <span className="">{job.primarySummary.jobTitle}</span>
                <ArrowTopRightOnSquareIcon className="invisible group-hover:visible h-6 lg:h-7 xl:h-8" />
              </a>
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
