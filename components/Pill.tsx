import React from "react";

interface PillProps {
  text: string;
  color:
    | "red"
    | "green"
    | "blue"
    | "yellow"
    | "indigo"
    | "purple"
    | "pink"
    | "gray";
}

const colorVariants = {
  blue: "bg-blue-50 hover:bg-blue-100 text-blue-700",
  red: "bg-red-50 hover:bg-red-100 text-red-700",
  green: "bg-green-50 hover:bg-green-100 text-green-700",
  yellow: "bg-yellow-50 hover:bg-yellow-100 text-yellow-800",
  indigo: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700",
  purple: "bg-purple-50 hover:bg-purple-100 text-purple-700",
  pink: "bg-pink-50 hover:bg-pink-100 text-pink-700",
  gray: "bg-gray-50 hover:bg-gray-100 text-gray-600",
};

const Pill: React.FC<PillProps> = ({ text, color }) => {
  return (
    <span
      className={`${colorVariants[color]} inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 m-0.5`}
    >
      {text}
    </span>
  );
};

export default Pill;
