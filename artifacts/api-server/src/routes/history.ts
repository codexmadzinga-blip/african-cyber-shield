import { Router } from "express";
import { db, scansTable } from "@workspace/db";
import { desc, eq, sql, count, avg } from "drizzle-orm";

const router = Router();

router.get("/history/stats", async (req, res) => {
  try {
    const rows = await db
      .select({
        total: count(),
        avgScore: avg(scansTable.score),
      })
      .from(scansTable);

    const byVerdict = await db
      .select({ verdict: scansTable.verdict, cnt: count() })
      .from(scansTable)
      .groupBy(scansTable.verdict);

    const verdictMap: Record<string, number> = {};
    for (const row of byVerdict) {
      verdictMap[row.verdict] = Number(row.cnt);
    }

    res.json({
      total: Number(rows[0]?.total ?? 0),
      safe: verdictMap["Likely Safe"] ?? 0,
      suspicious: verdictMap["Suspicious"] ?? 0,
      likelyPhishing: verdictMap["Likely Phishing"] ?? 0,
      phishing: verdictMap["Phishing"] ?? 0,
      avgScore: Math.round(Number(rows[0]?.avgScore ?? 0)),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get history stats");
    res.status(500).json({ error: "Failed to retrieve stats" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query["limit"] ?? 50), 100);
    const riskLevel = req.query["riskLevel"] as string | undefined;

    const query = db
      .select()
      .from(scansTable)
      .orderBy(desc(scansTable.createdAt))
      .limit(limit);

    const scans = riskLevel
      ? await db
          .select()
          .from(scansTable)
          .where(eq(scansTable.riskLevel, riskLevel))
          .orderBy(desc(scansTable.createdAt))
          .limit(limit)
      : await query;

    const [{ total }] = await db
      .select({ total: count() })
      .from(scansTable);

    res.json({ scans, total: Number(total) });
  } catch (err) {
    req.log.error({ err }, "Failed to get history");
    res.status(500).json({ error: "Failed to retrieve history" });
  }
});

router.delete("/history/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  try {
    const deleted = await db
      .delete(scansTable)
      .where(eq(scansTable.id, id))
      .returning();
    if (deleted.length === 0) {
      res.status(404).json({ error: "Scan not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete scan");
    res.status(500).json({ error: "Failed to delete scan" });
  }
});

export default router;
