export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  slug: string;
  title: string;
  shortDesc: string;
  tagline: string;
  iconType: 'design' | 'development' | 'automation';
  summary: string;
  problem: string;
  approach: string;
  deliverables: string[];
  capabilities: { title: string; desc: string }[];
  processSteps: { step: string; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

export interface ProjectItem {
  slug: string;
  title: string;
  client: string;
  category: 'UI/UX Design' | 'Development' | 'AI Workflows' | 'Full Digital Build' | 'Web Platform Build' | 'UI/UX & Frontend Development' | 'AI Workflow Automation';
  tag: string;
  year: string;
  image: string;
  summary: string;
  challenge: string;
  challengeHeading?: string;
  approach: string;
  approachHeading?: string;
  designHighlights: string[];
  devHighlights: string[];
  automationHighlights: string[];
  outcome: string;
  technologies: string[];
  featured: boolean;
  isConceptual: boolean;
  projectType?: string;
}

export interface ProcessPhase {
  number: string;
  name: string;
  duration: string;
  headline: string;
  description: string;
  keyActivities: string[];
  outputs: string[];
}

export const siteConfig = {
  name: "NovaStack",
  legalName: "NovaStack Studio",
  tagline: "DESIGN. DEVELOP. AUTOMATE. SCALE.",
  shortDescription: "A boutique creative technology agency blending thoughtful UI/UX design, robust engineering, and intelligent AI automation workflows.",
  contactEmail: "agency.souvik@gmail.com",
  contactPhone: "+918101685159",
  location: "Kolkata, India",
  status: "Accepting Q3/Q4 Projects",
  navItems: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Process", href: "/process" },
  ] as NavItem[],
  socials: {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    x: "https://x.com",
    instagram: "https://instagram.com",
  },
  palette: {
    forest: "#1F3D3A",
    forestDeep: "#142B29",
    sage: "#A7B89E",
    sand: "#E7D9C3",
    terracotta: "#C07A5A",
    midnight: "#111827",
    ink: "#080A0B",
    cream: "#FCF9F4",
  },
};

