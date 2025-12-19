import { GoogleGenAI, Type } from "@google/genai";
import { Article } from "../types";

// Initialize the client exactly as prescribed in the guidelines
// The API key is injected via vite.config.ts define
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSummary = async (markdownContent: string): Promise<string> => {
  try {
    // Truncate content to avoid token limits if the article is huge
    const truncatedContent = markdownContent.slice(0, 10000); 

    const prompt = `
      You are a helpful reading assistant. 
      Summarize the following markdown article into a concise, engaging teaser of exactly 15-20 words.
      Do not use introductory phrases like "Here is a summary". Just give the summary.
      
      Article Content:
      ${truncatedContent}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Summary unavailable.";

  } catch (error) {
    console.error("Gemini API Error (Summary):", error);
    return "Summary generation failed.";
  }
};

export const fetchHeadlines = async (): Promise<Article[]> => {
  try {
    const prompt = `
      Generate a list of 6 distinct, interesting, and real web articles suitable for reading on a commute.
      Focus on Technology, Science, Long-form Essays, or interesting Wikipedia History topics.
      
      Requirements:
      1. Use REAL, VALID URLs. Do not hallucinate links. Prefer major sites like Wikipedia, Paul Graham, Ars Technica, The Verge, or BBC.
      2. Ensure the articles are text-heavy (good for reading mode).
      3. Do not include video sites (YouTube) or paywalled sites (WSJ, FT).
      4. Create a unique ID for each using a simple hash or random string.
      5. Provide a short 10-word teaser summary.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              url: { type: Type.STRING },
              category: { type: Type.STRING },
              source: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ['id', 'title', 'url', 'category', 'source', 'summary'],
          },
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Ensure mapped correctly and add required frontend flags
      return data.map((item: any) => ({
        ...item,
        isDownloaded: false, // Default to false for new headlines
      }));
    }
    
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini API Error (Headlines):", error);
    throw error;
  }
};