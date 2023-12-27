import AssessmentCard from "@/components/AssessmentCard";
import { useState, useEffect } from "react";

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);

  useEffect(() => {
    fetch("/api/assessments/all")
      .then((response) => response.json())
      .then((data) => {
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
      <h1 className="text-4xl">Assessments</h1>
      {assessments
        ? assessments.map((assessment) => AssessmentCard({ assessment, handleDelete }))
        : null}
    </div>
  );
};

export default AssessmentsPage;
