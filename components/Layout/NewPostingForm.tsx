import React, { useState } from "react";

import { classNames, isValidUrl } from "@/lib/clientUtils";
import { useStore } from "@/context/context";
import LoadingScreen from "./LoadingModal";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

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
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const reset = () => {
    setUrl("");
    setValidationError(null);
    setServerError("");
    setLoading(false);
  };
  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.trim();
    if (input)
      isValidUrl(input)
        ? setValidationError(null)
        : setValidationError("Invalid URL");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value.trim());
    if (validationError) {
      isValidUrl(event.target.value.trim())
        ? setValidationError(null)
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
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      addJobToStore(data);
      reset();
    } catch (error: any) {
      console.log("server error: ", error);
      setServerError(error.message || "An error occurred");

    }
  };

  return (
    <>
      <LoadingScreen loading={loading} url={url} serverError={serverError} />
      <form
        className={classNames(
          "relative flex flex-1 ml-10 md:ml-6 lg:ml-8 -pr-16   ",
          validationError ? "border-b-4 -mb-1 border-red-700" : ""
        )}
        onSubmit={handleSubmit}
      >
        <label htmlFor="url" className="sr-only">
          Job Posting URL
        </label>
        <PlusCircleIcon
          className={classNames(
            validationError ? "text-red-300" : "text-slate-400",
            "pointer-events-none absolute inset-y-0 -left-4 md:left-0 h-full w-5"
          )}
          aria-hidden="true"
        />
        <input
          id="url"
          className={classNames(
            validationError ? "text-red-300" : "text-slate-400",
            "bg-slate-900 block h-full w-full border-0 -ml-10 md:-ml-8 py-0 pl-14 md:pl-16 pr-0 -mr-12 placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:bg-slate-700 "
          )}
          placeholder="Submit new job posting URL"
          type="url"
          name="url"
          value={url}
          onBlur={(event) => handleBlur(event)}
          onChange={(event) => handleChange(event)}
        />
      </form>
    </>
  );
};

export default NewPostingForm;