export type Project = {
  id: string;
  title: string;
  badge: string;
  description: string;
  bullets: string[];
  whatBroke: string;
  whatIdDoDifferently: string;
  tech: string[];
  tags: string[];
  href: string;
  span: "wide" | "narrow" | "full";
};

export const projects: Project[] = [
  {
    id: "fraudwatch",
    title: "FraudWatch",
    badge: "Spring Boot",
    description:
      "A rule-based fraud detection service that scores transactions against configurable rules and explains every decision it makes.",
    bullets: [
      "Every flag carries its triggering rule, so a reviewer never has to guess.",
      "Rule changes ship as config, not deploys, so tuning a threshold doesn't need a release.",
    ],
    whatBroke:
      "Rules evaluated first-match-wins, so a broad velocity rule kept swallowing flags a sharper rule should have owned — reviewers saw the wrong reason.",
    whatIdDoDifferently:
      "Sum weighted contributions instead of stopping at the first hit, and version rule sets so every change is reviewable after the fact.",
    tech: ["Java", "PostgreSQL", "Docker"],
    tags: ["backend", "security"],
    href: "https://github.com/chukwudican-sudo",
    span: "wide",
  },
  {
    id: "resumi",
    title: "Resumi",
    badge: "Next.js",
    description:
      "An AI resume tool that rewrites bullets against a job posting, with strictly-typed contracts between model output and UI.",
    bullets: [
      "Schema validation on every response — malformed output never reaches the page.",
      "10 active users, roughly 2,000 visitors since launch.",
    ],
    whatBroke:
      "The model returned well-formed JSON with invented fields, and the UI rendered empty bullets for a week before I rejected off-schema responses.",
    whatIdDoDifferently:
      "Cache rewrites per posting — most of the cost was re-running prompts that had already been answered.",
    tech: ["TypeScript", "FastAPI", "Supabase"],
    tags: ["frontend", "ai", "backend"],
    href: "https://github.com/chukwudican-sudo",
    span: "narrow",
  },
  {
    id: "mealapp",
    title: "MealApp",
    badge: "Offline-first",
    description:
      "A meal planning app for people with bad kitchen wifi. The screens were the easy part — the real problem was reconciling edits made while offline.",
    bullets: [
      "Last-write-wins per field rather than per record, so two devices rarely clobber each other.",
      "Queued mutations replay in order on reconnect, with conflicts surfaced instead of hidden.",
    ],
    whatBroke:
      "Per-record last-write-wins wiped a full day of edits the first time I tested on two devices.",
    whatIdDoDifferently:
      "Per-field timestamps from day one, plus a local change log I can replay when a sync goes wrong.",
    tech: ["React", "Python", "PostgreSQL"],
    tags: ["frontend", "backend"],
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
    title: "Founder & Full-Stack Developer",
    company: "Kudi Kitchen",
    description:
      "Own a custom e-commerce platform end to end — storefront, payments, and the backend that verifies them.",
    date: "Mar 2025 — Present",
    chips: ["JavaScript", "Stripe", "Cloudflare Workers", "Supabase", "Row-Level Security"],
    location: "Oshawa, ON · Remote",
    bullets: [
      "Replaced an earlier Shopify build with a hand-rolled storefront, for control over both the experience and the architecture.",
      "Stripe payments with Apple Pay and Google Pay — a Cloudflare Worker creates PaymentIntents server-side and re-verifies status, amount, and currency before any digital product is delivered.",
      "Supabase/PostgreSQL review and moderation backend: Row-Level Security, Deno Edge Functions, rate limiting, database constraints, privacy-preserving request fingerprinting, and file validation.",
      "Accessibility-conscious frontend — reduced-motion support and a reusable design-token system.",
      "11 Architecture Decision Records covering the calls that shaped it.",
    ],
    stats: [
      { value: "11", label: "ADRs written" },
      { value: "1,000+", label: "users served" },
      { value: "15–25%", label: "conversion lift, Shopify era" },
    ],
  },
  {
    id: "aegon",
    mark: "AE",
    title: "Wealth Manager",
    company: "Aegon",
    description: "Managed client portfolios, led a 20-advisor team, and owned compliance reporting.",
    date: "May 2025 — Aug 2026",
    chips: ["Portfolio management", "Team leadership", "Compliance reporting", "Client advisory"],
    location: "Oshawa, ON · Remote",
    bullets: [
      "Managed and monitored client investment portfolios, matching recommendations to each client's risk profile and goals.",
      "Led and trained a team of 20+ advisors through business conventions and weekly strategy sessions.",
      "Held a 95% client retention rate through consistent follow-up and plain-language communication.",
      "Prepared structured financial summaries against internal policy and regulatory standards — where I learned why auditable, reason-carrying systems matter.",
    ],
    stats: [
      { value: "20+", label: "advisors led" },
      { value: "95%", label: "client retention" },
      { value: "40+", label: "client portfolios" },
    ],
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
      "Built a Next.js landing page for Droady, a live fitness app on the App Store.",
      "Ran an 84-page website and UX audit for Konnecting Wit Humanity, covering accessibility, mobile responsiveness, navigation, and information architecture.",
      "Translated client business requirements into concrete website and UX decisions.",
    ],
    stats: [
      { value: "3", label: "clients shipped" },
      { value: "84", label: "page audit delivered" },
    ],
  },
  {
    id: "westernbell",
    mark: "WB",
    title: "Managerial Intern",
    company: "WesternBell International",
    description: "Built and shipped the company site, then ran inventory and client delivery alongside it.",
    date: "Jun 2024 — Jan 2025",
    chips: ["HTML/CSS", "Live chat", "Microsoft Excel", "Business development"],
    location: "Port Harcourt, Nigeria",
    locationHref: "https://westernbell.com",
    bullets: [
      "Built and deployed the company website and integrated live chat, cutting average client response time by 50%.",
      "Maintained Excel-based inventory and procurement tracking for 200+ industrial gas cylinders across enterprise partners.",
      "Supported client engagement, contract execution, and operational delivery — contributing to a 30% increase in new business.",
      "Took part in international partner outreach and business development.",
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
    description: "Ran a one-on-one training practice end to end — coaching, scheduling, and client acquisition.",
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
export const resumeHref = "/assets/Chukwudi_Ndubuisi_Resume.pdf";

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
