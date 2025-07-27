import React from 'react';
import Button from './Button';

interface MockDataWarningProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

const MockDataWarning: React.FC<MockDataWarningProps> = ({ onRetry, isRetrying = false }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-8">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              AI Analysis Temporarily Unavailable
            </h3>
            <div className="text-amber-700 space-y-2">
              <p>
                We're currently unable to perform a real AI analysis of your website. This could be due to:
              </p>
              <ul className="list-disc ml-5 space-y-1">
                <li>AI service temporarily unavailable</li>
                <li>Configuration issues with the analysis system</li>
                <li>Network connectivity problems</li>
              </ul>
              <p className="mt-3 font-medium">
                The report below contains generic placeholder content and should not be used for actual business decisions.
              </p>
            </div>
            <div className="mt-4">
              <Button
                onClick={onRetry}
                isLoading={isRetrying}
                variant="primary"
                size="md"
              >
                {isRetrying ? 'Retrying...' : 'Retry Analysis'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockDataWarning; 