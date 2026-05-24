import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Target, Zap, Activity, Github, Linkedin, ExternalLink, BookOpen, Users } from "lucide-react";

const OWASP_CHECKS = [
  { id: "A01", name: "Broken Access Control",       example: "Open redirect parameters in URLs" },
  { id: "A02", name: "Cryptographic Failures",      example: "Plain HTTP instead of HTTPS" },
  { id: "A03", name: "Injection",                   example: "Obfuscated or encoded URL payloads" },
  { id: "A04", name: "Insecure Design",             example: "IP-based hosting, unusual URI schemes" },
  { id: "A05", name: "Security Misconfiguration",   example: "High-abuse TLDs, random subdomains" },
  { id: "A07", name: "Identification & Auth Failures", example: "Credential harvesting, brand impersonation" },
  { id: "A08", name: "Software & Data Integrity",   example: "URL shorteners masking destinations" },
  { id: "A10", name: "Server-Side Request Forgery", example: "Redirect/goto parameters targeting internal paths" },
];

export default function About() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
          <Shield className="h-4 w-4" />
          African Cyber Shield
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Defending the African Web.
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl">
          A purpose-built heuristic engine designed to detect phishing campaigns targeting African financial institutions, mobile money platforms, and everyday users.
        </p>
        <div className="flex gap-3 flex-wrap">
          <a
            href="https://github.com/codexmadzinga-blip/african-cyber-shield"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4" />
            View on GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 bg-card shadow-sm">
          <CardHeader>
            <Target className="h-8 w-8 text-primary mb-3" />
            <CardTitle>Heuristic Scoring</CardTitle>
            <CardDescription>How we calculate risk</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-card-foreground/80 space-y-3 leading-relaxed">
            <p>We analyze the structural and lexical properties of every URL in real-time — no blocklists, no third-party lookups.</p>
            <p>A threat score (0–100) is computed from multiple weighted flags. Higher score = higher probability of malicious intent.</p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-card shadow-sm">
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mb-3" />
            <CardTitle>Detection Checks</CardTitle>
            <CardDescription>10+ indicators per URL</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-card-foreground/80 space-y-2 leading-relaxed">
            <ul className="list-disc pl-5 space-y-1">
              <li>Domain entropy and random-looking subdomains</li>
              <li>Brand impersonation via typosquatting</li>
              <li>Suspicious TLDs (.tk, .ml, .xyz, etc.)</li>
              <li>Open redirect parameters</li>
              <li>URL shorteners masking destinations</li>
              <li>Raw IP address hosting</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 bg-card shadow-sm">
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-3" />
            <CardTitle>Africa-First Intelligence</CardTitle>
            <CardDescription>Built for the local threat landscape</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-card-foreground/80 space-y-2 leading-relaxed">
            <p>Our keyword engine covers 40+ African brands including:</p>
            <p className="font-mono text-xs bg-muted p-2 rounded">
              M-PESA, MTN MoMo, Airtel Money, GTBank, Zenith, KCB, Equity, FNB, Absa, Nedbank, Capitec, ZANACO…
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-card shadow-sm">
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-3" />
            <CardTitle>OWASP Top 10 Aligned</CardTitle>
            <CardDescription>Industry-standard severity mapping</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-card-foreground/80 leading-relaxed">
            <p>Every detected flag is mapped to the relevant OWASP Top 10 (2021) category, so security teams can triage findings using a familiar framework.</p>
          </CardContent>
        </Card>
      </div>

      {/* OWASP mapping table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          OWASP Top 10 Coverage
        </h2>
        <p className="text-muted-foreground text-sm">
          These are the OWASP categories our scanner detects. Each scan result displays which categories apply to the URL.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {OWASP_CHECKS.map((c) => (
            <div key={c.id} className="flex gap-3 p-3 rounded-lg border border-border bg-muted/30">
              <span className="font-mono text-xs font-bold text-primary shrink-0 mt-0.5 w-10">{c.id}</span>
              <div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t space-y-4">
        <h2 className="text-2xl font-bold">The Threat Landscape</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
          <p>
            As digital adoption accelerates across Africa — driven by mobile money, neobanks, and e-commerce — so does the sophistication of cyber threats. Attackers impersonate local brands users trust most.
          </p>
          <p>
            African Cyber Shield provides security analysts and everyday users with a fast, transparent tool to triage suspicious links before they cause harm. By highlighting specific anomalies mapped to OWASP categories, we empower users to understand <em>why</em> a link is dangerous.
          </p>
        </div>
      </div>
    </div>
  );
}
