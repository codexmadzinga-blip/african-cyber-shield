import { Link } from "wouter";
import {
  Shield, ShieldCheck, Search, KeyRound, Smartphone,
  History, Zap, Globe, Lock, ChevronRight, ArrowRight,
  CheckCircle2, Users, TrendingUp, AlertTriangle, Star,
  BarChart3, Brain, Layers
} from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Phishing URL Scanner",
    desc: "Instantly analyze any link with 10+ heuristic checks — domain entropy, lookalike names, Africa-specific brand impersonation, and more.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
  },
  {
    icon: Layers,
    title: "Batch Scanner",
    desc: "Upload up to 20 URLs at once. Perfect for security teams reviewing suspicious links from email campaigns or threat intelligence feeds.",
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20",
  },
  {
    icon: KeyRound,
    title: "Password Strength Checker",
    desc: "Grade passwords from F to A+ with entropy scoring, crack-time estimation, and actionable suggestions. Blocks 50+ Africa-common weak passwords.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    icon: Smartphone,
    title: "2FA Setup Guide",
    desc: "Step-by-step 2FA activation for M-PESA, MTN MoMo, GTBank, KCB, Equity, FNB, Absa and more. Includes SIM-swap fraud prevention.",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    icon: History,
    title: "Scan History & Analytics",
    desc: "Every scan is stored and searchable. Filter by risk level, track threat trends over time, and export results as CSV for reporting.",
    color: "text-rose-400",
    bg: "bg-rose-400/10 border-rose-400/20",
  },
  {
    icon: Brain,
    title: "Africa-Focused Intelligence",
    desc: "Built with Africa in mind — recognises impersonation of Safaricom, MTN, Airtel, Zenith Bank, GTBank, Equity, and 30+ other local brands.",
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/20",
  },
];

const STATS = [
  { value: "10+", label: "Detection Checks" },
  { value: "40+", label: "African Brands Protected" },
  { value: "50+", label: "Common Passwords Blocked" },
  { value: "100%", label: "Privacy — Nothing Logged" },
];

