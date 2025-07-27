import React from 'react';
import { useState } from 'react';
import BrandHealthScorecard from './PerformanceRadar';
import { AuditResult, LighthouseData } from '@/types';
import Button from './Button';
import MockDataWarning from './MockDataWarning';

interface ReportProps {
  auditResult: AuditResult;
  lighthouseData: LighthouseData | null;
  website: string;
  onDownloadPdf: () => void;
  onSendEmail: () => void;
  isGeneratingPdf: boolean;
  isSendingEmail: boolean;
  onRetryAnalysis?: () => void;
  isRetryingAnalysis?: boolean;
}

const ScoreCircle: React.FC<{ score: number; label: string }> = ({
  score,
  label,
}) => {
  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className={getScoreColor(score)}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${getScoreColor(
            score
          )}`}
        >
          {score}
        </span>
      </div>
      <p className="mt-3 text-base font-medium text-navy">{label}</p>
    </div>
  );
};

const ListItem: React.FC<{
  text: string;
  type: 'strength' | 'weakness' | 'improvement';
}> = ({ text, type }) => {
  const icons = {
    strength: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    weakness: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    improvement: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-navy"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  };

  const colors = {
    strength: 'bg-green-500',
    weakness: 'bg-red-500',
    improvement: 'bg-yellow-500',
  };

  return (
    <li className="flex items-start">
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mr-4 mt-1 ${
          colors[type]
        }`}
      >
        {icons[type]}
      </div>
      <p className="text-gray-700 leading-relaxed text-balance">{text}</p>
    </li>
  );
};

