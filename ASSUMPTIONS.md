# Assumptions

This project simulates an AI SaaS cost-audit workflow using simplified pricing and recommendation logic.

## Pricing Assumptions

- Enterprise pricing is estimated where public pricing is unavailable
- Team plans are approximated using per-seat averages
- Prices are represented in USD/month
- Pricing data was collected from publicly available pricing pages

## Recommendation Logic

The audit engine assumes:

- Smaller teams may not require enterprise plans
- Users with low spend may benefit from cheaper tiers
- Team plans are only recommended for larger groups
- Existing plans are considered optimized if no cheaper suitable alternative exists

## AI Summary

The AI-generated summary:
- Uses OpenAI API when available
- Falls back to a static summary if API fails
- Is intended for demo/assignment purposes

## Lead Capture

Lead capture currently:
- Stores data temporarily in memory
- Does not persist to a database
- Exists to demonstrate backend integration

## Testing Scope

Tests currently cover:
- Audit calculation logic
- Summary API endpoint
- Lead capture endpoint

This project is intentionally lightweight and optimized for internship assignment evaluation.