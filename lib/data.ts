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
  /** The live product, when there is one to visit — distinct from the repo. */
  liveHref?: string;
  span: "wide" | "narrow" | "full";
  /** What the media slot shows when there is no video yet.
   *  "building" — still being worked on
   *  "soon"     — finished, footage still to record
   *  "still"    — finished, nothing meaningful to film (a static panel is used) */
  preview?: "building" | "soon" | "still";
};

export const projects: Project[] = [
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
    id: "rate-limit-lab",
    preview: "still",
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
    liveHref: "https://kudikitchen.com",
    preview: "soon",
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
  },];

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

export type PostBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "code"; lang?: string; text: string }
  | { kind: "list"; items: string[] };

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  body: PostBlock[];
};

export const posts: Post[] = [
  {
    id: "forcing-structured-output",
    title: "Getting an LLM to return data, not prose",
    excerpt:
      "Resumi asks Claude to rewrite a resume against a job posting. The first version parsed free text and broke constantly. Forced tool-use fixed it properly.",
    date: "Aug 14, 2026",
    readTime: "6 min",
    body: [
      {
        kind: "p",
        text: "Resumi takes your resume and a job posting and rewrites the bullets to match. The interesting problem is not the rewriting — the model is good at that. It is getting the result back in a shape the rest of the application can rely on.",
      },
      { kind: "h2", text: "Parsing prose is a trap" },
      {
        kind: "p",
        text: "My first version asked for JSON in the prompt and parsed whatever came back. It worked most of the time, which is the worst possible outcome — it worked well enough that I built on top of it before I understood how it failed.",
      },
      {
        kind: "p",
        text: "The failures were never malformed JSON. They were well-formed JSON with invented fields, or the right fields with subtly wrong types — a string where I expected an array, a single object where I expected a list of one. Every one of those reached the UI as an empty section rather than an error, because a missing key and an empty result look identical once you are three layers deep in optional chaining.",
      },
      { kind: "h2", text: "Forced tool-use" },
      {
        kind: "p",
        text: "The fix was to stop asking and start constraining. Claude's API lets you define a tool with a JSON schema and require that the model responds by calling it. The response is validated against that schema before it reaches you. Off-schema output is not something you detect and handle — it is something that cannot be returned.",
      },
      {
        kind: "p",
        text: "Resumi has four call modes, each with its own schema and its own endpoint: extract pulls structure out of a job posting, extract_resume does the same for an uploaded resume, tailor rewrites bullets against a target, and instruct applies a specific user edit. Four narrow contracts instead of one prompt trying to be everything.",
      },
      { kind: "h2", text: "The prompt is a boundary, not a suggestion" },
      {
        kind: "p",
        text: "Schema constrains the shape. It says nothing about what the model is allowed to change. Nothing in a schema stops it inventing a job you never had, in perfectly valid JSON.",
      },
      {
        kind: "p",
        text: "So the system prompt is 44 lines and almost all of it is prohibitions: rewrite phrasing, never invent employers, never change dates, never add a skill that does not appear in the source. Explicit content boundaries, not style guidance. The schema enforces the container; the prompt enforces the contents.",
      },
      { kind: "h2", text: "Testing without paying for it" },
      {
        kind: "p",
        text: "Every end-to-end test hitting the real API costs money and takes seconds, which means you write fewer of them, which means you catch less. Resumi has a mock mode behind an environment variable:",
      },
      { kind: "code", lang: "bash", text: "RESUMI_MOCK=1 npm run dev" },
      {
        kind: "p",
        text: "Every call mode returns a fixed, schema-valid fixture. The whole application — upload, extract, tailor, render to LaTeX, download — runs end to end for free, in milliseconds. It catches the class of bug that actually bit me, which was never the model being wrong. It was my code mishandling a shape it did not expect.",
      },
      { kind: "h2", text: "What I would tell myself" },
      {
        kind: "p",
        text: "If the model's output feeds anything other than a screen a human immediately reads, do not parse it. Constrain it. The parsing version is faster to build and you will spend that time back, with interest, on failures that look like empty states instead of errors.",
      },
    ],
  },
  {
    id: "rate-limiter-timing-bug",
    title: "A rate limiter that was wrong for the first request only",
    excerpt:
      "I built three rate-limiting algorithms to learn Python properly. One had a bug that every obvious test passed straight over.",
    date: "Aug 2, 2026",
    readTime: "5 min",
    body: [
      {
        kind: "p",
        text: "Python kept appearing in job postings and I had nothing to show for it, so I built something small and real: Token Bucket, Leaky Bucket and Sliding Window, implemented as independent classes behind one interface, with a traffic simulator and a chart comparing how each behaves under load.",
      },
      { kind: "h2", text: "The bug" },
      {
        kind: "p",
        text: "Each algorithm tracks when it last refilled or leaked. I initialised that lazily, on the first call, which is a reasonable instinct — you do not know when traffic will start, so you start the clock when it does.",
      },
      {
        kind: "p",
        text: "Except I initialised it to the wall clock at that moment, not to the timestamp of the request being handled. Those are the same number when requests arrive live. They are different numbers when time is passed in, which is exactly what happens in a simulation and in a test.",
      },
      {
        kind: "code",
        lang: "python",
        text:
          "# wrong: the clock starts when the code runs\nif self._last is None:\n    self._last = time.monotonic()\n\n# right: the clock starts when the traffic starts\nif self._last is None:\n    self._last = now",
      },
      {
        kind: "p",
        text: "The window for the very first request was measured from the wrong origin. Every request after it was correct, because by then _last had been set from a real timestamp.",
      },
      { kind: "h2", text: "Why the obvious tests missed it" },
      {
        kind: "p",
        text: "A test that fires a burst and asserts the limit holds passes: request one is off by a fraction, requests two through forty are fine, the total is right. A test that checks refill timing passes, because refill only happens after the first request has already fixed the state.",
      },
      {
        kind: "p",
        text: "It only showed up in the simulator, where I control time explicitly and start at zero. The first request behaved as though the window had begun at whatever the machine's clock said, which was not zero, so its allowance came out wrong. One dot out of place on a chart.",
      },
      { kind: "h2", text: "What caught it" },
      {
        kind: "p",
        text: "Being able to inject time. Every algorithm takes now as a parameter rather than reading the clock itself. That was originally for testing, but it is what made the bug visible — with time as an input, first-request behaviour is something you can assert on, and the discrepancy between the injected timestamp and the internal state had somewhere to show up.",
      },
      {
        kind: "p",
        text: "The suite is 16 tests covering limit enforcement, refill and leak timing, and window-expiry edges, plus live verification with curl against a running FastAPI server to confirm real 200s and 429s. But the test that would have caught this on day one is the boring one: assert that the very first request, at a known timestamp, behaves exactly like the second.",
      },
      { kind: "h2", text: "The lesson" },
      {
        kind: "p",
        text: "Lazy initialisation quietly picks a value from context. When the context is a clock, it picks the wrong one the moment the caller has their own idea of what time it is. If your code takes time as a parameter, take it from the parameter — including the first time.",
      },
    ],
  },
  {
    id: "row-level-security",
    title: "Why row-level security beat my API guards",
    excerpt:
      "I had auth checks in every endpoint and kept reintroducing the same bug. Moving the rules into Postgres deleted the whole category.",
    date: "Jul 19, 2026",
    readTime: "6 min",
    body: [
      {
        kind: "p",
        text: "MealApp is offline-first, which means the client holds a copy of your data and syncs it back. That makes the isolation question sharper than usual: it is not just whether an endpoint checks who you are, it is whether anything reaching the database can be trusted to say who it is for.",
      },
      { kind: "h2", text: "The bug I kept writing" },
      {
        kind: "p",
        text: "The obvious approach is a check at the top of every handler: read the session, compare the user id, reject if it does not match. It works. It also has to be written correctly in every handler, forever, including the one you add at midnight because a screen needs one more field.",
      },
      {
        kind: "p",
        text: "I did not forget the check. What I did, more than once, was write a query that filtered by something adjacent — the meal plan id rather than the user id — on the assumption that owning the plan had already been established upstream. Sometimes it had. The bug was never a missing guard, it was a guard proving something slightly different from what the query then relied on.",
      },
      { kind: "h2", text: "Moving the rule into the database" },
      {
        kind: "p",
        text: "Row-level security puts the predicate on the table itself. A policy says which rows a role may see, and Postgres applies it to every query touching that table, regardless of which endpoint issued it or what the query looked like.",
      },
      {
        kind: "p",
        text: "The 17-table schema has policies on every user-scoped table. A query that forgets to filter by user does not leak — it returns nothing, because the rows were never visible. The failure mode changed from silently wrong to obviously empty, and obviously empty is something you notice in development.",
      },
      { kind: "h2", text: "Revoke first, then grant" },
      {
        kind: "p",
        text: "The related move, on Kudi Kitchen's review system, was revoking default grants entirely. Anonymous and authenticated roles have zero access to those tables; only the service role can touch them, through Edge Functions that do the checking. Nothing is reachable because nobody remembered to lock it — the default is closed and access is added deliberately.",
      },
      {
        kind: "p",
        text: "Other invariants went the same way. Freemium entitlements resolve through an atomic Postgres function rather than read-then-write in application code, so two concurrent purchase attempts cannot both see an unclaimed entitlement. Business rules that must not race live where the transaction is.",
      },
      { kind: "h2", text: "What this does not solve" },
      {
        kind: "p",
        text: "RLS is not a substitute for authentication — something still has to establish who the request is from, and if that is wrong the policies faithfully enforce the wrong thing. It also does not help with rules that are not expressible per-row.",
      },
      {
        kind: "p",
        text: "What it does is move a rule from somewhere it must be repeated to somewhere it is stated once. My endpoints still check things. The difference is that when one of them is wrong, it is now wrong in a way that shows up as no data rather than someone else's.",
      },
    ],
  },
];