export const servicesData: ServiceItem[] = [
  {
    id: "ui-ux-design",
    number: "01",
    slug: "ui-ux-design",
    title: "UI/UX Design",
    shortDesc: "Human-centered designs that create beautiful, intuitive and memorable experiences.",
    tagline: "Interfaces that make complexity feel simple.",
    iconType: "design",
    summary: "We design digital experiences rooted in deep user empathy, rigorous information architecture, and bespoke visual craft. From foundational design systems to micro-interactions, we turn convoluted domain complexity into frictionless interfaces.",
    problem: "Most software feels cluttered, overwhelming, and inconsistent across screen sizes. Users struggle to adopt complex tools when visual hierarchies fight for attention and mental models are poorly mapped.",
    approach: "We strip away decorative noise to focus on typographic clarity, spatial harmony, and tactile interaction models. Every button, panel, and state transition exists to guide user focus effortlessly.",
    deliverables: [
      "Product Strategy & User Research",
      "Information Architecture & Wireframes",
      "High-Fidelity UI & Responsive Design",
      "Custom Design Systems (Tokens, Figma)",
      "Interactive High-Fidelity Prototypes",
      "Micro-interaction & Motion Specifications",
      "Accessibility & Usability Audits (WCAG AA)",
      "Developer Hand-off Documentation"
    ],
    capabilities: [
      {
        title: "Design Systems & Token Architecture",
        desc: "Scalable component libraries built with mathematical consistency, strict spacing scales, and multi-theme tokens for seamless handoff."
      },
      {
        title: "Complex Web & Mobile Interfaces",
        desc: "High-density enterprise dashboards, consumer web applications, and responsive mobile interfaces designed for sustained focus."
      },
      {
        title: "Motion & Interaction Choreography",
        desc: "Tactile micro-feedback and contextual transitions that orient users without creating visual lag or distraction."
      },
      {
        title: "Prototyping & User Validation",
        desc: "Rapid testing of key functional hypotheses with interactive flows before writing a single line of production code."
      }
    ],
    processSteps: [
      { step: "01", title: "Empathy & Exploration", desc: "Unpack user workflows, pain points, competitive landscapes, and core jobs-to-be-done." },
      { step: "02", title: "Information Architecture", desc: "Map schemas, structural views, navigation hierarchies, and content frameworks." },
      { step: "03", title: "Visual & System Design", desc: "Establish palette, typography, component hierarchies, and interactive states." },
      { step: "04", title: "Validation & Refinement", desc: "Stress-test prototypes across extreme viewport sizes and diverse real-world edge cases." }
    ],
    faqs: [
      {
        question: "Do you provide Figma design system files?",
        answer: "Yes, all design engagements include fully structured Figma files utilizing auto-layout, variables, semantic tokens, and component variants matching the engineering implementation."
      },
      {
        question: "How do you handle developer handoff?",
        answer: "We pair closely with engineering teams, providing token dictionaries, layout formulas, interactive prototype states, and zero-ambiguity component documentation."
      },
      {
        question: "Can we hire NovaStack for design-only engagements?",
        answer: "Absolutely. While we love building end-to-end systems, we frequently partner with in-house engineering teams to elevate their product design."
      }
    ]
  },
  {
    id: "development",
    number: "02",
    slug: "development",
    title: "Development",
    shortDesc: "Robust, scalable and future-ready web & mobile solutions built with clean code.",
    tagline: "Engineered to perform. Built to evolve.",
    iconType: "development",
    summary: "Modern frontend and full-stack engineering prioritizing speed, accessibility, structural modularity, and maintainable type safety. We build resilient digital platforms ready for long-term scale.",
    problem: "Bloated codebases, brittle client-side architectures, slow page loads, and fragile dependencies create technical debt that paralyzes team momentum.",
    approach: "We engineer systems using server-first patterns, zero-compromise type safety, and mathematically derived layout algorithms. We write code designed to be read, tested, and expanded effortlessly.",
    deliverables: [
      "Modern Web Applications (Next.js, TypeScript)",
      "Server-Side Rendering & Static Generation",
      "Robust API Architecture & Backend Microservices",
      "Database Modeling & Cloud Infrastructure",
      "Performance & Core Web Vitals Optimization",
      "WCAG AA Accessibility Compliance",
      "Headless CMS & Content Pipelines",
      "Continuous Integration & Automated Testing"
    ],
    capabilities: [
      {
        title: "Next.js & App Router Architecture",
        desc: "Lightning-fast server components, optimized asset pipelines, streaming responses, and edge caching strategies."
      },
      {
        title: "Full-Stack TypeScript Systems",
        desc: "End-to-end type safety connecting database schemas, API contracts, validation layers, and UI components."
      },
      {
        title: "Performance & Web Vitals Precision",
        desc: "Sub-second initial loads, zero layout shifts (CLS), and streamlined bundle footprints optimized for all networks."
      },
      {
        title: "API Design & Cloud Integrations",
        desc: "Clean REST/GraphQL interfaces, secure authentication layers, and reliable webhooks orchestrated on modern cloud infrastructure."
      }
    ],
    processSteps: [
      { step: "01", title: "Architecture Blueprint", desc: "Select optimal tech stack, model domain entities, and plan server vs. client boundaries." },
      { step: "02", title: "Core Engine & Data Layer", desc: "Establish database models, API routes, authentication, and state management foundations." },
      { step: "03", title: "UI Integration & Motion", desc: "Translate design tokens into pixel-precise, accessible, and responsive client interfaces." },
      { step: "04", title: "Optimization & Hardening", desc: "Execute load testing, Core Web Vitals audits, security reviews, and deployment pipelines." }
    ],
    faqs: [
      {
        question: "What is your primary technology stack?",
        answer: "We specialize in TypeScript, Next.js (App Router), React, Tailwind CSS, Node.js, and modern cloud databases (PostgreSQL, Firestore, Redis). We select technologies based on longevity, performance, and maintainability."
      },
      {
        question: "How do you guarantee high performance and SEO?",
        answer: "By utilizing server components, optimized asset compression, proper semantic markup, dynamic Open Graph generation, and strict adherence to Core Web Vitals."
      },
      {
        question: "Do you write automated tests and documentation?",
        answer: "Yes. Every production codebase includes automated test suites, type definitions, and thorough developer README documentation."
      }
    ]
  },
  {
    id: "ai-workflows",
    number: "03",
    slug: "ai-workflows",
    title: "AI Workflows",
    shortDesc: "Intelligent automation systems that streamline operations and drive exponential growth.",
    tagline: "Automate the work that should never have been manual.",
    iconType: "automation",
    summary: "We design and deploy practical AI automation pipelines that eliminate repetitive operational bottlenecks, connect fragmented software tools, and unlock massive leverage for high-growth teams.",
    problem: "Knowledge workers waste dozens of hours every week copying data across tools, summarizing customer inputs manually, and resolving predictable operational hurdles by hand.",
    approach: "We construct reliable orchestration pipelines using state-of-the-art LLM architectures, structured schema extraction, event triggers, and self-healing error guards.",
    deliverables: [
      "Operational Workflow Audits & Mapping",
      "Custom LLM & Agentic Integration",
      "Automated Document & Lead Processing",
      "Multi-System Data Synchronization",
      "Internal AI Knowledge Assistants",
      "Automated Notification & Dispatch Loops",
      "Fallback & Human-in-the-Loop Guards",
      "API Webhook & Event Bus Infrastructure"
    ],
    capabilities: [
      {
        title: "Intelligent Document & Data Extraction",
        desc: "Convert unstructured PDFs, emails, and customer communications into validated JSON schemas with zero manual entry."
      },
      {
        title: "Cross-Platform Workflow Orchestration",
        desc: "Seamlessly bind CRM, payment providers, messaging channels, and operational databases into cohesive event loops."
      },
      {
        title: "Domain-Grounded AI Assistants",
        desc: "Context-aware conversational engines indexed over private studio knowledge bases for fast internal decision support."
      },
      {
        title: "Fault-Tolerant Automation Architecture",
        desc: "Idempotent event handling, automated retry queues, and human-in-the-loop escalation gates for mission-critical reliability."
      }
    ],
    processSteps: [
      { step: "01", title: "Workflow Decomposition", desc: "Audit manual tasks, quantify time sinks, and identify high-leverage automation candidates." },
      { step: "02", title: "Pipeline & Schema Design", desc: "Formulate input/output schemas, prompt topologies, fallback triggers, and security boundaries." },
      { step: "03", title: "Integration & Sandbox Testing", desc: "Connect external APIs, execute thousands of simulated edge cases, and tune prompt accuracy." },
      { step: "04", title: "Deployment & Monitoring", desc: "Deploy with live telemetry, error alerting, latency tracking, and operational dashboards." }
    ],
    faqs: [
      {
        question: "Is our proprietary data secure with AI workflows?",
        answer: "Yes. We configure private, zero-data-retention enterprise API endpoints, ensuring your operational data is never used to train external public models."
      },
      {
        question: "What happens if an AI model hallucinates or fails?",
        answer: "We build strict JSON schema validators, deterministic checks, and human-in-the-loop review queues so edge cases never silently corrupt downstream data."
      },
      {
        question: "Can automation connect with our legacy software?",
        answer: "Yes, we integrate via webhooks, custom REST endpoints, database triggers, or middleware adaptors tailored to your exact tech stack."
      }
    ]
  }
];

