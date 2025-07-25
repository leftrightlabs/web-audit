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
  // Basic extraction of text from HTML for analysis
  // Remove scripts, styles, and HTML tags
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  
  // Truncate if too long (GPT has token limits)
  const maxLength = 12000;
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }
  
  return text;
};

// Analyze website content using OpenAI
export const analyzeWebsite = async (
  url: string,
  businessGoal?: string,
  industry?: string,
  runningAds?: string
): Promise<AuditResult> => {
  try {
    const client = initOpenAI();
    const websiteContent = await fetchWebsiteContent(url);
    const extractedText = extractTextFromHtml(websiteContent);
    
    // Create a structured prompt for OpenAI
    const prompt = `
      You are a professional website branding consultant conducting a brand audit. Analyze this website content and provide detailed, actionable feedback:

      Website URL: ${url}
      ${businessGoal ? `Primary Business Goal: ${businessGoal}` : ''}
      ${industry ? `Industry: ${industry}` : ''}
      ${runningAds ? `Currently Running Paid Ads: ${runningAds}` : ''}
      
      Website Content Extract:
      ---
      ${extractedText}
      ---

      Provide a comprehensive brand audit with the following:
      
      1. A concise summary paragraph of the overall branding effectiveness.
      2. 3-5 specific brand and design strengths.
      3. 3-5 key areas for improvement related to brand consistency, messaging clarity, design, user experience, and content.
      4. At least 3 detailed, actionable next steps the business should take to improve their branding.
      5. 2-3 tailored improvements specific to their ${industry || 'industry'} and ${businessGoal ? businessGoal.toLowerCase() : 'business'} goals.

      Format your response as structured JSON with these keys: summary, strengths (array), weaknesses (array), actionableSteps (array), and improvements (array).
    `;

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