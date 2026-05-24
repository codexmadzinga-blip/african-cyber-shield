import { useState } from "react";
import { Mail, Github, Linkedin, MessageSquare, Shield, Send, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
    const mailto = `mailto:contact@africancybershield.com?subject=${encodeURIComponent(subject || "Contact from African Cyber Shield")}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.open(mailto, "_blank");
    toast({ title: "Opening your email client…", description: "Your message has been pre-filled and is ready to send." });
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
          <p className="text-sm text-muted-foreground">Get in touch with the African Cyber Shield team.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact form */}
        <Card className="border-2 shadow-sm md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Send a Message</CardTitle>
            <CardDescription>We typically respond within 24–48 hours on business days.</CardDescription>
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
                  placeholder="e.g. Partnership inquiry, bug report, feature request"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Message <span className="text-destructive">*</span></label>
                <textarea
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  placeholder="Tell us how we can help you…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Direct contact */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Direct Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="mailto:contact@africancybershield.com" className="flex items-center gap-3 text-sm hover:text-primary transition-colors group">
              <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground text-xs">contact@africancybershield.com</p>
              </div>
            </a>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-muted">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Based in Africa</p>
                <p className="text-muted-foreground text-xs">Serving the entire continent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social links */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Follow Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="https://github.com/codexmadzinga-blip/african-cyber-shield"
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
                <p className="text-muted-foreground text-xs">View the source code</p>
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
      </div>

      {/* Responsible disclosure */}
      <Card className="border-2 shadow-sm border-primary/20 bg-primary/5">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Security / Responsible Disclosure</p>
              <p className="text-sm text-muted-foreground mt-1">
                Found a vulnerability in African Cyber Shield? Please report it responsibly to{" "}
                <a href="mailto:security@africancybershield.com" className="text-primary underline">
                  security@africancybershield.com
                </a>. We commit to acknowledging reports within 48 hours.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
