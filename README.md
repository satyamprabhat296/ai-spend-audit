
# 🚀 AI Spend Audit

An intelligent web app that analyzes your AI tool subscriptions and identifies **cost-saving opportunities** across plans.

---

## Live Demo

Frontend: https://ai-spend-audit-ghmi0wbnz-satyam-prabhat-singhs-projects.vercel.app

Backend API: https://ai-spend-audit-9y74.onrender.com

## 🔍 Problem

Teams today use multiple AI tools like ChatGPT, Claude, Copilot, etc.
Most end up:

* Overpaying for enterprise/team plans
* Paying for unused seats
* Missing cheaper alternatives

👉 Result: **wasted monthly spend**

---

## 💡 Solution

**AI Spend Audit** analyzes your tool usage and:

* Detects inefficient plans
* Recommends better alternatives
* Calculates **monthly + annual savings**
* Generates a clear, shareable report

---

## ✨ Features

### 🧾 Smart Audit Engine

* Compares pricing across tools
* Detects overpayment patterns
* Suggests optimal plans

### 💰 Savings Insights

* Monthly + yearly savings calculation
* Tool-wise breakdown
* Highlighted “high savings” opportunities

### ⚡ Dynamic UI

* Add/remove multiple tools
* Plan dropdown updates dynamically
* Real-time total spend tracking

### 🤖 AI Summary (Backend-powered)

* Generates human-readable insights
* Fallback support if API fails

### 📩 Lead Capture (Key Feature)

* Users can email themselves reports
* Stores leads via backend API

### 📋 Copy Report

* One-click copy for sharing results

### 💾 Persistent State

* Form data saved in localStorage
* No data loss on refresh

---

## 🛠️ Tech Stack

### Frontend

* React + TypeScript
* Tailwind CSS
* Vite

### Backend

* Node.js + Express
* REST API

---

## 📁 Project Structure

```
ai-spend-audit/
│
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── data/
│   │   │   └── pricing.ts
│   │   ├── utils/
│   │   │   └── audit.ts
│   │   └── types/
│   │       └── audit.ts
│
├── server/                # Backend (Express)
│   ├── routes/
│   │   ├── lead.js
│   │   └── summary.js
│   └── index.js
```

---

## ⚙️ How It Works

1. User inputs:

   * Tools (ChatGPT, Claude, etc.)
   * Plans
   * Monthly spend
   * Seats

2. Audit engine:

   * Compares pricing data
   * Applies optimization rules

3. Output:

   * Savings calculation
   * Plan recommendations
   * AI-generated summary

---

## 🚀 Getting Started

### 1️⃣ Clone Repo

```bash
git clone https://github.com/satyamprabhat296/ai-spend-audit.git
cd ai-spend-audit
```

---

### 2️⃣ Start Backend

```bash
cd server
npm install
npm run dev
```

Runs on: `http://localhost:5000`

---

### 3️⃣ Start Frontend

```bash
cd client
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

## 📡 API Endpoints

### POST `/api/summary`

Generates AI summary

```json
{
  "audit": { ... }
}
```

---

### POST `/api/lead`

Stores email + audit data

```json
{
  "email": "user@example.com",
  "audit": { ... }
}
```

---

## 🧠 Core Logic (Audit Engine)

* Detects:

  * Overuse of team plans
  * High-cost plans vs cheaper alternatives
* Calculates:

  * Cost difference per plan
  * Total savings

---

## 📸 Demo Flow

1. Add tools
2. Enter spend
3. Click **Run Audit**
4. View:

   * Savings 💰
   * Recommendations 📊
5. Capture email 📩

---

## 🎯 Key Highlights (Why this stands out)

* ✅ Real-world SaaS cost problem
* ✅ Full-stack implementation
* ✅ Clean UI + UX
* ✅ Scalable pricing engine
* ✅ Lead capture (product thinking)
* ✅ AI integration with fallback

---

## 🔮 Future Improvements

* PDF export of report
* Dashboard with charts
* SaaS integrations (Stripe, Slack)
* Multi-user/team analytics

---

## 👤 Author

**Satyam Prabhat Singh**

---

## ⭐ If you found this useful

Give this repo a star ⭐ — it helps!
=======
# AI Spend Audit

A smart tool to analyze and optimize AI tool subscriptions.

## Features

- Detect overpayment in AI tools
- Recommend cheaper plans
- Calculate monthly & annual savings
- Copy/share audit report

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS

## Setup

cd client
npm install
npm run dev

## Example

ChatGPT Enterprise → Switch to Plus → Save $80/month
Claude Team → Switch to Pro → Save $30/month
>>>>>>> 8e9c0f1 (feat: day 3 complete (AI summary + email capture))
