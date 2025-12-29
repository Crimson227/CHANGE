import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const resetChat = (): void => {
  chatSession = null;
  initializeChat();
};

export const initializeChat = (): void => {
  const ai = getGenAI();
  // Switched to gemini-3-flash-preview to resolve 500 errors and improve response speed for interactive fiction
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};

export const sendMessageStream = async (
  message: string, 
  onChunk: (text: string) => void
): Promise<void> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
     throw new Error("Failed to initialize chat session.");
  }

  try {
    const resultStream = await chatSession.sendMessageStream({ message });
    
    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        onChunk(c.text);
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};