import React, { useState } from "react";
import { TextInput } from "./TextInput";
import { isValidUrl } from "@/lib/clientUtils";
import { useStore } from "@/lib/context";
import LoadingScreen from "./LoadingModal";

interface JobPostingResponse {
  id: number;
  url: string;
  html: string;
  markdown: string;
}

const NewPostingForm: React.FC = () => {
  const { addJobToStore } = useStore();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    isValidUrl(event.target.value.trim())
      ? setValidationError("")
      : setValidationError("Invalid URL");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value.trim());
    if (validationError) {
      isValidUrl(event.target.value.trim())
        ? setValidationError("")
        : setValidationError("Invalid URL");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValidUrl(url)) {
      setValidationError("Invalid URL");
      return;
    }

    setLoading(true);
    setServerError("");
    try {
      const response = await fetch("/api/job_postings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      addJobToStore(data);
      setLoading(false);
    } catch (error: any) {
      console.log("server error: ", error);
      setServerError(error.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingScreen loading={loading} url={url} />
      <div className="mx-auto flex justify-center items-center">
      
        <form className="w-full" onSubmit={handleSubmit}>
          <TextInput
            label="Job Posting URL"
            name="url"
            value={url}
            type="url"
            onChange={(e) => handleChange(e)}
            onBlur={(e) => handleBlur(e)}
            error={validationError}
          />
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            Submit
          </button>
          {serverError && (
            <p className="text-red-500 text-lg my-4">{serverError}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default NewPostingForm;
