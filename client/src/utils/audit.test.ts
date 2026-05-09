import { describe, it, expect } from "vitest";
import { runAudit } from "./audit";

describe("runAudit", () => {
  it("recommends cheaper individual plan for small teams", () => {
    const result = runAudit({
      tools: [
        {
          tool: "Claude",
          plan: "Team",
          spend: 50,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    });

    expect(result.totalSavings).toBe(30);
    expect(result.results[0].recommendation).toContain("Pro");
  });

  it("recommends downgrading enterprise plans", () => {
    const result = runAudit({
      tools: [
        {
          tool: "ChatGPT",
          plan: "Enterprise",
          spend: 100,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "research",
    });

    expect(result.totalSavings).toBe(80);
    expect(result.results[0].recommendation).toContain("Plus");
  });

  it("returns no savings when already optimized", () => {
    const result = runAudit({
      tools: [
        {
          tool: "Copilot",
          plan: "Individual",
          spend: 10,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    });

    expect(result.totalSavings).toBe(0);
    expect(result.results[0].recommendation).toBe(
      "You're on the right plan"
    );
  });

  it("handles unknown plans safely", () => {
    const result = runAudit({
      tools: [
        {
          tool: "Gemini",
          plan: "FakePlan",
          spend: 100,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "writing",
    });

    expect(result.results[0].recommendation).toContain("Unknown");
  });

  it("calculates annual savings correctly", () => {
    const result = runAudit({
      tools: [
        {
          tool: "Claude",
          plan: "Team",
          spend: 50,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    });

    expect(result.annualSavings).toBe(360);
  });
});