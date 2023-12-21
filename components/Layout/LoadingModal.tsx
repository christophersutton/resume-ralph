import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Spinner } from "@/components/ui/Spinner";
import { classNames } from "@/lib/clientUtils";
import { Button } from "../ui/Button";
import Pill from "../ui/Pill";
interface LoadingScreenProps {
  loading: boolean;
  url: string;
  serverError: string | null;
}

const steps = [
  "Fetching",
  "Parsing website content",
  "Analyzing job posting",
  "Summarizing job posting",
];

const colorClasses = {
  active: "text-gray-800",
  incomplete: "text-gray-400",
  complete: "text-green-700",
};

const displayURL = (url: string) =>
  url.replace(/^https?:\/\//, "").split("?")[0];

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  loading,
  url,
  serverError,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(loading);
  const delay = !loading ? 200 : 2000; // Short delay if loaded, else longer delay

  useEffect(() => {
    // trigger the load once loading is true, but let the interval handle the rest
    if (loading) setIsOpen(loading);
  }, [loading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        const nextStep = (prevStep + 1) % steps.length;
        if (loading && prevStep === steps.length - 1) {
          return prevStep;
        }
        // If loaded and on the last step, clear the interval
        if (!loading && nextStep === 0) {
          clearInterval(interval);
          setIsOpen(false);
        } else if (!loading) {
          return prevStep; // Keep the currentStep on the last step until loading becomes false
        }
        return nextStep;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [loading, delay]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-200 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center">
                    <Dialog.Title
                      as="h3"
                      className={classNames(
                        serverError ? "text-red-700" : "text-slate-800",
                        "text-2xl font-semibold"
                      )}
                    >
                      {serverError
                        ? "There was a Problem Processing This Job"
                        : "Processing Your Job Posting"}
                    </Dialog.Title>
                    <div className="mt-6">
                      {serverError ? (
                        <p className="pb-6">
                          {serverError} <br />
                          <br />
                          <Button
                            text="Close"
                            onClick={() => setIsOpen(false)}
                          />
                        </p>
                      ) : (
                        <ul className="list-none">
                          {steps.map((step, index) => {
                            return (
                              <li
                                key={index}
                                className={`${
                                  colorClasses[
                                    currentStep > index
                                      ? "complete"
                                      : "incomplete"
                                  ]
                                } text-lg flex items-center space-x-2`}
                              >
                                <div className="w-7 h-8 flex justify-center place-items-center">
                                  {currentStep === index ? (
                                    <Spinner size="5"/>
                                  ) : (
                                    <CheckCircleIcon />
                                  )}
                                </div>
                                <div
                                  className={`${
                                    colorClasses[
                                      currentStep > index
                                        ? "complete"
                                        : currentStep === index
                                        ? "active"
                                        : "incomplete"
                                    ]
                                  } text-lg flex-grow text-left`}
                                >
                                  {step === "Fetching" ? (
                                    <span className="">
                                      Fetching:
                                      <Pill
                                        text={displayURL(url)}
                                        color={currentStep > index ? "green" : "gray"}
                                        colorMode="light"
                                      />
                                    </span>
                                  ) : (
                                    `${step}`
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default LoadingScreen;
