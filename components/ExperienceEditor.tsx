import { classNames } from "@/lib/utils/clientUtils";
import { useState } from "react";
import { Spinner } from "./ui/Spinner";
import { Button } from "./ui/Button";
import Markdown from "react-markdown";

interface SkillsEditorProps {
  jobId: number;
  editMode: boolean;
  experience: string;
  missingSkills: string[];
}

export default function ExperienceEditor({
  jobId,
  editMode,
  experience,
  missingSkills,
}: SkillsEditorProps) {
  const [editCandidates, setEditCandidates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function generateCandidates(
    experience: string,
    missingSkills: string[]
  ) {
    try {
      setLoading(true);
      const response = await fetch("/api/resume_edits/select_candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          experience,
          missingSkills,
          model: "gpt-4-1106-preview",
        }),
      });
      setLoading(false);
      const data = response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return error;
    }
  }

  return (
    <div
      className={classNames(
        editMode
          ? "my-2 p-8 -mx-6 prose-lg border-t-2 border-b-2 border-slate-300 drop-shadow-lg"
          : "my-12"
      )}
    >
      <div className="flex justify-between">
        <h2>Experience</h2>
        {editMode && (
          <Button
            onClick={() => generateCandidates(experience, missingSkills)}
            text={"Fill Out Skills"}
          ></Button>
        )}
      </div>
      <ul>
        <Markdown className="">
          {experience}
        </Markdown>
      </ul>
    </div>
  );
}
