import { useState } from "react";
import { useAnalyzeUrlBatch } from "@workspace/api-client-react";
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function Batch() {
  const [urlsInput, setUrlsInput] = useState("");
  const batchMutation = useAnalyzeUrlBatch();
  const { toast } = useToast();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const rawUrls = urlsInput.split('\n').map(u => u.trim()).filter(Boolean);
    
    if (rawUrls.length === 0) return;
    if (rawUrls.length > 20) {
      toast({
        title: "Limit exceeded",
        description: "Batch scanner supports a maximum of 20 URLs per request.",
        variant: "destructive"
      });
      return;
    }

    const cleanedUrls = rawUrls.map(url => {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
      }
      return url;
    });

    batchMutation.mutate({ data: { urls: cleanedUrls } });
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

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "LOW": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "MEDIUM": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "HIGH": return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "CRITICAL": return <ShieldAlert className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const results = batchMutation.data;
  const isPending = batchMutation.isPending;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Batch Scanner</h1>
        <p className="text-muted-foreground text-lg">
          Analyze up to 20 URLs simultaneously for phishing indicators.
        </p>
      </div>

      <Card className="border-2 shadow-sm">
        <CardHeader>
          <CardTitle>Input URLs</CardTitle>
          <CardDescription>Enter one URL per line</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <Textarea
              placeholder="https://example.com&#10;secure-update-login.net&#10;auth.billing-support.org"
              className="min-h-[200px] font-mono text-sm bg-muted/30 focus-visible:ring-primary focus-visible:ring-2"
              value={urlsInput}
              onChange={(e) => setUrlsInput(e.target.value)}
              data-testid="input-batch-urls"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">
                {urlsInput.split('\n').map(u => u.trim()).filter(Boolean).length} / 20 URLs
              </span>
              <Button 
                type="submit" 
                size="lg" 
                className="px-8 shadow-md"
                disabled={isPending || urlsInput.trim() === ""}
                data-testid="button-batch-analyze"
              >
                {isPending ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-pulse" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Scan Batch
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {results && results.length > 0 && (
        <Card className="border-2 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[300px]">URL</TableHead>
                    <TableHead className="w-[120px]">Risk</TableHead>
                    <TableHead className="w-[100px] text-right">Score</TableHead>
                    <TableHead>Verdict & Flags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, i) => (
                    <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs break-all">
                        {result.url}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`px-2 py-0.5 border ${getRiskColor(result.riskLevel)}`}>
                          <span className="flex items-center gap-1.5 font-bold">
                            {getRiskIcon(result.riskLevel)}
                            {result.riskLevel}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-base font-mono">
                        {result.score}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <span className="font-bold text-sm block">{result.verdict}</span>
                          {result.flags.length > 0 && (
                            <span className="text-xs text-muted-foreground block line-clamp-2" title={result.flags.join(", ")}>
                              {result.flags.length} flag{result.flags.length > 1 ? 's' : ''}: {result.flags.join(", ")}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
