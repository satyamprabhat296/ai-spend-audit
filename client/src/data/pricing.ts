type Plan = {
  price: number;
  type: "individual" | "team" | "enterprise" | "premium";
};

type ToolPricing = Record<string, Plan>;

export const pricing: Record<string, ToolPricing> = {
  ChatGPT: {
    Plus: { price: 20, type: "individual" },
    Team: { price: 25, type: "team" },
    Enterprise: { price: 60, type: "enterprise" },
  },
  Claude: {
    Pro: { price: 20, type: "individual" },
    Max: { price: 100, type: "premium" },
    Team: { price: 30, type: "team" },
  },
  Cursor: {
    Pro: { price: 20, type: "individual" },
    Business: { price: 40, type: "team" },
  },
  Copilot: {
    Individual: { price: 10, type: "individual" },
    Business: { price: 19, type: "team" },
  },
  Gemini: {
    Pro: { price: 20, type: "individual" },
    Ultra: { price: 30, type: "premium" },
  },
};