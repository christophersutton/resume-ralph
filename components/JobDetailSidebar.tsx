import { Job } from "@/lib/types";
import TagList from "./ui/TagList";
import { useRouter, useSearchParams } from "next/navigation";
import { classNames } from "@/lib/utils/clientUtils";
import Link from "next/link";

export const JobDetails: React.FC<{
  job: Job;
  id: number | null;
}> = ({ job, id }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentEditor = searchParams.get("editor");

  return (
    <>
      <Link
        href={`/jobs/${id}`}
        className="text-xs font-semibold leading-6 text-slate-400 mb-4"
      >
        {"< "}Job Details
      </Link>

      {job.primarySummary ? (
        <>
          <div>
            <h2 className="text-slate-50 text-2xl truncate ...">
              {job.primarySummary.jobTitle}
            </h2>
            <div className="flex justify-between">
              <span className="font-thin">
                {job.primarySummary.companyName}
              </span>
              <span className="font-thin">{job.primarySummary.salaryInfo}</span>
            </div>
          </div>
          <div className="mt-8 flex gap-y-8 flex-col">
            <button
              className={classNames(
                currentEditor === "technologies"
                  ? "bg-slate-800 text-white "
                  : "",
                "text-left -mx-6 -my-4 py-4 px-4 hover:bg-slate-800"
              )}
              onClick={() => {
                router.push(`/resume/?jobId=${id}&editor=technologies`);
              }}
            >
              <TagList
                tags={job.primarySummary.technologies}
                label={"Technologies"}
                color={currentEditor === "technologies" ? "blue" : "gray"}
              />
            </button>
            <button
              className={classNames(
                currentEditor === "keyTechSkills"
                  ? "bg-slate-800 text-white "
                  : "",
                "text-left -mx-6 -my-4 py-4 px-4 hover:bg-slate-800"
              )}
              onClick={() => {
                router.push(`/resume/?jobId=${id}&editor=keyTechSkills`);
              }}
            >
              <TagList
                tags={job.primarySummary.keyTechSkills}
                label={"Tech Skills"}
                color={currentEditor === "keyTechSkills" ? "blue" : "gray"}
              />
            </button>
            <button
              className={classNames(
                currentEditor === "keySoftSkills"
                  ? "bg-slate-800 text-white "
                  : "",
                "text-left -mx-6 -my-4 py-4 px-4 hover:bg-slate-800"
              )}
              onClick={() => {
                router.push(`/resume/?jobId=${id}&editor=keySoftSkills`);
              }}
            >
              <TagList
                tags={job.primarySummary.keySoftSkills}
                label={"Soft Skills"}
                color={currentEditor === "keySoftSkills" ? "blue" : "gray"}
              />
            </button>
          </div>
        </>
      ) : (
        <div role="status" className="max-w-sm animate-pulse">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-24 mb-2.5"></div>
        </div>
      )}

      {/* <li className="mt-auto">
            <a
              href="#"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
              Settings
            </a>
          </li> */}
    </>
  );
};
export default JobDetails;
