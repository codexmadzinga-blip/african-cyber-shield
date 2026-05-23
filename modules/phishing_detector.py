"""
phishing_detector.py
====================
Heuristic-based phishing URL detector for the African Cyber Shield project.

Usage:
    from modules.phishing_detector import PhishingDetector

    detector = PhishingDetector()
    result = detector.analyze("http://paypa1-secure-login.com/verify")
    print(result)
"""

import re
import math
import ipaddress
from urllib.parse import urlparse, parse_qs
from dataclasses import dataclass, field
from typing import Optional


SUSPICIOUS_KEYWORDS = [
    "login", "signin", "sign-in", "verify", "verification", "secure", "security",
    "update", "confirm", "account", "banking", "password", "credential",
    "wallet", "payment", "paypal", "mpesa", "mtn", "airtel", "fnb", "absa",
    "nedbank", "capitec", "standard-bank", "zanaco", "equity", "kcb",
    "access-bank", "gtbank", "zenith", "alert", "suspended", "limited",
    "unlock", "recover", "urgent", "winner", "prize", "congratulation",
    "free", "bonus", "reward", "gift", "click", "ebay", "amazon",
    "microsoft", "apple", "google", "netflix", "dhl", "fedex",
]

TRUSTED_TLDS = {
    ".com", ".org", ".net", ".edu", ".gov", ".co.za", ".co.ke", ".com.gh",
    ".com.ng", ".co.tz", ".co.ug", ".co.zm", ".co.zw", ".com.et",
}

SUSPICIOUS_TLDS = {
    ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".club", ".click",
    ".download", ".stream", ".accountant", ".loan", ".party", ".review",
    ".trade", ".date", ".racing", ".win", ".webcam", ".faith",
}

URL_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "short.link",
    "buff.ly", "rebrand.ly", "is.gd", "v.gd", "cutt.ly", "shorturl.at",
}


@dataclass
class DetectionResult:
    url: str
    score: int
    verdict: str
    risk_level: str
    flags: list[str] = field(default_factory=list)
    details: dict = field(default_factory=dict)

    def __str__(self) -> str:
        lines = [
            f"URL       : {self.url}",
            f"Verdict   : {self.verdict}",
            f"Risk Level: {self.risk_level}",
            f"Score     : {self.score}/100",
            f"Flags     :",
        ]
        for flag in self.flags:
            lines.append(f"  - {flag}")
        return "\n".join(lines)


