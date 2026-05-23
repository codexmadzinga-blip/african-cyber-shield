import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Target, Zap, Activity } from "lucide-react";

export default function About() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
          <Shield className="h-4 w-4" />
          African Cyber Shield
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Defending the African Web.
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl">
          A purpose-built heuristic engine designed to detect and intercept phishing campaigns targeting African tech ecosystems, financial institutions, and everyday users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <Card className="border-2 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <Target className="h-8 w-8 text-primary mb-3" />
            <CardTitle>Heuristic Scoring</CardTitle>
            <CardDescription>How we calculate risk</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-card-foreground/80 space-y-3 leading-relaxed">
            <p>
              We don't rely solely on static blocklists. Our engine analyzes the structural and lexical properties of every URL in real-time. 
            </p>
            <p>
              A score is calculated on a 0-100 scale, combining multiple weighted flags. A higher score indicates a higher probability of malicious intent.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mb-3" />
            <CardTitle>Detection Flags</CardTitle>
            <CardDescription>What we look for</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-card-foreground/80 space-y-3 leading-relaxed">
            <p>
              We extract multiple indicators of compromise (IoCs):
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Excessive domain entropy and suspicious character sets</li>
              <li>Brand impersonation via typosquatting</li>
              <li>Unusual path depth or obfuscated parameters</li>
              <li>Suspicious top-level domains (TLDs)</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="pt-8 border-t space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          The Threat Landscape
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none text-muted-foreground">
          <p>
            As digital adoption accelerates across the continent, so does the sophistication of cyber threats. Attackers continuously adapt, moving away from easily identifiable malware to socially engineered phishing attacks. 
          </p>
          <p>
            The African Cyber Shield aims to provide security analysts and users with a fast, reliable tool to triage suspicious links before they cause harm. By highlighting specific anomalies—rather than just returning a binary safe/unsafe result—we empower users to understand <em>why</em> a link is dangerous.
          </p>
        </div>
      </div>
      
    </div>
  );
}
