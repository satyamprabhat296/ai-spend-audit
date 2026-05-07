type PlanType = "individual" | "team" | "enterprise" | "premium";

export type Plan = {
  price: number;
  type: PlanType;
};

export const pricing = {
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
} as const;

// 🔥 Derived types (VERY IMPORTANT)
export type ToolName = keyof typeof pricing;
export type ToolPlans<T extends ToolName> = keyof typeof pricing[T];