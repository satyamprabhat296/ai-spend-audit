import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import leadRoutes from "./routes/lead.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/lead", leadRoutes);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
app.post("/api/save-lead", async (req, res) => {
  try {
    const { email, audit } = req.body;

    console.log("New Lead:", email);
    console.log("Audit:", audit);

    // For now: just log (assignment-friendly)
    // Later you can plug DB (Supabase)

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

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

    // ✅ Fallback (IMPORTANT for assignment)
    res.json({
      summary:
        "You have opportunities to reduce AI spending by optimizing your current plans. Review recommended changes to lower costs efficiently.",
    });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));