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

  const prompt = `
Generate a multiple-choice quiz on the subject: "${subject}".

Format the result as a JSON array like:
[
  {
    "question": "Sample Question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Correct Option",
    "marks": 1
  },
  ...
]

The quiz must contain:
- 10 questions worth 1 mark
- 5 questions worth 2 marks
- 3 questions worth 3 marks

Use simple, clear language. Keep it structured and valid JSON.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const resultText = completion.choices[0].message.content.trim();

    // Try parsing the response as JSON
    let quiz;
    try {
      quiz = JSON.parse(resultText);
    } catch (jsonErr) {
      console.error("JSON parsing failed:", jsonErr.message);
      return res.status(500).json({ error: "Invalid AI response format" });
    }

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
