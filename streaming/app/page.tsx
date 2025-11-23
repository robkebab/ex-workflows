"use client";

import { useState, useEffect } from "react";

const steps = [
  { id: 0, name: "Not Started", description: "Task has not been initiated" },
  { id: 1, name: "Requested", description: "Request has been submitted" },
  { id: 2, name: "In Progress", description: "Work is underway" },
  { id: 3, name: "Completed", description: "Task is finished" },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    async function startWorkflow() {
      try {
        const response = await fetch("/api/workflow");
        
        if (!response.body) {
          console.error("No response body");
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }

          const text = decoder.decode(value, { stream: true });
          console.log("Received:", text);

          // Map status to step index
          const statusToStep: Record<string, number> = {
            "Requested": 1,
            "In Progress": 2,
            "Completed": 3,
          };

          if (text in statusToStep) {
            setCurrentStep(statusToStep[text]);
          }
        }
      } catch (error) {
        console.error("Error reading stream:", error);
      }
    }

    startWorkflow();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 font-sans dark:from-zinc-900 dark:to-black">
      <main className="w-full max-w-4xl px-6 py-12 sm:px-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Status Tracker
          </h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
            Track progress through multiple stages
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.id
                        ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                        : "border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">
                        {step.id + 1}
                      </span>
                    )}
                  </div>
                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.id
                          ? "text-zinc-900 dark:text-zinc-50"
                          : "text-zinc-500 dark:text-zinc-500"
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 px-2">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        currentStep > step.id
                          ? "bg-blue-600 dark:bg-blue-500"
                          : "bg-zinc-300 dark:bg-zinc-700"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Details */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-800">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {steps[currentStep].name}
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="rounded-lg bg-zinc-200 px-6 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
            }
            disabled={currentStep === steps.length - 1}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
