/**
 * SOURCE OF TRUTH
 * -----------------------------------------------------------------------------
 * Every string in this file is derived from Amit Joshi's resume.
 * Nothing here is invented: no extra employers, metrics, clients or outcomes.
 * "Director's notes" are explicitly framed as engineering reasoning, not as
 * historical project claims.
 */

import resumePdf from "./Amit_Joshi_Resume.pdf";

export type CutType =
  | "CUT"
  | "DISSOLVE"
  | "ZOOM"
  | "PAN"
  | "TRACKING SHOT"
  | "RACK FOCUS"
  | "REWIND";

export type ProjectKind = "professional" | "personal";

export interface DirectorsNote {
  /** e.g. "WHY KALMAN FILTER?" */
  question: string;
  /** Framed as engineering reasoning. */
  body: string[];
}

export interface Metric {
  value: string;
  label: string;
}

export interface ProjectDetail {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  kind: ProjectKind;
  cut: CutType;
  status?: string;
  logline: string;
  details: ProjectDetail[];
  keywords: string[];
  metrics?: Metric[];
  github?: string;
  accent: string;
  note: DirectorsNote;
}

export const PROJECTS: Project[] = [
  {
    id: "roi-engine",
    index: "01",
    title: "ROI Engine",
    subtitle: "Adaptive Market Mix  Modelling",
    kind: "professional",
    cut: "TRACKING SHOT",
    logline:
      "A dynamic MMM platform for understanding which marketing and commercial levers are actually moving sales.",
    details: [
      { label: "PROBLEM", value: "How marketing and commercial activity affects product sales and where to put the next dollar." },
      { label: "ARCHITECTURE", value: "A state-space estimation system with queue-driven execution, containerized services, and cloud-native deployment for scalable market-level execution." },
      { label: "CONTRIBUTION", value: "Led a 3-person Data Science team from system design through production delivery." },
    ],
    keywords: ["Market Mix Modelling", "Distributed Execution", "Production", "Technical Leadership"],
    metrics: [
      { value: "$500M+", label: "annual spend optimized" },
      { value: "20+", label: "global markets" },
      { value: "3", label: "Data Scientists Led" },
      { value: "12wk → 4wk", label: "market onboarding time" },
    ],
    accent: "#C98A3C",
    note: {
      question: "Why Kalman Filter?",
      body: [
        "ENGINEERING RATIONALE:",
        "A market does not stay still, so a fixed coefficient has a hard time describing it.",
        "The state-space formulation treats channel effectiveness as a latent state that evolves over time. Each new observation updates that state while carrying uncertainty forward.",
        "That makes the model portable: a new market is a new set of observations, not a new codebase.",
      ],
    },
  },
  {
    id: "luma",
    index: "02",
    title: "Luma",
    subtitle: "AI ANALYTICS COPILOT",
    kind: "professional",
    cut: "DISSOLVE",
    logline:
      "A natural-language interface for MMM analysis, turning complex marketing results into answers people can actually use.",
    details: [
      { label: "PROBLEM", value: "MMM results can answer the question, but business users still have to dig through outputs to understand what changed, why it changed, and what deserves attention." },
      { label: "ARCHITECTURE", value: "A full-stack conversational analytics pipeline combining FastAPI, LangGraph orchestration, validated data retrieval, Python-based calculation, and streamed LLM responses." },
      { label: "CONTRIBUTION", value: "Designed and engineered the end-to-end experience, from natural-language query handling and data retrieval to analytical computation, visualization, and streamed responses." },
    ],
    keywords: ["CONVERSATIONAL AI", "ANALYTICS", "LANGGRAPH", "FULL-STACK"],
    accent: "#7C95A6",
    note: {
      question: "WHY BUILD IT THIS WAY?",
      body: [
        "ENGINEERING RATIONALE:",
        "The MMM engine already knows the numbers. The problem was making people work to find the story inside them.",
        "Luma turns that process into a conversation: ask a question, see the relevant signal, and get an explanation alongside it.",
        "The LLM is the interface to the analysis, not the source of truth.",
      ],
    },
  },
  {
    id: "spool",
    index: "03",
    title: "Spool",
    subtitle: "Natural Language to Optimizatoin Code",
    kind: "professional",
    cut: "ZOOM",
    logline:
      "Turns a natural-language business problem into a validated mathematical formulation and executable optimization code through an AI-guided workflow.",
    details: [
      { label: "PROBLEM", value: "Business optimization requirements are rarely expressed as equations. Translating them into a correct formulation and executable solver code takes significant manual iteration" },
      { label: "ARCHITECTURE", value: "A LangGraph-orchestrated workflow combining formulation extraction, AI critique, human review, solver-code generation, validation, and sandboxed execution." },
      { label: "CONTRIBUTION", value: "Designed and built the core formulation, critique, refinement, and solver-generation workflow, including human review and code validation." },
    ],
    keywords: ["LANGGRAPH", "OPERATIONS RESEARCH", "HUMAN-IN-THE-LOOP", "AI ORCHESTRATION"],
    accent: "#6B7F5E",
    note: {
      question: "Why multi-agent?",
      body: [
        "ENGINEERING RATIONALE:",
        "Formulation, model assembly, and solver configuration fail in different ways. Keeping them as separate stages makes each decision inspectable instead of hiding everything inside one generated block.",
        "The critique loop adds another checkpoint before code is produced, and the human review stage gives the workflow somewhere to stop when the model is technically plausible but wrong for the business problem.",
      ],
    },
  },
  {
    id: "sila",
    index: "04",
    title: "Sila",
    subtitle: "Local-First AI Media Organizer",
    kind: "personal",
    cut: "PAN",
    logline:
      "Built for filmmakers and photographers who want their archive to organize itself — locally, intelligently, and without manual tagging.",
    details: [
      { label: "PROBLEM", value: "Creators accumulate thousands of photos and video frames, but finding the right moment still depends on filenames, folders, memory, and manual tags." },
      { label: "ARCHITECTURE", value: "A local-first multimodal pipeline that enriches media with visual and semantic signals, stores them across SQLite and LanceDB, and fuses three retrieval paths with Reciprocal Rank Fusion." },
      { label: "GOAL", value: "Make an untagged archive searchable, understandable, and easier to organize through natural language." },
    ],
    keywords: ["LOCAL-FIRST", "MULTIMODAL", "HYBRID RETRIEVAL", "RANKING"],
    github: "https://github.com/amitjoshi9627/sila",
    accent: "#C98A3C",
    note: {
      question: "Why fuse three Signals?",
      body: [
        "ENGINEERING RATIONALE:",
        "Exact search is useful when the query names something concrete. Visual search finds composition, color, and visual similarity. Conceptual search can connect a scene description to an idea that was never explicitly tagged.",
        "RRF lets those signals contribute by rank rather than forcing incompatible scores onto the same scale.",
        "The archive is richer than any one index can describe.",
      ],
    },
  },
  {
    id: "vaak",
    index: "05",
    title: "Vaak",
    subtitle: "AI Synthetic Voice Detector",
    kind: "personal",
    cut: "RACK FOCUS",
    status: "ACTIVE BUILD",
    logline:
      "An AI voice detector built to tell synthetic speech from real speech - with evidence, not just a score.",
    details: [
      {
        label: "THE PROBLEM",
        value:
          "A voice can sound convincing while hiding synthetic artifacts across only parts of a recording. Detecting them requires more than one final score.",
      },
      {
        label: "THE SYSTEM",
        value:
          "A WavLM-based speech detector that analyzes overlapping audio segments, aggregates their evidence, and produces an utterance-level spoof likelihood.",
      },
      {
        label: "THE GOAL",
        value:
          "Make synthetic-voice detection easier to trust by pairing the verdict with evidence about where and why it was flagged.",
      },
    ],
    keywords: [
      "AI AUDIO",
      "SPOOF DETECTION",
      "SPEECH ML",
      "FORENSIC ANALYSIS",
    ],
    github: "https://github.com/amitjoshi9627/vaak",
    accent: "#C94E35",
    note: {
      question: "Why not just give a score?",
      body: [
        "ENGINEERING RATIONALE",
        "A score can tell you what the system decided. It doesn't tell you where the evidence appeared or whether the signal was consistent across the recording.",
        "Vaak breaks the recording into overlapping segments and preserves that evidence through the final decision.",
        "The verdict is the beginning. The evidence is what makes it useful.",
      ],
    },
  },
  {
    id: "feedshift",
    index: "06",
    title: "FeedShift",
    subtitle: "Personalized Feed Re-ranking",
    kind: "personal",
    cut: "CUT",
    logline:
      "Chronological order is an accident of time. This re-orders a feed around intent.",
    details: [
      {
        label: "THE PROBLEM",
        value:
          "A new article is not necessarily a relevant article. Chronological feeds can bury what a reader actually cares about beneath whatever arrived most recently.",
      },
      {
        label: "THE SYSTEM",
        value:
          "A hybrid recommendation pipeline combining TF-IDF content profiles, implicit-feedback ALS, behavioral features, and multi-signal re-ranking.",
      },
      {
        label: "THE GOAL",
        value:
          "Build a personalized top-K feed that balances relevance, freshness, diversity, and engagement.",
      },
    ],
    keywords: [
      "RECOMMENDER SYSTEMS",
      "COLLABORATIVE FILTERING",
      "CONTENT RANKING",
      "PERSONALIZATION",
    ],
    github: "https://github.com/amitjoshi9627/feedshift",
    accent: "#6B7F5E",
    note: {
      question: "Why rank the feed?",
      body: [
        "ENGINEERING RATIONALE",
        "Recency is useful, but it is only one signal. A reader may care more about a story that matches their interests, feels different from what they have already seen, or arrives at the right moment.",
        "FeedShift keeps those signals separate and combines them at ranking time instead of letting recency decide everything.",
        "The goal isn't to show more stories. It's to show the right ones sooner.",
      ],
    },
  },
];

