# Reflection

## What Went Well

The project evolved from a simple pricing calculator into a more complete AI spend optimization MVP.

Key achievements:
- dynamic audit engine
- AI-generated summaries
- lead capture flow
- frontend + backend testing
- production-ready UI improvements
- deployment-ready architecture

The modular structure made iteration faster during development.

---

# Biggest Challenges

## 1. Pricing Assumptions

Real AI pricing changes frequently and differs across plans.

To solve this:
- assumptions were documented clearly
- pricing sources were tracked separately
- logic was kept configurable

---

## 2. AI Reliability

AI-generated summaries can fail because of:
- API issues
- invalid keys
- network failures

Fallback responses were added to ensure reliability.

---

## 3. State Management

Managing:
- multiple tools
- plans
- spend calculations
- dynamic recommendations

required careful frontend state handling.

---

# Tradeoffs Made

## In-Memory Lead Storage

For MVP speed, leads are stored temporarily in memory instead of a database.

A production system would use:
- Supabase
- PostgreSQL
- Firebase

---

## Simplified Recommendation Logic

The recommendation engine uses deterministic pricing comparisons rather than ML-based optimization.

This improves:
- transparency
- predictability
- testability

---

## No Authentication

Authentication was intentionally excluded to reduce onboarding friction and keep the MVP lightweight.

---

# What I Would Improve Next

## Short Term
- persistent database
- transactional email integration
- downloadable PDF reports
- shareable audit links

## Long Term
- SaaS billing integrations
- organization dashboards
- spend trend analytics
- AI usage monitoring
- Slack/Discord alerts

---

# Key Learnings

This project improved understanding of:
- full-stack architecture
- API integration
- testing workflows
- deployment preparation
- AI product UX patterns

It also reinforced the importance of:
- documenting assumptions
- resilient fallbacks
- incremental shipping
- balancing scope vs delivery