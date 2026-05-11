import { useState, useEffect } from "react";
import type { AuditForm, ToolEntry } from "../types/audit";
import { runAudit } from "../utils/audit";
import { pricing, type ToolName } from "../data/pricing";

const API_BASE_URL = import.meta.env.VITE_API_URL;
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
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  // ✅ Email states
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  // ✅ Update Tool
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
          field === "spend" || field === "seats"
            ? Number(value)
            : value,
      };
    }

    setForm({ ...form, tools: updated });
  };

  // ✅ Add Tool
  const addTool = () => {
    setForm({
      ...form,
      tools: [...form.tools, { ...defaultTool }],
    });
  };

  // ✅ Remove Tool
  const removeTool = (index: number) => {
    const updated = form.tools.filter((_, i) => i !== index);

    setForm({
      ...form,
      tools: updated,
    });
  };

  // ✅ Save Lead
  const handleSaveLead = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      alert("Enter valid email");
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/api/lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          audit: auditResult,
        }),
      });

      setSaved(true);
      setEmail("");
    } catch {
      alert("Failed to save");
    }
  };

  // ✅ Run Audit
  const handleSubmit = async () => {
    const cleanedTools = form.tools.filter(
      (t) => t.tool && t.plan && t.spend > 0
    );

    if (cleanedTools.length === 0) {
      alert("Please add at least one valid tool");
      return;
    }

    setLoading(true);
    setSaved(false);

    const result = runAudit({
      ...form,
      tools: cleanedTools,
    });

    setAuditResult(result);

    try {
      const res = await fetch(`${API_BASE_URL}/api/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audit: result,
        }),
      });

      const data = await res.json();

      setSummary(data.summary);
    } catch {
      setSummary(
        "You can reduce AI costs by optimizing plans across your tools."
      );
    }

    setLoading(false);
  };

  // ✅ Savings Status
  const getStatus = (savings: number) => {
    if (savings > 50) return "high";
    if (savings > 0) return "medium";
    return "none";
  };

  // ✅ Total Spend
  const totalSpend = form.tools.reduce(
    (sum, t) => sum + (t.spend || 0),
    0
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        AI Spend Audit
      </h1>

      <p className="text-gray-600 mb-6">
        Discover wasted AI subscription spending and optimize your stack.
      </p>

      {/* TOOLS */}
      {form.tools.map((tool, index) => {
        const toolKey = tool.tool as ToolName;

        const plans = tool.tool
          ? Object.keys(pricing[toolKey])
          : [];

        const isEmpty =
          !tool.tool &&
          !tool.plan &&
          tool.spend === 0;

        return (
          <div
            key={index}
            className={`border rounded-lg p-4 mt-4 space-y-3 shadow-sm ${
              isEmpty ? "opacity-60" : ""
            }`}
          >
            {/* Tool */}
            <select
              value={tool.tool}
              onChange={(e) =>
                updateTool(index, "tool", e.target.value)
              }
              className="border p-2 w-full rounded"
            >
              <option value="">Select Tool</option>

              {Object.keys(pricing).map((toolName) => (
                <option
                  key={toolName}
                  value={toolName}
                >
                  {toolName}
                </option>
              ))}
            </select>

            {/* Plan */}
            <select
              value={tool.plan}
              onChange={(e) =>
                updateTool(index, "plan", e.target.value)
              }
              className="border p-2 w-full rounded"
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
              onChange={(e) =>
                updateTool(index, "spend", e.target.value)
              }
              className="border p-2 w-full rounded"
            />

            {/* Seats */}
            <input
              type="number"
              placeholder="Seats"
              value={tool.seats}
              onChange={(e) =>
                updateTool(index, "seats", e.target.value)
              }
              className="border p-2 w-full rounded"
            />

            {/* Remove */}
            <button
              onClick={() => removeTool(index)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        );
      })}

      {/* Add Tool */}
      <button
        onClick={addTool}
        className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
      >
        + Add Another Tool
      </button>

      {/* TEAM INFO */}
      <div className="mt-6 space-y-3">
        <input
          type="number"
          placeholder="Team Size"
          value={form.teamSize}
          onChange={(e) =>
            setForm({
              ...form,
              teamSize: Number(e.target.value),
            })
          }
          className="border p-2 w-full rounded"
        />

        <select
          value={form.useCase}
          onChange={(e) =>
            setForm({
              ...form,
              useCase: e.target.value,
            })
          }
          className="border p-2 w-full rounded"
        >
          <option value="coding">Coding</option>
          <option value="writing">Writing</option>
          <option value="research">Research</option>
          <option value="data">Data</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      {/* Spend */}
      <div className="mt-4 text-sm text-gray-600">
        Current Spend:{" "}
        <span className="font-semibold">
          ${totalSpend}/month
        </span>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black hover:bg-gray-800 text-white px-4 py-3 w-full mt-5 rounded"
      >
        {loading ? "Analyzing..." : "Run Audit"}
      </button>

      {/* RESULTS */}
      {auditResult && (
        <div className="mt-8 space-y-4">

          {/* Summary Card */}
          <div className="p-5 border rounded-lg bg-black text-white">
            <h2 className="text-2xl font-bold">
              💰 You’re overspending by $
              {auditResult.totalSavings}/month
            </h2>

            <p className="text-sm opacity-80 mt-2">
              ${auditResult.annualSavings}/year potential savings
            </p>
          </div>

          {/* AI Summary */}
          {summary && (
            <div className="p-4 border rounded-lg bg-gray-100">
              <h3 className="font-semibold mb-2">
                AI Summary
              </h3>

              <p className="text-sm text-gray-700">
                {summary}
              </p>
            </div>
          )}

          {/* Email Capture */}
          <div className="p-4 border rounded-lg bg-yellow-50">
            <p className="font-semibold mb-3">
              📩 Get detailed report in your email
            </p>

            {!saved ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="border p-2 w-full rounded"
                />

                <button
                  onClick={handleSaveLead}
                  className="bg-black text-white px-4 rounded"
                >
                  Get Report
                </button>
              </div>
            ) : (
              <p className="text-green-600 font-medium">
                ✅ Report saved successfully!
              </p>
            )}
          </div>

          {/* Copy Report */}
          <button
            onClick={() => {
              const text = auditResult.results
                .map(
                  (r: any) =>
                    `${r.tool}: ${r.recommendation} → Save $${r.savings}/month`
                )
                .join("\n");

              navigator.clipboard.writeText(
                `AI Spend Audit Report

Total Savings: $${auditResult.totalSavings}/month

${text}`
              );

              alert("Copied to clipboard!");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Copy Report
          </button>

          {/* Breakdown */}
          <div>
            <h2 className="text-lg font-bold mb-3">
              Breakdown
            </h2>

            {auditResult.results?.map(
              (item: any, index: number) => {
                const status = getStatus(item.savings);

                return (
                  <div
                    key={index}
                    className={`border p-4 mb-3 rounded-lg ${
                      status === "high"
                        ? "border-red-400 bg-red-50"
                        : status === "medium"
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-green-400 bg-green-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">
                        {item.tool}
                      </p>

                      <span className="text-xs px-2 py-1 rounded bg-white border">
                        {status === "high"
                          ? "High Savings"
                          : status === "medium"
                          ? "Optimize"
                          : "Optimized"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      Current Plan:{" "}
                      {item.currentPlan || "N/A"}
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
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}