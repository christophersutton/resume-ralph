import { Assessment } from "@/lib/types";
import React, { useEffect, useState } from "react";

const AssessmentPage = () => {
  const [url, setUrl] = useState<string>("");
  const [jobDescription, setjobDescription] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [showInput, setShowInput] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetch("/api/assessments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobDescription,
        url: url,
        companyName,
        jobTitle,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setError(null);
        setAssessment(data);
        setShowInput(false);
      })
      .catch((error) => {
        console.error("Error posting data:", error);
        setError("Error posting data");
        setAssessment(null);
      });
  };

  const testDB = async () => {
    fetch("/api/assessments/all")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  };

  const resetForm = () => {
    setUrl("");
    setCompanyName("");
    setJobTitle("");
    setjobDescription("");
    setAssessment(null);
    setShowInput(true);
  };

  return (
    <div className="md:flex md:space-x-4">
      <button className="text-2xl p-4 bg-teal-300" onClick={testDB}>
        Test DB
      </button>
      <div className="md:w-1/2 p-4">
        {showInput ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="url">URL:</label>
            <input
              id="url"
              className="text-black w-full p-2 border border-gray-300"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <label htmlFor="jobTitle">Job Title:</label>
            <input
              id="jobTitle"
              className="text-black w-full p-2 border border-gray-300"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            <label htmlFor="companyName">Company Name:</label>
            <input
              id="companyName"
              className="text-black w-full p-2 border border-gray-300"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <label htmlFor="jobDescription">Job Description:</label>
            <textarea
              id="jobDescription"
              className="text-black w-full h-64 p-2 border border-gray-300"
              value={jobDescription}
              onChange={(e) => setjobDescription(e.target.value)}
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        ) : (
          <div>
            <p className="whitespace-pre-wrap">{url}</p>
            <button
              onClick={resetForm}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reset
            </button>
          </div>
        )}
      </div>
      <div className="md:w-1/2 p-4">
        {assessment && (
          <>
            <div className="mb-4">
              <p className="text-2xl">
                Grade: <strong>{assessment.grade}</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="border-l-4 border-green-500 pl-2 mb-4">
                  <strong>Matching Technologies:</strong>{" "}
                  {assessment.matchingTech &&
                    assessment.matchingTech.join(", ")}
                </p>
                <p className="border-l-4 border-green-500 pl-2">
                  <strong>Matching Skills:</strong>{" "}
                  {assessment.matchingSkills &&
                    assessment.matchingSkills.join(", ")}
                </p>
              </div>

              <div>
                <p className="border-l-4 border-red-500 pl-2 mb-4">
                  <strong>Missing Technologies:</strong>{" "}
                  {assessment.missingTech && assessment.missingTech.join(", ")}
                </p>
                <p className="border-l-4 border-red-500 pl-2">
                  <strong>Missing Skills:</strong>{" "}
                  {assessment.missingSkills &&
                    assessment.missingSkills.join(", ")}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;
