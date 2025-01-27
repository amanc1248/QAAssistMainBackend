const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAIResponse(context, question) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Context about the system and the changes:\n${context}\n\nQuestion: ${question}\n\nPlease provide a response based on the context provided above.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('Failed to get AI response');
  }
}

module.exports = { getAIResponse }; 