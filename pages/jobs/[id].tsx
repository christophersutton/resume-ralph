import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Markdown from "react-markdown";
import { Disclosure } from "@headlessui/react";

import { useStore } from "@/context/context";
import { JobPosting } from "@/lib/types";
import { Button } from "@/components/Button";

const JobDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { state, dispatch } = useStore();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  useEffect(() => {
    const idAsNumber = typeof id === "string" ? parseInt(id, 10) : null;
    const fetchedJob = state.jobPostings.find((job) => job.id === idAsNumber);
    if (fetchedJob) setJob(fetchedJob);
  }, [id, state.jobPostings, needsRefresh]);

  const createSummary = async (jobId: number, jobDescription: string) => {
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
        setNeedsRefresh(true);
      } else {
        console.error("Failed to post job summary");
      }
    } catch (error) {
      console.error("An error occurred while posting job summary:", error);
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <h1 className="">{job.id}</h1>
      <Button
        text="Create Summary"
        onClick={() => createSummary(job.id, job.markdown)}
      />
      {job.primarySummary && (
        <>
          <h2 className="text-4xl font-bold mb-2 text-slate-200">
            {job.primarySummary.jobTitle}
          </h2>
          <p className=" mb-1">
            {job.primarySummary.companyName} - {job.primarySummary.location}
          </p>
          <p className="italic">{job.primarySummary.salaryInfo}</p>
          <div className="flex space-x-10">
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-slate-200">Key Technologies</h3>
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
        </>
      )}

      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="text-lg font-semibold mt-4 text-slate-200 hover:text-slate-400">
              See Full Job Description
            </Disclosure.Button>
            <Disclosure.Panel className="my-3 mr-2 p-4 bg-slate-300 text-slate-800 rounded-lg shadow-lg">
              <Markdown className="prose prose-slate">
                {job.markdown}
              </Markdown>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default JobDetails;
