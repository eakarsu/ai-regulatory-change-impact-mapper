export type FeatureSurfaceRow = { id: string; item: string; status: string; owner: string; nextStep: string };
export type FeatureSurface = {
  workItems: FeatureSurfaceRow[];
  quickActions: string[];
  controlChecks: Array<{ id: string; label: string; done: boolean }>;
  activityLog: Array<{ id: string; message: string; at: string }>;
};

const featureSeeds = [
  [
    "regulatory-watchlist",
    "Regulatory Watchlist",
    "Regulatory Watchlist operating queue",
    "Intake Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "impact-assessment",
    "Impact Assessment",
    "Impact Assessment operating queue",
    "Analysis Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "control-mapping",
    "Control Mapping",
    "Control Mapping operating queue",
    "Controls Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "policy-update-queue",
    "Policy Update Queue",
    "Policy Update Queue operating queue",
    "Policies Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "vendor-impact",
    "Vendor Impact",
    "Vendor Impact operating queue",
    "Third Party Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "product-change-plan",
    "Product Change Plan",
    "Product Change Plan operating queue",
    "Product Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "deadline-tracker",
    "Deadline Tracker",
    "Deadline Tracker operating queue",
    "Operations Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "evidence-requests",
    "Evidence Requests",
    "Evidence Requests operating queue",
    "Evidence Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "board-risk-summary",
    "Board Risk Summary",
    "Board Risk Summary operating queue",
    "Reporting Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "implementation-workplan",
    "Implementation Workplan",
    "Implementation Workplan operating queue",
    "Execution Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "documents",
    "Documents",
    "Documents operating queue",
    "Core Platform Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "notifications",
    "Notifications",
    "Notifications operating queue",
    "Core Platform Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "integrations",
    "Integrations",
    "Integrations operating queue",
    "Core Platform Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "profiles",
    "Profiles",
    "Profiles operating queue",
    "Core Platform Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "ai-assistant",
    "AI Assistant",
    "AI Assistant operating queue",
    "Intelligence Layer Lead",
    "Review evidence, assign owner, and record next action"
  ],
  [
    "ai-tools",
    "AI Tools",
    "AI Tools operating queue",
    "Intelligence Layer Lead",
    "Review evidence, assign owner, and record next action"
  ]
] as const;

function buildSurface(slug: string, title: string, item: string, owner: string, nextStep: string): FeatureSurface {
  return {
    workItems: [
      { id: `${slug}-1`, item, status: 'Open', owner, nextStep },
      { id: `${slug}-2`, item: `${title} exception review`, status: 'Review', owner: 'Operations', nextStep: 'Investigate exception and assign owner' },
      { id: `${slug}-3`, item: `${title} weekly operating queue`, status: 'Queued', owner: 'Team Lead', nextStep: 'Prioritize next actions' },
    ],
    quickActions: [`Create ${title} record`, `Export ${title} list`, `Review ${title} exceptions`],
    controlChecks: [
      { id: `${slug}-check-1`, label: `${title} owner assigned`, done: true },
      { id: `${slug}-check-2`, label: `${title} next step documented`, done: false },
      { id: `${slug}-check-3`, label: `${title} audit trail current`, done: true },
    ],
    activityLog: [
      { id: `${slug}-log-1`, message: `${title} queue refreshed`, at: '2026-05-29 09:00' },
      { id: `${slug}-log-2`, message: `${title} exception assigned`, at: '2026-05-29 11:30' },
    ],
  };
}

export const featureSurfaceBySlug: Record<string, FeatureSurface> = Object.fromEntries(featureSeeds.map(([slug, title, item, owner, nextStep]) => [slug, buildSurface(slug, title, item, owner, nextStep)]));
export const featureSurfaces: Record<string, FeatureSurface> = Object.fromEntries(featureSeeds.map(([slug, title]) => [title, featureSurfaceBySlug[slug]]));
