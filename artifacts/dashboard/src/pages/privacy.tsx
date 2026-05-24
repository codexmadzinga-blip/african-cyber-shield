import { Eye, Shield } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPage() {
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-6 md:p-10 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Eye className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: May 2026</p>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-foreground/80 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">1. Information We Collect</h2>
          <p>When you use African Cyber Shield, we may collect the following types of information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>URLs you submit</strong> for scanning — stored temporarily for result delivery and service analytics</li>
            <li><strong>Scan results and history</strong> — stored in our database to power the Scan History feature</li>
            <li><strong>Account information</strong> — if you log in, we store your name, email, and profile image as provided by the authentication provider</li>
            <li><strong>Usage data</strong> — aggregate, anonymous usage patterns to improve the Service</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To deliver scan results and maintain your scan history</li>
            <li>To improve the accuracy of our phishing detection algorithms</li>
            <li>To enforce usage limits and prevent abuse</li>
            <li>To communicate service updates (only if you have opted in)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">3. Data We Do NOT Collect</h2>
          <p>We are committed to minimal data collection. We do <strong>not</strong>:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Store the passwords you enter in the Password Checker — they are analyzed in memory and discarded</li>
            <li>Sell, rent, or share your personal data with third parties for marketing purposes</li>
            <li>Track your browsing behaviour outside of this application</li>
            <li>Use cookies for advertising or cross-site tracking</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">4. Data Storage and Security</h2>
          <p>Your data is stored in a PostgreSQL database with encrypted connections. We apply industry-standard security practices including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>HTTPS/TLS for all data in transit</li>
            <li>Encrypted session tokens stored in httpOnly, secure cookies</li>
            <li>Regular security reviews of our infrastructure</li>
          </ul>
          <p>However, no system is 100% secure. We encourage you not to submit URLs containing sensitive personal information.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">5. Authentication</h2>
          <p>If you choose to log in, authentication is handled via a secure OpenID Connect (OIDC) provider. We receive only your basic profile information (name, email, profile picture). We do not have access to your authentication provider password.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">6. Data Retention</h2>
          <p>Scan history records are retained for up to 12 months and then automatically deleted. Account data is retained for as long as your account is active. You may request deletion of your data at any time by contacting us.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">7. Your Rights</h2>
          <p>Under applicable privacy laws (including GDPR and Africa's emerging data protection frameworks), you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
          </ul>
          <p>To exercise these rights, please contact us via the <Link href="/contact"><span className="text-primary underline cursor-pointer">Contact page</span></Link>.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">8. Changes to This Policy</h2>
          <p>We may update this policy from time to time. When we do, we will revise the "last updated" date at the top of this page. Continued use of the Service after such changes constitutes your acceptance of the revised policy.</p>
        </section>

        <div className="flex items-center gap-2 pt-4 border-t text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          African Cyber Shield — Your privacy matters to us.
        </div>
      </div>
    </div>
  );
}
