import { useState, useEffect } from "react";
import type { AuditForm, ToolEntry } from "../types/audit";
import { runAudit } from "../utils/audit";
import { pricing, type ToolName } from "../data/pricing";

const defaultTool: ToolEntry = {
  tool: "",
  plan: "",
  spend: 0,
  seats: 1,
};

export default function Home() {
  const [form, setForm] = useState<AuditForm>(() => {
    const saved = localStorage.getItem("audit-form");
    return saved
      ? JSON.parse(saved)
      : {
          tools: [defaultTool],
          teamSize: 1,
          useCase: "coding",
        };
  });

  useEffect(() => {
    localStorage.setItem("audit-form", JSON.stringify(form));
  }, [form]);

  const [auditResult, setAuditResult] = useState<any>(null);

  const updateTool = (index: number, field: string, value: any) => {
    const updated = [...form.tools];
    updated[index] = {
      ...updated[index],
      [field]: field === "spend" || field === "seats" ? Number(value) : value,
    };
    setForm({ ...form, tools: updated });
  };

  const addTool = () => {
    setForm({ ...form, tools: [...form.tools, { ...defaultTool }] });
  };

  const removeTool = (index: number) => {
    const updated = form.tools.filter((_, i) => i !== index);
    setForm({ ...form, tools: updated });
  };

  const handleSubmit = () => {
    const result = runAudit(form);
    setAuditResult(result);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">AI Spend Audit</h1>

      {form.tools.map((tool, index) => {
        const toolKey = tool.tool as ToolName;
        const plans = tool.tool ? Object.keys(pricing[toolKey]) : [];

        return (
          <div key={index} className="border p-4 mt-4 space-y-2">

            {/* Tool */}
            <select
              value={tool.tool}
              onChange={(e) => updateTool(index, "tool", e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">Select Tool</option>
              {Object.keys(pricing).map((toolName) => (
                <option key={toolName} value={toolName}>
                  {toolName}
                </option>
              ))}
            </select>

            {/* Plan */}
            <select
              value={tool.plan}
              onChange={(e) => updateTool(index, "plan", e.target.value)}
              className="border p-2 w-full"
              disabled={!tool.tool}
            >
              <option value="">Select Plan</option>
              {plans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>

            {/* Spend */}
            <input
              type="number"
              placeholder="Monthly Spend ($)"
              value={tool.spend}
              onChange={(e) => updateTool(index, "spend", e.target.value)}
              className="border p-2 w-full"
            />

            {/* Seats */}
            <input
              type="number"
              placeholder="Seats"
              value={tool.seats}
              onChange={(e) => updateTool(index, "seats", e.target.value)}
              className="border p-2 w-full"
            />

            <button
              onClick={() => removeTool(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        );
      })}

      <button
        onClick={addTool}
        className="mt-4 bg-gray-200 px-4 py-2"
      >
        + Add Another Tool
      </button>

      <div className="mt-6 space-y-2">
        <input
          type="number"
          placeholder="Team Size"
          value={form.teamSize}
          onChange={(e) =>
            setForm({ ...form, teamSize: Number(e.target.value) })
          }
          className="border p-2 w-full"
        />

        <select
          value={form.useCase}
          onChange={(e) =>
            setForm({ ...form, useCase: e.target.value })
          }
          className="border p-2 w-full"
        >
          <option value="coding">Coding</option>
          <option value="writing">Writing</option>
          <option value="research">Research</option>
          <option value="data">Data</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 w-full mt-4"
      >
        Run Audit
      </button>

      {auditResult ? (
        <div className="mt-6 space-y-4">

          <div className="p-4 border rounded bg-gray-50">
            <h2 className="text-xl font-bold">Your Savings</h2>
            <p className="text-lg mt-2">
              Monthly: <span className="font-semibold">${auditResult.totalSavings}</span>
            </p>
            <p>
              Annual: <span className="font-semibold">${auditResult.annualSavings}</span>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Breakdown</h2>

            {auditResult.results?.map((item: any, index: number) => (
              <div key={index} className="border p-4 mb-3 rounded">

                <p className="font-semibold">{item.tool}</p>

                <p className="text-sm text-gray-600">
                  Current Plan: {item.currentPlan || "N/A"}
                </p>

                <p className="mt-2">
                  Recommendation:{" "}
                  <span className="font-medium">{item.recommendation}</span>
                </p>

                <p className="text-sm text-gray-600">
                  {item.reason}
                </p>

                <p className="mt-2 text-green-600 font-semibold">
                  Savings: ${item.savings}
                </p>

              </div>
            ))}
          </div>

        </div>
      ) : null}
    </div>
  );
}