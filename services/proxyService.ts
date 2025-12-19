import { GoogleGenAI } from "@google/genai";
import { ProxyResponse } from '../types';
import { MOCK_MARKDOWN_CONTENT } from '../constants';

// Helper to instantiate client lazily
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

// Renamed internally to reflect it's now an AI fetcher, though filename remains for consistency
export const fetchArticle = async (
  url: string, 
  isSimulated: boolean
): Promise<ProxyResponse> => {
  
  if (isSimulated) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      title: "Simulated Article Title",
      content: MOCK_MARKDOWN_CONTENT,
      excerpt: "This is a simulated excerpt for testing purposes.",
      siteName: "Simulated Source"
    };
  }

  // Live Mode: Use Gemini with Search Grounding to read the web
  try {
    const ai = getAiClient();
    const prompt = `
      You are a specialized reading assistant.
      
      TASK:
      1. Find the full content of the article located at this URL: ${url}
      2. Reconstruct the article as clean, readable Markdown.
      3. Start with the Title as an # H1.
      4. Remove all ads, navigation, and sidebars.
      5. If the exact full text is behind a hard paywall or inaccessible, provide a comprehensive summary of the topic based on available search results.
    `;

    // Using gemini-3-flash-preview as recommended for standard search grounding tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    // Basic parsing of the Markdown
    const titleMatch = text.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : "Article Content";
    
    const excerpt = text.split('\n\n')
      .find(p => p.length > 50 && !p.trim().startsWith('#') && !p.trim().startsWith('*'))
      ?.slice(0, 150) + "..." || "Read the full article below.";

    return {
      title: title,
      content: text,
      excerpt: excerpt,
      siteName: new URL(url).hostname
    };

  } catch (error) {
    console.error("Gemini Content Fetch failed:", error);
    throw error;
  }
};