export const PROFESSIONAL_PROJECTS = PROJECTS.filter(
  (p) => p.kind === "professional",
);
export const PERSONAL_PROJECTS = PROJECTS.filter((p) => p.kind === "personal");

/** SCENE 02 — the director's board. Drawn from the resume's technical areas. */
export const DIRECTORS_BOARD: { label: string; kind: "note" | "frame" | "strip" }[] = [
  { label: "Python", kind: "frame" },
  { label: "RAG", kind: "note" },
  { label: "Transformers", kind: "strip" },
  { label: "LLMs", kind: "note" },
  { label: "Regression", kind: "frame" },
  { label: "Classification", kind: "strip" },
  { label: "SEMANTIC SEARCH", kind: "note" },
  { label: "NLP", kind: "frame" },
  { label: "FASTAPI", kind: "note" },
  { label: "DOCKER", kind: "strip" },
  { label: "MLFLOW", kind: "frame" },
  { label: "LANGGRAPH", kind: "note" },
];

/** Full technical list, exactly as listed on the resume. */
export const TECHNICAL_AREAS = [
  "Python",
  "SQL",
  "LLMs",
  "RAG",
  "PEFT / LoRA",
  "Transformers",
  "PyTorch",
  "Vector Databases",
  "Time Series Forecasting",
  "Kalman Filters",
  "NLP",
  "Semantic Search",
  "FastAPI",
  "Docker",
  "CI/CD",
  "Git",
  "MLflow",
  "LangGraph",
  "Streamlit",
  "Supabase",
  "Snowflake",
  "Pandas",
  "NumPy",
];

