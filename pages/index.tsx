import NewPostingForm from "@/components/Layout/NewPostingForm";

const HomePage = () => {
  
  return (
    <>
      <main className="flex-1">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-5xl font-bold text-slate-200">
              Welcome to Job Board
            </h1>
            <p className="text-xl text-slate-200">
              Create a new job posting to get started
            </p>
          </div>
        </div>
      </main>

      <aside className="sticky top-8 hidden w-96 shrink-0 xl:block">
        {/* Right column area */}
      </aside>
    </>
  );
};

export default HomePage;
