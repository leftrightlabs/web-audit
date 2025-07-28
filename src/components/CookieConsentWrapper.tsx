'use client';

import React from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import CookieConsent from './CookieConsent';
import TrackingScripts from './TrackingScripts';

const CookieConsentWrapper: React.FC = () => {
  const { consent, showBanner, acceptCookies, declineCookies } = useCookieConsent();

  return (
    <>
      <TrackingScripts consent={consent || false} />
      {showBanner && (
        <CookieConsent
          onAccept={acceptCookies}
          onDecline={declineCookies}
        />
      )}
    </>
  );
};

export default CookieConsentWrapper;