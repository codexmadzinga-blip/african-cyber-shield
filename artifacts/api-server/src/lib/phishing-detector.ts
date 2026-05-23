import { createHash } from "crypto";

const SUSPICIOUS_KEYWORDS = [
  "login", "signin", "sign-in", "verify", "verification", "secure", "security",
  "update", "confirm", "account", "banking", "password", "credential",
  "wallet", "payment", "paypal", "mpesa", "mtn", "airtel", "fnb", "absa",
  "nedbank", "capitec", "standard-bank", "zanaco", "equity", "kcb",
  "access-bank", "gtbank", "zenith", "alert", "suspended", "limited",
  "unlock", "recover", "urgent", "winner", "prize", "congratulation",
  "free", "bonus", "reward", "gift", "click", "ebay", "amazon",
  "microsoft", "apple", "google", "netflix", "dhl", "fedex",
];

const SUSPICIOUS_TLDS = new Set([
  ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".club", ".click",
  ".download", ".stream", ".accountant", ".loan", ".party", ".review",
  ".trade", ".date", ".racing", ".win", ".webcam", ".faith",
]);

const URL_SHORTENERS = new Set([
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "short.link",
  "buff.ly", "rebrand.ly", "is.gd", "v.gd", "cutt.ly", "shorturl.at",
]);

export interface AnalysisResult {
  url: string;
  score: number;
  verdict: string;
  riskLevel: string;
  flags: string[];
  details: Record<string, unknown>;
}

function safeParse(url: string): URL | null {
  try {
    if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url)) {
      url = "http://" + url;
    }
    return new URL(url);
  } catch {
    return null;
  }
}

function shannonEntropy(text: string): number {
  if (!text) return 0;
  const freq: Record<string, number> = {};
  for (const ch of text) freq[ch] = (freq[ch] ?? 0) + 1;
  const n = text.length;
  return -Object.values(freq).reduce((sum, c) => sum + (c / n) * Math.log2(c / n), 0);
}

function isIpAddress(hostname: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) ||
    /^\[?[0-9a-fA-F:]+\]?$/.test(hostname);
}

function verdict(score: number): { verdict: string; riskLevel: string } {
  if (score >= 75) return { verdict: "Phishing", riskLevel: "CRITICAL" };
  if (score >= 55) return { verdict: "Likely Phishing", riskLevel: "HIGH" };
  if (score >= 30) return { verdict: "Suspicious", riskLevel: "MEDIUM" };
  return { verdict: "Likely Safe", riskLevel: "LOW" };
}

export function analyzeUrl(rawUrl: string): AnalysisResult {
  const url = rawUrl.trim();
  const flags: string[] = [];
  const details: Record<string, unknown> = {};
  let score = 0;

  const parsed = safeParse(url);
  if (!parsed) {
    return { url, score: 100, verdict: "Invalid URL", riskLevel: "Unknown", flags: ["Could not parse URL"], details };
  }

  const scheme = parsed.protocol.replace(":", "").toLowerCase();
  const hostname = (parsed.hostname ?? "").toLowerCase();
  const path = parsed.pathname.toLowerCase();
  const query = parsed.search.toLowerCase();
  const fullUrl = url.toLowerCase();

  if (scheme === "http") {
    score += 10;
    flags.push("Uses plain HTTP instead of HTTPS");
  } else if (!["http", "https", "ftp"].includes(scheme)) {
    score += 15;
    flags.push(`Unusual URL scheme: "${scheme}"`);
  }

  if (isIpAddress(hostname)) {
    score += 25;
    flags.push("URL uses a raw IP address instead of a domain name");
  }

  const dotCount = hostname.split(".").length - 1;
  if (dotCount >= 3) {
    score += 10;
    flags.push(`Excessive subdomain depth (${dotCount} dots in hostname)`);
  }
  if (hostname.length > 50) {
    score += 8;
    flags.push(`Unusually long hostname (${hostname.length} chars)`);
  }
  if (/\d{4,}/.test(hostname)) {
    score += 5;
    flags.push("Hostname contains long numeric sequence");
  }
  if (/(-){2,}/.test(hostname)) {
    score += 5;
    flags.push("Hostname contains repeated hyphens");
  }

  const urlLength = url.length;
  details["url_length"] = urlLength;
  if (urlLength > 100) { score += 5; flags.push(`Long URL (${urlLength} characters)`); }
  if (urlLength > 150) { score += 5; flags.push("Very long URL — common obfuscation technique"); }

  const atCount = (url.match(/@/g) ?? []).length;
  details["at_count"] = atCount;
  if (atCount > 0) { score += 20; flags.push("URL contains '@' — can be used to mask the real destination"); }

  const extraSlashes = (url.match(/\/\//g) ?? []).length - 1;
  if (extraSlashes > 0) { score += 10; flags.push("URL contains extra '//' — potential redirect obfuscation"); }

  const dashCount = (hostname.match(/-/g) ?? []).length;
  details["dash_count"] = dashCount;
  if (dashCount >= 3) { score += 8; flags.push(`Hostname has ${dashCount} hyphens — common in spoofed domains`); }

  const urlDots = (url.match(/\./g) ?? []).length;
  details["dot_count"] = urlDots;
  if (urlDots >= 6) { score += 5; flags.push(`High dot count (${urlDots}) — possible subdomain stacking`); }

  const hexEncoded = (url.match(/%[0-9a-fA-F]{2}/g) ?? []).length;
  if (hexEncoded > 4) { score += 8; flags.push(`Heavy hex encoding in URL (${hexEncoded} sequences)`); }

  const foundKeywords = SUSPICIOUS_KEYWORDS.filter(kw => fullUrl.includes(kw));
  if (foundKeywords.length > 0) {
    score += Math.min(foundKeywords.length * 5, 20);
    flags.push(`Suspicious keywords found: ${foundKeywords.slice(0, 5).join(", ")}`);
  }

  const execExt = path.match(/\.(php|html|htm|asp|aspx|exe|js|cgi|pl)\b/);
  if (execExt) { score += 5; flags.push(`Path targets executable/template file: ${execExt[0]}`); }
  if (/\/(login|signin|verify)/.test(path)) { score += 8; flags.push("Path suggests a login or verification page"); }
  if (query.length > 80) { score += 5; flags.push("Unusually long query string — may contain encoded payloads"); }
  if (/(redirect|url|next|goto|return|redir|target)=/.test(query)) {
    score += 10;
    flags.push("Query string contains redirect parameter — possible open redirect");
  }

  const firstLabel = hostname.split(".")[0] ?? "";
  if (firstLabel.length >= 4) {
    const entropy = shannonEntropy(firstLabel);
    details["hostname_entropy"] = Math.round(entropy * 1000) / 1000;
    if (entropy > 3.8) {
      score += 10;
      flags.push(`High entropy in hostname label (${entropy.toFixed(2)}) — looks randomly generated`);
    }
  }

  if (URL_SHORTENERS.has(hostname)) {
    score += 15;
    flags.push(`Known URL shortener (${hostname}) — destination is hidden`);
  }

  for (const tld of SUSPICIOUS_TLDS) {
    if (hostname.endsWith(tld)) {
      score += 12;
      flags.push(`Uses a high-abuse TLD: ${tld}`);
      break;
    }
  }

  score = Math.min(score, 100);
  const { verdict: v, riskLevel } = verdict(score);
  return { url, score, verdict: v, riskLevel, flags, details };
}

export function analyzeUrls(urls: string[]): AnalysisResult[] {
  return urls.map(analyzeUrl);
}
