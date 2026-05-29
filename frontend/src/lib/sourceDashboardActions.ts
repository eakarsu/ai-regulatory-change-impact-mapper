export type SourceDashboardAction = {
  id: string;
  label: string;
  description: string;
  href: string;
  sourceProjects: string[];
  examples: string[];
  count: number;
};

export const sourceDashboardActions: SourceDashboardAction[] = [
  {
    "id": "regulatory-watchlist",
    "label": "Regulatory Watchlist",
    "description": "Regulatory Watchlist action group for Regulatory Change Impact Mapper.",
    "href": "/regulatory-watchlist",
    "sourceProjects": [
      "Regulatory updates",
      "Control library"
    ],
    "examples": [
      "Open Regulatory Watchlist",
      "Review Intake",
      "Run Regulatory Watchlist AI check"
    ],
    "count": 3
  },
  {
    "id": "impact-assessment",
    "label": "Impact Assessment",
    "description": "Impact Assessment action group for Regulatory Change Impact Mapper.",
    "href": "/impact-assessment",
    "sourceProjects": [
      "Control library",
      "Policy inventory"
    ],
    "examples": [
      "Open Impact Assessment",
      "Review Analysis",
      "Run Impact Assessment AI check"
    ],
    "count": 3
  },
  {
    "id": "control-mapping",
    "label": "Control Mapping",
    "description": "Control Mapping action group for Regulatory Change Impact Mapper.",
    "href": "/control-mapping",
    "sourceProjects": [
      "Policy inventory",
      "Vendor register"
    ],
    "examples": [
      "Open Control Mapping",
      "Review Controls",
      "Run Control Mapping AI check"
    ],
    "count": 3
  },
  {
    "id": "policy-update-queue",
    "label": "Policy Update Queue",
    "description": "Policy Update Queue action group for Regulatory Change Impact Mapper.",
    "href": "/policy-update-queue",
    "sourceProjects": [
      "Vendor register"
    ],
    "examples": [
      "Open Policy Update Queue",
      "Review Policies",
      "Run Policy Update Queue AI check"
    ],
    "count": 3
  },
  {
    "id": "vendor-impact",
    "label": "Vendor Impact",
    "description": "Vendor Impact action group for Regulatory Change Impact Mapper.",
    "href": "/vendor-impact",
    "sourceProjects": [
      "Regulatory updates",
      "Control library"
    ],
    "examples": [
      "Open Vendor Impact",
      "Review Third Party",
      "Run Vendor Impact AI check"
    ],
    "count": 3
  },
  {
    "id": "product-change-plan",
    "label": "Product Change Plan",
    "description": "Product Change Plan action group for Regulatory Change Impact Mapper.",
    "href": "/product-change-plan",
    "sourceProjects": [
      "Control library",
      "Policy inventory"
    ],
    "examples": [
      "Open Product Change Plan",
      "Review Product",
      "Run Product Change Plan AI check"
    ],
    "count": 3
  },
  {
    "id": "deadline-tracker",
    "label": "Deadline Tracker",
    "description": "Deadline Tracker action group for Regulatory Change Impact Mapper.",
    "href": "/deadline-tracker",
    "sourceProjects": [
      "Policy inventory",
      "Vendor register"
    ],
    "examples": [
      "Open Deadline Tracker",
      "Review Operations",
      "Run Deadline Tracker AI check"
    ],
    "count": 3
  },
  {
    "id": "evidence-requests",
    "label": "Evidence Requests",
    "description": "Evidence Requests action group for Regulatory Change Impact Mapper.",
    "href": "/evidence-requests",
    "sourceProjects": [
      "Vendor register"
    ],
    "examples": [
      "Open Evidence Requests",
      "Review Evidence",
      "Run Evidence Requests AI check"
    ],
    "count": 3
  },
  {
    "id": "board-risk-summary",
    "label": "Board Risk Summary",
    "description": "Board Risk Summary action group for Regulatory Change Impact Mapper.",
    "href": "/board-risk-summary",
    "sourceProjects": [
      "Regulatory updates",
      "Control library"
    ],
    "examples": [
      "Open Board Risk Summary",
      "Review Reporting",
      "Run Board Risk Summary AI check"
    ],
    "count": 3
  },
  {
    "id": "implementation-workplan",
    "label": "Implementation Workplan",
    "description": "Implementation Workplan action group for Regulatory Change Impact Mapper.",
    "href": "/implementation-workplan",
    "sourceProjects": [
      "Control library",
      "Policy inventory"
    ],
    "examples": [
      "Open Implementation Workplan",
      "Review Execution",
      "Run Implementation Workplan AI check"
    ],
    "count": 3
  }
];