export const projectsData: ProjectItem[] = [
  {
    slug: "erlina",
    title: "ERLINA",
    client: "Erlina Studios",
    category: "Full Digital Build",
    tag: "The Space Theory",
    year: "2026",
    image: "/images/erlina.png",
    summary: "We create modern interiors that blend comfort, functionality, and timeless aesthetics for everyday living.",
    challenge: "The brand needed a digital presence that mirrored the physical beauty, spatial theory, and timeless aesthetics of their modern interior spaces without overwhelming the user with cluttered layouts.",
    challengeHeading: "Translating physical aesthetics into a digital experience.",
    approach: "Implemented a highly visual, spacious layout with typography-driven design, utilizing a clean interface to let the architectural projects (like Casa Noir, Maison Elara, and The Serene Villa) take center stage.",
    approachHeading: "Minimalist architectural intervention.",
    designHighlights: [
      "Minimalist editorial interface inspired by modern interior design principles. High focus on whitespace, clean lines, and premium typography."
    ],
    devHighlights: [
      "Built with Next.js App Router. Implemented smooth, fluid page transitions to mimic the feeling of walking through a physical space."
    ],
    automationHighlights: [
      "Optimized high-resolution image delivery for heavy visual assets (3D renders and interior photography) while maintaining sub-100ms render latency."
    ],
    outcome: "A seamless digital space that feels as meticulously crafted, functional, and beautiful as the physical spaces Erlina designs.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    featured: true,
    isConceptual: true,
    projectType: "Architecture & Interior"
  },
  {
    slug: "haven",
    title: "Haven",
    client: "Haven Real Estate",
    category: "Web Platform Build",
    tag: "Where Life Belongs",
    year: "2026",
    image: "/images/lumora.png",
    summary: "Explore premium residences crafted for effortless living and lasting value.",
    challenge: "The client needed an expansive property portal that could balance a vast database of over 250+ properties while maintaining an effortless, high-end user experience for potential buyers.",
    challengeHeading: "Scaling discovery without losing the premium feel.",
    approach: "Created a bright, immersive visual direction that highlights wide architectural photography. We paired this with frosted glass (glassmorphism) UI elements for key metrics (like '15+ Years Experience') to keep the user's focus on the homes.",
    approachHeading: "Airy aesthetics and glassmorphic UI.",
    designHighlights: [
      "Utilized bold, airy typography and overlapping glass panels to evoke a sense of space, freedom, and modern luxury."
    ],
    devHighlights: [
      "Optimized dynamic routing and static generation for hundreds of individual property pages to ensure instant load times."
    ],
    automationHighlights: [
      "Integrated a seamless headless CMS pipeline to handle real-time updates for properties and tour bookings."
    ],
    outcome: "A digital storefront that reflects 15+ years of real estate excellence, converting visitors into homeowners through effortless discovery.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    featured: true,
    isConceptual: false,
    projectType: "Property Tech"
  },
  {
    slug: "lumora",
    title: "LUMORA",
    client: "Lumora Properties",
    category: "Full Digital Build",
    tag: "Homes Made For Today",
    year: "2026",
    image: "/images/haven.png",
    summary: "Modern living spaces designed with light, openness, and comfort in mind. A premium platform for modern property discovery.",
    challenge: "High-end real estate buyers often face cluttered, outdated property listing platforms that fail to convey the true feeling of modern, open-concept homes.",
    challengeHeading: "Friction in modern property discovery.",
    approach: "Designed a dark-themed, immersive property gallery. We modularized property cards (featuring properties like Skyline Villa) with focused call-to-actions, transparent pricing, and instant visual feedback.",
    approachHeading: "Immersive, high-contrast exploration.",
    designHighlights: [
      "Dark mode specialized UI to make property imagery pop. Integrated quick-glance data points like pricing ($85.00.00) and 5-star ratings directly into the visual cards."
    ],
    devHighlights: [
      "Dynamic routing for individual property listings, utilizing React state for instant filtering and horizontal gallery navigation."
    ],
    automationHighlights: [
      "Built a scalable property rendering system capable of showcasing homes for over 100k+ happy clients with zero lag."
    ],
    outcome: "Redefining property discovery through an intuitive, modern, and visually striking digital experience that connects buyers with their future homes effortlessly.",
    technologies: ["Next.js", "React", "Tailwind CSS", "Node.js"],
    featured: true,
    isConceptual: false,
    projectType: "Real Estate Platform"
  },
  {
    slug: "aurelia",
    title: "Aurelia",
    client: "Aurelia Interior Design",
    category: "UI/UX & Frontend Development",
    tag: "Spaces that feel timeless",
    year: "2026",
    image: "/images/aurelia.jpg",
    summary: "We create calm, functional, and emotionally engaging interiors tailored for modern lifestyles.",
    challenge: "Designing a portfolio interface that feels as calm, bespoke, and emotionally engaging as the physical interiors the studio creates, moving away from standard, blocky layouts.",
    challengeHeading: "Breaking the traditional rigid grid.",
    approach: "Implemented a soft, rounded bento-box style layout. This allowed for distinct visual categorization (Commercial, Residential, Renovation) while maintaining a cohesive, flowing narrative.",
    approachHeading: "Fluid bento-box architecture.",
    designHighlights: [
      "Stark monochromatic contrast paired with soft rounded corners and circular navigational elements to soften the digital experience."
    ],
    devHighlights: [
      "Crafted custom CSS grid layouts with fluid responsiveness to ensure the intricate bento-box design scales perfectly across all devices."
    ],
    automationHighlights: [
      "Engineered subtle hover states and micro-interactions to make project discovery feel tactile and premium."
    ],
    outcome: "A digital environment that breathes. The website itself acts as the first interior space the client experiences, setting a tone of calm sophistication.",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS"],
    featured: false,
    isConceptual: false,
    projectType: "Creative Portfolio"
  },
  {
    slug: "leadflow-ai",
    title: "LeadFlow AI",
    client: "Internal System / Agency",
    category: "AI Workflow Automation",
    tag: "AI Response & Qualification",
    year: "2026",
    image: "/images/leadflow-ai.png",
    summary: "An automated pipeline that instantly responds to, qualifies, and routes incoming real estate leads.",
    challenge: "Real-estate businesses lose high-intent prospects due to delayed manual responses to leads originating from social media, websites, and WhatsApp. Interested prospects often go cold before the sales team can reach them.",
    challengeHeading: "Eliminating the manual response delay.",
    approach: "Architected an AI-powered lead management system that instantly engages incoming leads. It collects essential data—property requirements, budget, preferred location, and timeline—and calculates purchasing intent on the fly.",
    approachHeading: "Zero-touch automated qualification.",
    designHighlights: [
      "Built orchestration workflows using n8n to connect incoming lead sources directly to LLMs for natural language processing."
    ],
    devHighlights: [
      "Seamlessly integrated WhatsApp APIs, Google Sheets, and CRM webhooks to update lead statuses instantly without human intervention."
    ],
    automationHighlights: [
      "Engineered a categorization system that tags leads as Hot, Warm, or Cold, sending instant notifications to the right salesperson for high-priority prospects."
    ],
    outcome: "Slashed response times to zero and eliminated manual data entry, empowering the sales team to focus exclusively on closing high-intent buyers.",
    technologies: ["n8n", "AI Models", "WhatsApp API", "Webhooks"],
    featured: false,
    isConceptual: false,
    projectType: "Automated Pipeline"
  },
  {
    slug: "resolve-ai",
    title: "Resolve AI",
    client: "Internal System / Agency",
    category: "AI Workflow Automation",
    tag: "Intelligent Support Automation",
    year: "2026",
    image: "/images/resolve-ai.png",
    summary: "An autonomous support agent that resolves repetitive queries and intelligently escalates complex issues.",
    challenge: "Customer support teams in E-commerce and SaaS are frequently overwhelmed by repetitive questions like order tracking or refund policies, which delays human intervention for complex, sensitive issues.",
    challengeHeading: "Support bottleneck on repetitive queries.",
    approach: "Deployed an autonomous support automation workflow. The AI analyzes incoming customer messages for intent, retrieves verified answers from the internal knowledge base, and resolves simple tickets instantly.",
    approachHeading: "Intelligent triage and seamless handoff.",
    designHighlights: [
      "Utilized advanced LLMs to accurately classify query types (e.g., Order tracking, Return/refund, Account issue) from natural language inputs."
    ],
    devHighlights: [
      "Built an n8n pipeline that triggers specific actions—like fetching database statuses—and generates contextual, helpful responses to resolve the ticket autonomously."
    ],
    automationHighlights: [
      "Engineered a flawless fallback mechanism. Complex issues are automatically routed to a human agent's queue with the full conversation context pre-attached, preventing redundant back-and-forth."
    ],
    outcome: "Drastically reduced repetitive support workload and accelerated first-response times, creating a perfectly structured, friction-free handoff between AI and human agents.",
    technologies: ["n8n", "Knowledge Base", "Helpdesk API", "LLMs"],
    featured: false,
    isConceptual: false,
    projectType: "Customer Support AI"
  }
];

