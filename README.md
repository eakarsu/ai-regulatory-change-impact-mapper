# AI Regulatory Change Impact Mapper

Runnable Next.js full-stack app for Regulatory Change Impact Mapper.

## Workflows

- `/regulatory-watchlist` - Regulatory Watchlist (Intake): New laws, guidance, enforcement dates, jurisdictions, and affected teams.
- `/impact-assessment` - Impact Assessment (Analysis): Applicability, business units, products, data flows, vendors, and risk tier.
- `/control-mapping` - Control Mapping (Controls): Requirements mapped to controls, gaps, evidence owners, and remediation status.
- `/policy-update-queue` - Policy Update Queue (Policies): Policies needing edits, reviewers, approval dates, and rollout status.
- `/vendor-impact` - Vendor Impact (Third Party): Impacted vendors, contract clauses, security obligations, and outreach tasks.
- `/product-change-plan` - Product Change Plan (Product): Feature impacts, engineering actions, release dependencies, and validation needs.
- `/deadline-tracker` - Deadline Tracker (Operations): Enforcement dates, milestones, owner assignments, and overdue alerts.
- `/evidence-requests` - Evidence Requests (Evidence): Control evidence, screenshots, attestations, owner responses, and audit readiness.
- `/board-risk-summary` - Board Risk Summary (Reporting): Executive view of regulatory exposure, gaps, owners, and funding needs.
- `/implementation-workplan` - Implementation Workplan (Execution): Tasks, dependencies, owners, target dates, and completion evidence.

## Local Run

```bash
cd ai-regulatory-change-impact-mapper/frontend
npm run dev
```

Development password login requires an explicitly provisioned PostgreSQL account. Production uses the configured OIDC provider; no passwords are embedded in source.
