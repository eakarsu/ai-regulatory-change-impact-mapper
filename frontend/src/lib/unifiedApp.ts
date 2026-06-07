import {
  Activity,
  BarChart3,
  Bell,
  Blocks,
  Bot,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardList,
  Database,
  FileText,
  Files,
  LayoutDashboard,
  PackageCheck,
  Plug,
  ShieldCheck,
  UserRound,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = { label: string; href: string; icon: LucideIcon };
export type FeatureDefinition = { title: string; href: string; category: string; summary: string; bullets: string[] };
export type PageDefinition = {
  title: string;
  eyebrow: string;
  subtitle: string;
  category: string;
  summary: string;
  bullets: string[];
  metrics: Array<{ label: string; value: string; note: string }>;
};
export type FeatureContext = {
  sourceOwners: string[];
  operatingQueues: string[];
  outputs: string[];
  relatedRoutes: Array<{ label: string; href: string }>;
};

const suiteSourceOwners = ["Regulatory updates","Control library","Policy inventory","Vendor register"];

const features = [
  {
    slug: "regulatory-watchlist",
    title: "Regulatory Watchlist",
    href: "/regulatory-watchlist",
    category: "Intake",
    icon: Bot,
    summary: "New laws, guidance, enforcement dates, jurisdictions, and affected teams.",
    bullets: ["Regulatory Watchlist queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Regulatory Watchlist", value: "24", note: 'Active records' },
      { label: 'Exceptions', value: "2", note: 'Need review' },
      { label: 'Due Soon', value: "4", note: 'Next 14 days' },
    ],
  },
  {
    slug: "impact-assessment",
    title: "Impact Assessment",
    href: "/impact-assessment",
    category: "Analysis",
    icon: Workflow,
    summary: "Applicability, business units, products, data flows, vendors, and risk tier.",
    bullets: ["Impact Assessment queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Impact Assessment", value: "33", note: 'Active records' },
      { label: 'Exceptions', value: "3", note: 'Need review' },
      { label: 'Due Soon', value: "5", note: 'Next 14 days' },
    ],
  },
  {
    slug: "control-mapping",
    title: "Control Mapping",
    href: "/control-mapping",
    category: "Controls",
    icon: Users,
    summary: "Requirements mapped to controls, gaps, evidence owners, and remediation status.",
    bullets: ["Control Mapping queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Control Mapping", value: "42", note: 'Active records' },
      { label: 'Exceptions', value: "4", note: 'Need review' },
      { label: 'Due Soon', value: "6", note: 'Next 14 days' },
    ],
  },
  {
    slug: "policy-update-queue",
    title: "Policy Update Queue",
    href: "/policy-update-queue",
    category: "Policies",
    icon: CalendarCheck,
    summary: "Policies needing edits, reviewers, approval dates, and rollout status.",
    bullets: ["Policy Update Queue queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Policy Update Queue", value: "51", note: 'Active records' },
      { label: 'Exceptions', value: "5", note: 'Need review' },
      { label: 'Due Soon', value: "7", note: 'Next 14 days' },
    ],
  },
  {
    slug: "vendor-impact",
    title: "Vendor Impact",
    href: "/vendor-impact",
    category: "Third Party",
    icon: ClipboardList,
    summary: "Impacted vendors, contract clauses, security obligations, and outreach tasks.",
    bullets: ["Vendor Impact queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Vendor Impact", value: "60", note: 'Active records' },
      { label: 'Exceptions', value: "6", note: 'Need review' },
      { label: 'Due Soon', value: "8", note: 'Next 14 days' },
    ],
  },
  {
    slug: "product-change-plan",
    title: "Product Change Plan",
    href: "/product-change-plan",
    category: "Product",
    icon: FileText,
    summary: "Feature impacts, engineering actions, release dependencies, and validation needs.",
    bullets: ["Product Change Plan queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Product Change Plan", value: "69", note: 'Active records' },
      { label: 'Exceptions', value: "2", note: 'Need review' },
      { label: 'Due Soon', value: "9", note: 'Next 14 days' },
    ],
  },
  {
    slug: "deadline-tracker",
    title: "Deadline Tracker",
    href: "/deadline-tracker",
    category: "Operations",
    icon: BarChart3,
    summary: "Enforcement dates, milestones, owner assignments, and overdue alerts.",
    bullets: ["Deadline Tracker queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Deadline Tracker", value: "78", note: 'Active records' },
      { label: 'Exceptions', value: "3", note: 'Need review' },
      { label: 'Due Soon', value: "4", note: 'Next 14 days' },
    ],
  },
  {
    slug: "evidence-requests",
    title: "Evidence Requests",
    href: "/evidence-requests",
    category: "Evidence",
    icon: PackageCheck,
    summary: "Control evidence, screenshots, attestations, owner responses, and audit readiness.",
    bullets: ["Evidence Requests queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Evidence Requests", value: "87", note: 'Active records' },
      { label: 'Exceptions', value: "4", note: 'Need review' },
      { label: 'Due Soon', value: "5", note: 'Next 14 days' },
    ],
  },
  {
    slug: "board-risk-summary",
    title: "Board Risk Summary",
    href: "/board-risk-summary",
    category: "Reporting",
    icon: ShieldCheck,
    summary: "Executive view of regulatory exposure, gaps, owners, and funding needs.",
    bullets: ["Board Risk Summary queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Board Risk Summary", value: "96", note: 'Active records' },
      { label: 'Exceptions', value: "5", note: 'Need review' },
      { label: 'Due Soon', value: "6", note: 'Next 14 days' },
    ],
  },
  {
    slug: "implementation-workplan",
    title: "Implementation Workplan",
    href: "/implementation-workplan",
    category: "Execution",
    icon: Activity,
    summary: "Tasks, dependencies, owners, target dates, and completion evidence.",
    bullets: ["Implementation Workplan queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Implementation Workplan", value: "105", note: 'Active records' },
      { label: 'Exceptions', value: "6", note: 'Need review' },
      { label: 'Due Soon', value: "7", note: 'Next 14 days' },
    ],
  },
  {
    slug: "documents",
    title: "Documents",
    href: "/documents",
    category: "Core Platform",
    icon: Files,
    summary: "Regulatory Change Impact Mapper documents, evidence, attachments, and exports.",
    bullets: ["Documents","Controls","Audit trail"],
    metrics: [
      { label: "Documents", value: "48", note: 'Tracked' },
      { label: 'Open', value: "7", note: 'Needs review' },
      { label: 'Updated', value: "21", note: 'This week' },
    ],
  },
  {
    slug: "notifications",
    title: "Notifications",
    href: "/notifications",
    category: "Core Platform",
    icon: Bell,
    summary: "Regulatory Change Impact Mapper alerts, reminders, exceptions, and approvals.",
    bullets: ["Notifications","Controls","Audit trail"],
    metrics: [
      { label: "Notifications", value: "65", note: 'Tracked' },
      { label: 'Open', value: "10", note: 'Needs review' },
      { label: 'Updated', value: "29", note: 'This week' },
    ],
  },
  {
    slug: "integrations",
    title: "Integrations",
    href: "/integrations",
    category: "Core Platform",
    icon: Plug,
    summary: "Regulatory Change Impact Mapper connector health, sync status, and integration warnings.",
    bullets: ["Integrations","Controls","Audit trail"],
    metrics: [
      { label: "Integrations", value: "82", note: 'Tracked' },
      { label: 'Open', value: "13", note: 'Needs review' },
      { label: 'Updated', value: "37", note: 'This week' },
    ],
  },
  {
    slug: "profiles",
    title: "Profiles",
    href: "/profiles",
    category: "Core Platform",
    icon: UserRound,
    summary: "Regulatory Change Impact Mapper users, roles, teams, permissions, and ownership settings.",
    bullets: ["Profiles","Controls","Audit trail"],
    metrics: [
      { label: "Profiles", value: "99", note: 'Tracked' },
      { label: 'Open', value: "16", note: 'Needs review' },
      { label: 'Updated', value: "45", note: 'This week' },
    ],
  },
] as const;

