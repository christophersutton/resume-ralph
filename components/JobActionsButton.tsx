import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "@/lib/utils/clientUtils";

interface JobAction {
  name: string;
  function: () => void;
}

interface JobActionsButtonProps {
  jobId: number;
  actions: JobAction[];
}
export default function JobActionsButton({ jobId, actions }: JobActionsButtonProps) {
  return (
    <div className="inline-flex rounded-md shadow-sm">
      <Menu as="div" className="relative block">
        <Menu.Button className="relative inline-flex items-center rounded-md shadow-md shadow-slate-800 to-slate-900 from-slate-950 bg-gradient-to-b px-3 py-2 lg:px-5 lg:py-3 text-slate-400 ring-1 ring-inset ring-slate-900 hover:to-slate-950 focus:z-10">
          Options
          <ChevronDownIcon className="h-5 w-5 ml-2" aria-hidden="true" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {actions.map((action) => (
                <Menu.Item key={action.name}>
                  {({ active }) => (
                    <button
                      onClick={action.function}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      {action.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
