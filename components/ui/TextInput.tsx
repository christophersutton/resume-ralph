import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { on } from "events";

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const colors = {
  false:
    "border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500",
  true: "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500",
};

export const TextInput = ({
  label,
  name,
  type = "text",
  placeholder = "",
  error,
  onChange,
  value,
  onBlur,
}: TextInputProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={name}
          className={`${
            colors[(error?.trim().length ?? 0) > 0 ? "true" : "false"]
          }pr-10 appearance-none rounded-md relative block w-full px-3 py-2 border-2  placeholder-gray-500  focus:outline-none  focus:z-10 sm:text-sm`}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${name}-error`}
          onChange={onChange}
          value={value}
          onBlur={onBlur}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};
