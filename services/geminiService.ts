import { GoogleGenAI } from "@google/genai";

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

    // Use the model directly as requested in guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Summary unavailable.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Summary generation failed.";
  }
};