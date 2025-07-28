'use client';

import { useEffect } from 'react';

interface TrackingScriptsProps {
  consent: boolean;
}

const TrackingScripts: React.FC<TrackingScriptsProps> = ({ consent }) => {
  useEffect(() => {
    if (!consent) return;

    // Google Analytics
    const loadGoogleAnalytics = () => {
      // Load gtag script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-1BT14876FD';
      document.head.appendChild(script1);

      // Initialize gtag
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-1BT14876FD');
      `;
      document.head.appendChild(script2);
    };

    // Microsoft Clarity
    const loadMicrosoftClarity = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "sm6m50ani5");
      `;
      document.head.appendChild(script);
    };

    // Load both tracking scripts
    loadGoogleAnalytics();
    loadMicrosoftClarity();

    // Cleanup function
    return () => {
      // Remove tracking scripts if consent is revoked
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.src.includes('googletagmanager.com') || 
            script.src.includes('clarity.ms') ||
            script.innerHTML.includes('gtag') ||
            script.innerHTML.includes('clarity')) {
          script.remove();
        }
      });
    };
  }, [consent]);

  return null; // This component doesn't render anything
};

export default TrackingScripts;