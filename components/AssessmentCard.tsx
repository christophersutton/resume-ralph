import React from 'react';
import Pill from './Pill';

interface AssessmentCardProps {
  assessment: Assessment;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment }) => {
  // Function to truncate the job description
  const truncate = (str: string | null, num: number) => {
    if (!str) return 'No description available.';
    return str.length > num ? str.slice(0, num) + "..." : str;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 text-black">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {assessment.companyName || 'Unknown Company'}
          </div>
          <a href={assessment.url ?? '#'} className="block mt-1 text-lg leading-tight font-medium hover:underline">
            {assessment.jobTitle ?? 'Unknown Job Title'}
          </a>
          <p className="mt-2">{truncate(assessment.jobDescription, 500)}</p>
          <div className="mt-4">
            <h4 className="font-bold">Grade:</h4>
            <p>{assessment.grade ?? 'Not graded'}</p>
          </div>
          <div className="mt-4">
            <h4 className="font-bold">Rater:</h4>
            <p>{assessment.rater ?? 'Anonymous'}</p>
          </div>
        <div className="flex mt-4">
            <div className="w-1/2">
                <div>
                    <h4 className="font-bold">Matching Tech:</h4>
                    <ul className="flex flex-wrap">
                        {assessment.matchingTech.map((tech, index) => (
                            <li key={index}><Pill text={tech} color="green"/></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="w-1/2">
                <div>
                    <h4 className="font-bold">Missing Tech:</h4>
                    <ul className="flex flex-wrap">
                        {assessment.missingTech.map((tech, index) => (
                            <li key={index}><Pill text={tech} color="red"/></li>
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
                            <li key={index}><Pill text={skill} color="green"/></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="w-1/2">
                <div>
                    <h4 className="font-bold">Missing Skills:</h4>
                    <ul className="flex flex-wrap">
                        {assessment.missingSkills.map((skill, index) => (
                            <li key={index}><Pill text={skill} color="red"/></li>
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
