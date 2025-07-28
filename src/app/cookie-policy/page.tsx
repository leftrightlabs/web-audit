import React from 'react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 underline mb-4 inline-block"
            >
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What Are Cookies?
              </h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
                when you visit our website. They help us provide you with a better experience by:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Remembering your preferences and settings</li>
                <li>Analyzing how you use our website</li>
                <li>Improving our services based on user behavior</li>
                <li>Providing personalized content and recommendations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Types of Cookies We Use
              </h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  Analytics Cookies
                </h3>
                <p className="text-gray-700 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Google Analytics (G-1BT14876FD)</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    We use Google Analytics to analyze website traffic and user behavior. This service may collect:
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Pages visited and time spent on each page</li>
                    <li>How you reached our website (search terms, referring sites)</li>
                    <li>Your general location (city/country level)</li>
                    <li>Device and browser information</li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  Microsoft Clarity (sm6m50ani5)
                </h3>
                <p className="text-gray-700 mb-3">
                  We use Microsoft Clarity to better understand how users interact with our website through 
                  heatmaps and session recordings.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Microsoft Clarity may collect:
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Mouse movements and clicks</li>
                    <li>Scroll behavior</li>
                    <li>Page interaction patterns</li>
                    <li>Session recordings (with user consent)</li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  Essential Cookies
                </h3>
                <p className="text-gray-700 mb-3">
                  These cookies are necessary for the website to function properly and cannot be disabled.
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Cookie consent preferences</li>
                  <li>Session management</li>
                  <li>Security and fraud prevention</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How to Manage Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                You have several options for managing cookies:
              </p>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Browser Settings
                </h3>
                <p className="text-gray-700 mb-2">
                  Most browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete existing cookies</li>
                  <li>Set preferences for specific websites</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Our Cookie Banner
                </h3>
                <p className="text-gray-700">
                  When you first visit our website, you'll see a cookie consent banner that allows you to 
                  accept or decline non-essential cookies. You can change your preferences at any time by 
                  clearing your browser cookies and refreshing the page.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Third-Party Services
              </h2>
              <p className="text-gray-700 mb-4">
                We use the following third-party services that may set their own cookies:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Google Analytics</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Purpose:</strong> Website analytics and performance monitoring<br/>
                  <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://policies.google.com/privacy</a>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Microsoft Clarity</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Purpose:</strong> User behavior analysis and website optimization<br/>
                  <strong>Privacy Policy:</strong> <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://privacy.microsoft.com/en-us/privacystatement</a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Rights
              </h2>
              <p className="text-gray-700 mb-4">
                Under applicable data protection laws, you have the right to:
              </p>
              <ul className="text-gray-700 list-disc list-inside space-y-2">
                <li>Withdraw your consent to cookies at any time</li>
                <li>Request information about what data we collect</li>
                <li>Request deletion of your personal data</li>
                <li>Object to the processing of your data</li>
                <li>Lodge a complaint with your local data protection authority</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Updates to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons. We will notify you of any 
                material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about this Cookie Policy or our use of cookies, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@leftrightlabs.com<br/>
                  <strong>Address:</strong> Left Right Labs, [Your Address]<br/>
                  <strong>Phone:</strong> [Your Phone Number]
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}