import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React from "react";

interface SelectButtonProps {
  options: string[];
  label: string;
  id: string;
  name: string;
  selectedValue: string;
  onChange: (value: any) => void;
}

const SelectButton: React.FC<SelectButtonProps> = ({
  options,
  label,
  id,
  name,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="my-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-slate-400 mt-4"
      >
        {label}
      </label>
      <div className="relative flex">
        <select
          id={id}
          name={name}
          className="mt-1 bg-slate-500 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-slate-900 ring-2 ring-inset ring-slate-400 focus:ring-2 focus:ring-teal-600 sm:text-sm sm:leading-6"
          value={selectedValue}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-1 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-slate-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectButton;
