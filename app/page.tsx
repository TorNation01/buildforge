"use client";

import { useState, useEffect, useRef } from "react";

const AGENT_PROMPT = `SYSTEM IDENTITY: BUILD GOVERNANCE AGENT
Powered by BuildForge · buildforge.anakatechllc.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are a disciplined build governance agent. Your job is to conduct a structured interview, generate 4 governance files, confirm them, then execute the build step by step. One question at a time. One step at a time. No skipping.

PHASE 0 — OPEN
Say: "⬡ BUILD GOVERNANCE AGENT — READY. I'll guide you through 4 governance files before we write a single line of code. Answer each question as specifically as you can. Let's start with the PRD."

PHASE 1 — PRD (ask one at a time, wait for full answer)
Q1: Project name? Q2: One sentence — what does it do and who is it for? Q3: Who is the primary user specifically? Q4: The single core problem it solves? Q5: MVP features — everything it must do at launch? Q6: What will it NOT do? At least 3 things. Q7: What does success look like at launch? Q8: Constraints — tech stack, timeline, budget, existing services?

After Q8: "✓ PRD captured. Moving to Architecture."

PHASE 2 — ARCHITECTURE (one at a time)
Q9: Frontend? Q10: Backend? Q11: Database? Q12: Deployment target? Q13: Authentication? Q14: Key data entities and their fields? Q15: Environment variable names needed? Q16: External APIs or services? Q17: Any non-obvious architecture decisions?

After Q17: "✓ Architecture locked. Moving to AI Rules."

PHASE 3 — AI RULES (one at a time)
Q18: What must I NEVER do? Q19: What must I ALWAYS do? Q20: Code style rules? Q21: Define done — what must be true before any step is marked complete? Q22: Security rules for this project?

After Q22: "✓ Rules set. Final section — Build Plan."

PHASE 4 — PLAN (one at a time)
Q23: How many phases, named with purpose? Q24: Phase 1 Foundation steps? Q25: Phase 2 Core steps mapped to PRD features? Q26: Phase 3 Polish and Deploy steps? Q27: Launch checklist — what must be 100% true?

After Q27: "✓ Generating all 4 governance files now..."

PHASE 5 — GENERATE
Output all 4 files in professional markdown: PRD.md · ARCHITECTURE.md · AI_RULES.md · PLAN.md
Then: "4 governance files generated. Review above. Any changes? Reply CONFIRMED to begin the build."

PHASE 6 — BUILD EXECUTION
On CONFIRMED: "BUILD STARTED — [Project] · Phase 1 · Step 1 · Governance: PRD ✓ Architecture ✓ Rules ✓ Plan ✓"
Execute one step at a time. After each: state what was built, confirm done criteria met, state next step, ask "Proceed to Step X.X?" — unless user said "continuous".

PERMANENT RULES: Never build outside PRD scope. Never deviate from Architecture without approval. Never violate AI Rules. Never skip a Plan step. Never assume dependencies. Never mark done without meeting criteria. When blocked: stop, state blocker, list what's needed, wait.

Compatible with Claude · ChatGPT · Cursor · Gemini · Any capable LLM
BuildForge · buildforge.anakatechllc.com`;

