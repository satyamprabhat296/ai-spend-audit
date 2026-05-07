import { useState, useEffect } from "react";
import type { AuditForm, ToolEntry } from "../types/audit";
import { runAudit } from "../utils/audit";

const defaultTool: ToolEntry = {
  tool: "",
  plan: "",
  spend: 0,
  seats: 1,
};

export default function Home() {
  // ✅ Load from localStorage before first render
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

  // ✅ Store form data
  useEffect(() => {
    localStorage.setItem("audit-form", JSON.stringify(form));
  }, [form]);

  // ✅ Audit result state
  const [auditResult, setAuditResult] = useState<any>(null);

  // Handle tool updates
  const updateTool = (index: number, field: string, value: any) => {
    const updated = [...form.tools];
    updated[index] = {
      ...updated[index],
      [field]: field === "spend" || field === "seats" ? Number(value) : value,
    };

    setForm({ ...form, tools: updated });
  };

  // Add tool
  const addTool = () => {
    setForm({ ...form, tools: [...form.tools, { ...defaultTool }] });
  };

  // Remove tool
  const removeTool = (index: number) => {
    const updated = form.tools.filter((_, i) => i !== index);
    setForm({ ...form, tools: updated });
  };

  // ✅ Run audit
  const handleSubmit = () => {
    const result = runAudit(form);
    console.log(result);
    setAuditResult(result);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">AI Spend Audit</h1>

      {/* Tool Inputs */}
      {form.tools.map((tool, index) => (
        <div key={index} className="border p-4 mt-4 space-y-2">

          <select
            value={tool.tool}
            onChange={(e) => updateTool(index, "tool", e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Select Tool</option>
            <option value="ChatGPT">ChatGPT</option>
            <option value="Claude">Claude</option>
            <option value="Cursor">Cursor</option>
            <option value="Copilot">GitHub Copilot</option>
            <option value="Gemini">Gemini</option>
          </select>

          <input
            placeholder="Plan"
            value={tool.plan}
            onChange={(e) => updateTool(index, "plan", e.target.value)}
            className="border p-2 w-full"
          />

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
      ))}

      {/* Add Tool */}
      <button
        onClick={addTool}
        className="mt-4 bg-gray-200 px-4 py-2"
      >
        + Add Another Tool
      </button>

      {/* Team Info */}
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

      {/* Run Audit Button */}
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 w-full mt-4"
      >
        Run Audit
      </button>

      {/* Audit Result */}
      {auditResult && (
        <div className="mt-6 p-4 border">
          <h2 className="text-xl font-bold">Audit Result</h2>
          <p>Monthly Savings: ${auditResult.totalSavings}</p>
          <p>Annual Savings: ${auditResult.annualSavings}</p>
        </div>
      )}
    </div>
  );
}