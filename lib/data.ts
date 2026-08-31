export type Project = {
  id: string;
  title: string;
  /** Short descriptor shown after the name, e.g. "AI Resume Tailoring". */
  subtitle: string;
  badge: string;
  description: string;
  bullets: string[];
  /** Optional: personal post-mortems. Left out rather than invented. */
  whatBroke?: string;
  whatIdDoDifferently?: string;
  tech: string[];
  tags: string[];
  href: string;
  span: "wide" | "narrow" | "full";
};

export const projects: Project[] = [
  {
    id: "resumi",
    title: "Resumi",
    subtitle: "AI Resume Tailoring",
    badge: "Next.js",
    description:
      "An AI resume-tailoring platform. Four Claude call modes run under forced tool-use, so the model returns schema-constrained JSON rather than free text that has to be parsed and hoped over.",
    bullets: [
      "Four REST endpoints backing four call modes — extract, extract_resume, tailor, instruct — each guaranteed to return valid typed data.",
      "A pure-function LaTeX engine decouples content from formatting; single-pass escaping means user content can never break out of the document structure.",
      "Server-side DOCX parsing written from scratch on JSZip and @xmldom/xmldom, with no third-party DOCX library.",
      "A mock mode (RESUMI_MOCK=1) exercises the whole app end to end without touching the Claude API or costing anything.",
    ],
    whatBroke:
      "React's asynchronous state updates let a user navigate away before a write to localStorage had actually landed, so work silently disappeared. Fixed by making persistence synchronous and ordering it ahead of the state update.",
    tech: ["TypeScript", "Next.js", "Node.js", "Claude API", "LaTeX"],
    tags: ["frontend", "ai", "backend"],
    href: "https://github.com/chukwudican-sudo",
    span: "wide",
  },
  {
    id: "mealapp",
    title: "MealApp",
    subtitle: "Offline-First Nutrition",
    badge: "Offline-first",
    description:
      "An offline-first nutrition app on a 17-table PostgreSQL schema, with Row-Level Security enforced at the database — so per-user isolation holds regardless of what the client sends.",
    bullets: [
      "A durable outbox queues writes locally with request coalescing, exponential backoff and dead-lettering, and dependency-aware ordering so a record never syncs before the one it depends on.",
      "Eight AI Edge Functions on Deno use schema-constrained output; meal recommendations separate hard rules — dietary restrictions, always enforced — from soft preferences.",
      "An ETL pipeline imported 8,187 USDA records across 41 paginated requests, then deduplicated and categorised them.",
      "Freemium entitlements resolve through an atomic Postgres RPC, so concurrent purchase attempts can't race.",
    ],
    whatBroke:
      "The retry scheduler had a timing flaw that made recovery from a failed sync take 30–45 seconds. Tracing the scheduling logic brought it down to 1–2.",
    tech: ["React Native", "Expo", "TypeScript", "Supabase", "Gemini API"],
    tags: ["frontend", "ai", "backend"],
    href: "https://github.com/chukwudican-sudo",
    span: "narrow",
  },
  {
    id: "fraudwatch",
    title: "FraudWatch",
    subtitle: "Fraud & Anomaly Detection",
    badge: "Java",
    description:
      "A live fraud and anomaly-detection dashboard, built as backend lead on a three-person team running a genuine two-week Agile sprint.",
    bullets: [
      "Three detection algorithms: unusual amount measured against an account's historical average, impossible travel between two geographically incompatible transactions, and a sliding-window frequency check.",
      "Owned the shared data contract between three independently built components — detection service, data simulator and dashboard.",
      "GitHub Actions CI running the full test suite on every push.",
    ],
    tech: ["Java", "REST API", "GitHub Actions"],
    tags: ["backend"],
    href: "https://github.com/chukwudican-sudo",
    span: "wide",
  },
  {
    id: "rate-limit-lab",
    title: "Rate Limit Lab",
    subtitle: "Backend Systems Study",
    badge: "FastAPI",
    description:
      "Token Bucket, Leaky Bucket and Sliding Window implemented as independent classes behind one interface, with a traffic simulator and a comparison chart.",
    bullets: [
      "Built deliberately to close a gap — Python kept appearing in job postings and I had nothing to show for it.",
      "A simulation engine models a quiet period, a 40-request burst, then recovery; matplotlib charts how each algorithm responds.",
      "16 pytest tests covering limit enforcement, refill and leak timing, and window-expiry edges — verified live against a running server with curl.",
    ],
    whatBroke:
      "Lazy initialisation defaulted an algorithm's internal state to wall-clock time instead of the first actually-observed request. Subtle, but a real correctness bug — diagnosed, fixed, and written up as a case study.",
    tech: ["Python", "FastAPI", "pytest", "matplotlib"],
    tags: ["backend"],
    href: "https://github.com/chukwudican-sudo/rate-limit-lab",
    span: "narrow",
  },
  {
    id: "kudi-kitchen",
    title: "Kudi Kitchen",
    subtitle: "E-Commerce & Security",
    badge: "No framework",
    description:
      "A hand-coded storefront with no framework and no build step, replacing an earlier Shopify build for full control over design and performance — plus a fully built review and moderation subsystem.",
    bullets: [
      "678 lines of HTML, 2,926 of CSS and 863 of JS, driven by a custom design-token system, with IntersectionObserver scroll reveals and full prefers-reduced-motion support.",
      "Stripe Apple and Google Pay via the Payment Request API, backed by a Cloudflare Worker that re-verifies status, amount and currency with Stripe before releasing the download — the server never trusts a client-reported success.",
      "A built-but-dormant review system: advisory-lock rate limiting, peppered SHA-256 fingerprinting rather than raw email or IP, fully revoked default grants, and magic-byte validation that checks file content instead of declared MIME type.",
      "11 architecture decision records documenting the reasoning behind every major call.",
    ],
    tech: ["HTML/CSS/JS", "Stripe", "Cloudflare Workers", "Supabase", "Deno"],
    tags: ["frontend", "backend", "security"],
    href: "https://github.com/chukwudican-sudo",
    span: "full",
  },
];

