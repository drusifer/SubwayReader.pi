import { GoogleGenAI } from "@google/genai";
import { ProxyResponse } from '../types';
import { MOCK_MARKDOWN_CONTENT } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchArticle = async (
  url: string, 
  _serverUrl: string, // Deprecated, kept for signature compatibility but unused
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

  // Live Mode: Use Gemini 3 Pro with Search Grounding to "read" the web
  // This replaces the need for a custom CORS proxy server.
  try {
    const prompt = `
      You are a specialized content extractor.
      
      TASK:
      1. Access the following URL using Google Search: ${url}
      2. Extract the FULL article content.
      3. Format the output as clean, readable Markdown.
      4. Do NOT include ads, navigation menus, or sidebars.
      5. Start the markdown with the article Title as an # H1.
      
      If you cannot access the specific content, provide a detailed summary of what is publicly known about this specific link.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Pro model required for complex Search tasks
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("Gemini could not retrieve content for this URL.");
    }

    // Basic parsing of the Markdown to extract a title if possible, 
    // otherwise fallback to a generic one.
    const titleMatch = text.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : "Article Content";
    
    // Create a rough excerpt from the first paragraph
    const excerpt = text.split('\n\n').find(p => p.length > 50 && !p.startsWith('#'))?.slice(0, 150) + "..." || "";

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