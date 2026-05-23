import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  useGetHistory, 
  useGetHistoryStats, 
  useDeleteScan, 
  getGetHistoryQueryKey, 
  getGetHistoryStatsQueryKey 
} from "@workspace/api-client-react";
import { 
  History as HistoryIcon, 
  Trash2, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  AlertTriangle,
  Activity,
  AlertOctagon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function HistoryPage() {
  const [riskLevel, setRiskLevel] = useState<string>("ALL");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: stats, isLoading: statsLoading } = useGetHistoryStats({
    query: { queryKey: getGetHistoryStatsQueryKey() }
  });

  const queryParams = riskLevel === "ALL" ? {} : { riskLevel };
  const { data: historyData, isLoading: historyLoading } = useGetHistory(
    queryParams,
    { query: { queryKey: getGetHistoryQueryKey(queryParams) } }
  );

  const deleteScan = useDeleteScan();

  const handleDelete = (id: number) => {
    deleteScan.mutate({ id }, {
      onSuccess: () => {
        toast({
          title: "Scan deleted",
          description: "The scan record has been removed.",
        });
        queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetHistoryStatsQueryKey() });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete scan record.",
          variant: "destructive"
        });
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return "text-emerald-500 font-bold";
    if (score < 55) return "text-amber-500 font-bold";
    if (score < 75) return "text-orange-500 font-bold";
    return "text-red-500 font-bold";
  };

  const getRiskBadgeClasses = (level: string) => {
    switch (level) {
      case "LOW": return "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900 dark:text-emerald-400";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900 dark:text-yellow-400";
      case "HIGH": return "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900 dark:text-orange-400";
      case "CRITICAL": return "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <HistoryIcon className="h-8 w-8 text-primary" />
          Scan History
        </h1>
        <p className="text-muted-foreground text-lg">
          View and manage previous URL analysis results.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4" /> Total Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{stats?.total ?? 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-2 shadow-sm border-emerald-200 dark:border-emerald-900/50 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Safe
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-500">{stats?.safe ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-yellow-200 dark:border-yellow-900/50 bg-yellow-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Suspicious
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-500">{stats?.suspicious ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-orange-200 dark:border-orange-900/50 bg-orange-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Likely Phishing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold text-orange-700 dark:text-orange-500">{stats?.likelyPhishing ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-red-200 dark:border-red-900/50 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
              <AlertOctagon className="h-4 w-4" /> Phishing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold text-red-700 dark:text-red-500">{stats?.phishing ?? 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-sm flex flex-col">
        <CardHeader className="pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">Recent Analyses</CardTitle>
            <CardDescription>
              {historyData?.total ?? 0} results found
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={riskLevel} onValueChange={setRiskLevel}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Risk Levels</SelectItem>
                <SelectItem value="LOW">Low Risk</SelectItem>
                <SelectItem value="MEDIUM">Medium Risk</SelectItem>
                <SelectItem value="HIGH">High Risk</SelectItem>
                <SelectItem value="CRITICAL">Critical Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[30%]">URL</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : historyData?.scans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No scan history found.
                  </TableCell>
                </TableRow>
              ) : (
                historyData?.scans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-mono text-sm max-w-[200px] truncate" title={scan.url}>
                      {scan.url}
                    </TableCell>
                    <TableCell className="font-medium">
                      {scan.verdict}
                    </TableCell>
                    <TableCell>
                      <span className={getScoreColor(scan.score)}>{scan.score}</span>/100
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border ${getRiskBadgeClasses(scan.riskLevel)}`}>
                        {scan.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(scan.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        disabled={deleteScan.isPending}
                        onClick={() => handleDelete(scan.id)}
                        data-testid={`button-delete-scan-${scan.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
