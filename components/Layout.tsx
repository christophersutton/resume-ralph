import { useStore } from "@/context/context";
import Link from "next/link";
import React, { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, dispatch, loadAllPostings } = useStore();

  useEffect(() => {
    loadAllPostings();
  }, []);
  return (
    <div className="bg-slate-900 text-slate-400 flex min-h-screen flex-col">
      <header className="shrink-0 border-b border-slate-700 bg-slate-950">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-x-8">
            <h1 className="font-semibold text-slate-300"><Link href="/">Resume Ralph</Link></h1>
          </div>
        </div>
      </header>
      <div className="flex w-full items-start gap-x-8 min-h-screen">
        <aside className="sticky h-screen bg-slate-950 overflow-scroll top-8 w-1/5 shrink-0 lg:block">
          <div className="flex grow flex-col overflow-y-auto">
            <ul
              role="list"
              className="divide-y divide-gray-100 overflow-hidden shadow-sm ring-1 ring-gray-900/5"
            >
              {state.jobPostings.length ? (
                state.jobPostings.map((jobPosting) => (
                  <li
                    key={jobPosting.id}
                    className="relative flex justify-between gap-x-6 h-16 hover:bg-gray-50 "
                  >
                    <Link href={`/jobs/${jobPosting.id}`} className="flex-grow min-h-fit p-4" >
                      {jobPosting.id}
                    </Link>
                  </li>
                ))
              ) : (
                <li key={"none"}>No job postings</li>
              )}
            </ul>
          </div>
        </aside>
        {children}
      </div>
    </div>
  );
};

export default Layout;
