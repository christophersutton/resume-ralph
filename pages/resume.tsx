import { useEffect, useState } from "react";
import type { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Markdown from "react-markdown";

import { useStore } from "@/context/context";
import { Job } from "@/lib/types";
import JobSkeleton from "@/components/JobSkeleton";

import { loadFile } from "@/lib/utils/serverUtils";
import { CURRENT_RESUME_FILENAME } from "@/lib/constants";
import SkillsEditor from "@/components/SkillsEditor";
import { useSearchParams } from "next/navigation";
import { classNames } from "@/lib/utils/clientUtils";

export const getStaticProps = () => {
  const resume = loadFile(CURRENT_RESUME_FILENAME);
  return { props: { resume } };
};

export default function ResumeEditor({
  resume,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentEditor = searchParams.get("editor");
  const { jobId } = router.query;
  const { state } = useStore();
  const [job, setJob] = useState<Job | null>(null);

  // parse resume into sections
  const resumeIntro = resume.split("## Skills")[0];
  const resumeWorkHistory = resume.split("## Experience")[1];

  useEffect(() => {
    const idAsNumber = typeof jobId === "string" ? parseInt(jobId, 10) : null;
    const fetchedJob = state.jobs.find((job) => job.id === idAsNumber);
    if (fetchedJob) setJob(fetchedJob);
  }, [jobId, state.jobs]);

  if (!job) {
    <JobSkeleton />;
  } else if (!job.primarySummary) {
    <>
      <h1>Summarizing Job Description</h1>
    </>;
  } else
    return (
      <div className="bg-slate-50 p-6 rounded-sm max-w-2xl">
        <div className="prose prose-md prose-slate prose-h2:mt-2 prose-h1:mb-0 prose-h2:mb-1 prose-p:text-sm prose-li:text-sm prose-ul:my-0 prose-li:leading-4">
          <Markdown
            className={classNames(
              currentEditor == "" ? "" : " ",
              "prose-p:font-light"
            )}
          >
            {resumeIntro}
          </Markdown>
          <SkillsEditor
            jobId={job.id}
            editMode={currentEditor === "technologies"}
            technologies={job.primarySummary.technologies}
            keyTechSkills={job.primarySummary.keyTechSkills}
          />
          <Markdown className="">
            {["## Experience", resumeWorkHistory].join("\n")}
          </Markdown>
        </div>
      </div>
    );
}
