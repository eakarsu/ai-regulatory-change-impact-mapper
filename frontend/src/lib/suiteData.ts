export type Metric = { label: string; value: string; note: string };
export const sourceSystems = [
  {
    "name": "Regulatory updates",
    "ownership": "Regulatory updates contributes operating evidence, workflows, control signals, and reporting inputs to Regulatory Change Impact Mapper.",
    "coverage": [
      "Regulatory Watchlist",
      "Impact Assessment",
      "AI tools",
      "Audit evidence"
    ]
  },
  {
    "name": "Control library",
    "ownership": "Control library contributes operating evidence, workflows, control signals, and reporting inputs to Regulatory Change Impact Mapper.",
    "coverage": [
      "Impact Assessment",
      "Control Mapping",
      "AI tools",
      "Audit evidence"
    ]
  },
  {
    "name": "Policy inventory",
    "ownership": "Policy inventory contributes operating evidence, workflows, control signals, and reporting inputs to Regulatory Change Impact Mapper.",
    "coverage": [
      "Control Mapping",
      "Policy Update Queue",
      "AI tools",
      "Audit evidence"
    ]
  },
  {
    "name": "Vendor register",
    "ownership": "Vendor register contributes operating evidence, workflows, control signals, and reporting inputs to Regulatory Change Impact Mapper.",
    "coverage": [
      "Policy Update Queue",
      "Vendor Impact",
      "AI tools",
      "Audit evidence"
    ]
  }
];

export const dashboardMetrics: Metric[] = [
  { label: 'Workflow Areas', value: '10', note: 'Dedicated modules' },
  { label: 'Evidence Sources', value: '4', note: 'Mapped sources' },
  { label: 'AI Tools', value: '13', note: 'Suite copilots' },
  { label: 'Open Work', value: '64', note: 'Across workflows' },
];

export const healthMetrics: Metric[] = [
  { label: 'Connector Health', value: '96%', note: 'Pilot baseline' },
  { label: 'Audit Coverage', value: '100%', note: 'All workflows logged' },
  { label: 'Review Queue', value: '22', note: 'Needs owner action' },
  { label: 'Automation Runs', value: '345', note: 'Last 24 hours' },
];

export const dashboardModules = [
  "Regulatory Watchlist operating view",
  "Impact Assessment operating view",
  "Control Mapping operating view",
  "Policy Update Queue operating view",
  "Vendor Impact operating view",
  "Product Change Plan operating view",
  "Deadline Tracker operating view",
  "Evidence Requests operating view"
];
export const workflowHighlights = [
  "Regulatory Watchlist workflow with records, AI assist, approvals, audit, and reporting",
  "Impact Assessment workflow with records, AI assist, approvals, audit, and reporting",
  "Control Mapping workflow with records, AI assist, approvals, audit, and reporting",
  "Policy Update Queue workflow with records, AI assist, approvals, audit, and reporting",
  "Vendor Impact workflow with records, AI assist, approvals, audit, and reporting",
  "Product Change Plan workflow with records, AI assist, approvals, audit, and reporting"
];
