# TESTS.md

## Automated Tests

The audit engine is tested using Vitest.

Test file:

client/src/utils/audit.test.ts

---

## Covered Test Cases

### 1. Small team downgrade optimization
Checks that team plans are downgraded to cheaper individual plans when seat count is low.

Example:
- Claude Team → Claude Pro

---

### 2. Enterprise overspending detection
Ensures enterprise-tier users receive lower-cost recommendations when appropriate.

Example:
- ChatGPT Enterprise → ChatGPT Plus

---

### 3. Already optimized plan detection
Verifies that no recommendation is made when the user is already on the cheapest valid plan.

Example:
- Copilot Individual remains unchanged

---

### 4. Unknown plan handling
Ensures invalid or unsupported plans fail gracefully without crashing the audit engine.

Example:
- Fake Gemini plan

---

### 5. Annual savings calculation
Checks that yearly savings are correctly derived from monthly savings.

Formula:
annualSavings = totalSavings × 12

---

## How To Run Tests

From the client directory:

```bash
npm run test