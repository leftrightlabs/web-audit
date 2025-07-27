import React from 'react';
import { AuditResult } from '@/types';

interface ReportProps {
  auditResult: AuditResult;
  // userName: string;
  // userEmail: string;
  website: string;
  onDownloadPdf: () => void;
  onSendEmail: () => void;
  isGeneratingPdf: boolean;
  isSendingEmail: boolean;
}

const Report: React.FC<ReportProps> = ({
  auditResult,
  // userName,
  // userEmail,
  website,
  onDownloadPdf,
  onSendEmail,
  isGeneratingPdf,
  isSendingEmail,
}) => {
  // Helper to gracefully format items that might be an object (if the AI returned structured JSON)
  const formatItem = (item: unknown): string => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      // Join all primitive values of the object with a dash for readability
      return Object.values(item)
        .filter(val => typeof val === 'string' || typeof val === 'number')
        .join(' – ');
    }
    return String(item);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-navy tracking-heading text-balance">Your Website Brand Audit</h2>
        <p className="text-lg text-gray-600 text-balance">
          Here are the results of your audit for{' '}
          <span className="font-semibold text-purple">{website}</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 md:p-10 border border-gray-100 mb-10">
        <div className="mb-10 pb-8 border-b border-gray-100">
          <h3 className="font-heading text-2xl font-bold mb-6 text-navy tracking-heading">Summary</h3>
          <p className="text-lg leading-relaxed text-gray-700">{auditResult.summary}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-tan p-6 rounded-lg border border-gold border-opacity-20">
            <h4 className="font-heading text-xl font-bold mb-5 text-navy tracking-heading flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Strengths
            </h4>
            <ul className="space-y-4">
              {auditResult.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gold flex items-center justify-center mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-tan p-6 rounded-lg border border-purple border-opacity-20">
            <h4 className="font-heading text-xl font-bold mb-5 text-navy tracking-heading flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Areas for Improvement
            </h4>
            <ul className="space-y-4">
              {auditResult.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple flex items-center justify-center mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mb-12 pb-8 border-b border-gray-100">
          <h4 className="font-heading text-xl font-bold mb-5 text-navy tracking-heading flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Recommended Next Steps
          </h4>
          <ol className="space-y-5">
            {auditResult.actionableSteps.map((rawStep, index) => {
              const step = formatItem(rawStep);
              return (
              <li key={index} className="flex">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-navy flex items-center justify-center mr-3 text-white font-medium">
                  {index + 1}
                </span>
                <div className="pt-1">
                  <span className="text-gray-700">{step}</span>
                </div>
              </li>
            );
            })}
          </ol>
        </div>
        
        <div>
          <h4 className="font-heading text-xl font-bold mb-5 text-navy tracking-heading flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Tailored Improvements
          </h4>
          <div className="space-y-4">
            {auditResult.improvements.map((rawImp, index) => {
              const improvement = formatItem(rawImp);
              return (
              <div key={index} className="bg-tan p-6 rounded-lg border-l-4 border-gold">
                <p className="text-gray-700">{improvement}</p>
              </div>
            );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-tan rounded-lg p-8 md:p-10 mb-8">
        <h3 className="font-heading text-xl font-bold mb-4 text-navy tracking-heading text-center text-balance">Save Your Audit Results</h3>
        <p className="text-gray-600 mb-6 text-center text-balance">Download a PDF copy or have it sent to your email for future reference.</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <button 
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center justify-center bg-navy text-white px-6 py-4 rounded-md font-medium hover:bg-opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGeneratingPdf ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download PDF Report
              </>
            )}
          </button>
          <button 
            onClick={onSendEmail}
            disabled={isSendingEmail}
            className="flex items-center justify-center bg-white border border-navy text-navy px-6 py-4 rounded-md font-medium hover:bg-navy hover:text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSendingEmail ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Email...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Send to My Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report; 