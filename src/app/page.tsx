'use client';

import React, { useState, useEffect } from 'react';
import { FormData, AuditResult } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import Landing from '@/components/Landing';
import LeadForm from '@/components/LeadForm';
import PreferencesForm from '@/components/PreferencesForm';
import Analysis from '@/components/Analysis';
import Report from '@/components/Report';

export default function Home() {
  // State for multi-step form
  const [step, setStep] = useState(0); // 0: Landing, 1: Lead Form, 2: Preferences Form (with Website URL), 3: Analysis, 4: Report
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    website: '',
  });
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle start button click
  const handleStart = () => {
    setStep(1);
  };

  // Handle lead form submission
  const handleLeadSubmit = async (data: { name: string; email: string }) => {
    setLoading(true);
    setError('');

    try {
      // Save contact to ActiveCampaign
      const response = await fetch('/api/active-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to save contact information');
      }

      // Update form data and proceed to next step (preferences)
      setFormData(prev => ({ ...prev, ...data }));
      setStep(2);
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle preferences form submission
  const handlePreferencesSubmit = async (data: {
    website: string;
    websiteGoal?: string;
    industryType?: string;
    targetAudience?: string;
    brandPersonality?: string;
    marketingCampaigns?: string;
    improvementArea?: string;
  }) => {
    setLoading(true);
    setError('');
    setStep(3); // Move to analysis step immediately to show progress

    // Start progress simulation
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 1;
      setAnalysisProgress(prev => {
        const newProgress = prev + 1;
        return newProgress > 95 ? 95 : newProgress; // Cap at 95% until real completion
      });
      
      if (progress >= 95) {
        clearInterval(progressInterval);
      }
    }, 500);

    try {
      // Update form data
      const updatedFormData = { ...formData, ...data };
      setFormData(updatedFormData);

      // Now that we have the website URL, send the complete contact data to ActiveCampaign
      // This ensures the website field is included and the contact is added to list ID 36
      try {
        const acResponse = await fetch('/api/active-campaign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: updatedFormData.name,
            email: updatedFormData.email,
            website: updatedFormData.website,
            websiteGoal: updatedFormData.websiteGoal,
            industryType: updatedFormData.industryType,
            marketingCampaigns: updatedFormData.marketingCampaigns,
          }),
        });

        if (!acResponse.ok) {
          console.error('Failed to add contact to ActiveCampaign List ID 36');
        } else {
          console.log('Successfully added contact to ActiveCampaign List ID 36');
        }
      } catch (acError) {
        console.error('Error adding contact to ActiveCampaign:', acError);
        // Continue with the flow even if ActiveCampaign fails
      }

      // Call API to analyze website with all form data
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to analyze website');
      }

      // Save lead data to Supabase
      try {
        const supabaseResponse = await fetch('/api/submit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFormData),
        });
        
        if (!supabaseResponse.ok) {
          console.error('Failed to save lead data to Supabase');
          // We'll continue even if Supabase save fails, as the OpenAI call succeeded
        }
      } catch (supabaseError) {
        console.error('Error saving to Supabase:', supabaseError);
        // Continue with the flow even if Supabase save fails
      }

      // Clear progress interval and set to 100%
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Set audit result and move to report step after a short delay
      setTimeout(() => {
        setAuditResult(result.data);
        setStep(4);
      }, 1000);
    } catch (error: any) {
      clearInterval(progressInterval);
      setError(error.message || 'An unexpected error occurred');
      // Stay on analysis step but show error
    } finally {
      setLoading(false);
    }
  };

  // Handle preferences form back button
  const handlePreferencesBack = () => {
    setStep(1);
  };

  // Handle PDF download
  const handleDownloadPdf = async () => {
    if (!auditResult) return;
    
    setPdfLoading(true);
    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditResult,
          userData: formData, // Include all form data including preferences
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to generate PDF');
      }

      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = result.data.pdf;
      link.download = `${formData.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}-brand-audit.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      setError(error.message || 'Failed to download PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  // Handle email sending
  const handleSendEmail = async () => {
    if (!auditResult) return;
    
    setEmailLoading(true);
    try {
      // First generate the PDF
      const pdfResponse = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditResult,
          userData: formData, // Include all form data including preferences
        }),
      });

      const pdfResult = await pdfResponse.json();
      
      if (!pdfResult.success) {
        throw new Error(pdfResult.message || 'Failed to generate PDF');
      }

      // Then send the email with the PDF
      const emailResponse = await fetch('/api/pdf/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          website: formData.website,
          pdfBase64: pdfResult.data.pdf,
        }),
      });

      const emailResult = await emailResponse.json();
      
      if (!emailResult.success) {
        throw new Error(emailResult.message || 'Failed to send email');
      }

      // Show success notification or message
      alert('PDF report sent to your email successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to send email');
    } finally {
      setEmailLoading(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 0:
        return <Landing onStart={handleStart} />;
      case 1:
        return (
          <div className="py-8 md:py-12 w-full">
            <ProgressBar currentStep={1} totalSteps={4} />
            <LeadForm 
              onSubmit={handleLeadSubmit} 
              isLoading={loading} 
              defaultValues={formData}
            />
          </div>
        );
      case 2:
        return (
          <div className="py-8 md:py-12 w-full">
            <ProgressBar currentStep={2} totalSteps={4} />
            <PreferencesForm 
              onSubmit={handlePreferencesSubmit}
              onBack={handlePreferencesBack}
              isLoading={loading}
              defaultValues={formData}
            />
          </div>
        );
      case 3:
        return (
          <div className="py-8 md:py-12 w-full">
            <ProgressBar currentStep={3} totalSteps={4} />
            <Analysis progress={analysisProgress} />
          </div>
        );
      case 4:
        return (
          <div className="py-8 md:py-12 w-full">
            <ProgressBar currentStep={4} totalSteps={4} />
            {auditResult && (
              <Report 
                auditResult={auditResult}
                userName={formData.name}
                userEmail={formData.email}
                website={formData.website}
                onDownloadPdf={handleDownloadPdf}
                onSendEmail={handleSendEmail}
                isGeneratingPdf={pdfLoading}
                isSendingEmail={emailLoading}
              />
            )}
          </div>
        );
      default:
        return <Landing onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      {step > 0 && (
        <header className="bg-navy text-white py-6 shadow-md w-full">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-heading text-balance">Website Brand Audit Tool</h1>
          </div>
        </header>
      )}

      <main className="flex-grow w-full">
        {error && (
          <div className="w-full max-w-lg mx-auto bg-white border-l-4 border-purple text-purple p-4 my-6 rounded-md shadow-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {renderStep()}
      </main>
      
      {step > 0 && (
        <footer className="bg-tan py-6 mt-auto border-t border-gold border-opacity-20 w-full">
          <div className="container mx-auto px-4">
            <div className="text-center text-sm text-navy text-balance">
              &copy; {new Date().getFullYear()} Website Brand Audit Tool
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
