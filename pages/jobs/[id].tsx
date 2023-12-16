import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useRouter } from "next/router";
import Markdown from "react-markdown";

import { useStore } from "@/lib/context";
import { JobPosting } from "@/lib/types";

// const MarkdownContent = ({ markdown }: { markdown: string }) => {
//   return root.render(<Markdown>{markdown}</Markdown>);
// };

const JobDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { state } = useStore();
  const [job, setJob] = useState<JobPosting | null>(null);

  useEffect(() => {
    const idAsNumber = typeof id === "string" ? parseInt(id, 10) : null;
    const fetchedJob = state.jobPostings.find((job) => job.id === idAsNumber);
    if (fetchedJob) setJob(fetchedJob);
  }, [id, state.jobPostings]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="prose prose-slate prose-invert ">
      <h1 className="">{job.id}</h1>
      <Markdown>{job.markdown}</Markdown>
    </div>
  );
};

export default JobDetails;
