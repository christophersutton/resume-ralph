import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useStore } from "@/context/context";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import { classNames } from "@/lib/utils/clientUtils";

const Sidebar = () => {
  const { state, loadAllJobs } = useStore();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    loadAllJobs();
  }, []);

  if (!state.jobs) return <div>loading...</div>;
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center bg-slate-800 -mx-6 px-6 border-b">
        <h1 className="text-slate-100">RESUME RALPH</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <div className="text-xs font-semibold leading-6 text-slate-400">
          Your Job Postings
        </div>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {state.jobs.length ? (
                state.jobs.map((job) => {
                  return (
                    <li key={job.id}>
                      <Link
                        href={`/jobs/${job.id}`}
                        className={classNames(
                          typeof id === "string" &&
                            parseInt(id ?? "0") === job.id
                            ? "bg-slate-800 text-white"
                            : "text-slate-400 hover:text-white hover:bg-slate-800",
                          "group flex flex-col gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        {job.primarySummary ? (
                          <>
                            <span className="truncate ...">{job.primarySummary.jobTitle}</span>
                            <span className="font-thin">
                              {job.primarySummary.companyName}
                            </span>
                          </>
                        ) : (
                          <div role="status" className="max-w-sm animate-pulse">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-24 mb-2.5"></div>
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })
              ) : (
                <li key={"none"}>No job postings</li>
              )}
            </ul>
          </li>
          <li className="mt-auto">
            <a
              href="#"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
