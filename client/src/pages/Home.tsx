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
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  // ✅ Email states
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

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

  // ✅ Save Lead (FIXED API)
  const handleSaveLead = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      alert("Enter valid email");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/lead", { // ✅ FIXED HERE
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
      setEmail(""); // optional reset
    } catch {
      alert("Failed to save");
    }
  };

  const handleSubmit = async () => {
    const cleanedTools = form.tools.filter(
      (t) => t.tool && t.plan && t.spend > 0
    );

    if (cleanedTools.length === 0) {
      alert("Please add at least one valid tool");
      return;
    }

    setLoading(true);
    setSaved(false); // reset email state

    const result = runAudit({
      ...form,
      tools: cleanedTools,
    });

    setAuditResult(result);

    try {
      const res = await fetch("http://localhost:5000/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audit: result }),
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

      {/* Tools */}
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

      {/* Team */}
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

      <div className="mt-4 text-sm text-gray-600">
        Current Spend:{" "}
        <span className="font-semibold">${totalSpend}/month</span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 w-full mt-4"
      >
        {loading ? "Analyzing..." : "Run Audit"}
      </button>

      {/* RESULTS */}
      {auditResult && (
        <div className="mt-6 space-y-4">

          <div className="p-4 border rounded bg-black text-white">
            <h2 className="text-xl font-bold">
              💰 You’re overspending by ${auditResult.totalSavings}/month
            </h2>
            <p className="text-sm opacity-80 mt-1">
              ${auditResult.annualSavings}/year
            </p>
          </div>

          {summary && (
            <div className="p-4 border rounded bg-gray-100">
              <h3 className="font-semibold mb-2">AI Summary</h3>
              <p className="text-sm text-gray-700">{summary}</p>
            </div>
          )}

          {/* EMAIL CAPTURE */}
          <div className="p-4 border rounded bg-yellow-50">
            <p className="font-semibold mb-2">
              📩 Get detailed report in your email
            </p>

            {!saved ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 w-full"
                />

                <button
                  onClick={handleSaveLead}
                  className="bg-black text-white px-4"
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

                    <span className="text-xs px-2 py-1 rounded">
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