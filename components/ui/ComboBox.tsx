import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox as Cbox } from "@headlessui/react";
import { classNames } from "@/lib/utils/clientUtils";

interface Option {
  id: string | number;
  label: string;
}
interface ComboboxProps {
  options: string[];
  label: string;
  onChange: (value: string) => void;
  initialSelectedValue?: string;
}

export default function Combobox({
  options,
  label,
  onChange,
  initialSelectedValue,
}: ComboboxProps) {
  options = options || [];

  const [query, setQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState(
    initialSelectedValue || ""
  );

  const handleOnChange = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };

  const filteredValues =
    query === ""
      ? options
      : options.filter((val) => {
          return val.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Cbox as="div" value={selectedValue} onChange={handleOnChange}>
      <Cbox.Label className="block text-sm font-medium leading-6 mt-4">
        {label}
      </Cbox.Label>
      <div className="relative mt-1">
        <Cbox.Input
          className="w-full bg-slate-500 rounded-md border-0 text-slate-900 py-1.5 pl-3 pr-10  shadow-sm ring-2 ring-inset ring-slate-400 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(item: string) => item}
        />
        <Cbox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-slate-800"
            aria-hidden="true"
          />
        </Cbox.Button>

        {filteredValues.length > 0 && (
          <Cbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-200 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredValues.map((item) => (
              <Cbox.Option
                key={item}
                value={item}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-8 pr-4",
                    active ? "bg-slate-600 text-white" : "text-slate-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected ? "font-semibold" : ""
                      )}
                    >
                      {item}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 left-0 flex items-center pl-1.5",
                          active ? "text-white" : "text-slate-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Cbox.Option>
            ))}
          </Cbox.Options>
        )}
      </div>
    </Cbox>
  );
}
