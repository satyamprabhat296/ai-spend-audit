import { pricing, type ToolName, type Plan } from "../data/pricing";

export function runAudit(form: any) {
  let totalSavings = 0;
  let results: any[] = [];

  for (const tool of form.tools) {
    const toolName = tool.tool as ToolName;

    const toolData = pricing[toolName] as Record<string, Plan>;
    if (!toolData) continue;

    const currentPlanData = toolData[tool.plan];

    let recommendation = "You're on the right plan";
    let savings = 0;
    let reason = "No better alternative found";

    if (!currentPlanData) {
      recommendation = "Unknown plan — verify pricing";
      reason = "Plan not recognized in pricing data";
    } else {
      const seats = tool.seats || 1;
      const currentCost = tool.spend;

      const currentPerSeat = currentCost / seats;

      // 🔹 Rule 1: Team misuse
      if (currentPlanData.type === "team" && seats <= 2) {
        const individualPlan = (Object.entries(toolData) as [string, Plan][])
          .find(([_, p]) => p.type === "individual");

        if (individualPlan) {
          const [planName, planData] = individualPlan;

          const newCost = planData.price * seats;

          if (newCost < currentCost) {
            savings = currentCost - newCost;
            recommendation = `Switch to ${planName}`;
            reason = "Team plan is overkill for small teams";
          }
        }
      }

      // 🔹 Rule 2: Premium misuse
      if (currentPlanData.type === "premium") {
        const cheaperPlan = (Object.entries(toolData) as [string, Plan][])
          .find(([_, p]) => p.type === "individual" || p.type === "team");

        if (cheaperPlan) {
          const [planName, planData] = cheaperPlan;

          const newCost = planData.price * seats;

          if (
            newCost < currentCost &&
            (savings === 0 || newCost < currentCost - savings)
          ) {
            savings = currentCost - newCost;
            recommendation = `Switch to ${planName}`;
            reason = "Premium plan may be unnecessary for your usage";
          }
        }
      }

      // 🔹 Rule 3: Better plan detection (per-seat logic)
      for (const [planName, planData] of Object.entries(toolData) as [string, Plan][]) {
        const newCost = planData.price * seats;
        const newPerSeat = planData.price;

        if (newCost < currentCost && newPerSeat <= currentPerSeat) {
          const possibleSavings = currentCost - newCost;

          if (possibleSavings > savings) {
            savings = possibleSavings;
            recommendation = `Switch to ${planName}`;
            reason = "You are paying more per seat than necessary";
          }
        }
      }

      // 🔹 Rule 4: Anomaly detection
      if (currentCost > seats * 100) {
        reason = "Unusually high spend detected — verify billing or usage";
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