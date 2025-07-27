import { OpenAI } from 'openai';
import { AuditResult } from '@/types';
import axios from 'axios';

// Initialize OpenAI client
let openai: OpenAI;

// Initialize OpenAI with API key
const initOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  return openai;
};

// Extract website content
const fetchWebsiteContent = async (url: string): Promise<string> => {
  try {
    // If URL doesn't start with http or https, add https
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching website content:', error);
    throw new Error('Failed to fetch website content. Please check the URL and try again.');
  }
};

// Extract key text content from HTML
const extractTextFromHtml = (html: string): string => {
  // Enhanced extraction to include CSS and styling information
  let text = html;
  
  // Extract CSS styles for color and font analysis
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  const linkMatches = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi);
  
  // Extract inline styles
  const inlineStyleMatches = html.match(/style=["']([^"']*)["']/gi);
  
  // Remove scripts and HTML tags but keep some structural info
  text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  
  // Add CSS information for better visual analysis
  let cssInfo = '';
  if (styleMatches) {
    cssInfo += '\n\nCSS STYLES FOUND:\n' + styleMatches.join('\n');
  }
  if (linkMatches) {
    cssInfo += '\n\nEXTERNAL STYLESHEETS:\n' + linkMatches.join('\n');
  }
  if (inlineStyleMatches) {
    cssInfo += '\n\nINLINE STYLES:\n' + inlineStyleMatches.join('\n');
  }
  
  // Combine text with CSS info
  text = text + cssInfo;
  
  // Truncate if too long (GPT has token limits)
  const maxLength = 12000;
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }
  
  return text;
};

// Export the prompt builder function for debugging
export const buildPrompt = (
  url: string,
  businessGoal?: string,
  industry?: string,
  runningAds?: string,
  targetAudience?: string,
  brandPersonality?: string,
  extractedText?: string
): string => {
  return `
    You are a seasoned brand strategist and UX expert. Your task is to perform a full brand audit based on the provided website content and details. Assume the site is live and customer-facing.

    First, carefully evaluate the website in these four key areas:
    1. Branding and Positioning (clarity, consistency, voice)
    2. User Experience (UX) and Design (navigation, CTAs, aesthetics)
    3. Conversion and Trust (credibility, funnels, value proposition)
    4. Content and SEO (relevance, optimization, engagement)

    After your evaluation, generate a response in the following JSON format:

    {
      "summary": "A personalized brand audit summary, written in a helpful and professional tone, integrating your findings from the four key areas.",
      "strengths": [
        "A bulleted list of 3-5 key strengths of the website, based on your analysis.",
        "Each point should be a concise sentence."
      ],
      "weaknesses": [
        "A bulleted list of 3-5 critical weaknesses or areas for improvement.",
        "Be specific and constructive in your feedback."
      ],
      "actionableSteps": [
        "The Top 3 most important, high-impact next steps the business owner should take.",
        "Each step should be clearly explained and actionable.",
        "This section's content should correspond to a section titled 'Top 3 Recommended Next Steps' in a human-readable report."
      ],
      "improvements": [
        "2-3 additional tailored suggestions for improvement, kept concise."
      ],
      "pillarScores": {
        "branding": 85,
        "ux": 78,
        "conversion": 70,
        "content": 82
      },
      "colorPalette": [],
      "fonts": []
    }
    
    ---
    IMPORTANT CONTEXT
    ---
    Website URL: ${url}
    ${businessGoal ? `Primary Business Goal: ${businessGoal}` : ''}
    ${industry ? `Industry: ${industry}` : ''}
    ${runningAds ? `Currently Running Paid Ads: ${runningAds}` : ''}
    ${targetAudience ? `Ideal Audience: ${targetAudience}` : ''}
    ${brandPersonality ? `Desired Brand Personality: ${brandPersonality}` : ''}
    
    ---
    WEBSITE CONTENT FOR ANALYSIS
    ---
    ${extractedText || '[Content will be fetched during analysis]'}
    ---

    CRITICAL INSTRUCTIONS FOR VISUAL IDENTITY:
    • Analyze the website's actual color scheme and extract 3-5 primary hex color codes (e.g., "#ff69b4", "#000000")
    • Identify the main fonts used on the website (e.g., "Arial", "Helvetica", "Georgia")
    • Do NOT use placeholder values - extract real colors and fonts from the website content
    • If you cannot determine colors/fonts from the content, leave the arrays empty

    Replace all example values with the actual values you calculate. Use ONLY:
    • Numbers (0-100) for pillarScores.
    • Valid hex strings (e.g. "#1e90ff") for colorPalette.
    • Plain font family names for fonts.

    Provide ONLY the valid JSON object as your response. Do NOT include any text or markdown before or after the JSON.
  `;
};

// Analyze website content using OpenAI
export const analyzeWebsite = async (
  url: string,
  businessGoal?: string,
  industry?: string,
  runningAds?: string,
  targetAudience?: string,
  brandPersonality?: string
): Promise<AuditResult> => {
  try {
    const client = initOpenAI();
    const websiteContent = await fetchWebsiteContent(url);
    const extractedText = extractTextFromHtml(websiteContent);
    
    // Use the buildPrompt function
    const prompt = buildPrompt(url, businessGoal, industry, runningAds, targetAudience, brandPersonality, extractedText);

    const response = await client.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are a professional website branding consultant providing detailed, constructive analysis.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}') as AuditResult;
    
    return result;
  } catch (error) {
    console.error('Error analyzing website:', error);
    throw new Error('Failed to analyze website. Please try again later.');
  }
}; 