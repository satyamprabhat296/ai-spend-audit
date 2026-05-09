import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import leadRoutes from "./routes/lead.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ Lead Routes */
app.use("/api/save-lead", leadRoutes);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ✅ AI Summary Route */
app.post("/api/summary", async (req, res) => {
  try {
    const { audit } = req.body;

    const prompt = `
You are an AI cost optimization expert.

Given this audit result:
${JSON.stringify(audit)}

Write a short 80-100 word summary explaining:
- Where the user is overspending
- What they should change
- Total savings impact

Keep it simple and actionable.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      summary: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error(err);

    // ✅ Fallback summary
    res.json({
      summary:
        "You have opportunities to reduce AI spending by optimizing your current plans. Review recommended changes to lower costs efficiently.",
    });
  }
});

const PORT = 5000;

/* ✅ Prevent server from starting during tests */
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

export default app;