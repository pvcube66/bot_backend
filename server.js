const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 5000;

// Hardcoded API key
const apiKey = "AIzaSyA5E7GuZU7VxzRJ8UM5X2KMNZLz3dlmjJU";

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Middleware
app.use(bodyParser.json());

// Function to get response from Gemini AI
async function getResponse(userInput) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      },
      history: [],
    });

    const result = await chatSession.sendMessage(userInput);
    return result.response.text();
  } catch (error) {
    console.error("❌ Error getting response:", error);
    return "Error processing request.";
  }
}

// API endpoint to handle chat requests
app.post("/chat", async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    return res.status(400).json({ status: "error", response: "Message is required." });
  }

  console.log("User Input:", userInput);
  const response = await getResponse(userInput);

  res.json({
    status: "success",
    message: userInput,
    response: response,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://127.0.0.1:${port}`);
});
