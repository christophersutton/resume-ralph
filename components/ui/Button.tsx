interface ButtonProps {
  text: string;
  onClick: () => void;
}

export const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      className="mr-2 rounded-md bg-slate-500 px-4 py-2.5  text-md font-medium ring-2 ring-inset ring-slate-400 leading-6 text-slate-900 shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
