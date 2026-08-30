import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Add CORS headers just in case
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is missing on the server." });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    let prompt = `You are the IMRC (International Monetary Rehabilitation Cooperation) AI Assistant. You help victims of identity theft and financial abuse. Be helpful, professional, and empathetic.\n\nUser says: ${message}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt
    });
    
    res.status(200).json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat request." });
  }
}
