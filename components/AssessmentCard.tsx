import React from "react";
import Pill from "./ui/Pill";
import { Assessment } from "@/lib/types";
import TagList from "./ui/TagList";

interface AssessmentCardProps {
  assessment: Assessment;
  handleDelete: (id: number) => void;
}

function truncateText(str: string | null, num: number = 100) {
  if (!str) return "No description available.";
  return str.length > num ? str.slice(0, num) + "..." : str;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  handleDelete,
}) => {
  return (
    <div className=" my-4 ">
      <div className="md:flex">
        <div className="w-full">
          <div className="flex justify-between">
            <div className="flex flex-col items-end">
              <span className="text-6xl font-bold text-slate-100">
                {assessment.grade ?? "N/A"}
              </span>
            </div>
          </div>
          <div className="flex mt-4">
            <div className="w-1/2">
              <TagList label="Matching Tech" tags={assessment.matchingTech} />
            </div>
            <div className="w-1/2">
              <TagList label="Missing Tech" tags={assessment.missingTech} color="red" />
            </div>
          </div>
          <div className="flex mt-4">
            <div className="w-1/2">
              <div>
                <h4 className="font-bold">Matching Skills:</h4>
                <ul className="flex flex-wrap">
                  {assessment.matchingSkills.map((skill, index) => (
                    <li key={index}>
                      <Pill text={skill} color="green" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-1/2">
              <div>
                <h4 className="font-bold">Missing Skills:</h4>
                <ul className="flex flex-wrap">
                  {assessment.missingSkills.map((skill, index) => (
                    <li key={index}>
                      <Pill text={skill} color="red" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCard;
