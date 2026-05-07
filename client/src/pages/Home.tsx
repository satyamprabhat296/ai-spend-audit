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

    if (field === "tool") {
      updated[index] = {
        ...updated[index],
        tool: value,
        plan: "",
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]:
          field === "spend" || field === "seats" ? Number(value) : value,
      };
    }

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
    const cleanedTools = form.tools.filter(
      (t) => t.tool && t.plan && t.spend > 0
    );

    if (cleanedTools.length === 0) {
      alert("Please add at least one valid tool");
      return;
    }

    const result = runAudit({
      ...form,
      tools: cleanedTools,
    });

    setAuditResult(result);
  };

  const getStatus = (savings: number) => {
    if (savings > 50) return "high";
    if (savings > 0) return "medium";
    return "none";
  };

  const totalSpend = form.tools.reduce(
    (sum, t) => sum + (t.spend || 0),
    0
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">AI Spend Audit</h1>

      {form.tools.map((tool, index) => {
        const toolKey = tool.tool as ToolName;
        const plans = tool.tool ? Object.keys(pricing[toolKey]) : [];
        const isEmpty = !tool.tool && !tool.plan && tool.spend === 0;

        return (
          <div
            key={index}
            className={`border p-4 mt-4 space-y-2 ${
              isEmpty ? "opacity-60" : ""
            }`}
          >
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

            <input
              type="number"
              placeholder="Monthly Spend ($)"
              value={tool.spend}
              onChange={(e) => updateTool(index, "spend", e.target.value)}
              className="border p-2 w-full"
            />

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

      {/* 🔥 Total Spend */}
      <div className="mt-4 text-sm text-gray-600">
        Current Spend: <span className="font-semibold">${totalSpend}/month</span>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 w-full mt-4"
      >
        Run Audit
      </button>

      {auditResult && (
        <div className="mt-6 space-y-4">

          {/* 🔥 Summary */}
          <div className="p-4 border rounded bg-black text-white">
            <h2 className="text-xl font-bold">Total Savings</h2>
            <p className="text-2xl mt-2 font-bold">
              ${auditResult.totalSavings}/month
            </p>
            <p className="text-sm opacity-80">
              ${auditResult.annualSavings}/year
            </p>
          </div>

          {/* 🔥 Copy Report */}
          <button
            onClick={() => {
              const text = auditResult.results
                .map(
                  (r: any) =>
                    `${r.tool}: ${r.recommendation} → Save $${r.savings}/month`
                )
                .join("\n");

              navigator.clipboard.writeText(
                `AI Spend Audit Report\n\nTotal Savings: $${auditResult.totalSavings}/month\n\n${text}`
              );

              alert("Copied to clipboard!");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Copy Report
          </button>

          {/* 🔥 Insight Banner */}
          <div className="p-4 rounded bg-purple-100 border border-purple-300">
            <p className="font-semibold">💡 Insight:</p>
            <p className="text-sm mt-1">
              You could reduce your AI spending by{" "}
              <span className="font-bold">
                ${auditResult.totalSavings}/month
              </span>{" "}
              by optimizing plan selection across tools.
            </p>
          </div>

          {/* 🔥 Breakdown */}
          <div>
            <h2 className="text-lg font-bold mb-2">Breakdown</h2>

            {auditResult.results?.map((item: any, index: number) => {
              const status = getStatus(item.savings);

              return (
                <div
                  key={index}
                  className={`border p-4 mb-3 rounded ${
                    status === "high"
                      ? "border-red-400 bg-red-50"
                      : status === "medium"
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-green-400 bg-green-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{item.tool}</p>

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        status === "high"
                          ? "bg-red-200 text-red-800"
                          : status === "medium"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {status === "high"
                        ? "High Savings"
                        : status === "medium"
                        ? "Optimize"
                        : "Optimized"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    Current Plan: {item.currentPlan || "N/A"}
                  </p>

                  <p className="mt-2">
                    Recommendation:{" "}
                    <span className="font-medium">
                      {item.recommendation}
                    </span>
                  </p>

                  <p className="text-sm text-gray-600">
                    {item.reason}
                  </p>

                  <p className="mt-2 font-semibold">
                    Savings: ${item.savings}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}