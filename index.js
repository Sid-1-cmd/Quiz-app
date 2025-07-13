const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.My_API_KEY,
});

app.post("/generate-quiz", async (req, res) => {
  const { subject } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Generate a 5-question multiple-choice quiz on ${subject}. Format:
[
  {
    "question": "What is the capital of France?",
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "answer": "Paris"
  }
]`
      }],
    });

    const result = completion.choices[0].message.content;
    const quiz = JSON.parse(result);
    res.json(quiz);
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

app.get("/", (req, res) => {
  res.send("Quiz API is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