const aiFeatures = [
  {
    slug: 'ai-assistant',
    title: 'AI Assistant',
    href: '/features/ai-assistant',
    category: 'Intelligence Layer',
    icon: Bot,
    summary: "Regulatory Change Impact Mapper assistant for triage, drafting, analysis, recommendations, and operational review.",
    bullets: ['Triage support', 'Drafting', 'Review guidance'],
    metrics: [
      { label: 'Sessions', value: '128', note: 'Last 24 hours' },
      { label: 'Drafts', value: '204', note: 'Generated' },
      { label: 'Escalations', value: '14', note: 'Expert review' },
    ],
  },
  {
    slug: 'ai-tools',
    title: 'AI Tools',
    href: '/features/ai-tools',
    category: 'Intelligence Layer',
    icon: Activity,
    summary: "Regulatory Change Impact Mapper AI tools for scoring, generation, extraction, classification, exception review, and reporting.",
    bullets: ['Scoring', 'Classification', 'Exception review'],
    metrics: [
      { label: 'Runs', value: '318', note: 'Last 24 hours' },
      { label: 'Signals', value: '88', note: 'New alerts' },
      { label: 'Accepted', value: '117', note: 'Reviewer accepted' },
    ],
  },
] as const;

const supplementalFeatures = [
  {
    slug: "regulator-watchlist",
    title: "Regulator Watchlist",
    href: "/regulator-watchlist",
    category: "Intelligence Layer",
    icon: ShieldCheck,
    summary: "Regulator Watchlist workspace for AI scoring, signal review, trend analytics, recommended actions, and reviewer feedback in Regulatory Change Impact Mapper.",
    bullets: ["Regulator Watchlist queue","Subfeature work items","Audit-ready output"],
    metrics: [
      { label: "Regulator Watchlist", value: "90", note: 'Active records' },
      { label: 'Exceptions', value: "3", note: 'Need review' },
      { label: 'Due Soon', value: "5", note: 'Next 14 days' },
    ],
  },
  {
    slug: "obligation-mapping",
    title: "Obligation Mapping",
    href: "/obligation-mapping",
    category: "Compliance",
    icon: Workflow,
    summary: "Obligation Mapping workspace for regulatory obligations, control checks, evidence packets, deadlines, and audit-ready exports in Regulatory Change Impact Mapper.",
    bullets: ["Obligation Mapping queue","Subfeature work items","Audit-ready output"],
    metrics: [
      { label: "Obligation Mapping", value: "99", note: 'Active records' },
      { label: 'Exceptions', value: "4", note: 'Need review' },
      { label: 'Due Soon', value: "6", note: 'Next 14 days' },
    ],
  },
  {
    slug: "impact-assessment-board",
    title: "Impact Assessment Board",
    href: "/impact-assessment-board",
    category: "Governance",
    icon: BarChart3,
    summary: "Impact Assessment Board workspace for approval routing, policy controls, ownership, exceptions, audit evidence, and management signoff in Regulatory Change Impact Mapper.",
    bullets: ["Impact Assessment Board queue","Subfeature work items","Audit-ready output"],
    metrics: [
      { label: "Impact Assessment Board", value: "108", note: 'Active records' },
      { label: 'Exceptions', value: "5", note: 'Need review' },
      { label: 'Due Soon', value: "7", note: 'Next 14 days' },
    ],
  },
  {
    slug: "control-change-tasks",
    title: "Control Change Tasks",
    href: "/control-change-tasks",
    category: "Operations",
    icon: ClipboardList,
    summary: "Control Change Tasks workspace for intake queues, assignments, SLA tracking, exception handling, stakeholder updates, and closeout evidence in Regulatory Change Impact Mapper.",
    bullets: ["Control Change Tasks queue","Subfeature work items","Audit-ready output"],
    metrics: [
      { label: "Control Change Tasks", value: "117", note: 'Active records' },
      { label: 'Exceptions', value: "6", note: 'Need review' },
      { label: 'Due Soon', value: "8", note: 'Next 14 days' },
    ],
  },
  {
    slug: "policy-update-queue",
    title: "Policy Update Queue",
    href: "/policy-update-queue",
    category: "Legal",
    icon: CalendarCheck,
    summary: "Policy Update Queue workspace for legal review, redlines, evidence requirements, approval history, and deadline controls in Regulatory Change Impact Mapper.",
    bullets: ["Policy Update Queue queue","Subfeature work items","Audit-ready output"],
    metrics: [
      { label: "Policy Update Queue", value: "126", note: 'Active records' },
      { label: 'Exceptions', value: "7", note: 'Need review' },
      { label: 'Due Soon', value: "9", note: 'Next 14 days' },
    ],
  },
  {
    slug: "evidence-linkage",
    title: "Evidence Linkage",
    href: "/evidence-linkage",
    category: "Compliance",
    icon: PackageCheck,
    summary: "Evidence Linkage workspace for regulatory obligations, control checks, evidence packets, deadlines, and audit-ready exports in Regulatory Change Impact Mapper.",
    bullets: ["Evidence Linkage queue","Subfeature work items","Audit-ready output"],
    metrics: [
      { label: "Evidence Linkage", value: "135", note: 'Active records' },
      { label: 'Exceptions', value: "3", note: 'Need review' },
      { label: 'Due Soon', value: "10", note: 'Next 14 days' },
    ],
  },
  {
    slug: "deadline-calendar",
    title: "Deadline Calendar",
    href: "/deadline-calendar",
    category: "Operations",
    icon: Activity,
    summary: "Deadline Calendar workspace for intake queues, assignments, SLA tracking, exception handling, stakeholder updates, and closeout evidence in Regulatory Change Impact Mapper.",
    bullets: ["Deadline Calendar queue","Subfeature work items","Audit-ready output"],
    metrics: [
      { label: "Deadline Calendar", value: "144", note: 'Active records' },
      { label: 'Exceptions', value: "4", note: 'Need review' },
      { label: 'Due Soon', value: "11", note: 'Next 14 days' },
    ],
  }
] as const;

