import { useState, useEffect } from 'react';

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check localStorage for existing consent
    const savedConsent = localStorage.getItem('cookie-consent');
    if (savedConsent !== null) {
      setConsent(savedConsent === 'true');
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    setConsent(true);
    setShowBanner(false);
    localStorage.setItem('cookie-consent', 'true');
  };

  const declineCookies = () => {
    setConsent(false);
    setShowBanner(false);
    localStorage.setItem('cookie-consent', 'false');
  };

  const resetConsent = () => {
    localStorage.removeItem('cookie-consent');
    setConsent(null);
    setShowBanner(true);
  };

  return {
    consent,
    showBanner,
    acceptCookies,
    declineCookies,
    resetConsent,
  };
};