/** SCENE 03 — the script. Amit's general engineering approach. */
export const SCRIPT_STAGES: { id: string; label: string; caption: string }[] = [
  { id: "question", label: "QUESTION", caption: "Start with the question, not the model." },
  { id: "frame", label: "FRAME THE PROBLEM", caption: "Define what matters, and what doesn't." },
  { id: "signal", label: "UNDERSTAND THE SIGNAL", caption: "Find what the data is really saying." },
  { id: "experiment", label: "EXPERIMENT", caption: "Cheap tests before expensive ones." },
  { id: "build", label: "BUILD", caption: "Make it real enough to break." },
  { id: "evaluate", label: "EVALUATE", caption: "Decide what working actually means." },
  { id: "deploy", label: "DEPLOY", caption: "It only exists once it runs." },
];

/** SCENE 06 — the system. Stage names + resume technologies attached to them. */
export const SYSTEM_STAGES: { label: string; tech: string[] }[] = [
  { label: "DATA", tech: ["Snowflake", "SQL", "Pandas"] },
  { label: "MODEL", tech: ["PyTorch", "Transformers", "PEFT / LoRA"] },
  { label: "API", tech: ["FastAPI", "LangGraph"] },
  { label: "SYSTEM", tech: ["Docker", "Supabase"] },
  { label: "EVALUATION", tech: ["MLflow"] },
  { label: "DEPLOYMENT", tech: ["CI/CD", "Git"] },
  { label: "PRODUCT", tech: ["Streamlit"] },
];

