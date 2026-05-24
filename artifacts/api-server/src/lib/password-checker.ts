export interface PasswordChecks {
  length_8: boolean;
  length_12: boolean;
  has_uppercase: boolean;
  has_lowercase: boolean;
  has_digit: boolean;
  has_special: boolean;
  no_common: boolean;
  no_repeated: boolean;
  no_sequential: boolean;
  no_keyboard_walk: boolean;
}

export interface PasswordResult {
  passwordLength: number;
  score: number;
  grade: string;
  strength: string;
  checks: PasswordChecks;
  feedback: string[];
  suggestions: string[];
  entropy: number;
  timeToCrack: string;
}

const COMMON_PASSWORDS = new Set([
  // Universal weak passwords
  "password","password1","password123","pass","pass123","passw0rd",
  "123456","1234567","12345678","123456789","1234567890",
  "111111","222222","333333","000000","121212","696969",
  "qwerty","qwerty123","qwertyuiop","asdfgh","asdfghjkl","zxcvbn",
  "abc123","abc1234","abcd1234","iloveyou","letmein","welcome",
  "monkey","dragon","master","login","admin","admin123","admin1234",
  "hello","sunshine","princess","football","shadow","superman",
  "michael","jessica","trustno1","solo","baseball","batman",
  "root","toor","test","test123","user","user123","guest","changeme",
  "default","secret","temp","temp123","demo","demo123",

  // African cities & countries (standalone — too simple)
  "nigeria","kenya","ghana","uganda","africa","tanzania","ethiopia",
  "cameroon","senegal","zimbabwe","zambia","angola","mozambique",
  "rwanda","botswana","namibia","malawi","madagascar","niger",
  "nairobi","lagos","accra","kampala","harare","lusaka","abuja",
  "dakar","pretoria","johannesburg","capetown","mombasa","ibadan",
  "kigali","addisababa","cairo","casablanca","tunis","khartoum",
  "antananarivo","bamako","conakry","freetown","monrovia","lome",
  "cotonou","niamey","ndjamena","bangui","yaounde","libreville",

  // African country + year combos (extremely common in practice)
  "nigeria2023","nigeria2024","nigeria2025",
  "ghana2023","ghana2024","ghana2025",
  "kenya2023","kenya2024","kenya2025",
  "southafrica2024","sa2024","sa2025",
  "africa2023","africa2024","africa2025",
  "nairobi2024","lagos2024","accra2024",
  "zimbabwe2024","zambia2024","uganda2024",

  // Mobile money & telco brands
  "safaricom","safaricom1","safaricom123",
  "mpesa","mpesa123","mpesa2024","m-pesa","mpesa1234",
  "mtn","mtn123","mtn2024","mtn2025","mtnmomo","momomtn",
  "airtel","airtel1","airtel123","airtel2024","airtelmoney",
  "vodacom","vodacom1","vodacom123","vodacom2024",
  "glo","glo123","globacom","9mobile","etisalat",
  "orange","orangemoney","wave2024","tigo","tigo123",

  // African banks
  "kcb","kcb123","kcb1234","kcbbank","kcb2024",
  "equity","equity1","equity123","equitybank",
  "gtbank","gtbank1","gtbank123","guaranty1",
  "zenith","zenith1","zenith123","zenithbank",
  "firstbank","firstbank1","firstbank123",
  "accessbank","access123","accessbank1",
  "uba","uba123","uba2024","unitedbank",
  "stanbic","stanbic1","stanbic123",
  "absa","absa1","absa1234","absa2024",
  "nedbank","nedbank1","nedbank123",
  "fnb","fnb123","fnb2024","firstnational",
  "capitec","capitec1","capitec123","capitec2024",
  "ecobank","ecobank1","ecobank123",
  "coop","coopbank","cooperative1",

  // Common African names used as passwords
  "amara","amara123","amara2024",
  "kwame","kwame123","kwame2024",
  "chidi","chidi123","emeka","emeka123",
  "fatima","fatima1","fatima123",
  "aisha","aisha123","aisha2024",
  "blessing","blessing1","grace123",
  "patience","patience1","charity1",
  "joseph","joseph1","joseph123",
  "samuel","samuel1","samuel123",
  "david","david123","daniel123",
  "grace","grace1","mercy","mercy1",
  "tunde","tunde123","seun","seun123",
  "tendai","tendai1","chipo","chipo123",
  "zanele","zanele1","thabo","thabo123",

  // Sports teams popular in Africa
  "arsenal","arsenal1","arsenal123",
  "chelsea","chelsea1","chelsea123",
  "manchester","manutd","manutd123","manunited",
  "liverpool","liverpool1","liverpool123",
  "kaizer","kaizercheifs","sundowns","mamelodi",
  "supersport","supersport1","pirates","orlando",
  "enyimba","enyimba1","heartofoak","kotoko",
  "esperance","zamalek","ahly","alagola",

  // PIN-style weak passwords (common on mobile)
  "0000","1111","2222","3333","4444","5555","6666","7777","8888","9999",
  "1122","1212","1234","2580","1357","1470","2468","9876","7890",

  // Generic workplace/school passwords
  "company","company1","office","office123","work","work123",
  "school","school1","student","student1","staff","staff123",
  "intern","intern123","hr123","it123","security1",
]);

