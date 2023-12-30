import React from "react";
import { useStore } from "@/context/context";
import TagList from "./ui/TagList";

interface AssessmentListProps {
  jobId: number;
}

const ListItem = ({ label, values }: { label: string; values: string[] }) => (
  <li>
    <span className="font-medium">{label}: </span>
    <span className="text-xs">{values.join(", ")}</span>
  </li>
);

const AssessmentList: React.FC<AssessmentListProps> = ({ jobId }) => {
  const { state } = useStore();
  const jobAssessments = state.jobs.find(
    (job) => job.id === jobId
  )?.assessments;

  if (!jobAssessments) {
    return "loading...";
  }
  return (
    <ul className="">
      {jobAssessments &&
        jobAssessments.map((assessment) => (
          <li key={assessment.id} className="py-2 flex">
            <span className="text-4xl">{assessment.grade}</span>
            <div>
              <ul>
                {}
              {/* <ListItem label="Matching Tech" values={assessment.matchingTech} />
                <ListItem label="Missing Tech" values={assessment.missingTech} />
                <ListItem label="Matching Skills" values={assessment.matchingSkills} />
                <ListItem label="Missing Skills" values={assessment.missingSkills} />
                 */}
              </ul>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default AssessmentList;
