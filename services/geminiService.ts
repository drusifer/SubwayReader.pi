import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ensure this is set in your build environment
const ai = new GoogleGenAI({ apiKey });

export const generateSummary = async (markdownContent: string): Promise<string> => {
  // If no API key is present (e.g. initial simulated run without env), return a placeholder
  if (!apiKey) {
    console.warn("No API_KEY found in process.env. Returning mock summary.");
    return "AI Summary unavailable (Missing API Key)";
  }

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
    console.error("Gemini API Error:", error);
    return "Summary generation failed.";
  }
};