export const filters = [
  { id: "all", label: "All" },
  { id: "backend", label: "Backend" },
  { id: "frontend", label: "Frontend" },
  { id: "ai", label: "AI" },
  { id: "security", label: "Security" },
] as const;

export type ExperienceRole = {
  id: string;
  mark: string;
  title: string;
  company: string;
  description: string;
  date: string;
  chips: string[];
  location: string;
  locationHref?: string;
  bullets: string[];
  stats: { value: string; label: string }[];
};

export const experience: ExperienceRole[] = [
  {
    id: "kudi-kitchen",
    mark: "KK",
    title: "Founder & Digital Creator",
    company: "Kudi Kitchen",
    description:
      "Founded and independently run a direct-to-consumer digital product business — a cookbook e-commerce site.",
    date: "Mar 2025 — Present",
    chips: ["HTML/CSS/JS", "Stripe", "Cloudflare Workers", "Supabase", "Row-Level Security"],
    location: "Oshawa, ON",
    bullets: [
      "Rebuilt the storefront from Shopify to a fully hand-coded, framework-free HTML/CSS/JS site, for complete control over design and performance.",
      "Integrated Stripe payments, including a serverless Apple Pay and Google Pay flow via Cloudflare Workers that independently re-verifies payment status server-side before releasing the product.",
      "Used conversion tracking and checkout-flow analysis to raise checkout completion by 15–25%.",
      "Documented every architecture and design decision across 11 written ADRs.",
    ],
    stats: [
      { value: "11", label: "ADRs written" },
      { value: "15–25%", label: "checkout completion lift" },
    ],
  },
  {
    id: "droady",
    mark: "DR",
    title: "Software Engineer",
    company: "Droady",
    description:
      "Contributed to a production iOS and Android fitness app with AI features, a creator marketplace, and real-time social systems.",
    date: "Nov 2025 — May 2026",
    chips: ["React Native", "AI/LLM", "Stripe", "RevenueCat"],
    location: "San Francisco, CA",
    bullets: [
      "Contributed to Droady's AI physique-rating feature, integrating an LLM into a live, customer-facing product.",
      "Contributed to payment integration using Stripe and RevenueCat for subscription billing.",
      "Worked across mobile, backend and web alongside a small engineering team, from active development through App Store launch.",
    ],
    stats: [],
  },
  {
    id: "freelance",
    mark: "FL",
    title: "Freelance Web Developer & Consultant",
    company: "Self-employed",
    description: "Shipped sites and audits for community organizations and early-stage apps.",
    date: "Jul 2025 — Apr 2026",
    chips: ["Next.js", "UX audit", "Accessibility", "Client delivery"],
    location: "Oshawa, ON · Remote",
    bullets: [
      "Designed and launched African Family Connect's community site — event promotion, registration workflows, photo galleries, and ongoing maintenance.",
      "Ran an 84-page website and UX audit for Konnecting Wit Humanity, covering accessibility, mobile responsiveness, navigation, and information architecture.",
      "Translated client business requirements into concrete website and UX decisions.",
    ],
    stats: [
      { value: "3", label: "clients shipped" },
      { value: "84", label: "page audit delivered" },
    ],
  },
  {
    id: "aegon",
    mark: "AE",
    title: "Wealth Manager",
    company: "Aegon",
    description:
      "Managed client investment portfolios, led a 20-advisor team, and owned compliance reporting.",
    date: "May 2025 — Aug 2025",
    chips: ["Portfolio management", "Team leadership", "Compliance reporting", "Client advisory"],
    location: "Oshawa, ON",
    bullets: [
      "Managed client investment portfolios, achieving 12–18% average annual growth by aligning strategy with each client's risk profile.",
      "Led and coordinated a team of 20+ advisors, delivering training and strategic guidance at conventions and weekly strategy sessions.",
      "Maintained a 95% client retention rate through consistent communication and timely follow-up.",
      "Prepared structured financial reports while ensuring compliance with internal policy and regulatory standards.",
    ],
    stats: [
      { value: "12–18%", label: "avg. annual growth" },
      { value: "20+", label: "advisors led" },
      { value: "95%", label: "client retention" },
    ],
  },
  {
    id: "westernbell",
    mark: "WB",
    title: "Operations & Client Engagement",
    company: "WesternBell International",
    description:
      "Built and shipped the company site, then ran inventory and client delivery alongside it.",
    date: "Jun 2024 — Jan 2025",
    chips: ["HTML/CSS", "Live chat", "Microsoft Excel", "Business development"],
    location: "Port Harcourt, Nigeria",
    locationHref: "https://westernbell.com",
    bullets: [
      "Built and deployed the company website end to end and integrated a live chat system, cutting client response time by 50%.",
      "Maintained inventory and procurement documentation for 200+ industrial gas cylinders across enterprise partners.",
      "Contributed to a 30% increase in new business through client engagement, contract execution, and operational delivery.",
    ],
    stats: [
      { value: "50%", label: "faster response" },
      { value: "200+", label: "cylinders tracked" },
      { value: "30%", label: "new business" },
    ],
  },
  {
    id: "fitness-trainer",
    mark: "FT",
    title: "Fitness Trainer",
    company: "Self-employed",
    description:
      "Ran a one-on-one training practice end to end — coaching, scheduling, and client acquisition.",
    date: "Apr 2023 — Jan 2024",
    chips: ["Coaching", "Programming", "Client management"],
    location: "Oshawa, ON",
    bullets: [
      "Built personalized strength programs around each client's goals, experience level, and physical limits.",
      "Coached technique, session structure, and progressive overload one-on-one.",
      "Handled client acquisition, scheduling, and communication myself.",
    ],
    stats: [],
  },
];

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
};

