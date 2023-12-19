import Link from "next/link";

interface LinkButtonProps {
  href: string;
  text: string;
}

const LinkButton = ({ href, text }: LinkButtonProps) => {
  return (
    <Link
      className="rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      href={href}
    >
      {text}
    </Link>
  );
};
export default LinkButton;