class PhishingDetector:
    """
    Analyses a URL using heuristic rules and returns a DetectionResult.

    Scoring:
        0-29   → Safe
        30-54  → Suspicious
        55-74  → Likely Phishing
        75+    → Phishing
    """

    def analyze(self, url: str) -> DetectionResult:
        url = url.strip()
        flags: list[str] = []
        score = 0
        details: dict = {}

        parsed = self._safe_parse(url)
        if parsed is None:
            return DetectionResult(
                url=url,
                score=100,
                verdict="Invalid URL",
                risk_level="Unknown",
                flags=["Could not parse URL"],
            )

        scheme = parsed.scheme.lower()
        hostname = (parsed.hostname or "").lower()
        path = parsed.path.lower()
        query = parsed.query.lower()
        full_url = url.lower()

        score, flags = self._check_scheme(scheme, score, flags)
        score, flags = self._check_ip_address(hostname, score, flags)
        score, flags = self._check_hostname(hostname, score, flags)
        score, flags = self._check_url_length(url, score, flags, details)
        score, flags = self._check_special_chars(url, hostname, score, flags, details)
        score, flags = self._check_suspicious_keywords(full_url, score, flags)
        score, flags = self._check_path_and_query(path, query, score, flags)
        score, flags = self._check_entropy(hostname, score, flags, details)
        score, flags = self._check_shortener(hostname, score, flags)
        score, flags = self._check_tld(hostname, score, flags)

        score = min(score, 100)
        verdict, risk_level = self._verdict(score)

        return DetectionResult(
            url=url,
            score=score,
            verdict=verdict,
            risk_level=risk_level,
            flags=flags,
            details=details,
        )

    def batch_analyze(self, urls: list[str]) -> list[DetectionResult]:
        return [self.analyze(url) for url in urls]

    def is_phishing(self, url: str) -> bool:
        return self.analyze(url).score >= 55

    def _safe_parse(self, url: str) -> Optional[object]:
        try:
            if not re.match(r"^[a-zA-Z][a-zA-Z\d+\-.]*://", url):
                url = "http://" + url
            parsed = urlparse(url)
            if not parsed.hostname:
                return None
            return parsed
        except Exception:
            return None

    def _check_scheme(self, scheme, score, flags):
        if scheme == "http":
            score += 10
            flags.append("Uses plain HTTP instead of HTTPS")
        elif scheme not in ("http", "https", "ftp"):
            score += 15
            flags.append(f"Unusual URL scheme: {scheme!r}")
        return score, flags

    def _check_ip_address(self, hostname, score, flags):
        try:
            ipaddress.ip_address(hostname)
            score += 25
            flags.append("URL uses a raw IP address instead of a domain name")
        except ValueError:
            pass
        return score, flags

    def _check_hostname(self, hostname, score, flags):
        subdomain_count = hostname.count(".")
        if subdomain_count >= 3:
            score += 10
            flags.append(f"Excessive subdomain depth ({subdomain_count} dots in hostname)")

        if len(hostname) > 50:
            score += 8
            flags.append(f"Unusually long hostname ({len(hostname)} chars)")

        if re.search(r"\d{4,}", hostname):
            score += 5
            flags.append("Hostname contains long numeric sequence")

        if re.search(r"(-){2,}", hostname):
            score += 5
            flags.append("Hostname contains repeated hyphens")

        return score, flags

    def _check_url_length(self, url, score, flags, details):
        length = len(url)
        details["url_length"] = length
        if length > 100:
            score += 5
            flags.append(f"Long URL ({length} characters)")
        if length > 150:
            score += 5
            flags.append("Very long URL — common obfuscation technique")
        return score, flags

    def _check_special_chars(self, url, hostname, score, flags, details):
        at_count = url.count("@")
        details["at_count"] = at_count
        if at_count > 0:
            score += 20
            flags.append("URL contains '@' — can be used to mask the real destination")

        double_slash = url.count("//") - 1
        if double_slash > 0:
            score += 10
            flags.append("URL contains extra '//' — potential redirect obfuscation")

        dash_count = hostname.count("-")
        details["dash_count"] = dash_count
        if dash_count >= 3:
            score += 8
            flags.append(f"Hostname has {dash_count} hyphens — common in spoofed domains")

        dot_count = url.count(".")
        details["dot_count"] = dot_count
        if dot_count >= 6:
            score += 5
            flags.append(f"High dot count ({dot_count}) — possible subdomain stacking")

        hex_encoded = len(re.findall(r"%[0-9a-fA-F]{2}", url))
        if hex_encoded > 4:
            score += 8
            flags.append(f"Heavy hex encoding in URL ({hex_encoded} sequences)")

        return score, flags

    def _check_suspicious_keywords(self, full_url, score, flags):
        found = [kw for kw in SUSPICIOUS_KEYWORDS if kw in full_url]
        if found:
            hit_score = min(len(found) * 5, 20)
            score += hit_score
            flags.append(f"Suspicious keywords found: {', '.join(found[:5])}")
        return score, flags

    def _check_path_and_query(self, path, query, score, flags):
        sensitive_extensions = re.findall(
            r"\.(php|html|htm|asp|aspx|exe|js|cgi|pl)\b", path
        )
        if sensitive_extensions:
            score += 5
            flags.append(f"Path targets executable/template file: {sensitive_extensions[0]}")

        if "login" in path or "signin" in path or "verify" in path:
            score += 8
            flags.append("Path suggests a login or verification page")

        if len(query) > 80:
            score += 5
            flags.append("Unusually long query string — may contain encoded payloads")

        redirect_params = re.search(
            r"(redirect|url|next|goto|return|redir|target)=", query
        )
        if redirect_params:
            score += 10
            flags.append("Query string contains redirect parameter — possible open redirect")

        return score, flags

    def _check_entropy(self, hostname, score, flags, details):
        label = hostname.split(".")[0] if hostname else ""
        if len(label) < 4:
            return score, flags
        entropy = self._shannon_entropy(label)
        details["hostname_entropy"] = round(entropy, 3)
        if entropy > 3.8:
            score += 10
            flags.append(
                f"High entropy in hostname label ({entropy:.2f}) — looks randomly generated"
            )
        return score, flags

    def _check_shortener(self, hostname, score, flags):
        if hostname in URL_SHORTENERS:
            score += 15
            flags.append(f"Known URL shortener ({hostname}) — destination is hidden")
        return score, flags

    def _check_tld(self, hostname, score, flags):
        for tld in SUSPICIOUS_TLDS:
            if hostname.endswith(tld):
                score += 12
                flags.append(f"Uses a high-abuse TLD: {tld}")
                break
        return score, flags

    @staticmethod
    def _shannon_entropy(text: str) -> float:
        if not text:
            return 0.0
        freq = {}
        for ch in text:
            freq[ch] = freq.get(ch, 0) + 1
        n = len(text)
        return -sum((c / n) * math.log2(c / n) for c in freq.values())

    @staticmethod
    def _verdict(score: int) -> tuple[str, str]:
        if score >= 75:
            return "Phishing", "CRITICAL"
        elif score >= 55:
            return "Likely Phishing", "HIGH"
        elif score >= 30:
            return "Suspicious", "MEDIUM"
        else:
            return "Likely Safe", "LOW"


if __name__ == "__main__":
    test_urls = [
        "https://www.google.com",
        "http://paypa1-secure-login.verify-account.com/signin.php",
        "http://192.168.1.1/login",
        "https://bit.ly/3xAb12q",
        "https://secure-absa-update.tk/verify?redirect=http://evil.com",
        "http://xn--mtn-mncaisse-0kb.com/wallet/login",
        "https://github.com/codexmadzinga-blip/african-cyber-shield",
        "http://amaz0n-account-suspended.win/confirm.php?user=victim@email.com",
        "https://equity-bank.co.ke/online-banking",
    ]

    detector = PhishingDetector()
    print("=" * 60)
    print("  African Cyber Shield — Phishing URL Detector")
    print("=" * 60)

    for url in test_urls:
        result = detector.analyze(url)
        print(f"\n{result}")
        print("-" * 60)
