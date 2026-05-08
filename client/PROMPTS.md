## AI Summary Prompt

We use an LLM to generate a short summary of audit results.

Prompt:

"You are an AI cost optimization expert.

Given this audit result:
{{audit_json}}

Write a short 80-100 word summary explaining:
- Where the user is overspending
- What they should change
- Total savings impact

Keep it simple and actionable."

## Why this works
- Structured input → predictable output
- Forces actionable recommendations
- Keeps output concise

## What didn’t work
- Longer prompts → too verbose
- No structure → vague responses