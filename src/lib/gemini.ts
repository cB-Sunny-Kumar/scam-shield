import { GoogleGenerativeAI } from "@google/generative-ai";
import { FraudAnalysisResult } from "./fraud-engine";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are a fraud detection AI for India. Analyze the given text message (SMS, WhatsApp, Email) and determine if it is a scam or fraud attempt.

You MUST respond with ONLY valid JSON in this exact format, no markdown, no code fences:
{
  "score": <number 0-100>,
  "riskLevel": "<Low|Medium|High|Critical>",
  "flags": ["<red flag 1>", "<red flag 2>"],
  "firDraft": "<FIR draft string or null>"
}

Rules:
- score: 0 = completely safe, 100 = definitely a scam.
- riskLevel: Low (0-20), Medium (21-50), High (51-80), Critical (81-100).
- flags: List specific red flags detected (e.g. "Impersonates police officer", "Demands immediate payment", "Threatens arrest").
- firDraft: If score > 40, generate a formal First Information Report (FIR) draft addressed to the Cyber Crime Police Station. Include the message content, red flags, and suspected fraud technique. If score <= 40, set to null.

Common Indian scam patterns to watch for:
- Digital Arrest scams (fake CBI/Police/Customs/RBI officials)
- KYC update phishing
- Lottery/prize scams
- OTP theft
- Loan app harassment
- Fake job offers
- Investment/trading scams`;

export async function analyzeWithGemini(text: string): Promise<FraudAnalysisResult> {
    // 1. Explicit Key Check
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-api-key-here") {
        console.error("Gemini Error: Missing or placeholder API key in .env");
        throw new Error("MISSING_KEY");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: `Analyze this message for fraud:\n\n"${text}"` },
        ]);

        const response = result.response;
        const responseText = response.text();

        // Clean potential markdown code fences from response
        const cleaned = responseText
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/g, "")
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch (parseError) {
            console.error("[gemini.ts] JSON Parse Error. Raw response:", responseText);
            throw new Error("Invalid response format from AI");
        }

        // Validate and return
        return {
            score: Math.min(Math.max(Number(parsed.score) || 0, 0), 100),
            riskLevel: (["Low", "Medium", "High", "Critical"].includes(parsed.riskLevel)
                ? parsed.riskLevel
                : "Low") as FraudAnalysisResult["riskLevel"],
            flags: Array.isArray(parsed.flags) ? parsed.flags : [],
            firDraft: parsed.firDraft || undefined,
        };
    } catch (error) {
        // 2. Enhanced Error Logging
        console.error('Gemini Error:', error);

        if (error instanceof Error) {
            console.error("[gemini.ts] Analysis failed detail:", error.message);
        }

        // RE-THROW error so analyzeWithAI in fraud-engine.ts can catch it and use fallback
        throw error;
    }
}
