import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Gemini client using the GoogleGenerativeAI library
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Use the desired Gemini model; adjust the model identifier as needed
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Calls the Gemini API to improve the provided notes.
 * The prompt instructs the AI to output ONLY the enhanced notes in Markdown format,
 * with no prefatory or transitional sentences. If the input text is trivial (e.g. "hello" or only emojis),
 * only apply minor corrections such as capitalizing the first letter.
 *
 * @param {string} notes - The notes to improve.
 * @returns {Promise<string>} - The enhanced notes.
 */
async function callGemini(notes) {
  const prompt = `
You are an expert study note enhancer. Your task is to transform the given study notes into comprehensive, well-organized study materials, formatted in Markdown. Do not include any introductory, transitional, or prefatory sentences (e.g., do not say "Okay, I will enhance it" or similar). Simply output the enhanced study notes.

IMPORTANT:
- If the input text is trivial (e.g., just a greeting like "hello" or only emojis), return the input with only minor corrections (e.g., capitalize the first letter).
- Otherwise, expand bullet points into detailed, clear sentences, organize the content into logical sections with headings, and add any necessary context and connections between ideas.

Here are the notes to improve:

${notes}
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to connect to Gemini API. Please check your API key and try again.');
  }
}

app.post("/ai-improve", async (req, res) => {
  const { prompt, notes } = req.body;
  if (!prompt || !notes) {
    return res.status(400).json({ error: "Missing prompt or notes" });
  }

  try {
    const improvedNotes = await callGemini(notes);
    res.json({ improvedNotes });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to call Gemini API" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
