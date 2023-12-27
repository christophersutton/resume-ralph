import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

import Pill from "./ui/Pill";
import { Assessment } from "@/lib/types";

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
    <div className="max-w-md mx-auto bg-slate-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl my-4 ">
      <div className="md:flex">
        <div className="p-8 w-full">
          <div className="flex justify-between">
            <div className="flex flex-col items-end">
              <span className="text-6xl font-bold text-slate-100">
                {assessment.grade ?? "N/A"}
              </span>
              
            </div>
          </div>
          <div className="flex mt-4">
            <div className="w-1/2">
              <div>
                <h4 className="font-bold">Matching Tech:</h4>
                <ul className="flex flex-wrap">
                  {assessment.matchingTech.map((tech, index) => (
                    <li key={index}>
                      <Pill text={tech} color="green" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-1/2">
              <div>
                <h4 className="font-bold">Missing Tech:</h4>
                <ul className="flex flex-wrap">
                  {assessment.missingTech.map((tech, index) => (
                    <li key={index}>
                      <Pill text={tech} color="red" />
                    </li>
                  ))}
                </ul>
              </div>
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
      <div className="border-t border-gray-300 py-4 px-8 flex justify-end">
        
      </div>
    </div>
  );
};

export default AssessmentCard;
