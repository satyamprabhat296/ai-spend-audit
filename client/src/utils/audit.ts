import { pricing } from "../data/pricing";

export function runAudit(form: any) {
  let totalSavings = 0;
  let results: any[] = [];

  for (const tool of form.tools) {
    let recommendation = "No change";
    let savings = 0;

    // Example logic
    if (tool.tool === "ChatGPT" && tool.plan === "Team" && tool.seats < 3) {
      recommendation = "Switch to Plus";
      savings = (25 - 20) * tool.seats;
    }

    totalSavings += savings;

    results.push({
      tool: tool.tool,
      currentPlan: tool.plan,
      recommendation,
      savings,
    });
  }

  return {
    totalSavings,
    annualSavings: totalSavings * 12,
    results,
  };
}