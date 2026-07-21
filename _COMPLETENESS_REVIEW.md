# Completeness Review: ai-regulatory-change-impact-mapper

**Review date:** 2026-07-18

## Assessment basis

Static inspection of project-owned source and configuration only; no dependency installation, build, database migration, external-service call, or runtime launch was performed. The scan considered 90 project files (66 source files), 2 manifest(s), 0 test-like file(s), and 0 CI workflow(s), excluding dependency/generated directories.

## Classification

**Prototype-demo**

This is a prototype/demo for governance/compliance. Generated gap/demo patterns are present: it contains 66 source files and visible routes/pages in `frontend/`, `backend/`, but those surfaces are not evidence of durable domain execution, verified integrations, or operational completion.

## Why it is not complete

- Generated gap/visualization routes describe missing capabilities or simulate recommendations; they do not implement the underlying domain operation.
- Generic LLM calls are used as product behavior without enough typed tools, grounded evidence, deterministic rules, or output evaluation.
- Mock, demo, sample, fixture, or placeholder behavior remains in executable/product paths.
- No recognizable project-owned automated tests were found for the main workflow.
- No checked-in CI workflow proves builds, tests, migrations, and security checks on every change.

## Needed features

1. Replace advisory-only AI output with versioned policies, evidence links, accountable owners, approvals, and immutable decisions.
2. Add authoritative regulatory/contract ingestion with source provenance, effective dates, jurisdiction, and change detection.
3. Implement SSO, least-privilege RBAC, segregation of duties, retention/legal holds, and exportable audit logs.
4. Build scenario-specific evaluations so citations, obligations, deadlines, and risk ratings are checked before release.
5. Add risk-based unit, integration, and end-to-end tests in CI, including migration and failure-path coverage.

## Risks or launch blockers

- Credential/configuration exposure: environment files are present in the repository tree and must be checked against Git history and rotated if real.
- Automation contains destructive process, filesystem, or database operations; do not run it on a shared machine without review.
- Startup appears coupled to seed/migration behavior, risking data mutation or non-repeatable launches.
- AI-provider availability, cost, privacy, prompt injection, and unvalidated output are launch risks until bounded and evaluated.

## Evidence inspected

- `README.md`
- `SOURCE_DATA_TABLES.md:127`
- `frontend/src/lib/sourceAIToolFields.ts:6`
- `frontend/src/app/layout.tsx`
- `backend/package.json`
- `start.sh`

## Recommended next action

Stop adding generated pages; prove one governance/compliance workflow against real services and persistent state, with tests and measurable acceptance criteria.

## Implementation progress — 2026-07-19

1. Implemented a persistent, versioned regulatory-change workflow with accountable owner/assessor/approver fields, impact mappings, citations, scenario evaluations and append-only decision snapshots. Lifecycle transitions are role-constrained and transactionally persisted; manager/admin audit export is tenant-scoped, bounded and non-cacheable.
2. Implemented authoritative source ingestion with HTTPS URI, publisher, jurisdiction, publication/effective/retrieval dates, source version, canonical content digest, provenance and idempotent replay/change detection. Licensed feeds and production connector credentials remain external.
3. Implemented an OIDC authorization-code/PKCE SSO flow with discovery, state/nonce checks, issuer/audience validation and remote JWKS signature verification; only configured role and tenant claims can create signed, expiring sessions, and governed queries use the signed tenant identity. Least-privilege RBAC, segregation of duties, persisted legal-hold/retention controls, immutable records-control decisions and authorized audit export are enforced. IdP registration, approved group/tenant mapping values, MFA policy and approved retention/legal-hold/export-redaction procedures remain deployment/organizational gates.
4. Implemented deterministic evaluation of citations, owned obligations, deadlines, target mappings and bounded risk ratings; a passing evaluation gates approval/publication. Counsel-approved scenarios and jurisdiction-specific acceptance data remain external validation gates.
5. Added an idempotent additive migration, fourteen governance/risk/identity tests, PostgreSQL CI with migration replay/typecheck/build/live authenticated smoke/high-severity dependency audit, a non-destructive explicit launcher and runbook. Fresh verification passed typecheck, all 14 tests, optimized production build, two migration applications on a clean PostgreSQL database, generic and governed API smoke, invalid-date and unauthorized authoring/export failure paths, production local-login quarantine, live append-only-trigger enforcement, and a PostgreSQL backup/restore count check. Dependency audits have no high/critical finding (two moderate transitive PostCSS advisories remain).

Readiness: the review's source-actionable governance workflow is implemented and freshly verified, but production release remains blocked on licensed authoritative feeds, production IdP registration/configuration, legal validation, security testing, approved retention/export procedures, deployment-environment recovery testing and representative compliance-user acceptance.

## Runtime verification — 2026-07-20

- The launcher now requires and refuses conflicts on the assigned runtime port, honors acceptance-environment precedence, maps standard tenant/session variables to the project's required configuration, and starts the real source tree from an isolated fixture.
- Removed source-coded local credentials. Development password login now requires an explicitly provisioned PostgreSQL user with a scrypt hash; both local and verified OIDC identities receive opaque hashed PostgreSQL sessions, `/api/auth/me` reloads identity and tenant state from the database, and logout revokes the session. The runtime flag for local password login is off by default and production still requires approved OIDC configuration.
- The first attempt on `55625/6064/6065` correctly started but exposed a compiled `NODE_ENV` login gate; after replacing it with the explicit runtime gate, the fresh `55627/6068/6069` acceptance passed as `startup_login_session_api`. Both triples were released.
- TypeScript validation, all 14 governance/OIDC tests, the optimized 25-page Next.js production build, launcher/JavaScript syntax, and whitespace validation passed.
