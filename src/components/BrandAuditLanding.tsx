'use client';

import React from 'react';
import Link from 'next/link';

const BrandAuditLanding: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy via-purple to-navy text-white w-full">
        <div className="text-center max-w-4xl mx-auto px-4 md:px-6 lg:px-8">

          
          {/* Main Headline */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-heading text-balance text-white">
            Is Your Website Helping or Hurting Your Brand?
          </h1>
          
          {/* Subtext */}
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-light text-balance text-white opacity-90">
            Get a personalized, AI-powered brand audit of your website — in minutes.
          </p>
          
          {/* CTA Button */}
          <Link 
            href="/start"
            className="inline-block bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg transition-all duration-300 border border-white/30 hover:bg-white/20 hover:border-white/50"
          >
            Start My Free Brand Audit
          </Link>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-navy text-balance">
              What You&apos;ll Get in Your Free Brand Audit
            </h2>
          </div>

          <div className="bg-gradient-to-br from-navy to-purple rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-lg">
                <h3 className="font-heading text-xl font-bold mb-4 text-white text-center text-balance">
                  Honest Review
                </h3>
                <p className="text-white/90 text-center text-balance">
                  Honest review of your brand messaging, design, and content
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-lg">
                <h3 className="font-heading text-xl font-bold mb-4 text-white text-center text-balance">
                  Personalized Recommendations
                </h3>
                <p className="text-white/90 text-center text-balance">
                  Personalized recommendations based on your goals
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-lg">
                <h3 className="font-heading text-xl font-bold mb-4 text-white text-center text-balance">
                  Downloadable PDF
                </h3>
                <p className="text-white/90 text-center text-balance">
                  Downloadable PDF with your top 3 action steps
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-tan py-24 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
                      <h2 className="font-heading text-3xl md:text-4xl font-bold mb-16 text-center text-navy text-balance">
              Here&apos;s How It Works:
            </h2>
          <div className="grid md:grid-cols-4 gap-6 md:gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-bold mb-6 text-xl shadow-md">1</div>
              <h3 className="font-heading font-bold mb-3 text-lg text-navy text-balance">Enter your name and email</h3>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-bold mb-6 text-xl shadow-md">2</div>
              <h3 className="font-heading font-bold mb-3 text-lg text-navy text-balance">Answer a few quick questions</h3>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-bold mb-6 text-xl shadow-md">3</div>
              <h3 className="font-heading font-bold mb-3 text-lg text-navy text-balance">Submit your website</h3>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-bold mb-6 text-xl shadow-md">4</div>
              <h3 className="font-heading font-bold mb-3 text-lg text-navy text-balance">Get your custom audit instantly</h3>
            </div>
          </div>
        </div>
      </section>

      {/* FOMO / Trust Section */}
      <section className="py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-navy to-purple rounded-2xl p-8 md:p-12 border-4 border-purple/20 shadow-xl">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-white text-balance">
                Don&apos;t Let a Bad First Impression Cost You Customers
              </h2>
              <div className="text-lg text-white/90 text-balance space-y-2">
                <p>90% of people judge your business by your website.</p>
                <p>Make sure yours is working for you — not against you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-navy to-purple text-white py-20 w-full">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-balance">Ready to Transform Your Brand?</h2>
          <p className="text-xl mb-10 opacity-90 font-light text-balance">
            Get your free website audit today and start improving your online presence.
          </p>
          <Link 
            href="/start"
            className="inline-block bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg transition-all duration-300 border border-white/30 hover:bg-white/20 hover:border-white/50"
          >
            Start Now – It&apos;s Free
          </Link>
        </div>
      </section>

      <footer className="bg-navy py-10 w-full">
        <div className="max-w-7xl mx-auto px-4 text-center text-white text-balance">
          &copy; {new Date().getFullYear()} Website Brand Audit Tool
        </div>
      </footer>
    </div>
  );
};

export default BrandAuditLanding; 