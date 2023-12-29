import { useState } from "react";
import SelectButton from "./ui/SelectButton";
import { LLMProvider, MistralModel, OpenAIModel } from "@/lib/ai/types";
import { useStore } from "@/context/context";
import { Button } from "./ui/Button";
import { JobSummary } from "@/lib/types";

type Models = Record<LLMProvider, MistralModel[] | OpenAIModel[]>;

const models: Models = {
  openai: [
    // "gpt-3.5-turbo-0613", // current gpt-3.5-turbo, does not accept json mode
    "gpt-3.5-turbo-1106", // latest model, accepts json mode
    "gpt-4-1106-preview",
    "gpt-4-0613",
  ],
  mistral: ["mistral-tiny", "mistral-small", "mistral-medium"],
};

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
  const [model, setModel] = useState<MistralModel | OpenAIModel>(
    models[provider][0]
  );

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
          options={["openai", "mistral"] as LLMProvider[]}
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
            setModel(option as MistralModel);
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
