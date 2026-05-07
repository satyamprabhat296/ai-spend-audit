import { pricing } from "../data/pricing";

export function runAudit(form: any) {
  let totalSavings = 0;
  let results: any[] = [];

  for (const tool of form.tools) {
    const toolData = pricing[tool.tool];

    if (!toolData) continue;

    const currentPlanData = toolData[tool.plan];

    let recommendation = "You're on the right plan";
    let savings = 0;
    let reason = "No better alternative found";

    if (!currentPlanData) {
      recommendation = "Unknown plan — verify pricing";
      reason = "Plan not recognized in pricing data";
    } else {
      const currentCost = tool.spend;

      // 🔹 Rule 1: Team plan for small teams
      if (currentPlanData.type === "team" && tool.seats <= 2) {
        const cheaperPlan = Object.entries(toolData).find(
          ([_, p]) => p.type === "individual"
        );

        if (cheaperPlan) {
          const [planName, planData] = cheaperPlan;

          const newCost = planData.price * tool.seats;
          const possibleSavings = currentCost - newCost;

          if (possibleSavings > 0) {
            savings = possibleSavings;
            recommendation = `Switch to ${planName}`;
            reason = "Team plan is overkill for small teams";
          }
        }
      }

      // 🔹 Rule 2: Compare all plans
      for (const [planName, planData] of Object.entries(toolData)) {
        const newCost = planData.price * tool.seats;

        if (newCost < currentCost) {
          const possibleSavings = currentCost - newCost;

          if (possibleSavings > savings) {
            savings = possibleSavings;
            recommendation = `Switch to ${planName}`;
            reason = "Lower cost plan available with similar capability";
          }
        }
      }
    }

    totalSavings += savings;

    results.push({
      tool: tool.tool,
      currentPlan: tool.plan,
      recommendation,
      savings: Math.max(0, Math.round(savings)),
      reason,
    });
  }

  return {
    totalSavings: Math.round(totalSavings),
    annualSavings: Math.round(totalSavings * 12),
    results,
  };
}