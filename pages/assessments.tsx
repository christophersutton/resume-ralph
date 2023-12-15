import { useState, useEffect } from "react";

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);

  useEffect(() => {
    fetch("/api/assessments/all")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAssessments(data);
      })
      .catch((error) => console.error("Error fetching assessments:", error));
  }, []);

  const handleDelete = (id: number) => {
    fetch(`/api/assessments/${id}`, { method: "DELETE" })
      .then(() => {
        setAssessments(
          (prevAssessments) =>
            prevAssessments &&
            prevAssessments.filter((assessment) => assessment.id !== id)
        );
      })
      .catch((error) => console.error("Error deleting assessment:", error));
  };

  return (
    <div>
      <h1>Assessments</h1>
      <table className="w-screen">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company</th>
            <th>URL</th>
            <th>Job Title</th>
            <th>Grade</th>
            <th>Rater</th>
            <th>Tech</th>
            <th>Skills</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assessments &&
            assessments.map((assessment) => (
              <tr key={assessment.id}>
                <td>{assessment.id}</td>
                <td>{assessment.companyName}</td>
                <td>{assessment.url}</td>
                <td>{assessment.jobTitle}</td>
                <td>{assessment.grade}</td>
                <td>{assessment.rater}</td>
                <td>
                  Matching:{" "}
                  {assessment.matchingTech && assessment.matchingTech.join(", ")}
                  <br />
                  Missing:{" "}
                  {assessment.missingTech && assessment.missingTech}
                </td>
                <td>
                  Matching:{" "}
                  {assessment.matchingSkills && assessment.matchingSkills}
                  <br />
                  Missing:{" "}
                  {assessment.missingSkills && assessment.missingSkills}
                </td>
                <td>
                  <button onClick={() => handleDelete(assessment.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentsPage;
