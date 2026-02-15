
export interface FraudAnalysisResult {
    score: number;
    riskLevel: "Low" | "Medium" | "High" | "Critical";
    flags: string[];
    firDraft?: string;
}

export function analyzeFraudText(text: string): FraudAnalysisResult {
    const lowerText = text.toLowerCase();
    let score = 0;
    const flags: string[] = [];

    // 1. Text Pattern Analysis
    const patterns = [
        // Authority Terms (50 points)
        { word: "cbi", weight: 50, category: "Authority", flag: "Claims to be CBI/Police" },
        { word: "police", weight: 50, category: "Authority", flag: "Mentions Police involvement" },
        { word: "narcotics", weight: 50, category: "Authority", flag: "Mentions Narcotics/Drugs" },
        { word: "court", weight: 50, category: "Authority", flag: "Mentions Court/Legal Action" },
        { word: "rbi", weight: 50, category: "Authority", flag: "Claims to be RBI" },
        { word: "customs", weight: 50, category: "Authority", flag: "Mentions Customs officials" },
        { word: "arrest", weight: 50, category: "Authority", flag: "Threatens Arrest" },

        // Financial Pressure (40 points)
        { word: "transfer", weight: 40, category: "Financial", flag: "Requests money transfer" },
        { word: "fee", weight: 40, category: "Financial", flag: "Demands processing fee" },
        { word: "deposit", weight: 40, category: "Financial", flag: "Asks for deposit" },
        { word: "pay", weight: 40, category: "Financial", flag: "Demands payment" },
        { word: "refundable", weight: 40, category: "Financial", flag: "Claims amount is refundable" },
        { word: "fine", weight: 40, category: "Financial", flag: "Demands fine payment" },
        { word: "account", weight: 30, category: "Financial", flag: "Asks for account details" },

        // Phishing Triggers (30 points)
        { word: "kyc", weight: 30, category: "Phishing", flag: "KYC related phishing" },
        { word: "blocked", weight: 30, category: "Phishing", flag: "Threatens to block account" },
        { word: "lottery", weight: 30, category: "Phishing", flag: "Lottery/Prize scam" },
        { word: "won", weight: 30, category: "Phishing", flag: "Claims you won a prize" },
        { word: "expired", weight: 30, category: "Phishing", flag: "Urgency: Claiming expiry" },
        { word: "urgent", weight: 20, category: "Phishing", flag: "Creates urgency" },
        { word: "otp", weight: 40, category: "Phishing", flag: "Asks for OTP" }, // OTP is very high risk
    ];

    let hasAuthority = false;
    let hasFinancial = false;

    patterns.forEach((pattern) => {
        // Use word boundary to avoid partial matches (e.g. "fee" in "coffee")
        const regex = new RegExp(`\\b${pattern.word}\\b`, 'i');
        if (regex.test(text)) {
            score += pattern.weight;
            flags.push(pattern.flag);

            if (pattern.category === "Authority") hasAuthority = true;
            if (pattern.category === "Financial") hasFinancial = true;
        }
    });

    // 2. URL Analysis
    // Regex to find URLs
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    const hasUrl = urlRegex.test(lowerText);

    if (hasUrl) {
        if (lowerText.includes("bank") || lowerText.includes("update") || lowerText.includes("verify") || lowerText.includes("kyc")) {
            score += 40;
            flags.push("Suspicious link with sensitive keywords");
        } else {
            score += 20;
            flags.push("Contains external link");
        }
    }

    // 3. Logic: Critical Combinations
    // If Authority AND Financial are present (e.g., "Police" says "Pay"), it's almost certainly a "Digital Arrest" scam.
    if (hasAuthority && hasFinancial) {
        score = Math.max(score, 95);
        flags.push("CRITICAL: Authority demanding payment (Digital Arrest Pattern)");
    }

    // 4. Cap Score
    score = Math.min(Math.max(score, 0), 100);

    // 5. Determine Risk Level
    let riskLevel: FraudAnalysisResult["riskLevel"] = "Low";
    if (score > 80) riskLevel = "Critical";
    else if (score > 50) riskLevel = "High";
    else if (score > 20) riskLevel = "Medium";

    // 6. Generate FIR Draft
    let firDraft = undefined;
    if (score > 40) {
        const date = new Date().toLocaleString();
        firDraft = `
**FIRST INFORMATION REPORT (DRAFT)**
**To:** The Station House Officer,
Cyber Crime Police Station, [Your City]

**Subject:** Complaint regarding suspected ${hasAuthority ? "Impersonation/Digital Arrest" : "Financial/Phishing"} Fraud.

**Respected Sir/Madam,**

I am writing to report a fraud attempt received on ${date}.

**Details:**
1. **Message Content:** "${text.substring(0, 200)}..."
2. **Red Flags Identified:** ${flags.join(", ")}
3. **Suspected Technique:** ${hasAuthority && hasFinancial ? "Digital Arrest / Impersonation of Officials" : "Phishing / Financial Fraud"}

The sender used threatening/enticing language ("${patterns.find(p => lowerText.includes(p.word))?.word || 'suspicious terms'}") to manipulate me. I have NOT shared money or OTPs.

I request you to register my complaint and take action against this number/source.

**Sincerely,**
[Your Name]
        `.trim();
    }

    // Remove duplicate flags
    const uniqueFlags = Array.from(new Set(flags));

    return {
        score,
        riskLevel,
        flags: uniqueFlags,
        firDraft,
    };
}

/**
 * AI-powered analysis using Google Gemini, with keyword-based fallback.
 */
export async function analyzeWithAI(text: string): Promise<FraudAnalysisResult> {
    // If no API key, use keyword engine directly
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not set — using keyword-based analysis.");
        return analyzeFraudText(text);
    }

    try {
        const { analyzeWithGemini } = await import("./gemini");
        return await analyzeWithGemini(text);
    } catch (error) {
        console.error("Gemini API failed, falling back to keyword engine:", error);
        return analyzeFraudText(text);
    }
}