const Report: React.FC<ReportProps> = ({
  auditResult,
  lighthouseData,
  website,
  onDownloadPdf,
  onSendEmail,
  isGeneratingPdf,
  isSendingEmail,
  onRetryAnalysis,
  isRetryingAnalysis,
}) => {
  const { summary, strengths, weaknesses, actionableSteps, improvements } =
    auditResult;

  // Debug logging
  console.log('Report component - isMockData:', auditResult.isMockData);
  console.log('Report component - summary length:', summary?.length || 0);
  console.log('Report component - strengths count:', strengths?.length || 0);
  console.log('Report component - weaknesses count:', weaknesses?.length || 0);
  console.log('Report component - actionableSteps count:', actionableSteps?.length || 0);

  // Helper function to check if we have real AI data
  const hasRealData = (data: any[] | string | undefined): boolean => {
    if (!data) return false;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'string') return data.trim().length > 0;
    return false;
  };

  // Check if we should show real data or "temporarily unavailable"
  const shouldShowRealData = !auditResult.isMockData && 
    hasRealData(summary) && 
    hasRealData(strengths) && 
    hasRealData(weaknesses) && 
    hasRealData(actionableSteps);

  // State for Share Link generation
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShareLink = async () => {
    setIsGeneratingLink(true);
    setLinkCopied(false);
    try {
      const response = await fetch('/api/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditResult, lighthouseData, website }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to generate share link');
      }

      await navigator.clipboard.writeText(result.url);
      setLinkCopied(true);
    } catch (err) {
      console.error('Error generating share link:', err);
      alert(
        (err instanceof Error ? err.message : 'Failed to generate share link') +
          '. Please try again.'
      );
    } finally {
      setIsGeneratingLink(false);
      // Hide "Copied" status after a few seconds
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  // Helper: derive overall grade (A-F) from Lighthouse average or pillar scores
  const deriveGrade = (): string | null => {
    let score: number | null = null;

    if (lighthouseData) {
      const { performance, accessibility, bestPractices, seo } = lighthouseData;
      score = Math.round((performance + accessibility + bestPractices + seo) / 4);
    } else if (auditResult.pillarScores) {
      const { branding, ux, conversion, content } = auditResult.pillarScores;
      score = Math.round((branding + ux + conversion + content) / 4);
    }

    if (score === null) return null;

    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const overallGrade = deriveGrade();

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-navy tracking-heading text-balance">
          Your Website Brand Audit is Ready
        </h2>
        <p className="text-lg text-gray-600 text-balance">
          Here is the analysis for{' '}
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple hover:underline"
          >
            {website}
          </a>
        </p>
      </div>

      {/* Show warning if using mock data */}
      {auditResult.isMockData && onRetryAnalysis && (
        <MockDataWarning 
          onRetry={onRetryAnalysis}
          isRetrying={isRetryingAnalysis}
        />
      )}

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
        <Button
          onClick={onDownloadPdf}
          isLoading={isGeneratingPdf}
          variant="primary"
          size="lg"
          disabled={auditResult.isMockData}
        >
          {auditResult.isMockData ? 'Download Unavailable' : 'Download PDF Report'}
        </Button>
        <Button
          onClick={onSendEmail}
          isLoading={isSendingEmail}
          variant="outline"
          size="lg"
          disabled={auditResult.isMockData}
        >
          {auditResult.isMockData ? 'Email Unavailable' : 'Email Me This Report'}
        </Button>

        <Button
          onClick={handleShareLink}
          isLoading={isGeneratingLink}
          variant="gold"
          size="lg"
          disabled={auditResult.isMockData}
        >
          {auditResult.isMockData ? 'Share Unavailable' : (linkCopied ? 'Link Copied!' : 'Share Report')}
        </Button>
      </div>

      {/* Explanation for disabled buttons */}
      {auditResult.isMockData && (
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600">
            Download, email, and share features are disabled when using generic content.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 border border-gray-100">
        {/* Warning banner for mock data */}
        {auditResult.isMockData && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-600"
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
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">
                  ⚠️ Generic Content Warning
                </h4>
                <p className="mt-1 text-sm text-red-700">
                  This report contains generic placeholder content because AI analysis is currently unavailable. 
                  The information below should not be used for business decisions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Section */}
        <div className="mb-12">
          <h3 className="font-heading text-2xl font-bold mb-4 text-navy">
            Audit Summary
          </h3>
          {!shouldShowRealData ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 text-center">
                Temporarily unavailable
              </p>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed text-balance">
              {summary}
            </p>
          )}
        </div>

                {/* Brand Health Dashboard Section */}
        <div className="mb-12">
          <h3 className="font-heading text-2xl font-bold mb-6 text-navy">
            Brand Health Dashboard
          </h3>

          {/* Grade + Brand Health Scores */}
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {overallGrade && (
              <div className="flex flex-col items-center md:col-span-1">
                <span className="text-6xl font-extrabold text-navy leading-none">
                  {overallGrade}
                </span>
                <span className="mt-2 text-gray-600 font-medium">
                  Overall Grade
                </span>
              </div>
            )}

            <div className="md:col-span-2">
              {auditResult.pillarScores ? (
                <BrandHealthScorecard scores={auditResult.pillarScores} />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-600 text-center">
                    Brand health scores temporarily unavailable
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Visual Identity Section */}
        {(auditResult.colorPalette || auditResult.fonts) && (
          <div className="mb-12">
            <h3 className="font-heading text-2xl font-bold mb-6 text-navy">
              Visual Identity Snapshot
            </h3>

            {/* Color palette */}
            {auditResult.colorPalette && auditResult.colorPalette.length > 0 && (
              <div className="mb-6">
                <h4 className="font-heading text-xl font-semibold mb-3 text-navy">
                  Primary Colors
                </h4>
                <div className="flex flex-wrap gap-4">
                  {auditResult.colorPalette.map((hex, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className="w-12 h-12 rounded-lg border"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="mt-1 text-sm text-gray-700">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fonts */}
            {auditResult.fonts && auditResult.fonts.length > 0 && (
              <div>
                <h4 className="font-heading text-xl font-semibold mb-3 text-navy">
                  Primary Fonts
                </h4>
                <ul className="list-disc ml-6 space-y-1">
                  {auditResult.fonts.map((font, idx) => (
                    <li key={idx} className="text-gray-700" style={{ fontFamily: font }}>
                      {font}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* No Visual Identity Data Message */}
        {(!auditResult.colorPalette || auditResult.colorPalette.length === 0) && 
         (!auditResult.fonts || auditResult.fonts.length === 0) && (
          <div className="mb-12">
            <h3 className="font-heading text-2xl font-bold mb-6 text-navy">
              Visual Identity Snapshot
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 text-center">
                Visual identity analysis (colors and fonts) could not be extracted from this website. 
                This may be due to the site&apos;s structure or styling approach.
              </p>
            </div>
          </div>
        )}

        {/* ROI Forecast Section */}
        {lighthouseData && (
          <div className="mb-12">
            <h3 className="font-heading text-2xl font-bold mb-4 text-navy">
              ROI Forecast
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <h4 className="font-heading text-lg font-semibold mb-2 text-green-800">
                  Performance Impact
                </h4>
                <p className="text-green-700 text-sm">
                  Improving page speed and user experience could increase conversion rates by 15-25%.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <h4 className="font-heading text-lg font-semibold mb-2 text-blue-800">
                  SEO Potential
                </h4>
                <p className="text-blue-700 text-sm">
                  Optimizing content and technical SEO could improve search rankings and organic traffic.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <h4 className="font-heading text-lg font-semibold mb-2 text-purple-800">
                  Brand Growth
                </h4>
                <p className="text-purple-700 text-sm">
                  Enhanced branding and messaging could increase customer trust and brand recognition.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Technical Performance Metrics */}
        {lighthouseData && (
          <div className="mb-12">
            <h3 className="font-heading text-2xl font-bold mb-6 text-navy">
              Technical Performance Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <ScoreCircle
                score={lighthouseData.performance}
                label="Performance"
              />
              <ScoreCircle
                score={lighthouseData.accessibility}
                label="Accessibility"
              />
              <ScoreCircle
                score={lighthouseData.bestPractices}
                label="Best Practices"
              />
              <ScoreCircle score={lighthouseData.seo} label="SEO" />
            </div>
          </div>
        )}

        {/* Strengths and Weaknesses Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Strengths Section */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4 text-navy">
              What You&apos;re Doing Well
            </h3>
            {!shouldShowRealData ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 text-center">
                  Temporarily unavailable
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {strengths.map((item, index) => (
                  <ListItem key={index} text={item} type="strength" />
                ))}
              </ul>
            )}
          </div>

          {/* Weaknesses Section */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4 text-navy">
              Areas for Improvement
            </h3>
            {!shouldShowRealData ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 text-center">
                  Temporarily unavailable
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {weaknesses.map((item, index) => (
                  <ListItem key={index} text={item} type="weakness" />
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Actionable Steps Section */}
        <div className="mt-12">
          <h3 className="font-heading text-2xl font-bold mb-4 text-navy">
            Top 3 Recommended Next Steps
          </h3>
          {!shouldShowRealData ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 text-center">
                Temporarily unavailable
              </p>
            </div>
          ) : (
            <ol className="space-y-6">
              {actionableSteps.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-bold mr-4 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-balance">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Additional Improvements Section */}
        {improvements && improvements.length > 0 && (
          <div className="mt-12">
            <h3 className="font-heading text-2xl font-bold mb-4 text-navy">
              Additional Suggestions
            </h3>
            {!shouldShowRealData ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 text-center">
                Temporarily unavailable
              </p>
            </div>
            ) : (
              <ul className="space-y-4">
                {improvements.map((item, index) => (
                  <ListItem key={index} text={item} type="improvement" />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Rescan Section - Separate from main report */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8 border border-gray-200">
        <div className="text-center">
          <h3 className="font-heading text-xl font-semibold mb-4 text-navy">
            Need a Fresh Analysis?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Re-run the website analysis with the same settings to get updated insights. 
            This is useful if you&apos;ve made changes to your website or want to track improvements over time.
          </p>
          <Button
            onClick={onRetryAnalysis}
            isLoading={isRetryingAnalysis}
            variant="outline"
            size="lg"
          >
            {isRetryingAnalysis ? 'Rescanning...' : '🔄 Rescan Website'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Report; 