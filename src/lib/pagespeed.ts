import { LighthouseData } from '@/types';

export const getLighthouseMetrics = async (
  url: string
): Promise<LighthouseData | null> => {
  const apiKey = process.env.PAGESPEED_API_KEY;

  if (!apiKey) {
    console.warn(
      'PAGESPEED_API_KEY is not set. Skipping Lighthouse analysis.'
    );
    return null;
  }

  try {
    const api_url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&key=${apiKey}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`;

    const response = await fetch(api_url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { lighthouseResult } = data;
    const { categories } = lighthouseResult;

    return {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
    };
  } catch (error) {
    console.error('Error fetching Lighthouse metrics:', error);
    return null;
  }
}; 