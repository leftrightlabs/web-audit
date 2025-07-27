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
    if (value >= 90) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (value: number) => {
    if (value >= 90) return 'bg-green-100';
    if (value >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
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
    <li className="flex items-start p-4 bg-white rounded-lg shadow-soft hover:shadow-hover transition-all duration-300">
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1 ${
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
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy to-purple text-white py-16 px-6 mb-12 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Left Right Labs Logo */}
          <div className="mb-8">
            <div className="text-center">
              <img 
                src="/LeftRightLabs_Logo2022White.png" 
                alt="Left Right Labs" 
                className="h-16 md:h-20 mx-auto"
              />
            </div>
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-heading text-balance">
            Your Website Brand Audit is Ready
          </h1>
          <p className="text-xl text-white/90 mb-8 text-balance">
            Here is the comprehensive analysis for{' '}
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline font-medium"
            >
              {website}
            </a>
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onDownloadPdf}
              isLoading={isGeneratingPdf}
              variant="outline"
              size="lg"
              disabled={auditResult.isMockData}
            >
              {auditResult.isMockData ? 'Download Unavailable' : 'Download PDF Report'}
            </Button>
            <Button
              onClick={handleShareLink}
              isLoading={isGeneratingLink}
              variant="outline"
              size="lg"
              disabled={auditResult.isMockData}
            >
              {auditResult.isMockData ? 'Share Unavailable' : (linkCopied ? 'Link Copied!' : 'Share Report')}
            </Button>
          </div>

          {/* Explanation for disabled buttons */}
          {auditResult.isMockData && (
            <p className="text-sm text-white/70 mt-4">
              Download, email, and share features are disabled when using generic content.
            </p>
          )}
        </div>
      </div>

      {/* Show warning if using mock data */}
      {auditResult.isMockData && onRetryAnalysis && (
        <div className="mb-12 max-w-6xl mx-auto px-4">
          <MockDataWarning 
            onRetry={onRetryAnalysis}
            isRetrying={isRetryingAnalysis}
          />
        </div>
      )}

      {/* Main Report Content */}
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* Brand Health Dashboard Section */}
        <section className="bg-gradient-to-br from-navy to-purple text-white rounded-2xl p-8 md:p-12">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Brand Health Dashboard
          </h2>

          {/* Grade + Brand Health Scores */}
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {overallGrade && (
              <div className="flex flex-col items-center md:col-span-1">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                  <span className="text-7xl font-extrabold text-gold leading-none">
                    {overallGrade}
                  </span>
                  <p className="mt-3 text-white/90 font-medium text-lg">
                    Overall Grade
                  </p>
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              {auditResult.pillarScores ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <BrandHealthScorecard scores={auditResult.pillarScores} />
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                  <p className="text-white/80 text-lg">
                    Brand health scores temporarily unavailable
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section className="bg-gradient-to-br from-tan to-tan/60 text-navy rounded-2xl p-8 md:p-12">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Audit Summary
          </h2>
          {!shouldShowRealData ? (
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-8 text-center">
              <p className="text-navy/80 text-lg">
                Temporarily unavailable
              </p>
            </div>
          ) : (
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-8">
              <div className="space-y-4">
                {summary.split('. ').map((sentence, index) => (
                  sentence.trim() && (
                    <p key={index} className="text-navy/90 leading-relaxed text-balance text-lg">
                      {sentence.trim()}.
                    </p>
                  )
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Visual Identity Section - Hidden for now */}
        {/* {(auditResult.colorPalette || auditResult.fonts) && (
          <section className="bg-tan rounded-2xl p-8 md:p-12">
            <h2 className="font-heading text-3xl font-bold mb-8 text-navy text-center">
              Visual Identity Snapshot
            </h2>

            <div className="bg-tan/30 rounded-xl p-6">
              <ul className="space-y-3">
                {auditResult.fonts.map((font, idx) => (
                  <li key={idx} className="text-gray-700 text-lg" style={{ fontFamily: font }}>
                    {font}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {(!auditResult.colorPalette || auditResult.colorPalette.length === 0) && 
         (!auditResult.fonts || auditResult.fonts.length === 0) && (
          <section className="bg-white rounded-2xl shadow-soft p-8 md:p-12">
            <h2 className="font-heading text-3xl font-bold mb-8 bg-gradient-to-r from-navy to-purple bg-clip-text text-transparent">
              Visual Identity Snapshot
            </h2>
            <div className="bg-tan/50 border border-tan rounded-xl p-8 text-center">
              <p className="text-gray-600 text-lg">
                Visual identity analysis (colors and fonts) could not be extracted from this website. 
                This may be due to the site&apos;s structure or styling approach.
              </p>
            </div>
          </section>
        )} */}

        {/* ROI Forecast Section */}
        {lighthouseData && (
          <section className="bg-gradient-to-br from-navy to-purple text-white rounded-2xl p-8 md:p-12">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center">
              ROI Forecast
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
                <h3 className="font-heading text-lg font-semibold mb-3">
                  Performance Impact
                </h3>
                <p className="text-white/90">
                  Improving page speed and user experience could increase conversion rates by 15-25%.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
                <h3 className="font-heading text-lg font-semibold mb-3">
                  SEO Potential
                </h3>
                <p className="text-white/90">
                  Optimizing content and technical SEO could improve search rankings and organic traffic.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
                <h3 className="font-heading text-lg font-semibold mb-3">
                  Brand Growth
                </h3>
                <p className="text-white/90">
                  Enhanced branding and messaging could increase customer trust and brand recognition.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Technical Performance Metrics */}
        {lighthouseData && (
          <section className="bg-tan rounded-2xl p-8 md:p-12">
            <h2 className="font-heading text-3xl font-bold mb-8 text-navy text-center">
              Technical Performance Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
          </section>
        )}

        {/* Strengths and Weaknesses Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Strengths Section */}
          <section className="bg-gradient-to-br from-navy to-navy/80 text-white rounded-2xl p-8 md:p-12">
            <h2 className="font-heading text-3xl font-bold mb-6">
              What You&apos;re Doing Well
            </h2>
            {!shouldShowRealData ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <p className="text-white/80">
                  Temporarily unavailable
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {strengths.map((item, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
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
                      </div>
                      <p className="text-white/90 leading-relaxed text-balance">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Weaknesses Section */}
          <section className="bg-gradient-to-br from-purple to-purple/80 text-white rounded-2xl p-8 md:p-12">
            <h2 className="font-heading text-3xl font-bold mb-6">
              Areas for Improvement
            </h2>
            {!shouldShowRealData ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <p className="text-white/80">
                  Temporarily unavailable
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {weaknesses.map((item, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
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
                      </div>
                      <p className="text-white/90 leading-relaxed text-balance">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Actionable Steps Section */}
        <section className="bg-gradient-to-br from-navy to-purple text-white rounded-2xl p-8 md:p-12">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Top 3 Recommended Next Steps
          </h2>
          {!shouldShowRealData ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <p className="text-white/80 text-lg">
                Temporarily unavailable
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {actionableSteps.map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold mr-4 mt-1 text-white">
                      {index + 1}
                    </div>
                    <p className="text-white/90 leading-relaxed text-balance text-lg">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Additional Improvements Section */}
        {improvements && improvements.length > 0 && (
          <section className="bg-gradient-to-br from-tan to-tan/60 text-navy rounded-2xl p-8 md:p-12">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center">
              Additional Suggestions
            </h2>
            {!shouldShowRealData ? (
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-8 text-center">
                <p className="text-navy/80 text-lg">
                  Temporarily unavailable
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {improvements.map((item, index) => (
                  <div key={index} className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-navy/20">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold flex items-center justify-center mr-4 mt-1">
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
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <p className="text-navy/90 leading-relaxed text-balance">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Spacing between sections */}
      <div className="h-16"></div>

      {/* Strategy Session CTA */}
      <section className="bg-gradient-to-br from-navy to-purple text-white p-8 md:p-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl font-bold mb-6">
            Ready to Elevate Your Brand?
          </h2>
          <p className="text-xl text-white/90 mb-8 text-balance">
            This audit is just the beginning. Book a strategy session with our team to dive deeper into your brand positioning, 
            create a comprehensive action plan, and transform your website into a powerful conversion machine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.open('https://leftrightlabs.com/contact', '_blank')}
              variant="outline"
              size="lg"
            >
              Book Strategy Session
            </Button>
            <Button
              onClick={() => window.open('https://leftrightlabs.com', '_blank')}
              variant="outline"
              size="lg"
            >
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Report; 