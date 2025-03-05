const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all origins (allow everyone)
app.use(cors());

app.use(bodyParser.json());

// API key should be stored in environment variables
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

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

app.listen(port, () => {
  console.log(`✅ Server running at http://127.0.0.1:${port}`);
});
