'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [showPolicy, setShowPolicy] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              We use cookies to improve your experience
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              This website uses cookies and similar technologies to analyze site usage, 
              provide personalized content, and improve our services. By continuing to use 
              this site, you consent to our use of cookies.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPolicy(!showPolicy)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {showPolicy ? 'Hide' : 'View'} Cookie Policy
              </button>
              <Link
                href="/cookie-policy"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Full Cookie Policy
              </Link>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>

        {showPolicy && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Cookie Policy</h4>
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                <strong>What are cookies?</strong> Cookies are small text files that are stored on your device 
                when you visit our website. They help us provide you with a better experience.
              </p>
              
              <div>
                <strong>We use the following types of cookies:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong>Analytics cookies:</strong> Google Analytics (G-1BT14876FD) and Microsoft Clarity 
                    help us understand how visitors use our website so we can improve it.
                  </li>
                  <li>
                    <strong>Essential cookies:</strong> These are necessary for the website to function properly.
                  </li>
                </ul>
              </div>
              
              <p>
                <strong>Third-party services:</strong> We use Google Analytics and Microsoft Clarity to analyze 
                website traffic and user behavior. These services may collect information about your device, 
                location, and browsing patterns.
              </p>
              
              <p>
                <strong>Your choices:</strong> You can decline cookies, but some features may not work properly. 
                You can also manage your cookie preferences in your browser settings.
              </p>
              
              <p>
                <strong>Updates:</strong> This cookie policy may be updated from time to time. 
                Please check back periodically for any changes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;