export const CAPABILITIES: { label: string; skills: string[] }[] = [
  { label: "MACHINE LEARNING", skills: ["Machine Learning", "Deep Learning", "Feature Engineering"] },
  { label: "NLP & LANGUAGE", skills: ["NLP", "Transformers", "Embeddings", "BERT"] },
  { label: "GENERATIVE AI", skills: ["LLMs", "RAG", "Agents", "LangGraph", "PEFT / LoRA"] },
  { label: "SEARCH & RETRIEVAL", skills: ["Vector Search", "Vector Databases", "Semantic Search", "Re-ranking"] },
  { label: "TIME SERIES & OPTIMIZATION", skills: ["Kalman Filters", "Market Mix Modeling", "OR", "Mathematical Optimization"] },
  { label: "MULTIMODAL AI", skills: ["Computer Vision", "CLIP", "Vision LMs", "Speech"] },
  { label: "RECOMMENDATION", skills: ["Collaborative Filtering", "ALS", "Content-based Ranking"] },
  { label: "PRODUCTION ML", skills: ["FastAPI", "Docker", "MLflow", "CI/CD", "Snowflake"] },
];

export interface Role {
  company: string;
  title: string;
  period: string;
  meta?: string;
}

export const ROLES: Role[] = [
  {
    company: "Tiger Analytics",
    title: "Senior AI/ML Engineer",
    period: "October 2021 — Present",
    meta: "Hyderabad (Remote)",
  },
  {
    company: "Carelon Global Solutions",
    title: "Associate AI Engineer",
    period: "September 2020 — October 2021",
  },
  {
    company: "Vassar Labs",
    title: "ML Engineer Intern",
    period: "January 2020 — August 2020",
  },
  {
    company: "Bungee Tech",
    title: "Data Science Intern",
    period: "November 2019 — December 2019",
  },
];

export const EDUCATION = {
  school: "Indian Institute of Information Technology, Ranchi",
  degree: "Bachelor of Technology, Computer Science & Engineering",
  date: "July 2020",
};

export const PROFILE = {
  name: "Amit Joshi",
  title: "Senior AI/ML Engineer",
  years: "6",
  company: "Tiger Analytics",
  location: "Hyderabad (Remote)",
  tagline: "Six years building things that had to actually work.",
};

/** Other work listed on the resume, shown as an index rather than as case studies. */
export const OTHER_WORK = [
  "Pratilipi",
  "Crop Classification",
  "E-commerce Catalog De duplication",
];

export interface SceneMeta {
  id: string;
  index: string;
  title: string;
  menuLabel?: string;
}

export const SCENES: SceneMeta[] = [
  { id: "opening", index: "01", title: "OPENING CREDITS", menuLabel: "THE FILM" },
  { id: "director", index: "02", title: "THE DIRECTOR", menuLabel: "THE DIRECTOR / RÉSUMÉ" },
  { id: "script", index: "03", title: "THE SCRIPT" },
  { id: "footage", index: "04", title: "RAW FOOTAGE" },
  { id: "edit", index: "05", title: "THE EDIT", menuLabel: "THE WORK" },
  { id: "system", index: "06", title: "THE SYSTEM", menuLabel: "SYSTEMS" },
  { id: "behind", index: "07", title: "BEHIND THE SCENES", menuLabel: "STUDIO DESK & CRAFT" },
  { id: "life", index: "08", title: "THE LIFE BETWEEN FRAMES", menuLabel: "BETWEEN FRAMES" },
  { id: "final", index: "09", title: "FINAL CUT", menuLabel: "CONTACT" },
];

/**
 * PLACEHOLDERS — replace with real destinations before publishing.
 */
export const LINKS = {
  github: "https://github.com/amitjoshi9627",
  linkedin: "https://www.linkedin.com/in/amitjoshi9627/",
  email: "mailto:amitjoshi9627@gmail.com",
  resume: resumePdf,
};

/**
 * SCENE 02 — Director statement.
 * Not a bio. A position.
 */
export const DIRECTOR_STATEMENT = [
  "Most people treat the model as the answer.",
  "I treat it as a character in a larger system.",
  "The difficult part is not teaching the model to speak.",
  "It is deciding what the system should see,",
  "what it should carry forward,",
  "and where it must be allowed to fail.",
];

/**
 * SCENE 07 — Behind the scenes personal note.
 */
export const BEHIND_STATEMENT = {
  headline: "The set, with the lights on.",
  body: [
    "I LIKE BUILDING THINGS THAT HAVE NO REASON TO EXIST YET.",
    "A question becomes a sketch.\nA sketch becomes a prototype.\nSometimes it becomes a system.",
    "That's usually enough reason to start.",
  ],
  annotation: "every frame was placed on purpose",
};

/**
 * SCENE 09 — Final cut sign-off lines.
 */
export const FINAL_LINES = {
  headline: "WHAT SHALL WE BUILD NEXT?",
  subline: "",
  cta: "LET'S TALK",
  manifesto: "",
};
