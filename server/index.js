import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import leadRoutes from "./routes/lead.js";

dotenv.config();

const app = express();

/* ✅ CORS Configuration */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-spend-audit-beige.vercel.app/",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

/* ✅ Health Check Route */
app.get("/", (req, res) => {
  res.json({
    status: "API running",
  });
});

/* ✅ Lead Routes */
app.use("/api/lead", leadRoutes);

/* ✅ OpenAI Client */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ✅ AI Summary Route */
app.post("/api/summary", async (req, res) => {
  try {
    const { audit } = req.body;

    if (!audit) {
      return res.status(400).json({
        error: "Audit data required",
      });
    }

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

    const completion =
      await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    res.json({
      success: true,
      summary:
        completion.choices[0].message.content,
    });

  } catch (err) {
    console.error(err);

    /* ✅ Fallback Summary */
    res.json({
      success: true,
      summary:
        "You have opportunities to reduce AI spending by optimizing your current plans. Review recommended changes to lower costs efficiently.",
    });
  }
});

/* ✅ Server */
const PORT = process.env.PORT || 5000;

/* ✅ Prevent tests from starting server */
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

export default app;