const productionPlatformFeatures = [
  {
    slug: "enterprise-identity-access",
    title: "Enterprise Identity & Access",
    href: "/enterprise-identity-access",
    category: "Production Platform",
    icon: ShieldCheck,
    summary: "Enterprise Identity & Access workspace for domain workflows, approvals, evidence, and reporting in Regulatory Change Impact Mapper.",
    bullets: ["Production controls","Evidence tracking","Launch readiness"],
    metrics: [
      { label: "Enterprise Identity & Access", value: "90", note: 'Active records' },
      { label: 'Exceptions', value: "3", note: 'Need review' },
      { label: 'Due Soon', value: "5", note: 'Next 14 days' },
    ],
  },
  {
    slug: "connector-operations-center",
    title: "Connector Operations Center",
    href: "/connector-operations-center",
    category: "Production Platform",
    icon: Workflow,
    summary: "Connector Operations Center workspace for domain workflows, approvals, evidence, and reporting in Regulatory Change Impact Mapper.",
    bullets: ["Production controls","Evidence tracking","Launch readiness"],
    metrics: [
      { label: "Connector Operations Center", value: "99", note: 'Active records' },
      { label: 'Exceptions', value: "4", note: 'Need review' },
      { label: 'Due Soon', value: "6", note: 'Next 14 days' },
    ],
  },
  {
    slug: "audit-export-center",
    title: "Audit Export Center",
    href: "/audit-export-center",
    category: "Production Platform",
    icon: BarChart3,
    summary: "Audit Export Center workspace for domain workflows, approvals, evidence, and reporting in Regulatory Change Impact Mapper.",
    bullets: ["Production controls","Evidence tracking","Launch readiness"],
    metrics: [
      { label: "Audit Export Center", value: "108", note: 'Active records' },
      { label: 'Exceptions', value: "5", note: 'Need review' },
      { label: 'Due Soon', value: "7", note: 'Next 14 days' },
    ],
  },
  {
    slug: "notification-delivery-ledger",
    title: "Notification Delivery Ledger",
    href: "/notification-delivery-ledger",
    category: "Production Platform",
    icon: ClipboardList,
    summary: "Notification Delivery Ledger workspace for domain workflows, approvals, evidence, and reporting in Regulatory Change Impact Mapper.",
    bullets: ["Production controls","Evidence tracking","Launch readiness"],
    metrics: [
      { label: "Notification Delivery Ledger", value: "117", note: 'Active records' },
      { label: 'Exceptions', value: "6", note: 'Need review' },
      { label: 'Due Soon', value: "8", note: 'Next 14 days' },
    ],
  },
  {
    slug: "observability-runbooks",
    title: "Observability & Runbooks",
    href: "/observability-runbooks",
    category: "Production Platform",
    icon: CalendarCheck,
    summary: "Observability & Runbooks workspace for domain workflows, approvals, evidence, and reporting in Regulatory Change Impact Mapper.",
    bullets: ["Production controls","Evidence tracking","Launch readiness"],
    metrics: [
      { label: "Observability & Runbooks", value: "126", note: 'Active records' },
      { label: 'Exceptions', value: "7", note: 'Need review' },
      { label: 'Due Soon', value: "9", note: 'Next 14 days' },
    ],
  },
  {
    slug: "release-test-harness",
    title: "Release Test Harness",
    href: "/release-test-harness",
    category: "Production Platform",
    icon: PackageCheck,
    summary: "Release Test Harness workspace for domain workflows, approvals, evidence, and reporting in Regulatory Change Impact Mapper.",
    bullets: ["Production controls","Evidence tracking","Launch readiness"],
    metrics: [
      { label: "Release Test Harness", value: "135", note: 'Active records' },
      { label: 'Exceptions', value: "3", note: 'Need review' },
      { label: 'Due Soon', value: "10", note: 'Next 14 days' },
    ],
  },
  {
    slug: "production-gap-workspace",
    title: "Production Gap Workspace",
    href: "/production-gap-workspace",
    category: "Production Platform",
    icon: Activity,
    summary: "Production Gap Workspace workspace for domain workflows, approvals, evidence, and reporting in Regulatory Change Impact Mapper.",
    bullets: ["Production controls","Evidence tracking","Launch readiness"],
    metrics: [
      { label: "Production Gap Workspace", value: "144", note: 'Active records' },
      { label: 'Exceptions', value: "4", note: 'Need review' },
      { label: 'Due Soon', value: "11", note: 'Next 14 days' },
    ],
  }
] as const;

