import React from "react";

export interface PillProps {
  colorMode?: "light" | "dark";
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
  dark: {
    blue: "bg-blue-400/10 hover:bg-blue-100 text-blue-400 ring-blue-400/20",
    red: "bg-red-400/10 hover:bg-red-100 text-red-400 ring-red-400/20",
    green: "bg-green-400/10 hover:bg-green-100 text-green-400 ring-green-400/20",
    yellow: "bg-yellow-400/10 hover:bg-yellow-100 text-yellow-400 ring-yellow-400/20",
    indigo: "bg-indigo-400/10 hover:bg-indigo-100 text-indigo-400 ring-indigo-400/20",
    purple: "bg-purple-400/10 hover:bg-purple-100 text-purple-400 ring-purple-400/20",
    pink: "bg-pink-400/10 hover:bg-pink-100 text-pink-400 ring-pink-400/20",
    gray: "bg-gray-400/10 hover:bg-gray-100 text-gray-400 ring-gray-400/20",
  },
  light: {
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-700 ring-blue-700/20",
    red: "bg-red-50 hover:bg-red-100 text-red-700 ring-red-700/20",
    green: "bg-green-50 hover:bg-green-100 text-green-700 ring-green-700/20",
    yellow: "bg-yellow-50 hover:bg-yellow-100 text-yellow-800 ring-yellow-800/20",
    indigo: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 ring-indigo-700/20",
    purple: "bg-purple-50 hover:bg-purple-100 text-purple-700 ring-purple-700/20",
    pink: "bg-pink-50 hover:bg-pink-100 text-pink-700 ring-pink-700/20",
    gray: "bg-gray-50 hover:bg-gray-100 text-gray-600 ring-gray-600/20",
  },
};

export const Pill: React.FC<PillProps> = ({ colorMode = "dark", text, color }) => {
  return (
    <span
      className={`${colorVariants[colorMode][color]} inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 m-0.5`}
    >
      {text}
    </span>
  );
};

export default Pill;