const TEMPLATES = [
  {
    id: "saas", name: "SaaS Web App", tag: "Web App", color: "#ff6b35", icon: "◈",
    description: "Multi-tenant subscription app with auth, billing, and dashboard.",
    stack: "Next.js · Supabase · Stripe · Vercel",
    prd: `# PRD — SaaS Web App\n\n## What It IS\nMulti-tenant SaaS with subscription billing and user dashboard.\n\n**Primary User:** [Your specific user — e.g. small business owners, freelancers]\n\n**Core Problem:** [The single problem this solves]\n\n### MVP Features\n1. User auth — signup, login, password reset\n2. Stripe billing — Free, Pro, Premium tiers\n3. Dashboard with data overview\n4. CRUD on primary entity\n5. Account + billing management page\n\n### Post-MVP (V2)\n- Team workspaces\n- CSV import/export\n- Email notifications\n\n## What It Is NOT\n- Not a CRM\n- Not an analytics platform\n- Not a mobile app at launch`,
    arch: `# ARCHITECTURE — SaaS Web App\n\n## Stack\n- Frontend: Next.js 14 (App Router)\n- Backend: Server Actions + API Routes\n- Database: Supabase (PostgreSQL + Auth)\n- Payments: Stripe (Subscriptions + Webhooks)\n- Deploy: Vercel\n- Package manager: pnpm\n\n## Folder Structure\n\`\`\`\n/project\n  /app\n    /(marketing)   ← public pages\n    /(app)\n      /dashboard\n      /settings\n    /auth\n    /api/webhooks/stripe\n  /components\n    /ui\n    /dashboard\n  /lib\n    /supabase\n    /stripe\n  /types\n  middleware.ts\n\`\`\`\n\n## Data Models\n\`\`\`\nUser         { id, email, name, plan, stripeCustomerId }\nSubscription { id, userId, stripeSubId, status, planId }\nEntity       { id, userId, name, data, status, createdAt }\n\`\`\`\n\n## Env Vars\n\`\`\`\nNEXT_PUBLIC_SUPABASE_URL\nNEXT_PUBLIC_SUPABASE_ANON_KEY\nSUPABASE_SERVICE_ROLE_KEY\nSTRIPE_SECRET_KEY\nSTRIPE_WEBHOOK_SECRET\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY\n\`\`\``,
    rules: `# AI RULES — SaaS Web App\n\n## NEVER\n- Never use TypeScript \`any\` type\n- Never hardcode secrets or API keys\n- Never skip error handling on async ops\n- Never expose service role keys to client\n- Never skip loading and error UI states\n\n## ALWAYS\n- Always validate input server-side\n- Always type all function params and returns\n- Always use env vars for all config\n- Always add Supabase RLS policies\n- Always check auth before any data operation\n\n## Style\n- ESLint + Prettier · 2-space indent · single quotes · no semicolons\n- Arrow functions · JSDoc on exported functions\n\n## Done Criteria\n✓ Happy path works · Error case handled · Zero TS errors · Zero console errors · Matches architecture`,
    plan: `# PLAN — SaaS Web App\n\n## Phases\nPhase 1: Foundation — setup, auth, DB\nPhase 2: Core — billing, dashboard, CRUD\nPhase 3: Polish & Deploy\n\n## Phase 1 — Foundation\n- [ ] 1.1 Init Next.js 14 with pnpm\n- [ ] 1.2 Folder structure per Architecture doc\n- [ ] 1.3 .env.local + .env.example\n- [ ] 1.4 ESLint, Prettier, TypeScript strict\n- [ ] 1.5 Supabase connect + schema + RLS\n- [ ] 1.6 Auth — signup, login, reset\n- [ ] 1.7 Auth middleware for protected routes\n- [ ] CHECKPOINT: Auth works end-to-end. DB connected.\n\n## Phase 2 — Core\n- [ ] 2.1 Stripe products, prices, customer creation\n- [ ] 2.2 Checkout session + success flow\n- [ ] 2.3 Stripe webhook — sync subscription to DB\n- [ ] 2.4 Dashboard shell + navigation\n- [ ] 2.5 Data overview widgets\n- [ ] 2.6 CRUD for primary entity\n- [ ] 2.7 Settings + billing pages\n- [ ] CHECKPOINT: All MVP features working.\n\n## Phase 3 — Deploy\n- [ ] 3.1 Error boundaries + loading skeletons\n- [ ] 3.2 Mobile responsiveness\n- [ ] 3.3 Deploy to Vercel + production env vars\n- [ ] 3.4 Smoke test production\n- [ ] LAUNCH: Live URL · billing live · no errors`
  },
  {
    id: "api", name: "REST API", tag: "Backend", color: "#00d4ff", icon: "⬡",
    description: "Edge API with key auth, rate limiting, versioned endpoints.",
    stack: "Hono · Cloudflare Workers · D1 · Drizzle",
    prd: `# PRD — REST API Service\n\n## What It IS\nProduction REST API with key auth and rate limiting.\n\n**Primary User:** Developers consuming via API key.\n\n**Core Problem:** Apps need a reliable, fast, versioned data API without complex infrastructure.\n\n### MVP Features\n1. API key auth — generate, revoke, rotate\n2. CRUD endpoints for primary resource\n3. Rate limiting per key tier\n4. Structured error responses + request IDs\n5. /v1/health status endpoint\n6. All routes versioned under /v1/\n\n## What It Is NOT\n- Not a frontend\n- Not a real-time/WebSocket service\n- Not public — key-gated only`,
    arch: `# ARCHITECTURE — REST API\n\n## Stack\n- Runtime: Cloudflare Workers\n- Framework: Hono\n- Database: Cloudflare D1 (SQLite at edge)\n- ORM: Drizzle\n- Validation: Zod\n- Deploy: Wrangler CLI\n\n## Folder Structure\n\`\`\`\n/src\n  /routes/v1\n    /health\n    /keys\n    /[resource]\n  /middleware\n    auth.ts\n    ratelimit.ts\n    validate.ts\n  /db\n    schema.ts\n    queries.ts\n  /lib/errors.ts\n  index.ts\nwrangler.toml\n.dev.vars\n\`\`\`\n\n## Response Envelope\n{ success, data, error: { code, message, requestId }, meta }\n\n## Data Models\n\`\`\`\nApiKey   { id, keyHash, name, tier, requestCount, active }\nResource { id, ownerId, data, status, createdAt }\n\`\`\``,
    rules: `# AI RULES — REST API\n\n## NEVER\n- Never store API keys plaintext — always hash + salt\n- Never return stack traces to consumers\n- Never skip Zod validation on any endpoint\n- Never bypass rate limiting for any key\n\n## ALWAYS\n- Always return standard JSON envelope on every response\n- Always include requestId in error responses\n- Always use correct HTTP status codes\n- Always type Hono route handlers fully\n\n## Done Criteria\n✓ Endpoint returns correct response · Auth blocks bad keys · Rate limiting enforced · Zero TS errors · Tested via curl`,
    plan: `# PLAN — REST API\n\n## Phase 1 — Foundation\n- [ ] 1.1 Init Hono + Wrangler\n- [ ] 1.2 D1 binding in wrangler.toml\n- [ ] 1.3 Drizzle schema + migration\n- [ ] 1.4 API key auth middleware\n- [ ] 1.5 GET /v1/health\n- [ ] CHECKPOINT: Worker runs · auth blocks bad keys · D1 connected\n\n## Phase 2 — Core\n- [ ] 2.1 Key generation + revocation endpoints\n- [ ] 2.2 Rate limiting middleware (sliding window)\n- [ ] 2.3 POST /v1/[resource]\n- [ ] 2.4 GET /v1/[resource] + /:id\n- [ ] 2.5 PATCH /v1/[resource]/:id\n- [ ] 2.6 DELETE /v1/[resource]/:id\n- [ ] CHECKPOINT: All endpoints working · auth + rate limit active\n\n## Phase 3 — Harden & Deploy\n- [ ] 3.1 Zod on all request bodies\n- [ ] 3.2 Error envelope on all error paths\n- [ ] 3.3 Production D1 + secrets\n- [ ] 3.4 wrangler deploy\n- [ ] 3.5 Smoke test production Worker`
  },
  {
    id: "ecom", name: "E-commerce", tag: "Full Stack", color: "#a855f7", icon: "▲",
    description: "Catalogue, cart, Stripe checkout, order management.",
    stack: "Next.js · Supabase · Stripe · Vercel",
    prd: `# PRD — E-commerce Store\n\n## What It IS\nD2C storefront with catalogue, cart, and Stripe checkout.\n\n**Primary User:** Customers purchasing products online.\n\n**Core Problem:** Need a branded store with no platform fees or middlemen.\n\n### MVP Features\n1. Product catalogue with categories\n2. Product detail pages with images\n3. Shopping cart — add, remove, update qty\n4. Stripe Checkout for payment\n5. Order confirmation page + email\n6. Admin — view orders, update fulfillment\n\n## What It Is NOT\n- Not a marketplace\n- Not a subscription service at launch\n- Not a mobile app at launch`,
    arch: `# ARCHITECTURE — E-commerce\n\n## Stack\n- Frontend: Next.js 14 (App Router, RSC)\n- Backend: Server Actions + API Routes\n- Database: Supabase (PostgreSQL + Storage)\n- Payments: Stripe Checkout + Webhooks\n- Email: Resend\n- Deploy: Vercel\n\n## Folder Structure\n\`\`\`\n/store\n  /app\n    /(shop)\n      /products\n      /products/[slug]\n      /cart\n      /order/[id]\n    /(admin)/orders\n    /api/webhooks/stripe\n  /components\n    /shop\n    /admin\n    /ui\n  /lib\n    /supabase · /stripe · /email\n\`\`\`\n\n## Data Models\n\`\`\`\nProduct { id, name, slug, price, images[], stock, active }\nOrder   { id, email, lineItems[], total, status, stripePaymentId }\n\`\`\`\n\n## Critical Rule\nOrder creation happens ONLY in Stripe webhook — never on redirect. Price always fetched from DB server-side.`,
    rules: `# AI RULES — E-commerce\n\n## NEVER\n- Never process payments client-side\n- Never trust client-provided prices\n- Never fulfil on redirect — webhook only\n- Never store card data\n\n## ALWAYS\n- Always verify Stripe webhook signature\n- Always fetch price from DB at checkout\n- Always create Order after webhook fires\n- Always handle out-of-stock gracefully\n- Always use Next.js Image for product images\n\n## Done Criteria\n✓ Full purchase flow works · Webhook verified · Order in DB · Confirmation email sent · Tested with Stripe test card`,
    plan: `# PLAN — E-commerce\n\n## Phase 1 — Foundation\n- [ ] 1.1 Init Next.js + pnpm\n- [ ] 1.2 Supabase schema (Product, Category, Order)\n- [ ] 1.3 Seed 5–10 test products\n- [ ] 1.4 Catalogue page + category filter\n- [ ] 1.5 Product detail page (PDP)\n- [ ] CHECKPOINT: Catalogue + PDP render from live DB\n\n## Phase 2 — Core\n- [ ] 2.1 Cart (localStorage + context)\n- [ ] 2.2 Cart UI — add, remove, qty, total\n- [ ] 2.3 Stripe Checkout session (server action)\n- [ ] 2.4 Stripe webhook → create Order in DB\n- [ ] 2.5 Order confirmation page\n- [ ] 2.6 Confirmation email via Resend\n- [ ] 2.7 Admin orders view + status update\n- [ ] CHECKPOINT: Full purchase flow working on Stripe test mode\n\n## Phase 3 — Deploy\n- [ ] 3.1 Out-of-stock handling\n- [ ] 3.2 Mobile responsiveness\n- [ ] 3.3 Deploy Vercel + production Stripe\n- [ ] 3.4 Live test purchase`
  },
  {
    id: "agent", name: "AI Agent", tag: "AI", color: "#00ff9d", icon: "⬢",
    description: "Conversational agent with memory, tools, and defined personality.",
    stack: "Any LLM · Vector DB · Telegram / Web / Slack",
    prd: `# PRD — AI Agent\n\n## What It IS\nPurpose-built conversational AI with defined role, memory, tool access, and consistent interface.\n\n**Primary User:** [Internal team / customers / specific department]\n\n**Core Problem:** [What manual/repetitive task does this handle?]\n\n### MVP Features\n1. Defined identity — name, role, personality, system prompt\n2. Conversational interface — [Telegram / Web / Slack / API]\n3. Short-term memory — context within a session\n4. Long-term memory — relevant context across sessions\n5. Tool access — [list tools: search, DB, calendar, etc.]\n6. Escalation path — knows when to hand off to human\n\n## What It Is NOT\n- Not a replacement for human expertise in high-stakes decisions\n- Not a voice agent at launch — text only\n- Not general-purpose — scoped role only`,
    arch: `# ARCHITECTURE — AI Agent\n\n## Stack\n- LLM: [Claude / GPT-4o / Gemini]\n- LLM Access: Direct API or proxy (LiteLLM)\n- Framework: [LangChain / OpenClaw / custom]\n- Short-term: In-context conversation history\n- Long-term: Vector DB [Pinecone / pgvector / Chroma]\n- Interface: [Telegram / Web / Slack / REST]\n- Deploy: [VPS / Cloudflare Workers / Railway]\n\n## Folder Structure\n\`\`\`\n/agent-name\n  /agent\n    system-prompt.md\n    /tools/[tool].py\n    /memory\n      store.py\n      retrieval.py\n  /interface\n    telegram.py\n  /lib\n    llm.py\n    utils.py\n  .env\n\`\`\`\n\n## Memory Flow\nWrite: after each turn · Read: before each LLM call\nShort-term: last N messages · Long-term: top-K semantic retrieval`,
    rules: `# AI RULES — AI Agent\n\n## NEVER\n- Never call LLM without system prompt\n- Never persist raw conversation without user awareness\n- Never hallucinate tool results — if tool fails, say so\n- Never claim capabilities the agent doesn't have\n- Never hardcode system prompt in code — load from file\n\n## ALWAYS\n- Always include system prompt on every LLM call\n- Always validate user input before passing to tools\n- Always handle LLM API errors gracefully\n- Always set max token limit per response\n- Always log tool calls for debugging\n\n## Done Criteria\n✓ Correct responses in 10-message test · Tool calls working · Memory retrieving relevant context · Escalation triggers correctly`,
    plan: `# PLAN — AI Agent\n\n## Phase 1 — Foundation\n- [ ] 1.1 Project structure per Architecture\n- [ ] 1.2 .env with all required variables\n- [ ] 1.3 Write system prompt\n- [ ] 1.4 LLM client with retry + error handling\n- [ ] 1.5 Basic single-turn conversation loop\n- [ ] 1.6 Test 10 prompts — identity and scope hold\n- [ ] CHECKPOINT: Agent responds correctly · system prompt enforced\n\n## Phase 2 — Core\n- [ ] 2.1 Short-term memory (conversation history window)\n- [ ] 2.2 Vector DB connection for long-term memory\n- [ ] 2.3 Memory write after each turn\n- [ ] 2.4 Memory retrieval before each LLM call\n- [ ] 2.5 Tool 1 — [name]\n- [ ] 2.6 Tool 2 — [name]\n- [ ] 2.7 Interface — [Telegram / Web / Slack]\n- [ ] 2.8 Escalation trigger\n- [ ] CHECKPOINT: Full convo with memory + tools working\n\n## Phase 3 — Deploy\n- [ ] 3.1 20-message stress test\n- [ ] 3.2 Tool failure scenarios tested\n- [ ] 3.3 Deploy to production\n- [ ] 3.4 Monitor first 50 real conversations`
  }
];

