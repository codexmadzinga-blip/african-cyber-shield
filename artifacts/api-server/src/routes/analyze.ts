import { Router } from "express";
import { analyzeUrl, analyzeUrls } from "../lib/phishing-detector";
import { AnalyzeUrlBody, AnalyzeUrlBatchBody } from "@workspace/api-zod";

const router = Router();

router.post("/analyze", (req, res) => {
  const parsed = AnalyzeUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const result = analyzeUrl(parsed.data.url);
  res.json(result);
});

router.post("/analyze/batch", (req, res) => {
  const parsed = AnalyzeUrlBatchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const results = analyzeUrls(parsed.data.urls);
  res.json(results);
});

export default router;