const KEYBOARD_WALKS = [
  "qwerty","qwertyuiop","asdfgh","asdfghjkl","zxcvbn",
  "1qaz","2wsx","3edc","qazwsx","qweasd",
  "123456789","987654321","abcdefg","zyxwvut",
];

function calculateEntropy(password: string): number {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/\d/.test(password)) charsetSize += 10;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) charsetSize += 32;
  if (charsetSize === 0) return 0;
  return password.length * Math.log2(charsetSize);
}

function estimateCrackTime(entropy: number): string {
  const guessesPerSecond = 1e10;
  const combinations = Math.pow(2, entropy);
  const seconds = combinations / guessesPerSecond;

  if (seconds < 1) return "less than a second";
  if (seconds < 60) return `${Math.floor(seconds)} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  if (seconds < 2_592_000) return `${Math.floor(seconds / 86400)} days`;
  if (seconds < 31_536_000) return `${Math.floor(seconds / 2_592_000)} months`;
  if (seconds < 3_153_600_000) return `${Math.floor(seconds / 31_536_000)} years`;
  return "centuries";
}

export function checkPassword(password: string): PasswordResult {
  let score = 0;
  const feedback: string[] = [];
  const suggestions: string[] = [];

  const lower = password.toLowerCase();

  const checks: PasswordChecks = {
    length_8: password.length >= 8,
    length_12: password.length >= 12,
    has_uppercase: /[A-Z]/.test(password),
    has_lowercase: /[a-z]/.test(password),
    has_digit: /\d/.test(password),
    has_special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password),
    no_common: !COMMON_PASSWORDS.has(lower),
    no_repeated: !(/(.)\1{2,}/.test(password)),
    no_sequential: !(
      /(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/.test(password) ||
      /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)
    ),
    no_keyboard_walk: !KEYBOARD_WALKS.some((walk) => lower.includes(walk)),
  };

  if (checks.length_8) {
    score += 10;
  } else {
    feedback.push("Password is too short (minimum 8 characters)");
    suggestions.push("Use at least 8 characters; 12 or more is strongly recommended");
  }
  if (checks.length_12) {
    score += 15;
  } else {
    suggestions.push("Increase length to 12+ characters for much stronger protection");
  }
  if (password.length >= 16) score += 10;

  if (checks.has_uppercase) {
    score += 10;
  } else {
    feedback.push("No uppercase letters found");
    suggestions.push("Add uppercase letters (A–Z)");
  }
  if (checks.has_lowercase) {
    score += 10;
  } else {
    feedback.push("No lowercase letters found");
    suggestions.push("Add lowercase letters (a–z)");
  }
  if (checks.has_digit) {
    score += 10;
  } else {
    feedback.push("No numbers found");
    suggestions.push("Include at least one number (0–9)");
  }
  if (checks.has_special) {
    score += 15;
  } else {
    feedback.push("No special characters found");
    suggestions.push("Add special characters like !, @, #, $, % for a big boost");
  }
  if (!checks.no_common) {
    score -= 30;
    feedback.push("This is a very commonly used password and can be cracked instantly");
    suggestions.push("Choose a password that is not on any common-password list");
  }
  if (!checks.no_repeated) {
    score -= 10;
    feedback.push("Password contains repeated characters (e.g. 'aaa')");
    suggestions.push("Avoid repeating the same character three or more times in a row");
  }
  if (!checks.no_sequential) {
    score -= 10;
    feedback.push("Password contains sequential characters (e.g. '123' or 'abc')");
    suggestions.push("Avoid predictable sequences like 123, abc, or qwerty");
  }
  if (!checks.no_keyboard_walk) {
    score -= 10;
    feedback.push("Password follows a keyboard pattern (e.g. 'qwerty')");
    suggestions.push("Avoid keyboard walk patterns — they are trivial for attackers");
  }

  score = Math.max(0, Math.min(100, score));

  let grade: string;
  let strength: string;
  if (score >= 90) { grade = "A+"; strength = "Very Strong"; }
  else if (score >= 75) { grade = "A"; strength = "Strong"; }
  else if (score >= 60) { grade = "B"; strength = "Moderate"; }
  else if (score >= 40) { grade = "C"; strength = "Weak"; }
  else if (score >= 20) { grade = "D"; strength = "Very Weak"; }
  else { grade = "F"; strength = "Critically Weak"; }

  const entropy = parseFloat(calculateEntropy(password).toFixed(2));
  const timeToCrack = estimateCrackTime(entropy);

  return {
    passwordLength: password.length,
    score,
    grade,
    strength,
    checks,
    feedback,
    suggestions,
    entropy,
    timeToCrack,
  };
}