export const posts: Post[] = [
  {
    id: "verifying-stripe-payments",
    title: "Verifying Stripe payments server-side",
    excerpt:
      "Trusting the client's word on a completed payment is how you ship free digital goods. What I check in the Worker before delivery.",
    date: "Jun 2026",
    readTime: "6 min",
  },
  {
    id: "row-level-security",
    title: "Why row-level security beat my API guards",
    excerpt:
      "I had auth checks in every endpoint. Moving the rules into Postgres deleted a whole class of bug I kept reintroducing.",
    date: "Apr 2026",
    readTime: "8 min",
  },
  {
    id: "eleven-adrs",
    title: "Eleven ADRs into a solo project",
    excerpt:
      "Writing decision records for a codebase only I touch felt like overhead. Then I came back after four months.",
    date: "Feb 2026",
    readTime: "5 min",
  },
];

export type Tool = { mark: string; name: string; role: string };

export const tools: Tool[] = [
  { mark: "py", name: "Python", role: "apis + scripts" },
  { mark: "TS", name: "TypeScript", role: "typed ui" },
  { mark: "( )", name: "React", role: "interfaces" },
  { mark: "N", name: "Next.js", role: "app framework" },
  { mark: "{ }", name: "Spring Boot", role: "backend" },
  { mark: "=>", name: "FastAPI", role: "python apis" },
  { mark: "DB", name: "PostgreSQL", role: "relational store" },
  { mark: "::", name: "Supabase", role: "auth + data" },
  { mark: "~", name: "Tailwind", role: "styling" },
  { mark: "Y", name: "Git", role: "version control" },
  { mark: "J", name: "Java", role: "services" },
];

