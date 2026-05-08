import express from "express";

const router = express.Router();

let leads = []; // simple in-memory storage (OK for assignment)

router.post("/", (req, res) => {
  const { email, audit } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  leads.push({
    email,
    audit,
    createdAt: new Date(),
  });

  console.log("📩 New Lead Captured:", email);

  res.json({ success: true });
});

export default router;