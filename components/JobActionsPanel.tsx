import { useState } from "react";
import { JobSummary } from "@/lib/types";
import { LLMModel, LLMProvider, models } from "@/lib/ai/types";
import { useStore } from "@/context/context";
import { Button } from "./ui/Button";
import SelectButton from "./ui/SelectButton";



interface JobActionsPanelProps {
  jobId: number;
  jobDescription: string;
  jobSummary: JobSummary;
}

const JobActionsPanel: React.FC<JobActionsPanelProps> = ({
  jobId,
  jobDescription,
  jobSummary,
}) => {
  const { createAssessment, createSummary } = useStore();
  const [provider, setProvider] = useState<LLMProvider>("openai");
  const [model, setModel] = useState<LLMModel>(models[provider][0]);

  const handleSummaryCreation = async () => {
    const response = await createSummary({
      jobId,
      jobDescription,
      provider,
      model,
    });

    if (response.success) {
      alert("Summary created!");
    } else {
      alert("Summary creation failed!");
    }
  };
  const handleAssessmentCreation = async () => {
    const response = await createAssessment({
      jobId,
      jobDescription,
      provider,
      model,
    });

    if (response.success) {
      alert("Summary created!");
    } else {
      alert("Summary creation failed!");
    }
  };
  const handleAssessmentFromSummaryCreation = async () => {
    const response = await createAssessment({
      jobId,
      jobSummary,
      provider,
      model,
    });

    if (response.success) {
      alert("Summary created!");
    } else {
      alert("Summary creation failed!");
    }
  };

  const handleProviderChange = (value: LLMProvider) => {
    setProvider(value);
    setModel(models[value][0]);
  };
  return (
    <div className="place-content-end">
      <h2>Select Options</h2>

      <div className="flex space-x-4">
        <SelectButton
          options={["openai", "mistral", "ollama"] as LLMProvider[]}
          label={"Provider"}
          id={"provider"}
          name={"provider"}
          selectedValue={provider}
          onChange={handleProviderChange}
        />

        <SelectButton
          options={[...models[provider]]}
          label={"Model"}
          id={"model"}
          name={"model"}
          selectedValue={model}
          onChange={(option) => {
            setModel(option as LLMModel);
          }}
        />
      </div>

      <Button text={"Create Summary"} onClick={handleSummaryCreation} />
      <Button text={"Create Assessment"} onClick={handleAssessmentCreation} />
      <Button
        text={"Create Assessment from Summary"}
        onClick={handleAssessmentFromSummaryCreation}
      />
    </div>
  );
};

export default JobActionsPanel;
