import React from 'react';

interface BrandHealthScorecardProps {
  scores: {
    branding: number;
    ux: number;
    conversion: number;
    content: number;
  };
}

const BrandHealthScorecard: React.FC<BrandHealthScorecardProps> = ({ scores }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-400';
    if (score >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const categories = [
    {
      name: 'Branding & Positioning',
      score: scores.branding,
      description: 'Brand clarity, consistency, and voice',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      )
    },
    {
      name: 'User Experience',
      score: scores.ux,
      description: 'Navigation, design, and usability',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Conversion & Trust',
      score: scores.conversion,
      description: 'Credibility, funnels, and value proposition',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      name: 'Content & SEO',
      score: scores.content,
      description: 'Relevance, optimization, and engagement',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  const overallScore = Math.round((scores.branding + scores.ux + scores.conversion + scores.content) / 4);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border ${getScoreColor(category.score)} backdrop-blur-sm transition-all duration-300 hover:shadow-hover`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-white/90">
                  {category.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base">{category.name}</h4>
                  <p className="text-sm text-white/70">{category.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{category.score}</div>
                <div className="text-sm text-white/70">{getScoreLabel(category.score)}</div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${getProgressColor(category.score)}`}
                style={{ width: `${category.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Overall score summary */}
      <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white text-lg">Overall Brand Health</h4>
            <p className="text-sm text-white/70">Average score across all categories</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gold">
              {overallScore}
            </div>
            <div className="text-sm text-white/70">out of 100</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandHealthScorecard; 