const PLANS = [
  {
    id: "free", name: "Free", price: "0", per: "", badge: null,
    color: "#3a3a5c", glow: false,
    description: "Taste the system.",
    features: [
      { text: "1 active project", included: true },
      { text: "Blank templates — manual fill", included: true },
      { text: "Copy agent prompt", included: true },
      { text: "Interview mode", included: false },
      { text: "Template library", included: false },
      { text: "Export .md files", included: false },
      { text: "Project history", included: false },
    ],
    cta: "Get Started", ctaStyle: "outline"
  },
  {
    id: "oneoff", name: "One-Off", price: "9", per: "/project", badge: "NO SUBSCRIPTION",
    color: "#ffd700", glow: true,
    description: "Full Builder, once. Pay when you need it.",
    features: [
      { text: "1 project — full experience", included: true },
      { text: "Interview mode — agent asks the questions", included: true },
      { text: "All 4 templates + library", included: true },
      { text: "Export all 4 .md files", included: true },
      { text: "No expiry on what you generate", included: true },
      { text: "No subscription required", included: true },
      { text: "Project history", included: false },
    ],
    cta: "Buy Once", ctaStyle: "gold",
    note: "Bought 3 or more? Builder pays for itself."
  },
  {
    id: "builder", name: "Builder", price: "19", per: "/mo", badge: "MOST POPULAR",
    color: "#ff6b35", glow: true,
    description: "Unlimited builds. Always on.",
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Interview mode on every project", included: true },
      { text: "Full template library (20+ stacks)", included: true },
      { text: "Export all 4 .md files", included: true },
      { text: "Version history per project", included: true },
      { text: "Priority file generation", included: true },
      { text: "Team workspaces", included: false },
    ],
    cta: "Start Building", ctaStyle: "brand"
  },
  {
    id: "agency", name: "Agency", price: "49", per: "/mo", badge: null,
    color: "#a855f7", glow: false,
    description: "For teams shipping client work.",
    features: [
      { text: "Everything in Builder", included: true },
      { text: "Team workspaces — 5 seats", included: true },
      { text: "Client-branded exports", included: true },
      { text: "Custom template library", included: true },
      { text: "Webhook on project events", included: true },
      { text: "Priority support", included: true },
      { text: "White-label option", included: true },
    ],
    cta: "Scale Up", ctaStyle: "outline"
  }
];

