// app/api/simplify/route.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Initialize the AI Model ---

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// --- The API Handler Function ---

// Use a named export for the POST method
export async function POST(request: Request) {
  try {
    // 1. Get the JSON body from the Request object
    const { textToSimplify } = await request.json();

    // 2. Validate input
    if (!textToSimplify || typeof textToSimplify !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid input: "textToSimplify" must be a non-empty string.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Define the AI Prompt (Core logic is the same)
    const prompt = `
      You are an expert in early childhood education and linguistics... [truncated for brevity]
      
      ... Return ONLY the simplified text, formatted as a JSON array of strings,
          where each string is a simplified sentence.

      Original Text:
      "${textToSimplify}"

      Simplified JSON:
    `;

    // 4. Call the AI model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonString = response.text();

    // 5. Clean and parse the AI's response
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7, -3).trim();
    }

    const simplifiedSentences = JSON.parse(jsonString) as string[];

    // 6. Send the successful response using the standard Web Response object
    return new Response(JSON.stringify({ simplifiedSentences }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in /api/simplify:', error);
    return new Response(JSON.stringify({ error: 'Failed to simplify text.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Optional: Prevent other methods (GET, PUT, etc.)
export async function GET() {
  return new Response(null, { status: 405, statusText: 'Method Not Allowed' });
}