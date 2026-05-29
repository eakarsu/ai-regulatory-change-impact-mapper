export type EntityRecord = { id: string; name: string; status: string; owner: string; amount?: string; dueDate?: string; priority?: string };
export type FeatureEntitySet = { title: string; columns: string[]; rows: EntityRecord[] };
const COLUMNS = ['Name', 'Status', 'Owner', 'Amount', 'Due Date', 'Priority'];
const entitySeeds = [
  [
    "regulatory-watchlist",
    "Regulatory Watchlist Records",
    "Regulatory Watchlist priority queue",
    "Open",
    "Regulatory Watchlist exception list",
    "Intake Lead",
    "$0"
  ],
  [
    "impact-assessment",
    "Impact Assessment Records",
    "Impact Assessment priority queue",
    "Review",
    "Impact Assessment exception list",
    "Analysis Lead",
    "$0"
  ],
  [
    "control-mapping",
    "Control Mapping Records",
    "Control Mapping priority queue",
    "Action needed",
    "Control Mapping exception list",
    "Controls Lead",
    "$0"
  ],
  [
    "policy-update-queue",
    "Policy Update Queue Records",
    "Policy Update Queue priority queue",
    "Open",
    "Policy Update Queue exception list",
    "Policies Lead",
    "$0"
  ],
  [
    "vendor-impact",
    "Vendor Impact Records",
    "Vendor Impact priority queue",
    "Review",
    "Vendor Impact exception list",
    "Third Party Lead",
    "$0"
  ],
  [
    "product-change-plan",
    "Product Change Plan Records",
    "Product Change Plan priority queue",
    "Action needed",
    "Product Change Plan exception list",
    "Product Lead",
    "$0"
  ],
  [
    "deadline-tracker",
    "Deadline Tracker Records",
    "Deadline Tracker priority queue",
    "Open",
    "Deadline Tracker exception list",
    "Operations Lead",
    "$0"
  ],
  [
    "evidence-requests",
    "Evidence Requests Records",
    "Evidence Requests priority queue",
    "Review",
    "Evidence Requests exception list",
    "Evidence Lead",
    "$0"
  ],
  [
    "board-risk-summary",
    "Board Risk Summary Records",
    "Board Risk Summary priority queue",
    "Action needed",
    "Board Risk Summary exception list",
    "Reporting Lead",
    "$0"
  ],
  [
    "implementation-workplan",
    "Implementation Workplan Records",
    "Implementation Workplan priority queue",
    "Open",
    "Implementation Workplan exception list",
    "Execution Lead",
    "$0"
  ],
  [
    "documents",
    "Documents Records",
    "Documents priority queue",
    "Review",
    "Documents exception list",
    "Core Platform Lead",
    "$0"
  ],
  [
    "notifications",
    "Notifications Records",
    "Notifications priority queue",
    "Action needed",
    "Notifications exception list",
    "Core Platform Lead",
    "$0"
  ],
  [
    "integrations",
    "Integrations Records",
    "Integrations priority queue",
    "Open",
    "Integrations exception list",
    "Core Platform Lead",
    "$0"
  ],
  [
    "profiles",
    "Profiles Records",
    "Profiles priority queue",
    "Review",
    "Profiles exception list",
    "Core Platform Lead",
    "$0"
  ],
  [
    "ai-assistant",
    "AI Assistant Records",
    "AI Assistant priority queue",
    "Action needed",
    "AI Assistant exception list",
    "Intelligence Layer Lead",
    "$0"
  ],
  [
    "ai-tools",
    "AI Tools Records",
    "AI Tools priority queue",
    "Open",
    "AI Tools exception list",
    "Intelligence Layer Lead",
    "$0"
  ]
] as const;

function buildSet(slug: string, title: string, firstName: string, firstStatus: string, secondName: string, owner: string, amount: string): FeatureEntitySet {
  return {
    title,
    columns: COLUMNS,
    rows: [
      { id: `${slug}-1`, name: firstName, status: firstStatus, owner, amount, dueDate: '2026-06-03', priority: 'High' },
      { id: `${slug}-2`, name: secondName, status: 'Review', owner: 'Operations', amount, dueDate: '2026-06-06', priority: 'Medium' },
      { id: `${slug}-3`, name: `${title.replace(' Records', '')} audit queue`, status: 'Queued', owner: 'Team Lead', amount: '$0', dueDate: '2026-06-10', priority: 'Medium' },
    ],
  };
}

export const featureEntitiesBySlug: Record<string, FeatureEntitySet> = Object.fromEntries(entitySeeds.map(([slug, title, firstName, firstStatus, secondName, owner, amount]) => [slug, buildSet(slug, title, firstName, firstStatus, secondName, owner, amount)]));
