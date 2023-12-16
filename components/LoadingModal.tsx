import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

interface LoadingScreenProps {
  loading: boolean;
  url: string;
}

const steps = [
  "Fetching",
  "Parsing website content",
  "Analyzing job posting",
  "Summarizing job description",
];

const spinner = () => (
  <svg
    className="animate-spin h-8 w-8 text-gray-800"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const colorClasses = {
  active: "text-gray-800",
  incomplete: "text-gray-400",
  complete: "text-green-700",
};

const stripHttps = (url: string) => url.replace(/^https?:\/\//, "");

const LoadingScreen: React.FC<LoadingScreenProps> = ({ loading, url }) => {
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-light text-gray-900"
                    >
                      Processing Your Job Posting
                    </Dialog.Title>
                    <div className="mt-8">
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
                              <div className="w-12 h-12 flex justify-center place-items-center">
                                {currentStep === index ? (
                                  spinner()
                                ) : (
                                  <CheckCircleIcon
                                    className={`${
                                      colorClasses[
                                        currentStep > index
                                          ? "complete"
                                          : currentStep === index
                                          ? "active"
                                          : "incomplete"
                                      ]
                                    } h-12`}
                                  />
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
                                } text-lg font-bold flex-grow text-left`}
                              >
                                {step === "Fetching"
                                  ? `${step} ${stripHttps(url)}`
                                  : `${step}`}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
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
