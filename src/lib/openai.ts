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
      You are a senior branding strategist who specializes in high-impact online presence for businesses in the ${industry || 'given'} industry. Your task is to carry out a thorough yet easy-to-understand website brand audit. Examine the website content below in the context of best-in-class practices for this industry and the stated business goal. Speak directly to a busy founder or marketing lead – be clear, constructive, and avoid generic fluff.

      Website URL: ${url}
      ${businessGoal ? `Primary Business Goal: ${businessGoal}` : ''}
      ${industry ? `Industry: ${industry}` : ''}
      ${runningAds ? `Currently Running Paid Ads: ${runningAds}` : ''}

      -------------
      WEBSITE CONTENT EXTRACT
      -------------
      ${extractedText}
      -------------

      After carefully reviewing the site, return a JSON object with the following keys exactly: summary, strengths, weaknesses, actionableSteps, improvements.

      Requirements for each key:

      1. summary – 1–2 short paragraphs that evaluate the overall brand experience, written in second person and referencing their industry to make it feel personalized (e.g. “As a B2B SaaS company…”).
      2. strengths – an array with 3-5 bullet points describing concrete brand/design/UX strengths. Each bullet should be 1 concise sentence.
      3. weaknesses – an array with 3-5 bullet points highlighting the most critical gaps or inconsistencies. Be specific and root the feedback in industry expectations.
      4. actionableSteps – an array containing ONLY the Top 3 most important next steps, prioritized by impact. Each step should start with an imperative verb, include a short rationale, and, where helpful, an example.
      5. improvements – an array with 2-3 additional tailored suggestions that link directly to their ${industry || 'industry'} context and their ${businessGoal ? businessGoal.toLowerCase() : 'business'} goals.

      Reply ONLY with valid JSON that matches the schema described above. Do not wrap your answer in markdown or add any extraneous text.
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