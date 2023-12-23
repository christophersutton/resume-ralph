const JobSkeleton = () => {
  return (
    <div role="status" className="max-w-2xl animate-pulse">
      <div className="h-12 bg-gray-200 rounded-sm dark:bg-gray-700 w-4/5 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
export default JobSkeleton;