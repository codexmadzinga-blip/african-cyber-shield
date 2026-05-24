import { useState } from "react";
import { useAnalyzeUrl } from "@workspace/api-client-react";
import { Shield, Search, AlertTriangle, CheckCircle, Info, Link as LinkIcon, AlertOctagon, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [urlInput, setUrlInput] = useState("");
  const analyzeMutation = useAnalyzeUrl();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    // Auto-prepend http if not present
    let finalUrl = urlInput.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    analyzeMutation.mutate({ data: { url: finalUrl } });
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "LOW": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-200 dark:border-emerald-900";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 border-yellow-200 dark:border-yellow-900";
      case "HIGH": return "bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 border-orange-200 dark:border-orange-900";
      case "CRITICAL": return "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border-red-200 dark:border-red-900";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return "text-emerald-500";
    if (score < 55) return "text-yellow-500";
    if (score < 75) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreProgressColor = (score: number) => {
    if (score < 30) return "bg-emerald-500";
    if (score < 55) return "bg-yellow-500";
    if (score < 75) return "bg-orange-500";
    return "bg-red-500";
  };

  const result = analyzeMutation.data;
  const isPending = analyzeMutation.isPending;

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">URL Analyzer</h1>
        <p className="text-muted-foreground text-lg">
          Analyze suspicious links with our heuristic detection engine.
        </p>
      </div>

      <Card className="border-2 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Paste URL here (e.g. secure-login-update.com)"
                className="pl-10 h-14 text-lg bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary focus-visible:ring-2 font-mono"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                data-testid="input-url"
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="h-14 px-8 text-base font-semibold shadow-md"
              disabled={isPending || !urlInput.trim()}
              data-testid="button-analyze"
            >
              {isPending ? (
                <>
                  <Search className="mr-2 h-5 w-5 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Analyze
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isPending && (
        <Card className="border-2 animate-pulse bg-muted/20">
          <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <Shield className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-semibold">Running Security Heuristics</h3>
              <p className="text-muted-foreground">Checking domain entropy, path anomalies, and string distances...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isPending && result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both delay-100">
          
          <Card className="md:col-span-1 border-2 shadow-sm flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center py-6">
              <div className="relative flex items-center justify-center w-40 h-40 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-muted"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                  />
                  <circle
                    className={getScoreProgressColor(result.score)}
                    strokeWidth="12"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * result.score) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className={`text-4xl font-bold tracking-tighter ${getScoreColor(result.score)}`}>
                    {result.score}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">
                    Score
                  </span>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <Badge variant="outline" className={`px-4 py-1.5 text-sm font-bold border-2 ${getRiskColor(result.riskLevel)}`}>
                  {result.riskLevel} RISK
                </Badge>
                <h3 className="text-xl font-bold">{result.verdict}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-2 shadow-sm flex flex-col">
            <CardHeader className="pb-4 border-b">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-lg">Analysis Details</CardTitle>
                <CardDescription className="font-mono text-xs break-all text-foreground mt-2 bg-muted p-2 rounded-md">
                  {result.url}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertOctagon className="h-4 w-4" />
                    Detection Flags
                  </h4>
                  
                  {result.flags.length > 0 ? (
                    <ul className="space-y-3">
                      {result.flags.map((flag, i) => (
                        <li 
                          key={i} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50 animate-in fade-in slide-in-from-right-4 duration-300 fill-mode-both"
                          style={{ animationDelay: `${150 + i * 50}ms` }}
                        >
                          <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                          <span className="text-sm font-medium leading-tight">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-200 dark:border-emerald-900/50">
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">No suspicious indicators detected during analysis.</span>
                    </div>
                  )}
                </div>

                {result.owaspCategories && result.owaspCategories.length > 0 && (
                  <div className="pt-6 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      OWASP Top 10 Categories Detected
                    </h4>
                    <div className="space-y-2">
                      {result.owaspCategories.map((cat) => (
                        <div key={cat.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
                          <span className="font-mono text-xs font-bold text-primary shrink-0 mt-0.5 w-16">{cat.id}</span>
                          <div>
                            <p className="text-sm font-semibold">{cat.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{cat.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.details && Object.keys(result.details).length > 0 && (
                  <div className="pt-6 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Metadata
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(result.details).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <p className="text-xs text-muted-foreground font-mono">{key}</p>
                          <p className="text-sm font-semibold truncate" title={String(value)}>{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
