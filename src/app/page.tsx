"use client";

import { useState } from "react";
import { analyzeTextAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert, ShieldCheck, AlertTriangle, FileText, Send, Copy, AlertOctagon } from "lucide-react";
import { type FraudAnalysisResult } from "@/lib/fraud-engine";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FraudAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", input);
      const data = await analyzeTextAction(formData);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast here
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] flex flex-col items-center">
      <main className="w-full max-w-4xl flex flex-col gap-8 mt-8">

        {/* Input Section */}
        <section className="w-full">
          <Card className="border-primary/20 shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)]">
            <CardHeader>
              <CardTitle>Analyze Suspicious Text</CardTitle>
              <CardDescription>Paste the content of the WhatsApp message, Email, or SMS you received.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the suspicious text here..."
                className="min-h-[200px] text-base resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleAnalyze}
                className="w-full sm:w-auto gap-2"
                disabled={loading || !input}
                variant="neon"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Analyze for Fraud
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Results Section */}
        {result && (
          <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in transition-all duration-500">

            {/* Risk Score Card */}
            <Card className="md:col-span-2 overflow-hidden relative">
              <div className={`absolute top-0 left-0 w-full h-1 ${result.riskLevel === 'Critical' ? 'bg-red-500' :
                result.riskLevel === 'High' ? 'bg-orange-500' :
                  result.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">Risk Analysis</CardTitle>
                <Badge variant={
                  result.riskLevel === 'Critical' ? 'destructive' :
                    result.riskLevel === 'High' ? 'danger' :
                      result.riskLevel === 'Medium' ? 'warning' : 'safe'
                } className="text-sm px-3 py-1">
                  {result.riskLevel} Risk
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Scam Probability Score</span>
                        <span className="text-sm font-bold">{result.score}/100</span>
                      </div>
                      <Progress value={result.score} className="h-3" />
                    </div>
                    <div className={`p-4 rounded-full border-4 ${result.riskLevel === 'Critical' ? 'border-red-500 text-red-500 bg-red-500/10' :
                      result.riskLevel === 'High' ? 'border-orange-500 text-orange-500 bg-orange-500/10' :
                        result.riskLevel === 'Medium' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-green-500 text-green-500 bg-green-500/10'
                      }`}>
                      {result.riskLevel === 'Critical' || result.riskLevel === 'High' ? (
                        <AlertOctagon className="w-8 h-8" />
                      ) : result.riskLevel === 'Medium' ? (
                        <AlertTriangle className="w-8 h-8" />
                      ) : (
                        <ShieldCheck className="w-8 h-8" />
                      )}
                    </div>
                  </div>

                  {result.flags.length > 0 && (
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        Detected Red Flags:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.flags.map((flag, i) => (
                          <Badge key={i} variant="outline" className="bg-background/40 border-primary/20">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* FIR Draft Card */}
            {result.firDraft && (
              <Card className="md:col-span-2 glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <CardTitle>Generated FIR Draft</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.firDraft!)}>
                    <Copy className="w-4 h-4 mr-2" /> Copy Draft
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-mono text-sm p-4 rounded-lg bg-black/40 border border-border overflow-auto max-h-[400px]">
                    {result.firDraft}
                  </pre>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    * This is an AI-generated draft. Please review and verify all details before submitting to authorities.
                  </p>
                </CardFooter>
              </Card>
            )}

          </section>
        )}
      </main>
    </div>
  );
}