export const processPhases: ProcessPhase[] = [
  {
    number: "01",
    name: "Discover",
    duration: "Week 1–2",
    headline: "Unpacking the business, user workflows, and structural constraints.",
    description: "We begin by diagnosing the core problem rather than jumping straight into pixels or code. We interview stakeholders, map existing friction points, audit technical architecture, and define clear measurable benchmarks.",
    keyActivities: [
      "Stakeholder alignment & strategic goal mapping",
      "User workflow & friction point analysis",
      "Technical infrastructure & data schema audit",
      "Competitive positioning & landscape review"
    ],
    outputs: [
      "Strategic Project Brief & Requirements Matrix",
      "Core User Personas & Job-To-Be-Done Maps",
      "Architecture Evaluation Report"
    ]
  },
  {
    number: "02",
    name: "Define",
    duration: "Week 2–3",
    headline: "Shaping priorities, information architecture, scope, and technical roadmap.",
    description: "We translate strategic discoveries into concrete structural blueprints. We define the information hierarchy, map state diagrams, establish API boundaries, and align on project milestones.",
    keyActivities: [
      "Information architecture & content modeling",
      "User journey & state transition diagrams",
      "Technical architecture specification",
      "Milestone roadmap & risk mitigation plan"
    ],
    outputs: [
      "Interactive Wireframe Architecture",
      "API & Schema Specification Document",
      "Sprint Milestones & Scope Agreement"
    ]
  },
  {
    number: "03",
    name: "Design",
    duration: "Week 3–5",
    headline: "Crafting a bespoke visual identity, component system, and tactile UI.",
    description: "We create a distinctive visual system built around mathematical typography scales, deliberate color contrast, and architectural geometry. We build comprehensive Figma design systems with interactive prototypes.",
    keyActivities: [
      "Art direction & mood exploration",
      "High-fidelity UI design for all viewports",
      "Design token architecture & component libraries",
      "Micro-interaction & motion choreography"
    ],
    outputs: [
      "Complete Figma Design System & Prototype",
      "Multi-viewport Responsive Screen Layouts",
      "Motion & Interaction Token Specs"
    ]
  },
  {
    number: "04",
    name: "Build",
    duration: "Week 5–8",
    headline: "Engineering clean, accessible, and high-performance production code.",
    description: "We construct the application using modern Next.js, full-stack TypeScript, and Tailwind CSS. We emphasize sub-second render speeds, strict type safety, accessibility standards, and clean maintainable patterns.",
    keyActivities: [
      "Server and client component architecture",
      "API route, database, and auth implementation",
      "Responsive UI & micro-interaction integration",
      "Automated testing & performance profiling"
    ],
    outputs: [
      "Production-ready Next.js / TypeScript Repository",
      "Automated Test Suites & Lint Configurations",
      "Lighthouse 95+ Core Web Vitals Report"
    ]
  },
  {
    number: "05",
    name: "Automate",
    duration: "Week 8–9",
    headline: "Connecting intelligent workflows, external APIs, and event pipelines.",
    description: "We connect the digital product to your broader operational ecosystem. We design event triggers, AI-powered extraction pipelines, CRM synchronizations, and self-healing error escalation channels.",
    keyActivities: [
      "Webhook & API orchestration",
      "LLM prompt tuning & JSON schema validation",
      "CRM & third-party service synchronization",
      "Error recovery & fallback guardrails"
    ],
    outputs: [
      "Automated Workflow Pipelines & Event Triggers",
      "Telemetry, Logging & Alerting Setup",
      "Operational Playbook & Fallback Matrix"
    ]
  },
  {
    number: "06",
    name: "Evolve",
    duration: "Ongoing",
    headline: "Iterating based on real telemetry, user feedback, and business growth.",
    description: "Software is an evolving asset. After deployment, we monitor performance, analyze real usage patterns, and collaborate with your team on tactical iterations and future feature expansions.",
    keyActivities: [
      "Live telemetry & error rate monitoring",
      "User behavior & drop-off analytics",
      "Iterative performance & SEO tuning",
      "Quarterly architecture & feature reviews"
    ],
    outputs: [
      "Quarterly Growth & Telemetry Reports",
      "Continuous Deployment Updates",
      "Future Feature Roadmaps"
    ]
  }
];

