'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import { FormData, AuditResult, LighthouseData } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import LeadForm from '@/components/LeadForm';
import PreferencesForm from '@/components/PreferencesForm';
import Analysis from '@/components/Analysis';

export default function StartPage() {
  const router = useRouter();
  // State for multi-step form
  const [step, setStep] = useState(0); // 0: Lead Form, 1: Preferences Form (with Website URL), 2: Analysis, 3: Report
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    website: '',
  });
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [lighthouseData, setLighthouseData] = useState<LighthouseData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; onRetry?: () => void } | null>(null);

  // Redirect to report route when step 3 is reached
  useEffect(() => {
    if (step === 3 && auditResult) {
      // Generate a share link and redirect to the report route
      const generateAndRedirect = async () => {
        try {
          const response = await fetch('/api/magic-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ auditResult, lighthouseData, website: formData.website }),
          });

          const result = await response.json();

          if (result.success) {
            // Extract the token from the URL and redirect to the report route
            const url = new URL(result.url);
            const token = url.pathname.split('/').pop();
            router.push(`/report/${token}`);
          } else {
            throw new Error(result.message || 'Failed to generate report link');
          }
        } catch (error) {
          console.error('Error generating report link:', error);
          setError('Failed to generate report link. Please try again.');
          setStep(2); // Go back to analysis step
        }
      };

      generateAndRedirect();
    }
  }, [step, auditResult, lighthouseData, formData.website, router]);

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
      setStep(1);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
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
    setStep(2); // Move to analysis step immediately to show progress

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
      const updatedFormData = { ...formData, ...data } as FormData;
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
      // Map preference fields to the names expected by the OpenAI endpoint
      const openAiPayload = {
        website: updatedFormData.website,
        businessGoal: updatedFormData.websiteGoal, // formerly websiteGoal
        industry: updatedFormData.industryType,    // formerly industryType
        runningAds: updatedFormData.marketingCampaigns, // formerly marketingCampaigns
        targetAudience: updatedFormData.targetAudience,
        brandPersonality: updatedFormData.brandPersonality,
      };

      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(openAiPayload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to analyze website');
      }

      // Save lead data to Supabase (non-critical operation)
      fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData),
      }).catch(err => {
        // Log error but don't interrupt the user flow
        console.error('Error saving to Supabase (non-critical):', err);
      });

      // Clear progress interval and set to 100%
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Set audit result and move to report step after a short delay
      setTimeout(() => {
        setAuditResult(result.data);
        setLighthouseData(result.data.lighthouseData || null);
        setStep(3);
      }, 1000);
    } catch (error: unknown) {
      clearInterval(progressInterval);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);

      // Show toast with retry option specifically for analysis failures
      setToast({
        message: 'We couldn\'t reach our analysis service. Please try again.',
        onRetry: () => handlePreferencesSubmit(data),
      });
       
    } finally {
      setLoading(false);
    }
  };

  // Handle preferences form back button
  const handlePreferencesBack = () => {
    setStep(0);
  };



  // Render current step
  const renderStep = () => {
    switch (step) {
      case 0:
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
      case 1:
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
      case 2:
        return (
          <div className="py-8 md:py-12 w-full">
            <ProgressBar currentStep={3} totalSteps={4} />
            <Analysis progress={analysisProgress} />
          </div>
        );
      case 3:
        // Redirect to report route - this will be handled by useEffect
        return null;
      default:
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full" style={{ backgroundColor: '#d5dbe6' }}>
      <header className="bg-gradient-to-r from-navy to-purple text-white py-6 shadow-md w-full">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-heading text-balance">Website Brand Audit</h1>
          <p className="font-sans text-sm md:text-base mt-1">by Left Right Labs</p>
        </div>
      </header>

      <main className="flex-grow w-full" style={{ backgroundColor: '#d5dbe6' }}>
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
        
        {toast && (
          <Toast
            message={toast.message}
            actionLabel={toast.onRetry ? 'Retry' : undefined}
            onAction={toast.onRetry}
            onClose={() => setToast(null)}
          />
        )}

        {renderStep()}
      </main>
      
      <footer className="bg-navy py-6 mt-auto w-full">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-white text-balance">
            &copy; {new Date().getFullYear()} Website Brand Audit Tool
          </div>
        </div>
      </footer>
    </div>
  );
} 