const allFeatures = [...features, ...supplementalFeatures, ...productionPlatformFeatures, ...aiFeatures];

export const primaryNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'All Features', href: '/features', icon: Blocks },
  { label: 'Production Readiness', href: '/production-readiness', icon: ShieldCheck },
  { label: 'Documents', href: '/documents', icon: Files },
  { label: 'Source Tables', href: '/source-tables', icon: Database },
  { label: 'Profiles', href: '/profiles', icon: UserRound },
];

export const featureNav: NavItem[] = allFeatures.map((feature) => ({ label: feature.title, href: feature.href, icon: feature.icon }));
export const featureCatalog: FeatureDefinition[] = allFeatures.map((feature) => ({ title: feature.title, href: feature.href, category: feature.category, summary: feature.summary, bullets: [...feature.bullets] }));

export const featureFamilies = [
  { name: 'Production Platform Controls', features: ['Enterprise Identity & Access', 'Connector Operations Center', 'Audit Export Center', 'Notification Delivery Ledger', 'Observability & Runbooks', 'Release Test Harness', 'Production Gap Workspace'] },
  { name: "Regulatory Change Controls", features: ["Regulator Watchlist","Obligation Mapping","Impact Assessment Board","Control Change Tasks","Policy Update Queue","Evidence Linkage","Deadline Calendar"] },
  {
    "name": "Intake",
    "features": [
      "Regulatory Watchlist"
    ]
  },
  {
    "name": "Analysis",
    "features": [
      "Impact Assessment"
    ]
  },
  {
    "name": "Controls",
    "features": [
      "Control Mapping"
    ]
  },
  {
    "name": "Policies",
    "features": [
      "Policy Update Queue"
    ]
  },
  {
    "name": "Third Party",
    "features": [
      "Vendor Impact"
    ]
  },
  {
    "name": "Product",
    "features": [
      "Product Change Plan"
    ]
  },
  {
    "name": "Operations",
    "features": [
      "Deadline Tracker"
    ]
  },
  {
    "name": "Evidence",
    "features": [
      "Evidence Requests"
    ]
  },
  {
    "name": "Reporting",
    "features": [
      "Board Risk Summary"
    ]
  },
  {
    "name": "Execution",
    "features": [
      "Implementation Workplan"
    ]
  },
  {
    "name": "Core Platform",
    "features": [
      "Documents",
      "Notifications",
      "Integrations",
      "Profiles"
    ]
  },
  {
    "name": "Intelligence Layer",
    "features": [
      "AI Assistant",
      "AI Tools"
    ]
  }
];

