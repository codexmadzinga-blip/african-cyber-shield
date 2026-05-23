"""
password_checker.py — Password Strength Analyzer
Part of the African Cyber Shield toolkit.

Evaluates password strength across 10 checks and returns a
0–100 score with an overall grade, specific feedback, and
suggestions for improvement.
"""

import re
import math
from typing import TypedDict


class PasswordResult(TypedDict):
    password_length: int
    score: int
    grade: str
    strength: str
    checks: dict[str, bool]
    feedback: list[str]
    suggestions: list[str]
    entropy: float
    time_to_crack: str


# Common passwords list (Africa-relevant + global top offenders)
COMMON_PASSWORDS = {
    "password", "password1", "123456", "12345678", "qwerty", "abc123",
    "111111", "monkey", "dragon", "master", "letmein", "login", "admin",
    "welcome", "hello", "sunshine", "princess", "football", "shadow",
    "superman", "michael", "jessica", "passw0rd", "iloveyou", "trustno1",
    # Africa-common
    "nigeria", "kenya", "ghana", "uganda", "africa", "nairobi", "lagos",
    "accra", "kampala", "harare", "lusaka", "abuja", "dakar", "pretoria",
    "johannesburg", "capetown", "mombasa", "ibadan", "kigali", "addisababa",
    "safaricom", "mtn2024", "airtel", "vodacom", "kcb123", "equity1",
    "zenith1", "gtbank1", "stanbic1", "absa1234", "nedbank1",
    # Generic weak
    "test", "test123", "user", "user123", "guest", "changeme", "default",
    "secret", "pass", "password123", "admin123", "root", "toor",
}

# Keyboard walk patterns
KEYBOARD_WALKS = [
    "qwerty", "qwertyuiop", "asdfgh", "asdfghjkl", "zxcvbn",
    "1qaz", "2wsx", "3edc", "qazwsx", "qweasd",
    "123456789", "987654321", "abcdefg", "zyxwvut",
]

# Repeated character patterns
REPEATED_PATTERN = re.compile(r"(.)\1{2,}")
SEQUENTIAL_DIGITS = re.compile(r"(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)")
SEQUENTIAL_ALPHA = re.compile(r"(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)", re.IGNORECASE)


