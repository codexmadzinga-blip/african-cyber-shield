import { useState } from "react";
import { useCheckPassword } from "@workspace/api-client-react";
import type { PasswordResult } from "@workspace/api-client-react";
import {
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Lightbulb,
  Lock,
  Clock,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const CHECK_LABELS: Record<string, string> = {
  length_8:         "At least 8 characters",
  length_12:        "At least 12 characters",
  has_uppercase:    "Contains uppercase letters",
  has_lowercase:    "Contains lowercase letters",
  has_digit:        "Contains numbers",
  has_special:      "Contains special characters",
  no_common:        "Not a common password",
  no_repeated:      "No repeated characters (aaa)",
  no_sequential:    "No sequential patterns (123, abc)",
  no_keyboard_walk: "No keyboard walk patterns (qwerty)",
};

function gradeColor(grade: string) {
  if (grade === "A+" || grade === "A") return "text-green-600";
  if (grade === "B") return "text-blue-600";
  if (grade === "C") return "text-yellow-600";
  if (grade === "D") return "text-orange-600";
  return "text-red-600";
}

function strengthBadgeVariant(strength: string): "default" | "secondary" | "destructive" | "outline" {
  if (strength === "Very Strong" || strength === "Strong") return "default";
  if (strength === "Moderate") return "secondary";
  return "destructive";
}

function progressColor(score: number) {
  if (score >= 75) return "bg-green-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-yellow-500";
  if (score >= 20) return "bg-orange-500";
  return "bg-red-500";
}

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<PasswordResult | null>(null);
  const { toast } = useToast();

  const checkPassword = useCheckPassword();

  const handleCheck = () => {
    if (!password.trim()) {
      toast({ title: "Enter a password", description: "Type a password above to analyze it." });
      return;
    }
    checkPassword.mutate(
      { data: { password } },
      {
        onSuccess: (data) => setResult(data),
        onError: () =>
          toast({ title: "Error", description: "Failed to check password. Please try again.", variant: "destructive" }),
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheck();
  };

  const passedChecks = result
    ? Object.values(result.checks).filter(Boolean).length
    : 0;
  const totalChecks = Object.keys(CHECK_LABELS).length;

  return (
    <div className="flex-1 p-6 space-y-6 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <KeyRound className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Password Checker</h1>
          <p className="text-sm text-muted-foreground">
            Test how strong your password is across 10 security criteria.
          </p>
        </div>
      </div>

      {/* Input Card */}
      <Card className="border-2 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Enter a Password</CardTitle>
          <CardDescription>
            Your password is sent only to our local API — nothing is stored or logged.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Type a password to analyze..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-10 font-mono"
                autoComplete="off"
                data-testid="input-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              onClick={handleCheck}
              disabled={checkPassword.isPending || !password.trim()}
              data-testid="button-check-password"
            >
              {checkPassword.isPending ? "Checking…" : "Check"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Score Overview */}
          <Card className="border-2 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className={`text-5xl font-black tabular-nums ${gradeColor(result.grade)}`}>
                    {result.grade}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{result.strength}</div>
                    <Badge variant={strengthBadgeVariant(result.strength)} className="mt-1">
                      Score: {result.score} / 100
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-4 w-4" />
                    <span>{result.passwordLength} chars</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4" />
                    <span>{result.entropy} bits entropy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Cracks in {result.timeToCrack}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Strength</span>
                  <span>{passedChecks}/{totalChecks} checks passed</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressColor(result.score)}`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Security Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {(Object.entries(result.checks) as [string, boolean][]).map(([key, passed]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${
                      passed
                        ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-300"
                        : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-800 dark:text-red-300"
                    }`}
                  >
                    {passed ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                    )}
                    <span>{CHECK_LABELS[key] ?? key}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          {result.feedback.length > 0 && (
            <Card className="border-2 shadow-sm border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <ShieldAlert className="h-4 w-4" />
                  Issues Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.feedback.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-orange-800 dark:text-orange-300">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <Card className="border-2 shadow-sm border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Lightbulb className="h-4 w-4" />
                  How to Improve
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.suggestions.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300">
                    <span className="font-bold shrink-0">{i + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* All clear */}
          {result.feedback.length === 0 && result.score >= 75 && (
            <Card className="border-2 shadow-sm border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                  <ShieldCheck className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Great password!</p>
                    <p className="text-sm text-muted-foreground">
                      This password passes all security checks. Keep it safe and don't reuse it elsewhere.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
