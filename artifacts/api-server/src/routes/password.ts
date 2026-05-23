import { Router } from "express";
import { checkPassword } from "../lib/password-checker";
import { CheckPasswordBody } from "@workspace/api-zod";

const router = Router();

router.post("/password/check", (req, res) => {
  const parsed = CheckPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const result = checkPassword(parsed.data.password);
  res.json(result);
});

export default router;