const PRICING = [
  {
    tier: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for individuals protecting themselves online.",
    features: [
      "URL phishing scanner",
      "Password strength checker",
      "2FA setup guides",
      "10 scan history records",
      "CSV export",
    ],
    cta: "Get Started Free",
    href: "/analyzer",
    highlight: false,
  },
  {
    tier: "Pro",
    price: "$19",
    period: "per month",
    desc: "For security-conscious professionals and small businesses.",
    features: [
      "Everything in Free",
      "Batch scan up to 20 URLs",
      "Unlimited scan history",
      "Priority analysis queue",
      "API access (500 req/day)",
      "Email threat alerts",
    ],
    cta: "Start Pro Trial",
    href: "/analyzer",
    highlight: true,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "contact us",
    desc: "For banks, telcos, and large organisations.",
    features: [
      "Everything in Pro",
      "Unlimited API access",
      "Custom brand monitoring",
      "Dedicated threat analyst",
      "SLA & compliance reports",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    href: "/analyzer",
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Amara O.",
    role: "IT Security Lead, Lagos",
    body: "We've been using African Cyber Shield to screen links sent to our employees. It caught 3 credential-harvesting pages in the first week.",
    stars: 5,
  },
  {
    name: "Wanjiku M.",
    role: "Fintech Developer, Nairobi",
    body: "The 2FA guide for M-PESA and KCB alone is worth it. Shared it with my entire family after my aunt almost lost her savings to a phishing attack.",
    stars: 5,
  },
  {
    name: "Kwame A.",
    role: "Cybersecurity Trainer, Accra",
    body: "I use the password checker in my workshops. The crack-time estimate really drives home why 'Ghana2024' is not a safe password.",
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)] text-white overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[hsl(222,47%,5%)]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-lg">
            <div className="p-1.5 rounded-lg bg-[hsl(173,100%,38%)]/15 border border-[hsl(173,100%,38%)]/30">
              <Shield className="h-5 w-5 text-[hsl(173,100%,52%)]" />
            </div>
            <span className="text-white">African <span className="text-[hsl(173,100%,52%)]">Cyber Shield</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          </div>
          <Link href="/analyzer">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[hsl(173,100%,38%)] text-[hsl(222,47%,5%)] font-semibold text-sm hover:bg-[hsl(173,100%,44%)] transition-colors cursor-pointer">
              Open App <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 cyber-grid">
        {/* Glow blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[hsl(173,100%,38%)]/8 blur-[100px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] rounded-full bg-[hsl(258,90%,62%)]/6 blur-[80px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[hsl(173,100%,38%)]/30 bg-[hsl(173,100%,38%)]/8 text-[hsl(173,100%,60%)] text-xs font-medium">
            <Zap className="h-3 w-3" />
            Africa's #1 Cybersecurity Toolkit
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
            Stop Cyber Threats
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(173,100%,52%)] to-[hsl(258,90%,68%)]">
              Before They Hit.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed">
            Detect phishing links, audit passwords, set up 2FA — built specifically for
            African banks, mobile money, and online users. Free to use. Takes seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/analyzer">
              <span className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[hsl(173,100%,38%)] text-[hsl(222,47%,5%)] font-bold text-base hover:bg-[hsl(173,100%,44%)] transition-all glow-primary cursor-pointer">
                <Shield className="h-5 w-5" />
                Scan a URL Free
              </span>
            </Link>
            <a href="#features">
              <span className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 text-white/80 font-semibold text-base hover:border-white/30 hover:text-white transition-all cursor-pointer">
                See All Features <ChevronRight className="h-4 w-4" />
              </span>
            </a>
          </div>

          {/* Floating scanner card mock */}
          <div className="relative mt-12 mx-auto max-w-2xl">
            <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm p-5 text-left shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-white/30 font-mono">url-analyzer</span>
              </div>
              <div className="flex gap-3 items-center bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white/60">
                <Search className="h-4 w-4 text-white/30 shrink-0" />
                <span className="text-[hsl(173,100%,52%)]">https://</span>secure-ecobank-login-verify.com/update
              </div>
              <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/25">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-300">CRITICAL RISK — Likely Phishing</p>
                  <p className="text-xs text-white/40 mt-0.5">Score 88/100 · Flags: brand impersonation, suspicious subdomain, deceptive path</p>
                </div>
                <span className="ml-auto text-xs font-bold text-red-400 border border-red-500/30 px-2 py-0.5 rounded">BLOCK</span>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[hsl(173,100%,38%)]/15 blur-xl rounded-full" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-white/8 bg-white/2 py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black text-[hsl(173,100%,52%)] glow-text">{s.value}</p>
              <p className="text-sm text-white/45 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <p className="text-[hsl(173,100%,52%)] text-sm font-semibold uppercase tracking-widest">What's Inside</p>
            <h2 className="text-4xl md:text-5xl font-black">Everything You Need to Stay Safe</h2>
            <p className="text-white/50 max-w-xl mx-auto">One toolkit. Six powerful tools. Built for the African cyber threat landscape.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className={`rounded-2xl border p-6 space-y-3 hover:scale-[1.02] transition-transform ${f.bg}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.bg}`}>
                    <Icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-white">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 bg-white/2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <p className="text-[hsl(173,100%,52%)] text-sm font-semibold uppercase tracking-widest">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black">Simple, Transparent Pricing</h2>
            <p className="text-white/50 max-w-xl mx-auto">Start free. Upgrade when you need more power.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((p) => (
              <div
                key={p.tier}
                className={`relative rounded-2xl border p-7 flex flex-col gap-5 ${
                  p.highlight
                    ? "border-[hsl(173,100%,38%)]/60 bg-[hsl(173,100%,38%)]/8 glow-primary"
                    : "border-white/10 bg-white/3"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[hsl(173,100%,38%)] text-[hsl(222,47%,5%)] text-xs font-bold">
                    MOST POPULAR
                  </span>
                )}
                <div>
                  <p className="text-white/50 text-sm font-medium">{p.tier}</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-4xl font-black text-white">{p.price}</span>
                    <span className="text-white/40 text-sm">/{p.period}</span>
                  </div>
                  <p className="text-white/45 text-sm mt-2">{p.desc}</p>
                </div>
                <ul className="space-y-2 flex-1">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-[hsl(173,100%,52%)] shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href={p.href}>
                  <span className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                    p.highlight
                      ? "bg-[hsl(173,100%,38%)] text-[hsl(222,47%,5%)] hover:bg-[hsl(173,100%,44%)]"
                      : "border border-white/15 text-white hover:border-white/30"
                  }`}>
                    {p.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <p className="text-[hsl(173,100%,52%)] text-sm font-semibold uppercase tracking-widest">Trusted Across Africa</p>
            <h2 className="text-4xl md:text-5xl font-black">What Users Are Saying</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-white/10 bg-white/3 p-6 space-y-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white/65 leading-relaxed">"{t.body}"</p>
                <div>
                  <p className="font-semibold text-sm text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[200px] rounded-full bg-[hsl(173,100%,38%)]/10 blur-[80px]" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex p-4 rounded-2xl bg-[hsl(173,100%,38%)]/10 border border-[hsl(173,100%,38%)]/25 mb-2">
            <ShieldCheck className="h-10 w-10 text-[hsl(173,100%,52%)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black">Start Protecting Yourself Today</h2>
          <p className="text-white/50 text-lg">No signup required. Completely free to start. Takes under 10 seconds.</p>
          <Link href="/analyzer">
            <span className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[hsl(173,100%,38%)] text-[hsl(222,47%,5%)] font-bold text-lg hover:bg-[hsl(173,100%,44%)] transition-all glow-primary cursor-pointer mt-2">
              <Shield className="h-6 w-6" />
              Open the Dashboard Free
            </span>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-white/80">
            <Shield className="h-5 w-5 text-[hsl(173,100%,52%)]" />
            African Cyber Shield
          </div>
          <p className="text-sm text-white/30">© 2026 African Cyber Shield. Built to protect Africa's digital future.</p>
          <div className="flex gap-4 text-sm text-white/40">
            <Link href="/analyzer"><span className="hover:text-white/70 transition-colors cursor-pointer">Dashboard</span></Link>
            <Link href="/about"><span className="hover:text-white/70 transition-colors cursor-pointer">About</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
