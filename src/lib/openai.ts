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
  // Enhanced extraction to include structured content for better personalization
  let structuredContent = '';
  
  // Extract headings (H1, H2, H3, etc.) - these are often key brand messages
  const headingMatches = html.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi);
  if (headingMatches) {
    structuredContent += '\n\nHEADINGS FOUND:\n';
    headingMatches.forEach((heading, index) => {
      const cleanHeading = heading.replace(/<[^>]*>/g, '').trim();
      if (cleanHeading) {
        structuredContent += `H${index + 1}: "${cleanHeading}"\n`;
      }
    });
  }
  
  // Extract images and their alt text
  const imageMatches = html.match(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi);
  if (imageMatches) {
    structuredContent += '\n\nIMAGES WITH ALT TEXT:\n';
    imageMatches.forEach((img, index) => {
      const altMatch = img.match(/alt=["']([^"']*)["']/i);
      if (altMatch && altMatch[1]) {
        structuredContent += `Image ${index + 1}: "${altMatch[1]}"\n`;
      }
    });
  }
  
  // Extract navigation links
  const navMatches = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/gi);
  if (navMatches) {
    structuredContent += '\n\nNAVIGATION MENU:\n';
    navMatches.forEach((nav, index) => {
      const linkMatches = nav.match(/<a[^>]*>([^<]+)<\/a>/gi);
      if (linkMatches) {
        structuredContent += `Nav ${index + 1}: ${linkMatches.map(link => link.replace(/<[^>]*>/g, '').trim()).join(' | ')}\n`;
      }
    });
  }
  
  // Extract buttons and CTAs
  const buttonMatches = html.match(/<button[^>]*>([^<]+)<\/button>/gi);
  const ctaMatches = html.match(/<a[^>]*class[^>]*button[^>]*>([^<]+)<\/a>/gi);
  if (buttonMatches || ctaMatches) {
    structuredContent += '\n\nCALL-TO-ACTIONS:\n';
    [...(buttonMatches || []), ...(ctaMatches || [])].forEach((cta, index) => {
      const cleanCta = cta.replace(/<[^>]*>/g, '').trim();
      if (cleanCta) {
        structuredContent += `CTA ${index + 1}: "${cleanCta}"\n`;
      }
    });
  }
  
  // Extract meta title and description
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (titleMatch || descMatch) {
    structuredContent += '\n\nMETA INFORMATION:\n';
    if (titleMatch) {
      structuredContent += `Page Title: "${titleMatch[1]}"\n`;
    }
    if (descMatch) {
      structuredContent += `Meta Description: "${descMatch[1]}"\n`;
    }
  }
  
  // Extract CSS styles for color and font analysis
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  const linkMatches = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi);
  const inlineStyleMatches = html.match(/style=["']([^"']*)["']/gi);
  
  // Remove scripts and HTML tags but keep some structural info
  let text = html
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
  
  // Combine all content
  text = structuredContent + '\n\nMAIN CONTENT:\n' + text + cssInfo;
  
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
    You are a seasoned brand strategist and UX expert. Your task is to perform a highly personalized brand audit based on the specific content and elements found on this website. Your analysis should reference actual text, images, and specific elements from the site to make it feel truly customized.

    CRITICAL PERSONALIZATION REQUIREMENTS:
    • Reference specific headlines, taglines, or key phrases from the website
    • Mention actual product names, service offerings, or unique selling points found on the site
    • Reference specific images, graphics, or visual elements you can identify
    • Quote or paraphrase actual content from the website when making points
    • Use the business's actual name, industry terminology, and specific language they use
    • Reference specific pages, sections, or features you can identify from the content

    First, carefully evaluate the website in these four key areas:
    1. Branding and Positioning (clarity, consistency, voice)
    2. User Experience (UX) and Design (navigation, CTAs, aesthetics)
    3. Conversion and Trust (credibility, funnels, value proposition)
    4. Content and SEO (relevance, optimization, engagement)

    After your evaluation, generate a response in the following JSON format:

    {
      "summary": "A highly personalized brand audit summary that references specific content from the website. Include actual headlines, product names, or key phrases you found. Write in a helpful and professional tone, integrating your findings from the four key areas while making it clear this analysis is specifically about this website's content.",
      "strengths": [
        "3-5 key strengths that reference specific elements from the website. For example: 'Your headline \"[actual headline]\" effectively communicates your value proposition' or 'The [specific feature/product] section demonstrates strong brand positioning'",
        "Each point should reference actual content, images, or elements from the site",
        "Be specific about what you found and why it works well"
      ],
      "weaknesses": [
        "3-5 critical weaknesses that reference specific content or missing elements. For example: 'The [specific section] could be improved by...' or 'Your [actual product/service] description lacks...'",
        "Reference actual content when possible and be specific about what needs improvement",
        "Be constructive and actionable in your feedback"
      ],
      "actionableSteps": [
        "The Top 3 most important, high-impact next steps that reference specific content from the website. For example: 'Revise your [actual headline] to better communicate...' or 'Add testimonials to your [specific product] page'",
        "Each step should reference actual content, pages, or elements from the site",
        "Make it clear these recommendations are specifically for this website's content"
      ],
      "improvements": [
        "2-3 additional tailored suggestions that reference specific content or elements from the website",
        "Reference actual pages, sections, or content when making suggestions"
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

    PERSONALIZATION EXAMPLES:
    • Instead of "Your headline could be improved" say "Your headline '[actual headline text]' could be improved by..."
    • Instead of "Add testimonials" say "Add testimonials to your [specific product/service] page"
    • Instead of "Improve your value proposition" say "Your value proposition about [specific offering] could be strengthened by..."
    • Reference actual product names, service descriptions, or unique features you find
    • Quote specific phrases or taglines from the website when making points

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