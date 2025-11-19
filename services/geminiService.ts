import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { AnalysisResult } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
// Note: We create the client inside the function to ensure it picks up the key if it changes, 
// though in this app structure it's static.
const getAiClient = () => new GoogleGenAI({ apiKey });

export const analyzePrompt = async (promptText: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Analyze the following coding prompt used in a Vibe Coding tool. 
    Extract a catchy title, a concise summary (max 2 sentences), relevant technical tags (max 5), and a complexity score (1-10).
    
    Prompt:
    ${promptText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          tags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          complexityScore: { type: Type.INTEGER }
        },
        required: ["title", "summary", "tags", "complexityScore"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    return JSON.parse(text) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Failed to parse AI analysis");
  }
};

export const generateSearchEmbeddings = async (text: string) => {
   // Placeholder for future embedding logic if needed for semantic search
   // Currently using keyword search in the app for simplicity
   return null; 
};