function toPage(feature: (typeof allFeatures)[number]): PageDefinition {
  return {
    title: feature.title,
    eyebrow: feature.category,
    subtitle: feature.summary,
    category: feature.category,
    summary: feature.title + ' is implemented as a dedicated Regulatory Change Impact Mapper workflow with records, AI assistance, approvals, audit, and reporting.',
    bullets: [...feature.bullets],
    metrics: [...feature.metrics],
  };
}

export const pageRegistry: Record<string, PageDefinition> = Object.fromEntries([...features, ...supplementalFeatures, ...productionPlatformFeatures].map((feature) => [feature.slug, toPage(feature)]));
export const aiFeatureRegistry: Record<string, PageDefinition> = Object.fromEntries(aiFeatures.map((feature) => [feature.slug, toPage(feature)]));
export const featureContexts: Record<string, FeatureContext> = Object.fromEntries(
  allFeatures.map((feature) => [
    feature.title,
    {
      sourceOwners: suiteSourceOwners,
      operatingQueues: [feature.title + ' records', feature.title + ' approvals', feature.title + ' exceptions'],
      outputs: [feature.title + ' dashboard', feature.title + ' export', feature.title + ' audit trail'],
      relatedRoutes: [{ label: 'Dashboard', href: '/dashboard' }, { label: 'All Features', href: '/features' }, { label: 'AI Tools', href: '/features/ai-tools' }],
    },
  ]),
);
