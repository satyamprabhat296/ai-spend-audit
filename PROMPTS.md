# PROMPTS.md

# AI Prompting Strategy

This document outlines the prompts, workflows, and AI-assisted development process used while building AI Spend Audit.

The project intentionally used AI as a productivity multiplier rather than a one-shot code generator.

---

# 1. Audit Summary Prompt

## Purpose

Generate a concise business-oriented summary after an audit is completed.

The goal was:
- actionable language
- short output
- non-technical wording
- startup founder readability

---

## Prompt

```txt
You are an AI finance assistant.

Analyze this AI software spending audit and produce:
- a concise summary
- key overspending insight
- one optimization recommendation

Keep the response under 80 words.

Audit:
{{auditData}}