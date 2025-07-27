import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  const stepLabels = ["Your Information", "Website Details", "Analysis", "Report"];
  
  const currentStepIndex = currentStep - 1; // convert to 0-based index for easier comparison

  return (
    <div className="w-full max-w-3xl mx-auto mb-16 px-4">
      <div className="relative">
        <div className="h-1 w-full bg-gray-200 rounded-full absolute top-5">
          <div
            className="h-1 bg-navy rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between relative">
          {[...Array(totalSteps)].map((_, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={index} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm mb-3 transition-all
                    ${isCompleted
                      ? 'bg-navy text-white shadow-md'
                      : isCurrent
                        ? 'bg-purple text-white shadow-md'
                        : 'bg-white border-2 border-gray-200 text-gray-500'}
                  `}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="font-medium">{index + 1}</span>
                  )}
                </div>
                <div className={`text-sm font-medium text-center ${isCurrent ? 'text-purple' : 'text-gray-500'} text-balance`}>
                  {stepLabels[index]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 