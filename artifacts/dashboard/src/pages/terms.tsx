import { Scale, Shield } from "lucide-react";
import { Link } from "wouter";

export default function TermsPage() {
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-6 md:p-10 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Scale className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: May 2026</p>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-foreground/80 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using African Cyber Shield ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">2. Description of Service</h2>
          <p>African Cyber Shield provides cybersecurity tools including a phishing URL scanner, password strength checker, and two-factor authentication guides. The Service is designed to assist users in identifying potential online threats and improving their digital security posture.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">3. Disclaimer of Warranties</h2>
          <p>The Service is provided "as is" without warranties of any kind. African Cyber Shield does not guarantee that any URL flagged as safe is actually safe, or that any URL flagged as malicious is definitively malicious. Our heuristic engine provides a risk assessment only — it is not a substitute for professional cybersecurity advice.</p>
          <p>Always exercise caution with unknown links regardless of the scan result.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">4. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, African Cyber Shield shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service, including but not limited to damages resulting from reliance on scan results.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">5. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Conduct denial-of-service attacks or overload our scanning infrastructure</li>
            <li>Submit URLs for the purpose of probing our detection systems</li>
            <li>Use automated tools to scrape or abuse the API without permission</li>
            <li>Attempt to reverse-engineer the detection algorithms</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">6. Privacy</h2>
          <p>Your use of the Service is also governed by our <Link href="/privacy"><span className="text-primary underline cursor-pointer">Privacy Policy</span></Link>. URLs you submit for scanning may be stored temporarily for service improvement purposes. We do not sell your data.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">7. Intellectual Property</h2>
          <p>All content, algorithms, and software comprising African Cyber Shield are the property of the Service operators. You may not copy, reproduce, or distribute any part of the Service without written permission.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">8. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms. We will update the "last updated" date at the top of this page.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">9. Contact</h2>
          <p>For questions about these terms, please visit our <Link href="/contact"><span className="text-primary underline cursor-pointer">Contact page</span></Link>.</p>
        </section>

        <div className="flex items-center gap-2 pt-4 border-t text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          African Cyber Shield — Protecting Africa's Digital Future
        </div>
      </div>
    </div>
  );
}
