import React from 'react';

interface AnalysisProps {
  progress: number;
}

const Analysis: React.FC<AnalysisProps> = ({ progress }) => {
  const steps = [
    { label: 'Collecting website data', threshold: 10 },
    { label: 'Analyzing brand identity', threshold: 30 },
    { label: 'Evaluating design consistency', threshold: 50 },
    { label: 'Reviewing messaging clarity', threshold: 70 },
    { label: 'Checking technical performance', threshold: 85 },
    { label: 'Generating recommendations', threshold: 95 },
    { label: 'Finalizing your report', threshold: 100 },
  ];

  const currentStep = steps.findIndex(step => progress < step.threshold) !== -1
    ? steps.findIndex(step => progress < step.threshold)
    : steps.length - 1;

  return (
    <div className="w-full max-w-3xl mx-auto text-center px-4">
      <div className="mb-16">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-navy tracking-heading text-balance">Analyzing Your Website</h2>
        <p className="text-lg text-gray-600 mb-10 text-balance">Our AI is working hard to evaluate your website. This typically takes about 1-2 minutes.</p>
        
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner mb-2">
          <div 
            className="h-full bg-gold rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-navy font-medium text-balance">{Math.round(progress)}% Complete</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 md:p-10 border border-gray-100 max-w-2xl mx-auto">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex items-center ${index <= currentStep ? 'text-gray-800' : 'text-gray-400'}`}
            >
              <div 
                className={`mr-4 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm
                  ${index < currentStep 
                    ? 'bg-navy text-white shadow-md' 
                    : index === currentStep 
                      ? 'bg-purple text-white animate-pulse shadow-md' 
                      : 'bg-gray-100 border border-gray-200'}`}
              >
                {index < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="font-medium">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className={`text-base ${index === currentStep ? 'font-medium' : ''}`}>{step.label}</span>
                  {index === currentStep && (
                    <span className="text-xs bg-navy bg-opacity-10 text-navy px-2 py-1 rounded font-medium">In Progress</span>
                  )}
                </div>
                {index === currentStep && (
                  <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-purple h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analysis; 