// --- Gemini API Configuration ---
// TODO: Replace with your actual Gemini API Key
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "";
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-09-2025",
});
