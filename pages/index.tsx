import NewPostingForm from "@/components/Layout/NewPostingForm";

const HomePage = () => {
  
  return (
    <>
      <main className="flex-1">
        <NewPostingForm />
      </main>

      <aside className="sticky top-8 hidden w-96 shrink-0 xl:block">
        {/* Right column area */}
      </aside>
    </>
  );
};

export default HomePage;