export const studioPrinciples = [
  {
    number: "01",
    title: "Craft over noise",
    desc: "We reject generic templates, hyperactive animations, and superficial trends. Real craftsmanship comes from typography, balanced spacing, and architectural restraint."
  },
  {
    number: "02",
    title: "Systems over shortcuts",
    desc: "We don't build one-off visual illusions. Every component, token, and API endpoint is built into a cohesive system designed to scale effortlessly over years."
  },
  {
    number: "03",
    title: "Clarity over complexity",
    desc: "The hallmark of great software is making intricate domain operations feel intuitive, calm, and predictable for the people who rely on them daily."
  },
  {
    number: "04",
    title: "Automation with purpose",
    desc: "We automate repetitive tasks that drain human energy, leaving your team free to focus on strategic creativity, relationships, and vision."
  },
  {
    number: "05",
    title: "Design that earns trust",
    desc: "High-trust digital experiences are built on fast response times, accessible interactions, clear visual hierarchies, and total honesty."
  }
];

export const philosophyFourPillars = [
  {
    id: "future-ready",
    title: "Future-Ready Solutions",
    desc: "Modular digital architecture engineered to adapt seamlessly as technology and user expectations evolve."
  },
  {
    id: "scalable-architecture",
    title: "Scalable Architecture",
    desc: "Clean, maintainable codebases with zero bloat, ensuring effortless team expansion and high operational uptime."
  },
  {
    id: "ai-automation",
    title: "AI-Powered Automation",
    desc: "Smart orchestration pipelines that eliminate operational friction and unlock compound productivity."
  },
  {
    id: "results-growth",
    title: "Results-Driven Growth",
    desc: "Direct alignment between digital craftsmanship and real business leverage, speed, and market differentiation."
  }
];