const AGENTS = ["Claude", "ChatGPT", "Cursor", "Gemini", "Copilot", "Windsurf", "Any LLM"];

type TemplateFileKey = "prd" | "arch" | "rules" | "plan";
type SignupState = "idle" | "loading" | "ok" | "error";

export default function BuildForge() {
  const [section, setSection] = useState("product");
  const [activeTemplate, setActiveTemplate] = useState("saas");
  const [activeFile, setActiveFile] = useState<TemplateFileKey>("prd");
  const [copied, setCopied] = useState("");
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [agentIdx, setAgentIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [signupState, setSignupState] = useState<SignupState>("idle");
  const [signupMsg, setSignupMsg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setAgentIdx(i => (i + 1) % AGENTS.length), 1800);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = 12, rows = 8;
      const cw = canvas.width / cols, ch = canvas.height / rows;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const wave = Math.sin(t * 0.4 + c * 0.6 + r * 0.5) * 0.5 + 0.5;
          const alpha = wave * 0.06 + 0.02;
          ctx.fillStyle = `rgba(255, 107, 53, ${alpha})`;
          ctx.beginPath();
          ctx.arc(c * cw, r * ch, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      t += 0.03;
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2500);
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupState === "loading") return;
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setSignupState("error");
      setSignupMsg("Enter a valid email.");
      return;
    }
    setSignupState("loading");
    setSignupMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSignupState("error");
        setSignupMsg(data?.error || "Something went wrong.");
        return;
      }
      setSignupState("ok");
      setSignupMsg("You're on the list.");
      setEmail("");
    } catch {
      setSignupState("error");
      setSignupMsg("Network error. Try again.");
    }
  };

  const tpl = TEMPLATES.find(t => t.id === activeTemplate);
  const fileKey: Record<TemplateFileKey, TemplateFileKey> = { prd: "prd", arch: "arch", rules: "rules", plan: "plan" };

  const css = `
    @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
    .fade-up { animation: fadeUp 0.5s ease forwards; }
    .plan-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .plan-card:hover { transform: translateY(-4px); }
    .tpl-card { transition: all 0.15s ease; }
    .tpl-card:hover { transform: translateY(-2px); }
    .nav-btn { transition: color 0.15s ease; }
    .nav-btn:hover { color: #fff !important; }
    .copy-btn { transition: all 0.2s ease; }
    .copy-btn:hover { opacity: 0.85; }
    .file-tab { transition: all 0.15s ease; }
    .file-tab:hover { color: #aaa !important; }
    .feature-row { transition: background 0.1s ease; }
    .feature-row:hover { background: rgba(255,255,255,0.02); }
    .signup-input::placeholder { color: #33335a; }
    .signup-input:focus { border-color: rgba(255,107,53,0.5); outline: none; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #0a0a18; }
    ::-webkit-scrollbar-thumb { background: #2a2a4a; border-radius: 2px; }
  `;

  const S = {
    root: {
      minHeight: "100vh",
      background: "#06060e",
      color: "#c8c8e0",
      fontFamily: "'JetBrains Mono', monospace",
    },
    nav: {
      position: "sticky" as const, top: 0, zIndex: 100,
      display: "flex", alignItems: "center",
      background: "rgba(6,6,14,0.92)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,107,53,0.12)",
      padding: "0 28px",
      overflowX: "auto" as const,
    },
    logo: {
      display: "flex", alignItems: "center", gap: "10px",
      padding: "18px 20px 18px 0", marginRight: "24px",
      borderRight: "1px solid rgba(255,107,53,0.15)",
      whiteSpace: "nowrap" as const,
    },
    logoHex: {
      width: "26px", height: "26px",
      background: "linear-gradient(135deg, #ff6b35, #ff4500)",
      clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "11px", color: "#fff", fontWeight: 800,
    },
    logoText: {
      fontSize: "13px", fontWeight: 800, color: "#fff",
      letterSpacing: "2px", fontFamily: "'Syne', sans-serif",
    },
    badge: {
      fontSize: "8px", letterSpacing: "1px", color: "#ff6b35",
      background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.25)",
      borderRadius: "2px", padding: "1px 6px",
    },
  };

  const NavBtn = ({ id, label }: { id: string; label: string }) => (
    <button className="nav-btn" onClick={() => setSection(id)} style={{
      padding: "18px 16px", background: "none", border: "none",
      borderBottom: section === id ? "2px solid #ff6b35" : "2px solid transparent",
      color: section === id ? "#fff" : "#3a3a5c",
      cursor: "pointer", fontSize: "10px", letterSpacing: "1.5px",
      fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap",
    }}>{label}</button>
  );

  const CopyBtn = ({ text, id, label = "COPY" }: { text: string; id: string; label?: string }) => (
    <button className="copy-btn" onClick={() => copy(text, id)} style={{
      padding: "8px 16px",
      background: copied === id ? "rgba(0,255,157,0.12)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${copied === id ? "rgba(0,255,157,0.5)" : "rgba(255,255,255,0.08)"}`,
      color: copied === id ? "#00ff9d" : "#666",
      borderRadius: "4px", cursor: "pointer", fontSize: "9px",
      letterSpacing: "2px", fontFamily: "'JetBrains Mono', monospace",
    }}>
      {copied === id ? "✓ COPIED" : label}
    </button>
  );

  return (
    <div style={S.root}>
      <style>{css}</style>

      <nav style={S.nav}>
        <div style={S.logo}>
          <div style={S.logoHex}>⬡</div>
          <span style={S.logoText}>BUILDFORGE</span>
        </div>
        <NavBtn id="product" label="PRODUCT" />
        <NavBtn id="agent" label="FOR YOUR AGENT" />
        <NavBtn id="templates" label="TEMPLATES" />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={S.badge}>ANAKATECH</span>
        </div>
      </nav>

      {section === "product" && (
        <div className="fade-up">
          <div style={{ position: "relative", overflow: "hidden", padding: "72px 40px 64px", borderBottom: "1px solid rgba(255,107,53,0.1)" }}>
            <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.8 }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(255,107,53,0.06) 0%, transparent 70%)" }} />
            <div style={{ position: "relative", maxWidth: "760px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px", padding: "6px 14px", background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: "20px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff6b35", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "10px", color: "#ff6b35", letterSpacing: "2px" }}>BUILD GOVERNANCE SYSTEM</span>
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, color: "#fff", margin: "0 0 16px 0", lineHeight: 1.1, letterSpacing: "-1px" }}>
                Ship projects that<br />
                <span style={{ background: "linear-gradient(90deg, #ff6b35, #ff9a6b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>don't fall apart.</span>
              </h1>
              <p style={{ fontSize: "14px", color: "#4a4a70", lineHeight: "1.9", maxWidth: "520px", margin: "0 0 32px 0" }}>
                Four governance files. Written before you touch code. Any AI — Claude, ChatGPT, Cursor — follows them to the letter. No scope creep. No structural drift. Builds that match what you designed.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", marginBottom: "24px" }}>
                <button onClick={() => setSection("agent")} style={{ padding: "13px 24px", background: "linear-gradient(135deg, #ff6b35, #ff4500)", border: "none", borderRadius: "6px", color: "#fff", fontSize: "11px", letterSpacing: "1.5px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  GET THE AGENT PROMPT →
                </button>
                <button onClick={() => setSection("templates")} style={{ padding: "13px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#888", fontSize: "11px", letterSpacing: "1.5px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>
                  VIEW TEMPLATES
                </button>
              </div>

              <form onSubmit={submitEmail} style={{ maxWidth: "440px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#3a3a5c", marginBottom: "8px" }}>EARLY ACCESS — JOIN THE LIST</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <input
                    className="signup-input"
                    type="email"
                    required
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (signupState !== "idle") { setSignupState("idle"); setSignupMsg(""); } }}
                    placeholder="you@domain.com"
                    disabled={signupState === "loading"}
                    style={{
                      flex: "1 1 220px", minWidth: "220px",
                      padding: "11px 14px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "6px", color: "#fff",
                      fontSize: "12px", fontFamily: "'JetBrains Mono', monospace",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={signupState === "loading"}
                    style={{
                      padding: "11px 20px",
                      background: signupState === "ok" ? "rgba(0,255,157,0.12)" : "linear-gradient(135deg, #ff6b35, #ff4500)",
                      border: signupState === "ok" ? "1px solid rgba(0,255,157,0.5)" : "none",
                      borderRadius: "6px",
                      color: signupState === "ok" ? "#00ff9d" : "#fff",
                      fontSize: "10px", letterSpacing: "1.5px",
                      cursor: signupState === "loading" ? "wait" : "pointer",
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                      opacity: signupState === "loading" ? 0.6 : 1,
                    }}
                  >
                    {signupState === "loading" ? "…" : signupState === "ok" ? "✓ ON THE LIST" : "NOTIFY ME"}
                  </button>
                </div>
                {signupMsg && (
                  <div style={{
                    marginTop: "8px", fontSize: "10px",
                    color: signupState === "error" ? "#ff6b6b" : "#00ff9d",
                  }}>{signupMsg}</div>
                )}
              </form>
            </div>
          </div>

          <div style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "9px", letterSpacing: "2px", color: "#2a2a44" }}>WORKS WITH</span>
            {AGENTS.map((a, i) => (
              <span key={a} style={{ fontSize: "11px", color: agentIdx === i ? "#ff6b35" : "#2e2e50", transition: "color 0.4s ease", letterSpacing: "0.5px" }}>{a}</span>
            ))}
          </div>

          <div style={{ padding: "60px 40px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2a2a44", marginBottom: "36px" }}>HOW IT WORKS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "2px" }}>
              {[
                ["01", "Interview", "The agent asks your project questions one by one. You answer in plain language.", "#ff6b35"],
                ["02", "Generate", "All 4 governance files written from your answers automatically.", "#00d4ff"],
                ["03", "Execute", "Hand the files to any AI. It follows the plan and enforces your rules on every decision.", "#00ff9d"],
                ["04", "Ship", "No scope creep. No rogue decisions. Builds that match what you designed.", "#a855f7"],
              ].map(([n, t, d, c]) => (
                <div key={n} style={{ padding: "28px 24px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "36px", fontWeight: 800, color: c, opacity: 0.3, marginBottom: "16px" }}>{n}</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "8px", fontFamily: "'Syne', sans-serif" }}>{t}</div>
                  <div style={{ fontSize: "11px", color: "#333a55", lineHeight: "1.8" }}>{d}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "60px 40px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2a2a44", marginBottom: "36px" }}>THE 4 GOVERNANCE FILES</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                ["01", "PRD", "Scope lock. What it IS and what it is NOT. If it's not in the PRD, the agent doesn't build it.", "#ff6b35"],
                ["02", "ARCHITECTURE", "Blueprint. Exact folder structure, stack, naming conventions, data models. Followed exactly.", "#00d4ff"],
                ["03", "AI RULES", "The law. Non-negotiables checked before any step is marked done.", "#00ff9d"],
                ["04", "PLAN", "Execution map. One step. Fully done. Verified. Then — and only then — next step.", "#a855f7"],
              ].map(([n, t, d, c]) => (
                <div key={n} style={{ padding: "24px", background: `linear-gradient(135deg, ${c}08 0%, transparent 60%)`, border: `1px solid ${c}18`, borderLeft: `3px solid ${c}`, borderRadius: "4px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "10px" }}>
                    <span style={{ fontSize: "9px", color: c, letterSpacing: "2px", opacity: 0.6 }}>{n}</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>{t}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#333a55", lineHeight: "1.8" }}>{d}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "60px 40px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2a2a44", marginBottom: "12px" }}>PRICING</div>
            <p style={{ fontSize: "12px", color: "#2a2a44", marginBottom: "36px" }}>
              No commitment required. Buy once when you need it. Subscribe when you're hooked.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "12px" }}>
              {PLANS.map(plan => (
                <div key={plan.id} className="plan-card"
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  style={{
                    padding: "28px 22px",
                    background: hoveredPlan === plan.id ? `${plan.color}08` : plan.id === "builder" ? "rgba(255,107,53,0.05)" : "rgba(255,255,255,0.01)",
                    border: plan.id === "builder" ? `1px solid rgba(255,107,53,0.35)` : plan.id === "oneoff" ? `1px solid rgba(255,215,0,0.25)` : "1px solid rgba(255,255,255,0.06)",
                    borderTop: `3px solid ${plan.color}`,
                    borderRadius: "6px",
                    position: "relative",
                    boxShadow: plan.glow ? `0 0 30px ${plan.color}0a` : "none",
                  }}>
                  {plan.badge && (
                    <div style={{ position: "absolute", top: "-1px", right: "16px", background: plan.color, color: plan.id === "oneoff" ? "#000" : "#fff", fontSize: "7px", letterSpacing: "1.5px", padding: "3px 8px", borderRadius: "0 0 4px 4px", fontWeight: 700 }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ fontSize: "9px", letterSpacing: "2px", color: plan.color, marginBottom: "8px" }}>{plan.name.toUpperCase()}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "3px", marginBottom: "6px" }}>
                    {plan.price === "0"
                      ? <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff" }}>Free</span>
                      : <>
                        <span style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>$</span>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff" }}>{plan.price}</span>
                        <span style={{ fontSize: "11px", color: "#2a2a44" }}>{plan.per}</span>
                      </>}
                  </div>
                  <div style={{ fontSize: "10px", color: "#2a2a44", marginBottom: "20px", lineHeight: "1.5" }}>{plan.description}</div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "18px", marginBottom: "20px" }}>
                    {plan.features.map((f, i) => (
                      <div key={i} className="feature-row" style={{ display: "flex", gap: "10px", padding: "5px 0", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "10px", color: f.included ? plan.color : "#1e1e38", minWidth: "14px", marginTop: "1px" }}>{f.included ? "✓" : "×"}</span>
                        <span style={{ fontSize: "10px", color: f.included ? "#6a6a90" : "#1e1e38", lineHeight: "1.5" }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                  {plan.note && <div style={{ fontSize: "9px", color: plan.color, marginBottom: "12px", opacity: 0.7 }}>↑ {plan.note}</div>}
                  <button style={{
                    width: "100%", padding: "11px",
                    background: plan.ctaStyle === "brand" ? "linear-gradient(135deg,#ff6b35,#ff4500)"
                      : plan.ctaStyle === "gold" ? "linear-gradient(135deg,#ffd700,#ffaa00)"
                        : "transparent",
                    border: plan.ctaStyle === "outline" ? `1px solid ${plan.color}` : "none",
                    color: plan.ctaStyle === "gold" ? "#000" : plan.ctaStyle === "brand" ? "#fff" : plan.color,
                    borderRadius: "4px", cursor: "pointer", fontSize: "10px", letterSpacing: "2px",
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  }}>{plan.cta}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === "agent" && (
        <div className="fade-up" style={{ padding: "48px 40px", maxWidth: "900px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "5px 12px", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "20px" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00d4ff", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "9px", color: "#00d4ff", letterSpacing: "2px" }}>FOR YOUR AGENT</span>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, color: "#fff", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
            One prompt. Any AI.<br />Structured builds every time.
          </h2>
          <p style={{ fontSize: "12px", color: "#333a55", lineHeight: "1.9", maxWidth: "580px", marginBottom: "36px" }}>
            Paste this as the system prompt in Claude, ChatGPT, Cursor, or any capable model. It interviews you, writes all 4 governance files, confirms them, then executes the build one step at a time.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: "10px", marginBottom: "36px" }}>
            {[
              ["01  Copy", "Hit the button. Full governance prompt on clipboard.", "#ff6b35"],
              ["02  Open AI", "Claude, ChatGPT, Cursor — any new conversation.", "#00d4ff"],
              ["03  Paste", "Into the system prompt field or top of chat.", "#00ff9d"],
              ["04  Build", "Say 'new build'. Agent interviews you, writes files, executes.", "#a855f7"],
            ].map(([t, d, c]) => (
              <div key={t} style={{ padding: "18px", background: "rgba(255,255,255,0.01)", border: `1px solid ${c}15`, borderTop: `2px solid ${c}`, borderRadius: "4px" }}>
                <div style={{ fontSize: "10px", color: c, fontWeight: 700, marginBottom: "6px" }}>{t}</div>
                <div style={{ fontSize: "10px", color: "#2a2a44", lineHeight: "1.7" }}>{d}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
            {[["One question at a time", "#ff6b35"], ["Generates all 4 files", "#00d4ff"], ["Continuous mode available", "#00ff9d"], ["Works with any capable LLM", "#a855f7"]].map(([l, c]) => (
              <div key={l} style={{ padding: "5px 12px", background: `${c}0e`, border: `1px solid ${c}25`, borderRadius: "20px", fontSize: "10px", color: c }}>✓ {l}</div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
            <CopyBtn text={AGENT_PROMPT} id="agentprompt" label="COPY AGENT PROMPT" />
          </div>
          <pre style={{ background: "#030309", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "24px", color: "#3a3a5c", fontSize: "10px", lineHeight: "2", overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {AGENT_PROMPT}
          </pre>
        </div>
      )}

      {section === "templates" && (
        <div className="fade-up" style={{ padding: "48px 40px", maxWidth: "980px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "5px 12px", background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "20px" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#a855f7", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "9px", color: "#a855f7", letterSpacing: "2px" }}>TEMPLATE LIBRARY</span>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: 800, color: "#fff", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
            All 4 files. Pre-filled.<br />Ready to hand to your agent.
          </h2>
          <p style={{ fontSize: "12px", color: "#2a2a44", marginBottom: "32px" }}>
            Pick a template, copy the files, swap placeholders for your project, hand to agent. It executes from Step 1.1.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "10px", marginBottom: "28px" }}>
            {TEMPLATES.map(t => (
              <div key={t.id} className="tpl-card"
                onClick={() => { setActiveTemplate(t.id); setActiveFile("prd"); }}
                style={{ padding: "18px", background: activeTemplate === t.id ? `${t.color}0c` : "rgba(255,255,255,0.01)", border: activeTemplate === t.id ? `1px solid ${t.color}55` : `1px solid rgba(255,255,255,0.05)`, borderLeft: `3px solid ${activeTemplate === t.id ? t.color : "transparent"}`, borderRadius: "4px", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ color: t.color, fontSize: "18px" }}>{t.icon}</span>
                  <span style={{ fontSize: "8px", letterSpacing: "1px", color: t.color, background: `${t.color}14`, border: `1px solid ${t.color}30`, borderRadius: "2px", padding: "2px 6px" }}>{t.tag}</span>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "12px", fontWeight: 700, color: "#fff", marginBottom: "5px" }}>{t.name}</div>
                <div style={{ fontSize: "10px", color: "#222238", lineHeight: "1.6", marginBottom: "8px" }}>{t.description}</div>
                <div style={{ fontSize: "9px", color: `${t.color}66` }}>{t.stack}</div>
              </div>
            ))}
          </div>

          {tpl && (
            <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0 4px", background: "rgba(0,0,0,0.2)" }}>
                {([["prd", "PRD.md"], ["arch", "ARCHITECTURE.md"], ["rules", "AI_RULES.md"], ["plan", "PLAN.md"]] as const).map(([id, label]) => (
                  <button key={id} className="file-tab" onClick={() => setActiveFile(id)} style={{
                    padding: "12px 14px", background: "none", border: "none",
                    borderBottom: activeFile === id ? `2px solid ${tpl.color}` : "2px solid transparent",
                    color: activeFile === id ? "#fff" : "#2a2a44",
                    cursor: "pointer", fontSize: "9px", letterSpacing: "1px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{label}</button>
                ))}
                <div style={{ marginLeft: "auto", padding: "0 12px" }}>
                  <CopyBtn text={tpl[fileKey[activeFile]]} id={`${tpl.id}-${activeFile}`} />
                </div>
              </div>
              <pre style={{ margin: 0, padding: "24px", color: "#3a3a5c", fontSize: "10px", lineHeight: "2", overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: "500px", overflowY: "auto" }}>
                {tpl[fileKey[activeFile]]}
              </pre>
              <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,215,0,0.03)", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "10px", color: "#ffd70060" }}>⚡</span>
                <span style={{ fontSize: "10px", color: "#2a2a44", lineHeight: "1.7" }}>
                  Copy all 4 files · Replace bracketed placeholders · Paste For Your Agent prompt as system prompt · Attach files · Say CONFIRMED · Agent executes from Step 1.1
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
