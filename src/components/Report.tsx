import React from 'react';
import { useState, useEffect } from 'react';
import BrandHealthScorecard from './PerformanceRadar';
import { AuditResult, LighthouseData } from '@/types';
import Button from './Button';
import MockDataWarning from './MockDataWarning';

interface ReportProps {
  auditResult: AuditResult;
  lighthouseData: LighthouseData | null;
  website: string;
  onDownloadPdf?: () => void; // Made optional since we handle it internally now
  isGeneratingPdf?: boolean; // Made optional since we handle it internally now
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



const Report: React.FC<ReportProps> = ({
  auditResult,
  lighthouseData,
  website,
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
  const hasRealData = (data: unknown[] | string | undefined): boolean => {
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
  
  // State for PDF generation (internal)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // State for website screenshot
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(false);

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

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      // Call the new PDF generation API
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auditResult,
          userData: { website },
          lighthouseData,
          screenshot,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to generate PDF');
      }

      // Create a download link for the PDF
      const link = document.createElement('a');
      link.href = result.data.pdf;
      link.download = `${website.replace(/^https?:\/\//, '').replace(/\/$/, '')}-brand-audit.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('PDF generation completed');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
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

  // Fetch website screenshot on component mount
  useEffect(() => {
    const fetchScreenshot = async (retryCount = 0) => {
      if (!website || auditResult.isMockData) return;
      
      setIsLoadingScreenshot(true);
      try {
        console.log(`Fetching screenshot for: ${website} (attempt ${retryCount + 1})`);
        
        const response = await fetch('/api/screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: website }),
        });

        const result = await response.json();
        
        if (result.success && result.data.screenshot) {
          console.log('Screenshot received, length:', result.data.screenshot.length);
          console.log('Setting screenshot state...');
          setScreenshot(result.data.screenshot);
          console.log('Screenshot state set successfully');
        } else {
          console.warn('Failed to fetch screenshot:', result.message);
          // Retry once if it's the first attempt
          if (retryCount === 0) {
            console.log('Retrying screenshot capture...');
            setTimeout(() => fetchScreenshot(1), 2000);
            return;
          }
          setScreenshot(null);
        }
      } catch (error) {
        console.error('Error fetching screenshot:', error);
        // Retry once if it's the first attempt
        if (retryCount === 0) {
          console.log('Retrying screenshot capture after error...');
          setTimeout(() => fetchScreenshot(1), 2000);
          return;
        }
        setScreenshot(null);
      } finally {
        setIsLoadingScreenshot(false);
      }
    };

    fetchScreenshot();
  }, [website, auditResult.isMockData]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy to-purple text-white py-16 px-6 mb-12 w-full">
        <div className="text-center max-w-4xl mx-auto">

          
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
              onClick={handleDownloadPDF}
              isLoading={isGeneratingPdf}
              variant="glassy"
              size="lg"
              disabled={auditResult.isMockData}
            >
              {auditResult.isMockData ? 'Download Unavailable' : 'Download PDF Report'}
            </Button>
            <Button
              onClick={handleShareLink}
              isLoading={isGeneratingLink}
              variant="glassy"
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
      <div id="report" className="max-w-6xl mx-auto px-4 space-y-12">
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
            <div className="grid md:grid-cols-2 gap-8">
              {/* Website Screenshot */}
              <div className="flex flex-col items-center">
                <h3 className="font-heading text-xl font-semibold mb-4 text-navy">
                  Website Snapshot
                </h3>
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 w-full">
                  {isLoadingScreenshot ? (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-navy/60">Loading screenshot...</div>
                    </div>
                  ) : screenshot ? (
                    <div className="relative">
                      <img 
                        src={screenshot} 
                        alt={`Screenshot of ${website}`}
                        className="w-full h-auto rounded-lg shadow-md"
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                        onError={(e) => {
                          console.error('Failed to load screenshot image');
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Website Preview
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-navy/60">Screenshot unavailable</div>
                    </div>
                  )}
                  
                  {/* Fallback placeholder that shows if image fails to load */}
                  {!isLoadingScreenshot && !screenshot && (
                    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="text-navy/60 text-center">
                        <div className="font-medium">Website Snapshot</div>
                        <div className="text-sm">Unable to capture screenshot</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Summary Text */}
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
              onClick={() => window.open('https://leftrightlabs.com/start-here/', '_blank')}
              variant="glassy"
              size="lg"
            >
              Book Strategy Session
            </Button>
            <Button
              onClick={() => window.open('https://leftrightlabs.com/about/', '_blank')}
              variant="glassy"
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