export type Tool = { mark: string; slug: string; name: string; role: string };

export const tools: Tool[] = [
  { mark: "py", slug: "python", name: "Python", role: "apis + scripts" },
  { mark: "TS", slug: "typescript", name: "TypeScript", role: "typed ui" },
  { mark: "( )", slug: "react", name: "React", role: "interfaces" },
  { mark: "N", slug: "nextdotjs", name: "Next.js", role: "app framework" },
  { mark: "{ }", slug: "springboot", name: "Spring Boot", role: "backend" },
  { mark: "=>", slug: "fastapi", name: "FastAPI", role: "python apis" },
  { mark: "DB", slug: "postgresql", name: "PostgreSQL", role: "relational store" },
  { mark: "::", slug: "supabase", name: "Supabase", role: "auth + data" },
  { mark: "~", slug: "tailwindcss", name: "Tailwind", role: "styling" },
  { mark: "Y", slug: "git", name: "Git", role: "version control" },
  // Oracle had Java removed from Simple Icons over trademark; openjdk is the
  // same language and is the maintained entry.
  { mark: "J", slug: "openjdk", name: "Java", role: "services" },
];

export const toolsLoop = [...tools, ...tools];

export const currentlyLearning = ["Kubernetes", "Kafka", "Rust"];

export const nav = [
  { href: "#top", label: "Home", id: "top" },
  { href: "#projects", label: "Work", id: "projects" },
  { href: "#experience", label: "Experience", id: "experience" },
  { href: "#writing", label: "Blog", id: "writing" },
] as const;

export const email = "chukwudi.can@gmail.com";
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
