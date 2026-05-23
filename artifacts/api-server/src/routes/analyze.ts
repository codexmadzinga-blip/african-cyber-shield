import { Router } from "express";
import { analyzeUrl, analyzeUrls } from "../lib/phishing-detector";
import { AnalyzeUrlBody, AnalyzeUrlBatchBody } from "@workspace/api-zod";
import { db, scansTable } from "@workspace/db";

const router = Router();

router.post("/analyze", async (req, res) => {
  const parsed = AnalyzeUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const result = analyzeUrl(parsed.data.url);
  try {
    await db.insert(scansTable).values({
      url: result.url,
      score: result.score,
      verdict: result.verdict,
      riskLevel: result.riskLevel,
      flags: result.flags,
      details: result.details,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to save scan to history");
  }
  res.json(result);
});

router.post("/analyze/batch", async (req, res) => {
  const parsed = AnalyzeUrlBatchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const results = analyzeUrls(parsed.data.urls);
  try {
    await db.insert(scansTable).values(
      results.map((r) => ({
        url: r.url,
        score: r.score,
        verdict: r.verdict,
        riskLevel: r.riskLevel,
        flags: r.flags,
        details: r.details,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to save batch scans to history");
  }
  res.json(results);
});

export default router;