export const toolsLoop = [...tools, ...tools];

export const currentlyLearning = ["Kubernetes", "Kafka", "Rust"];

export const nav = [
  { href: "#top", label: "Home", id: "top" },
  { href: "#projects", label: "Work", id: "projects" },
  { href: "#experience", label: "Experience", id: "experience" },
  { href: "#writing", label: "Blog", id: "writing" },
] as const;

export const email = "alex.ndubuisi@ontariotechu.net";
export const linkedin = "https://www.linkedin.com/in/chukwudi-ndubuisi/";
export const github = "https://github.com/chukwudican-sudo";
export const resumeHref = "/assets/Chukwudi_Alex_Software_Engineering_Resume.pdf";

/**
 * Deterministic pseudo-random GitHub-style contribution heatmap. 53 weeks x 7
 * days, with a term-time/summer seasonal curve and lighter weekends, matching
 * the design reference. Real data should come from the GitHub API or a
 * build-time snapshot (see README "State Management").
 */
export function buildHeatmap(density = 1) {
  const levels = [
    "rgba(242,237,228,0.07)",
    "rgba(194,96,58,0.30)",
    "rgba(194,96,58,0.55)",
    "rgba(194,96,58,0.80)",
    "#E08A5C",
  ];
  let seed = 20260826;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const cells: { title: string; level: number; color: string }[] = [];
  let total = 0;
  let streak = 0;
  let best = 0;

  for (let w = 0; w < 53; w++) {
    const season = 0.45 + 0.55 * Math.abs(Math.sin((w / 53) * Math.PI * 2.1));
    for (let d = 0; d < 7; d++) {
      const weekend = d === 0 || d === 6 ? 0.45 : 1;
      const r = rnd() * season * weekend * density;
      const lvl = r > 0.62 ? 4 : r > 0.46 ? 3 : r > 0.3 ? 2 : r > 0.14 ? 1 : 0;
      const count = lvl === 0 ? 0 : lvl * 2 + Math.floor(rnd() * 3);
      total += count;
      if (lvl > 0) {
        streak++;
        if (streak > best) best = streak;
      } else {
        streak = 0;
      }
      cells.push({
        title: count === 0 ? "No contributions" : `${count} contributions`,
        level: lvl,
        color: levels[lvl],
      });
    }
  }

  return { cells, total, longestStreak: best, weeksTracked: 53 };
}
