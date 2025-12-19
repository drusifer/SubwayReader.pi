import { GoogleGenAI, Type } from "@google/genai";
import { Article, AppSettings, UserProfile } from "../types";

// Helper to instantiate client lazily
const getAiClient = () => {
  // Use process.env.API_KEY directly as per guidelines
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const generateSummary = async (markdownContent: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
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
    return "Summary unavailable.";
  }
};

export const fetchHeadlines = async (settings?: AppSettings, user?: UserProfile | null): Promise<Article[]> => {
  try {
    const ai = getAiClient();
    const interests = settings?.interests || "Technology, Science, Long-form Essays, History";
    
    // Personalization logic
    const curatorContext = user 
        ? `You are ${user.name}'s personal news curator. They have trusted you to find articles matching their specific taste.` 
        : `You are a personalized news curator.`;

    const prompt = `
      ${curatorContext}
      The user is interested in: "${interests}".
      
      TASK:
      1. Use Google Search to find 6 HIGH QUALITY, RECENT, and REAL long-form articles matching the user's interests.
      2. Prioritize reputable sources (e.g., NYT, BBC, The Atlantic, Paul Graham, Ars Technica) and avoid video platforms.
      3. Return the results strictly as a JSON array matching the schema below.
      
      Ensure every URL is valid and leads directly to an article.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for better reasoning with Search tool
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable Search Grounding
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
      return data.map((item: any) => ({
        ...item,
        // Ensure ID is unique enough (Gemini often generates generic IDs like '1', '2')
        id: `gen_${Math.random().toString(36).substr(2, 9)}`, 
        isDownloaded: false,
      }));
    }
    
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini API Error (Headlines):", error);
    throw error;
  }
};