def _calculate_entropy(password: str) -> float:
    """Calculate Shannon entropy of the password."""
    charset_size = 0
    if re.search(r"[a-z]", password):
        charset_size += 26
    if re.search(r"[A-Z]", password):
        charset_size += 26
    if re.search(r"\d", password):
        charset_size += 10
    if re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?`~]", password):
        charset_size += 32
    if charset_size == 0:
        return 0.0
    return len(password) * math.log2(charset_size)


def _estimate_crack_time(entropy: float) -> str:
    """Estimate time to crack assuming 10 billion guesses/sec (GPU cluster)."""
    guesses_per_second = 1e10
    combinations = 2 ** entropy
    seconds = combinations / guesses_per_second

    if seconds < 1:
        return "less than a second"
    elif seconds < 60:
        return f"{int(seconds)} seconds"
    elif seconds < 3600:
        return f"{int(seconds / 60)} minutes"
    elif seconds < 86400:
        return f"{int(seconds / 3600)} hours"
    elif seconds < 2_592_000:
        return f"{int(seconds / 86400)} days"
    elif seconds < 31_536_000:
        return f"{int(seconds / 2_592_000)} months"
    elif seconds < 3_153_600_000:
        return f"{int(seconds / 31_536_000)} years"
    else:
        return "centuries"


def check_password(password: str) -> PasswordResult:
    """
    Analyze a password and return a detailed strength report.
    Score 0–100. Grade: F / D / C / B / A / A+
    """
    score = 0
    feedback: list[str] = []
    suggestions: list[str] = []

    checks: dict[str, bool] = {
        "length_8":        len(password) >= 8,
        "length_12":       len(password) >= 12,
        "has_uppercase":   bool(re.search(r"[A-Z]", password)),
        "has_lowercase":   bool(re.search(r"[a-z]", password)),
        "has_digit":       bool(re.search(r"\d", password)),
        "has_special":     bool(re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?`~]", password)),
        "no_common":       password.lower() not in COMMON_PASSWORDS,
        "no_repeated":     not bool(REPEATED_PATTERN.search(password)),
        "no_sequential":   not (
                               bool(SEQUENTIAL_DIGITS.search(password)) or
                               bool(SEQUENTIAL_ALPHA.search(password))
                           ),
        "no_keyboard_walk": not any(walk in password.lower() for walk in KEYBOARD_WALKS),
    }

    # --- Scoring ---
    if checks["length_8"]:
        score += 10
    else:
        feedback.append("Password is too short (minimum 8 characters)")
        suggestions.append("Use at least 8 characters; 12 or more is strongly recommended")

    if checks["length_12"]:
        score += 15
    else:
        suggestions.append("Increase length to 12+ characters for much stronger protection")

    # Bonus for very long passwords
    if len(password) >= 16:
        score += 10

    if checks["has_uppercase"]:
        score += 10
    else:
        feedback.append("No uppercase letters found")
        suggestions.append("Add uppercase letters (A–Z)")

    if checks["has_lowercase"]:
        score += 10
    else:
        feedback.append("No lowercase letters found")
        suggestions.append("Add lowercase letters (a–z)")

    if checks["has_digit"]:
        score += 10
    else:
        feedback.append("No numbers found")
        suggestions.append("Include at least one number (0–9)")

    if checks["has_special"]:
        score += 15
    else:
        feedback.append("No special characters found")
        suggestions.append("Add special characters like !, @, #, $, % for a big boost")

    if not checks["no_common"]:
        score -= 30
        feedback.append("This is a very commonly used password and can be cracked instantly")
        suggestions.append("Choose a password that is not on any common-password list")

    if not checks["no_repeated"]:
        score -= 10
        feedback.append("Password contains repeated characters (e.g. 'aaa')")
        suggestions.append("Avoid repeating the same character three or more times in a row")

    if not checks["no_sequential"]:
        score -= 10
        feedback.append("Password contains sequential characters (e.g. '123' or 'abc')")
        suggestions.append("Avoid predictable sequences like 123, abc, or qwerty")

    if not checks["no_keyboard_walk"]:
        score -= 10
        feedback.append("Password follows a keyboard pattern (e.g. 'qwerty')")
        suggestions.append("Avoid keyboard walk patterns — they are trivial for attackers")

    score = max(0, min(100, score))

    if score >= 90:
        grade = "A+"
        strength = "Very Strong"
    elif score >= 75:
        grade = "A"
        strength = "Strong"
    elif score >= 60:
        grade = "B"
        strength = "Moderate"
    elif score >= 40:
        grade = "C"
        strength = "Weak"
    elif score >= 20:
        grade = "D"
        strength = "Very Weak"
    else:
        grade = "F"
        strength = "Critically Weak"

    entropy = _calculate_entropy(password)
    time_to_crack = _estimate_crack_time(entropy)

    return PasswordResult(
        password_length=len(password),
        score=score,
        grade=grade,
        strength=strength,
        checks=checks,
        feedback=feedback,
        suggestions=suggestions,
        entropy=round(entropy, 2),
        time_to_crack=time_to_crack,
    )


if __name__ == "__main__":
    test_passwords = [
        "password",
        "Kenya2024",
        "Tr0ub4dor&3",
        "correct-horse-battery-staple",
        "P@ssw0rd!",
        "x",
        "Qwerty123!",
        "M0mb@sa#Shield2024!",
    ]
    for pw in test_passwords:
        result = check_password(pw)
        print(f"\n[{result['grade']}] {result['strength']} (score: {result['score']}) — '{pw}'")
        print(f"  Entropy: {result['entropy']} bits | Crack time: {result['time_to_crack']}")
        if result["feedback"]:
            for f in result["feedback"]:
                print(f"  ! {f}")
