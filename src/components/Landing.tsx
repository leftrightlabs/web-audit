import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section with Navy Background */}
      <section className="bg-navy text-white py-20 md:py-28 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-heading text-balance">
              What If Your Brand Could Speak To You?
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 font-light text-balance">
              Discover actionable insights to improve your online presence, enhance your brand messaging, and attract more customers.
            </p>
            <button 
              onClick={onStart}
              className="bg-purple hover:bg-opacity-90 text-white px-8 py-4 rounded-md text-lg font-medium shadow-lg transition-all duration-300"
            >
              Start Your Free Brand Audit Now
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-navy text-balance">
              Your Brand. Digital. Your Business. Defined.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              Make Your Brand&apos;s Voice Heard
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card group">
              <div className="w-16 h-16 bg-tan rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-navy text-center group-hover:text-purple transition-colors text-balance">Brand Analysis</h3>
              <p className="text-gray-600 text-center text-balance">
                Get insights into your brand identity, messaging clarity, and overall market positioning.
              </p>
            </div>

            <div className="card group">
              <div className="w-16 h-16 bg-tan rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-navy text-center group-hover:text-purple transition-colors text-balance">Design Evaluation</h3>
              <p className="text-gray-600 text-center text-balance">
                Review of visual elements, layout, and user experience to ensure consistency and effectiveness.
              </p>
            </div>

            <div className="card group">
              <div className="w-16 h-16 bg-tan rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-navy text-center group-hover:text-purple transition-colors text-balance">Actionable Recommendations</h3>
              <p className="text-gray-600 text-center text-balance">
                Get tailored next steps and practical improvements to enhance your website&apos;s effectiveness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-tan py-24 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-16 text-center text-navy text-balance">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6 md:gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-bold mb-6 text-xl shadow-md">1</div>
              <h3 className="font-heading font-bold mb-3 text-lg text-navy text-balance">Enter Your Info</h3>
              <p className="text-gray-600 text-balance">Provide your name and email to get started</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-bold mb-6 text-xl shadow-md">2</div>
              <h3 className="font-heading font-bold mb-3 text-lg text-navy text-balance">Submit Your Website</h3>
              <p className="text-gray-600 text-balance">Enter your website URL and business details</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-bold mb-6 text-xl shadow-md">3</div>
              <h3 className="font-heading font-bold mb-3 text-lg text-navy text-balance">AI Analysis</h3>
              <p className="text-gray-600 text-balance">Our AI evaluates your website&apos;s branding & design</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-bold mb-6 text-xl shadow-md">4</div>
              <h3 className="font-heading font-bold mb-3 text-lg text-navy text-balance">Get Your Report</h3>
              <p className="text-gray-600 text-balance">Download or email your detailed audit results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-navy text-balance">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 text-balance">Real businesses, real results</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-tan p-8 md:p-10 rounded-lg shadow-soft">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex-shrink-0"></div>
              <div>
                <p className="text-lg md:text-xl text-gray-700 mb-4 italic text-balance">
                  &quot;The brand audit helped us identify key areas where our messaging wasn&apos;t consistent. Within weeks of implementing the recommendations, our conversion rate increased by 27%.&quot;
                </p>
                <p className="font-bold text-navy">Sarah Johnson</p>
                <p className="text-gray-600">Marketing Director, TechSolutions Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy text-white py-20 w-full">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-balance">Ready to Transform Your Brand?</h2>
          <p className="text-xl mb-10 opacity-90 font-light text-balance">Get your free website audit today and start improving your online presence.</p>
          <button 
            onClick={onStart}
            className="bg-gold text-white hover:bg-opacity-90 px-8 py-4 rounded-md text-lg font-medium shadow-lg transition-all duration-300"
          >
            Start Your Free Audit Now
          </button>
        </div>
      </section>

      <footer className="bg-gray-100 py-10 w-full">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-balance">
          &copy; {new Date().getFullYear()} Website Brand Audit Tool
        </div>
      </footer>
    </div>
  );
};

export default Landing; 