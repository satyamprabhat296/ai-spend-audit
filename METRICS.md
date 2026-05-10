# METRICS.md

## North Star Metric

### Audit Completion → Consultation Booking Rate

This is the most important metric because the product is fundamentally a lead-generation tool for Credex.

A completed audit alone has limited business value unless it converts into a high-intent consultation or downstream financial product engagement.

The ideal user journey is:

Visitor → Audit Completed → Consultation Booked → Credit Product Purchased

Because the audit directly demonstrates cost savings opportunities, users completing the flow already show strong purchase intent.

---

# Input Metrics

## 1. Audit Completion Rate

Definition:
Percentage of visitors who successfully complete the audit after landing on the site.

Why it matters:
If users abandon the flow before seeing savings, no downstream conversion is possible.

Formula:

Completed Audits / Landing Page Visitors

Target:
> 35%

---

## 2. Email Capture Rate

Definition:
Percentage of completed audits that result in an email submission.

Why it matters:
This measures lead quality and willingness to continue engagement.

Formula:

Emails Captured / Completed Audits

Target:
> 40%

---

## 3. Consultation Booking Rate

Definition:
Percentage of captured leads that schedule a Credex consultation.

Why it matters:
This is the strongest indicator that the audit creates meaningful commercial intent.

Formula:

Consultations Booked / Captured Leads

Target:
> 15%

---

# What I Would Instrument First

## Frontend Events

- Landing page visits
- Audit started
- Tool added
- Audit completed
- Copy report clicked
- Email submitted

---

## Backend Events

- Summary API success/failure
- Lead capture success/failure
- AI fallback usage frequency
- Most commonly audited tools
- Average reported monthly spend

---

# Pivot Trigger

I would consider pivoting if:

- Audit completion rate remains below 15%
OR
- Consultation booking rate stays below 5%
after multiple iterations and user interviews.

This would indicate that users either:
1. do not perceive enough value in the audit, or
2. do not trust the recommendations enough to continue into the Credex funnel.

At that point, I would likely reposition the product toward:
- procurement visibility,
- AI usage analytics,
or
- SaaS spend management more broadly instead of only AI subscription optimization.

---

# Why These Metrics Matter

This product is not a daily-use SaaS dashboard.

Most companies would likely use it:
- monthly,
- quarterly,
or
- during budgeting cycles.

Because of this, traditional engagement metrics like DAU are weak indicators of success.

The real business value comes from identifying high-intent leads with clear cost pain and converting them into Credex customers.