'use client';

import { AuditResult, LighthouseData } from '@/types';
import Report from '@/components/Report';
import React, { use, useState, useEffect } from 'react';

interface TokenPayload {
  auditResult: AuditResult;
  lighthouseData: LighthouseData | null;
  website: string;
  created_at: string;
  expires_at: string;
}

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function ReportViewerPage({ params }: PageProps) {
  const { token } = use(params);
  const [payload, setPayload] = useState<TokenPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (result.success) {
          setPayload(result.payload);
        } else {
          if (response.status === 410) {
            setError('This report has expired');
          } else {
            setError('Invalid or expired link');
          }
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        setError('Invalid or expired link');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-700">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-navy">Invalid or Expired Link</h1>
          <p className="text-gray-700">{error || 'The link you used is no longer valid. Please request a new one.'}</p>
        </div>
      </div>
    );
  }

  const { auditResult, lighthouseData, website } = payload;

  return (
    <div className="min-h-screen flex flex-col w-full">
      <main className="flex-grow w-full">
        <div className="w-full">
          <Report
            auditResult={auditResult}
            lighthouseData={lighthouseData}
            website={website}
            onDownloadPdf={() => {}}
            onSendEmail={() => {}}
            isGeneratingPdf={false}
            isSendingEmail={false}
          />
        </div>
      </main>

      <footer className="bg-navy py-6 mt-auto border-t border-gold border-opacity-20 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-white text-balance">
            &copy; {new Date().getFullYear()} Website Brand Audit Tool
          </div>
        </div>
      </footer>
    </div>
  );
} 