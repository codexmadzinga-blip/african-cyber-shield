import { useState } from "react";
import { Mail, Github, Linkedin, MessageSquare, Shield, Send, Bug, Lightbulb, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const GITHUB_REPO = "https://github.com/codexmadzinga-blip/african-cyber-shield";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    const body = `**From:** ${name} (${email})\n\n**Subject:** ${subject || "(no subject)"}\n\n---\n\n${message}`;
    const issueUrl = `${GITHUB_REPO}/issues/new?title=${encodeURIComponent(subject || "Contact: " + name)}&body=${encodeURIComponent(body)}&labels=contact`;
    window.open(issueUrl, "_blank");
    toast({
      title: "Opening GitHub Issues…",
      description: "Your message is pre-filled — just click 'Submit new issue' to send it.",
    });
    setName(""); setEmail(""); setSubject(""); setMessage("");
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-6 md:p-10 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-sm text-muted-foreground">
            We read every message. Typical response within 48 hours.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <a
          href={`${GITHUB_REPO}/issues/new?labels=bug&template=bug_report.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="border-2 shadow-sm hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3">
                <Bug className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm flex items-center gap-1">
                    Report a Bug <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Something not working? Open a bug report on GitHub Issues.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>

        <a
          href={`${GITHUB_REPO}/issues/new?labels=enhancement&template=feature_request.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="border-2 shadow-sm hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm flex items-center gap-1">
                    Suggest a Feature <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Missing a bank or platform? Suggest it on GitHub.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Contact form */}
      <Card className="border-2 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Send a Message</CardTitle>
          <CardDescription>
            General enquiries, partnerships, or media requests. This opens a pre-filled GitHub Issue — no account needed if you sign in with GitHub.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
                <Input
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="e.g. Partnership enquiry, media request, general question"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Message <span className="text-destructive">*</span></label>
              <textarea
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                placeholder="Tell us how we can help…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto flex items-center gap-2">
              <Send className="h-4 w-4" />
              Open GitHub Issue
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* GitHub */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Source Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
            >
              <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                <Github className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium flex items-center gap-1">
                  GitHub <ExternalLink className="h-3 w-3" />
                </p>
                <p className="text-muted-foreground text-xs">codexmadzinga-blip/african-cyber-shield</p>
              </div>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
            >
              <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                <Linkedin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium flex items-center gap-1">
                  LinkedIn <ExternalLink className="h-3 w-3" />
                </p>
                <p className="text-muted-foreground text-xs">Connect professionally</p>
              </div>
            </a>
          </CardContent>
        </Card>

        {/* Email */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Direct Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="mailto:hello@africancybershield.dev"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
            >
              <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">General Enquiries</p>
                <p className="text-muted-foreground text-xs">hello@africancybershield.dev</p>
              </div>
            </a>
            <a
              href="mailto:security@africancybershield.dev"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
            >
              <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Security Disclosures</p>
                <p className="text-muted-foreground text-xs">security@africancybershield.dev</p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Responsible disclosure */}
      <Card className="border-2 shadow-sm border-primary/20 bg-primary/5">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Responsible Disclosure Policy</p>
              <p className="text-sm text-muted-foreground mt-1">
                Found a vulnerability in African Cyber Shield? Please report it responsibly — do not post it publicly before we've had a chance to patch it. Email{" "}
                <a href="mailto:security@africancybershield.dev" className="text-primary underline font-medium">
                  security@africancybershield.dev
                </a>{" "}
                with a description of the issue and steps to reproduce. We acknowledge all reports within 48 hours and aim to patch critical issues within 7 days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
