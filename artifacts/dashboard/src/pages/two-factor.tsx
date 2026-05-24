import {
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock,
  MessageSquare,
  QrCode,
  Fingerprint,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Platform {
  name: string;
  category: "bank" | "telco" | "app";
  country: string;
  twoFAType: string[];
  steps: string[];
  tip?: string;
}

const PLATFORMS: Platform[] = [
  {
    name: "Safaricom M-PESA",
    category: "telco",
    country: "Kenya",
    twoFAType: ["PIN", "Biometric"],
    steps: [
      "Open the M-PESA app on your phone.",
      "Go to Settings → Security.",
      "Enable 'Fingerprint Login' or 'Face ID' if your device supports it.",
      "Set a strong 4–6 digit PIN — avoid birthdays or repeating digits.",
      "Enable 'Transaction Confirmation' so every payment requires PIN entry.",
    ],
    tip: "Never share your M-PESA PIN over the phone. Safaricom staff will never ask for it.",
  },
  {
    name: "MTN MoMo",
    category: "telco",
    country: "Ghana / Uganda / Nigeria",
    twoFAType: ["PIN", "SMS OTP"],
    steps: [
      "Open the MTN MoMo app.",
      "Navigate to Profile → Security Settings.",
      "Enable 'Two-Step Verification' under the security section.",
      "Choose SMS OTP — a one-time code sent to your registered number for each login.",
      "Set a strong wallet PIN separate from your phone PIN.",
    ],
    tip: "Register only your own SIM card. SIM-swap fraud is the most common attack on MoMo accounts.",
  },
  {
    name: "Airtel Money",
    category: "telco",
    country: "Kenya / Uganda / Rwanda",
    twoFAType: ["PIN", "SMS OTP"],
    steps: [
      "Dial *185# or open the Airtel Money app.",
      "Go to My Account → Change PIN to set a unique wallet PIN.",
      "For the app: go to Settings → Enable Login OTP.",
      "Each login will send a one-time code to your registered number.",
      "Enable transaction alerts under Notifications.",
    ],
    tip: "Use a PIN that is completely different from your phone's screen lock.",
  },
  {
    name: "KCB Mobile Banking",
    category: "bank",
    country: "Kenya",
    twoFAType: ["SMS OTP", "Biometric"],
    steps: [
      "Download and open the KCB Mobile Banking app.",
      "Log in and go to Settings → Security.",
      "Enable 'Two-Factor Authentication' — you will receive OTPs via SMS.",
      "Optionally enable biometric login (fingerprint / face recognition).",
      "Ensure your registered phone number is up to date at your branch.",
    ],
    tip: "KCB will never send a link via SMS asking you to verify your account. All OTPs expire in 5 minutes.",
  },
  {
    name: "Equity Bank EazzyBanking",
    category: "bank",
    country: "Kenya / East Africa",
    twoFAType: ["SMS OTP", "USSD PIN"],
    steps: [
      "Open the Equity EazzyBanking app or visit equitybankgroup.com.",
      "Go to Settings → Enable Two-Factor Authentication.",
      "A one-time code will be sent to your registered mobile number on every login.",
      "Set a strong app PIN under Security → Change App PIN.",
      "Register your device — unregistered devices require additional verification.",
    ],
    tip: "Equity Bank uses device registration. Logging in from a new phone always triggers extra verification.",
  },
  {
    name: "GTBank (Guaranty Trust)",
    category: "bank",
    country: "Nigeria",
    twoFAType: ["Hardware Token", "SMS OTP", "Soft Token"],
    steps: [
      "Log into the GTBank internet banking portal or app.",
      "Go to Settings → Security → Token Management.",
      "Request a soft token — this generates a time-based OTP on your phone.",
      "Download the GTBank Token app from your app store.",
      "Every transaction above a threshold requires the token code.",
    ],
    tip: "GTBank soft tokens are time-based — they expire every 30 seconds. Keep your phone clock accurate.",
  },
  {
    name: "Zenith Bank",
    category: "bank",
    country: "Nigeria",
    twoFAType: ["Hardware Token", "SMS OTP"],
    steps: [
      "Visit any Zenith Bank branch to request a hardware token, or use the eaZyBanking app.",
      "Open the eaZyBanking app and go to Profile → Security.",
      "Enable 'Transaction OTP' — sent to your registered number for all transfers.",
      "Activate login 2FA under Security → Two-Step Login.",
      "Consider requesting a physical token for high-value accounts.",
    ],
    tip: "Hardware tokens are more secure than SMS OTPs because they can't be intercepted by SIM-swap attacks.",
  },
  {
    name: "First National Bank (FNB)",
    category: "bank",
    country: "South Africa",
    twoFAType: ["App Approval", "OTP"],
    steps: [
      "Open the FNB Banking app.",
      "Go to Menu → Settings → Security.",
      "Enable 'inContact' alerts so every transaction sends a push notification.",
      "Enable 'App Approval' — high-value payments require approval inside the app.",
      "Set a strong username and password for online banking — avoid reusing passwords.",
    ],
    tip: "FNB's app approval is stronger than SMS OTP — it can't be forwarded to a fraudster.",
  },
  {
    name: "Absa Bank",
    category: "bank",
    country: "South Africa / East Africa",
    twoFAType: ["SMS OTP", "App Notification"],
    steps: [
      "Log into Absa online banking or the Absa Banking app.",
      "Go to Settings → Security Preferences.",
      "Enable 'Authentication' — choose between SMS OTP and push notification.",
      "For the strongest protection, choose app push notification over SMS.",
      "Register the devices you trust — new devices will always require verification.",
    ],
    tip: "Always opt for push notification 2FA over SMS where available — SIM-swap fraud cannot intercept app push notifications.",
  },
  {
    name: "Standard Bank",
    category: "bank",
    country: "South Africa / Pan-Africa",
    twoFAType: ["SMS OTP", "App Approval", "Biometric"],
    steps: [
      "Open the Standard Bank app or visit standardbank.co.za.",
      "Go to Settings → Security → Two-Factor Authentication.",
      "Enable 'App Approval' — high-value payments prompt an in-app notification to approve or deny.",
      "Turn on biometric login under Security → Enable Fingerprint / Face ID.",
      "Ensure your mobile number on record is current — OTPs and alerts are sent there.",
    ],
    tip: "Standard Bank's 'App Approval' blocks most fraud — the fraudster would need physical access to your unlocked phone to approve a transaction.",
  },
  {
    name: "Capitec Bank",
    category: "bank",
    country: "South Africa",
    twoFAType: ["Remote PIN", "App Notification", "Biometric"],
    steps: [
      "Open the Capitec app and log in with your Remote PIN.",
      "Go to Menu → Settings → Security.",
      "Enable 'Biometric Login' (fingerprint or face) for faster, safer access.",
      "Turn on 'Transaction Notifications' to receive instant push alerts for every transaction.",
      "Set a unique Remote PIN — different from your ATM PIN and phone screen lock.",
    ],
    tip: "Capitec's Remote PIN is your second factor. Never share it, even with someone claiming to be Capitec — they will never ask for it.",
  },
  {
    name: "Nedbank",
    category: "bank",
    country: "South Africa",
    twoFAType: ["Approve-It", "SMS OTP"],
    steps: [
      "Download the Nedbank Money app and complete registration.",
      "Go to Settings → Security → Enable Approve-It.",
      "Approve-It sends a push notification to your phone for every online banking action.",
      "For SMS fallback, go to Settings → Security → Enable OTP Authentication.",
      "Register your device — a new device always triggers a full re-verification.",
    ],
    tip: "Nedbank's 'Approve-It' is end-to-end encrypted and cannot be intercepted by SIM-swap. Always prefer it over SMS OTP.",
  },
  {
    name: "Access Bank",
    category: "bank",
    country: "Nigeria / Pan-Africa",
    twoFAType: ["SMS OTP", "Soft Token", "USSD PIN"],
    steps: [
      "Log into Access Bank internet banking at accessbankplc.com or via the AccessMore app.",
      "Go to Settings → Security → Token Management.",
      "Request a soft token — the Access Bank Token app generates a 6-digit TOTP every 30 seconds.",
      "Download the Access Bank Token app from your app store and link it to your account.",
      "Enable transaction OTP under Security → Transaction Authentication.",
    ],
    tip: "The soft token is offline and cannot be intercepted. It is far safer than SMS OTP for high-value transfers.",
  },
  {
    name: "Ecobank",
    category: "bank",
    country: "Pan-Africa (33 countries)",
    twoFAType: ["SMS OTP", "App PIN", "Biometric"],
    steps: [
      "Download the Ecobank Mobile App and complete registration.",
      "Log in and go to Settings → Security → Two-Step Verification.",
      "Enable SMS OTP — a one-time code is sent to your registered number on every login.",
      "For biometric: go to Settings → Enable Fingerprint or Face ID.",
      "Set a unique app PIN — avoid using the same PIN as your physical bank card.",
    ],
    tip: "Ecobank operates across 33 African countries. If you travel, ensure your registered phone number works internationally — or update it before you travel.",
  },
  {
    name: "UBA (United Bank for Africa)",
    category: "bank",
    country: "Nigeria / Pan-Africa (20+ countries)",
    twoFAType: ["SMS OTP", "App Notification"],
    steps: [
      "Open the UBA Mobile Banking app or log into ubagroup.com.",
      "Navigate to Settings → Security → Two-Factor Authentication.",
      "Enable 'Transaction OTP' — a code is sent to your registered number for every transfer.",
      "Enable push notification alerts under Notifications → All Transactions.",
      "Update your registered phone number at any UBA branch if it has changed.",
    ],
    tip: "UBA phishing pages are among the most commonly faked in Nigeria. Always verify you are on ubagroup.com before entering credentials — check the padlock and the exact URL.",
  },
  {
    name: "Orange Money",
    category: "telco",
    country: "West & Central Africa",
    twoFAType: ["PIN", "SMS OTP"],
    steps: [
      "Dial the Orange Money USSD code for your country (e.g. *144# in Senegal, *126# in Mali).",
      "Go to My Account → Change Secret Code to set a strong 4-digit PIN.",
      "Open the Orange Money app and go to Settings → Security.",
      "Enable 'Transaction Confirmation' — every payment will require your PIN.",
      "Enable SMS alerts so every transaction sends a confirmation to your number.",
    ],
    tip: "Do not use your phone number digits, birth year, or repeating digits (e.g. 1111) as your PIN. These are the first guesses attackers try.",
  },
];

const AUTHENTICATOR_APPS = [
  {
    name: "Google Authenticator",
    description: "Free, works offline, generates time-based codes every 30 seconds.",
    platform: "Android & iOS",
    best_for: "General use",
  },
  {
    name: "Microsoft Authenticator",
    description: "Free, includes password manager, supports push approval for Microsoft accounts.",
    platform: "Android & iOS",
    best_for: "Microsoft / Office 365 users",
  },
  {
    name: "Authy",
    description: "Free, encrypted cloud backup, multi-device sync — great for Africa where phone replacements are common.",
    platform: "Android, iOS & Desktop",
    best_for: "Users who switch phones frequently",
  },
  {
    name: "2FAS Auth",
    description: "Open source, no account required, optional cloud backup.",
    platform: "Android & iOS",
    best_for: "Privacy-conscious users",
  },
];

const twoFATypes = [
  {
    icon: MessageSquare,
    label: "SMS OTP",
    description: "A one-time code sent to your phone by text message. Convenient but vulnerable to SIM-swap attacks.",
    strength: "Medium",
    color: "text-yellow-600",
  },
  {
    icon: QrCode,
    label: "Authenticator App",
    description: "An app generates a 6-digit code that changes every 30 seconds. Works offline and is not affected by SIM-swap.",
    strength: "Strong",
    color: "text-green-600",
  },
  {
    icon: Fingerprint,
    label: "Biometric",
    description: "Fingerprint or face recognition used as a second factor. Tied to your device and very fast.",
    strength: "Strong",
    color: "text-green-600",
  },
  {
    icon: Lock,
    label: "Hardware Token",
    description: "A physical device (like a key fob) that generates codes. The most secure option for high-value accounts.",
    strength: "Very Strong",
    color: "text-blue-600",
  },
];

function categoryColor(cat: Platform["category"]) {
  if (cat === "bank") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  if (cat === "telco") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
}

function PlatformCard({ platform }: { platform: Platform }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="border-2 shadow-sm">
      <button
        className="w-full text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-base">{platform.name}</CardTitle>
              <CardDescription className="text-xs">{platform.country}</CardDescription>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor(platform.category)}`}>
                {platform.category === "bank" ? "Bank" : platform.category === "telco" ? "Telco/Mobile Money" : "App"}
              </span>
              {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {platform.twoFAType.map((t) => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        </CardHeader>
      </button>
      {open && (
        <CardContent className="pt-0 pb-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">How to enable 2FA</p>
            <ol className="space-y-1.5">
              {platform.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="font-bold text-primary shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          {platform.tip && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{platform.tip}</span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function TwoFactorPage() {
  const [filter, setFilter] = useState<"all" | "bank" | "telco">("all");

  const filtered = PLATFORMS.filter((p) => filter === "all" || p.category === filter);

  return (
    <div className="flex-1 p-6 space-y-6 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Smartphone className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">2FA Setup Guide</h1>
          <p className="text-sm text-muted-foreground">
            How to enable two-factor authentication on popular African banks and mobile money platforms.
          </p>
        </div>
      </div>

      {/* What is 2FA */}
      <Card className="border-2 shadow-sm bg-primary/5 border-primary/20">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-sm">What is Two-Factor Authentication (2FA)?</p>
              <p className="text-sm text-muted-foreground">
                2FA adds a second layer of protection beyond your password. Even if a fraudster steals your
                password, they still cannot access your account without the second factor — a code from your
                phone, a fingerprint, or a hardware token.
              </p>
              <p className="text-sm text-muted-foreground">
                In Africa, mobile money fraud and bank account takeovers are among the most common cybercrimes.
                Enabling 2FA on your accounts is the single most effective step you can take.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Types of 2FA */}
      <div>
        <h2 className="text-base font-semibold mb-3">Types of 2FA — Strongest to Weakest</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {twoFATypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.label} className="border-2 shadow-sm">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${type.color}`} />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{type.label}</p>
                        <span className={`text-xs font-medium ${type.color}`}>{type.strength}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Authenticator Apps */}
      <div>
        <h2 className="text-base font-semibold mb-3">Recommended Authenticator Apps</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {AUTHENTICATOR_APPS.map((app) => (
            <Card key={app.name} className="border-2 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <p className="font-semibold text-sm">{app.name}</p>
                </div>
                <p className="text-xs text-muted-foreground ml-6 mb-1">{app.description}</p>
                <div className="flex gap-2 ml-6 flex-wrap">
                  <Badge variant="secondary" className="text-xs">{app.platform}</Badge>
                  <Badge variant="outline" className="text-xs">Best for: {app.best_for}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Platform Guides */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Step-by-Step Platform Guides</h2>
          <div className="flex gap-1">
            {(["all", "bank", "telco"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f === "all" ? "All" : f === "bank" ? "Banks" : "Telco / Mobile Money"}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Click any platform to expand the step-by-step guide.
        </p>
        <div className="space-y-3">
          {filtered.map((platform) => (
            <PlatformCard key={platform.name} platform={platform} />
          ))}
        </div>
      </div>

      {/* SIM Swap Warning */}
      <Card className="border-2 shadow-sm border-red-200 dark:border-red-800">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-sm text-red-700 dark:text-red-400">Watch Out: SIM-Swap Fraud</p>
              <p className="text-sm text-muted-foreground">
                SIM-swap is the most dangerous attack on SMS-based 2FA in Africa. Fraudsters trick your mobile
                operator into transferring your number to a SIM they control, giving them access to all your SMS OTPs.
              </p>
              <ul className="text-sm text-muted-foreground list-disc ml-4 space-y-0.5 mt-1">
                <li>Ask your operator to add a "SIM-swap block" or "port-out freeze" to your number.</li>
                <li>Use an authenticator app instead of SMS 2FA wherever possible.</li>
                <li>If your phone suddenly loses signal, contact your operator immediately.</li>
                <li>Register a secondary contact number or email with your bank for alerts.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
