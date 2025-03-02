import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables (Vercel automatically loads .env files during local development)
dotenv.config();

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { prompt, notes } = req.body;
  if (!prompt || !notes) {
    return res.status(400).json({ error: 'Missing prompt or notes' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key is not configured.' });
  }

  // Initialize the Gemini client using GoogleGenerativeAI
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  // Use the desired Gemini model; adjust the model identifier as needed
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Build the prompt. (Make sure it follows your desired instructions.)
  const fullPrompt = `
You are an expert study note enhancer. Your task is to transform the given study notes into comprehensive, well-organized study materials, formatted in Markdown.
IMPORTANT:
- If the input text is trivial (e.g. "hello" or only emojis), simply return the input with only minor corrections (like capitalizing the first letter).
- Do not include any extra commentary or transitional sentences.
Here are the notes to improve:
${notes}
`;

  try {
    const result = await model.generateContent(fullPrompt);
    const improvedNotes = result.response.text();
    res.status(200).json({ improvedNotes });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to connect to Gemini API. Please check your API key and try again.' });
  }
}
