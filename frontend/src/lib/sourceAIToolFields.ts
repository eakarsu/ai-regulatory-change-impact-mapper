export type SourceAIToolField = {
  name: string;
  label: string;
  type: string;
  defaultValue: string;
  placeholder: string;
  options: string[];
  required?: boolean;
  source: string;
};

export const sourceAIToolFieldsByToolId: Record<string, SourceAIToolField[]> = {
  "regulatory-watchlist-copilot": [
    {
      "name": "objective",
      "label": "Objective",
      "type": "textarea",
      "defaultValue": "Improve Regulatory Watchlist and produce an audit-ready action plan.",
      "placeholder": "Describe the decision or workflow goal",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "source_context",
      "label": "Source Context",
      "type": "textarea",
      "defaultValue": "Paste records, notes, documents, metrics, or evidence for Regulatory Watchlist.",
      "placeholder": "Paste source context",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "output_format",
      "label": "Output Format",
      "type": "select",
      "defaultValue": "Action plan",
      "placeholder": "Select output format",
      "options": [
        "Action plan",
        "Executive summary",
        "Evidence table",
        "Checklist"
      ],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    }
  ],
  "impact-assessment-copilot": [
    {
      "name": "objective",
      "label": "Objective",
      "type": "textarea",
      "defaultValue": "Improve Impact Assessment and produce an audit-ready action plan.",
      "placeholder": "Describe the decision or workflow goal",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "source_context",
      "label": "Source Context",
      "type": "textarea",
      "defaultValue": "Paste records, notes, documents, metrics, or evidence for Impact Assessment.",
      "placeholder": "Paste source context",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "output_format",
      "label": "Output Format",
      "type": "select",
      "defaultValue": "Action plan",
      "placeholder": "Select output format",
      "options": [
        "Action plan",
        "Executive summary",
        "Evidence table",
        "Checklist"
      ],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    }
  ],
  "control-mapping-copilot": [
    {
      "name": "objective",
      "label": "Objective",
      "type": "textarea",
      "defaultValue": "Improve Control Mapping and produce an audit-ready action plan.",
      "placeholder": "Describe the decision or workflow goal",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "source_context",
      "label": "Source Context",
      "type": "textarea",
      "defaultValue": "Paste records, notes, documents, metrics, or evidence for Control Mapping.",
      "placeholder": "Paste source context",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "output_format",
      "label": "Output Format",
      "type": "select",
      "defaultValue": "Action plan",
      "placeholder": "Select output format",
      "options": [
        "Action plan",
        "Executive summary",
        "Evidence table",
        "Checklist"
      ],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    }
  ],
  "policy-update-queue-copilot": [
    {
      "name": "objective",
      "label": "Objective",
      "type": "textarea",
      "defaultValue": "Improve Policy Update Queue and produce an audit-ready action plan.",
      "placeholder": "Describe the decision or workflow goal",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "source_context",
      "label": "Source Context",
      "type": "textarea",
      "defaultValue": "Paste records, notes, documents, metrics, or evidence for Policy Update Queue.",
      "placeholder": "Paste source context",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "output_format",
      "label": "Output Format",
      "type": "select",
      "defaultValue": "Action plan",
      "placeholder": "Select output format",
      "options": [
        "Action plan",
        "Executive summary",
        "Evidence table",
        "Checklist"
      ],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    }
  ],
  "vendor-impact-copilot": [
    {
      "name": "objective",
      "label": "Objective",
      "type": "textarea",
      "defaultValue": "Improve Vendor Impact and produce an audit-ready action plan.",
      "placeholder": "Describe the decision or workflow goal",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "source_context",
      "label": "Source Context",
      "type": "textarea",
      "defaultValue": "Paste records, notes, documents, metrics, or evidence for Vendor Impact.",
      "placeholder": "Paste source context",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "output_format",
      "label": "Output Format",
      "type": "select",
      "defaultValue": "Action plan",
      "placeholder": "Select output format",
      "options": [
        "Action plan",
        "Executive summary",
        "Evidence table",
        "Checklist"
      ],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    }
  ],
  "product-change-plan-copilot": [
    {
      "name": "objective",
      "label": "Objective",
      "type": "textarea",
      "defaultValue": "Improve Product Change Plan and produce an audit-ready action plan.",
      "placeholder": "Describe the decision or workflow goal",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "source_context",
      "label": "Source Context",
      "type": "textarea",
      "defaultValue": "Paste records, notes, documents, metrics, or evidence for Product Change Plan.",
      "placeholder": "Paste source context",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "output_format",
      "label": "Output Format",
      "type": "select",
      "defaultValue": "Action plan",
      "placeholder": "Select output format",
      "options": [
        "Action plan",
        "Executive summary",
        "Evidence table",
        "Checklist"
      ],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    }
  ],
  "deadline-tracker-copilot": [
    {
      "name": "objective",
      "label": "Objective",
      "type": "textarea",
      "defaultValue": "Improve Deadline Tracker and produce an audit-ready action plan.",
      "placeholder": "Describe the decision or workflow goal",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "source_context",
      "label": "Source Context",
      "type": "textarea",
      "defaultValue": "Paste records, notes, documents, metrics, or evidence for Deadline Tracker.",
      "placeholder": "Paste source context",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "output_format",
      "label": "Output Format",
      "type": "select",
      "defaultValue": "Action plan",
      "placeholder": "Select output format",
      "options": [
        "Action plan",
        "Executive summary",
        "Evidence table",
        "Checklist"
      ],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    }
  ],
  "evidence-requests-copilot": [
    {
      "name": "objective",
      "label": "Objective",
      "type": "textarea",
      "defaultValue": "Improve Evidence Requests and produce an audit-ready action plan.",
      "placeholder": "Describe the decision or workflow goal",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "source_context",
      "label": "Source Context",
      "type": "textarea",
      "defaultValue": "Paste records, notes, documents, metrics, or evidence for Evidence Requests.",
      "placeholder": "Paste source context",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "output_format",
      "label": "Output Format",
      "type": "select",
      "defaultValue": "Action plan",
      "placeholder": "Select output format",
      "options": [
        "Action plan",
        "Executive summary",
        "Evidence table",
        "Checklist"
      ],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    }
  ],
  "board-risk-summary-copilot": [
    {
      "name": "objective",
      "label": "Objective",
      "type": "textarea",
      "defaultValue": "Improve Board Risk Summary and produce an audit-ready action plan.",
      "placeholder": "Describe the decision or workflow goal",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "source_context",
      "label": "Source Context",
      "type": "textarea",
      "defaultValue": "Paste records, notes, documents, metrics, or evidence for Board Risk Summary.",
      "placeholder": "Paste source context",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "output_format",
      "label": "Output Format",
      "type": "select",
      "defaultValue": "Action plan",
      "placeholder": "Select output format",
      "options": [
        "Action plan",
        "Executive summary",
        "Evidence table",
        "Checklist"
      ],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    }
  ],
  "implementation-workplan-copilot": [
    {
      "name": "objective",
      "label": "Objective",
      "type": "textarea",
      "defaultValue": "Improve Implementation Workplan and produce an audit-ready action plan.",
      "placeholder": "Describe the decision or workflow goal",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "source_context",
      "label": "Source Context",
      "type": "textarea",
      "defaultValue": "Paste records, notes, documents, metrics, or evidence for Implementation Workplan.",
      "placeholder": "Paste source context",
      "options": [],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    },
    {
      "name": "output_format",
      "label": "Output Format",
      "type": "select",
      "defaultValue": "Action plan",
      "placeholder": "Select output format",
      "options": [
        "Action plan",
        "Executive summary",
        "Evidence table",
        "Checklist"
      ],
      "required": true,
      "source": "Regulatory Change Impact Mapper"
    }
  ]
};
