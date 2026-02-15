"use client";

import { useState, useEffect } from "react";
import { analyzeTextAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadialProgress } from "@/components/ui/radial-progress";
import { SkeletonScanner } from "@/components/ui/skeleton-scanner";
import { ShieldAlert, ShieldCheck, AlertTriangle, FileText, Send, Copy, AlertOctagon, Cpu, Zap, Fingerprint } from "lucide-react";
import { type FraudAnalysisResult } from "@/lib/fraud-engine";
import { cn } from "@/lib/utils";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<FraudAnalysisResult | null>(null);

  // Fake scanning progress bar effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? 95 : prev + (100 - prev) * 0.1));
      }, 300);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async () => {
    if (!input) return;
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("text", input);
      const data = await analyzeTextAction(formData);
      // Wait a bit to show the pulse effect
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Analysis failed:", error);
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto pb-20">
      {/* Hero Header */}
      <header className="flex flex-col gap-4 animate-fade-in">
        <div className="flex items-center gap-3 text-primary">
          <Fingerprint className="w-10 h-10" />
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Scam Shield <span className="text-white/20 not-italic">v2.0</span></h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-xl">
          Advanced AI-powered fraud detection system monitor. Paste suspicious communications below for immediate neural analysis.
        </p>
      </header>

      {/* Main Scanner Input */}
      <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <Card className="glass-panel border-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 group-focus-within:bg-primary/50 transition-colors" />

          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" /> Analysis Input Terminal
              </CardTitle>
              <CardDescription>Target: SMS, WhatsApp, Email, or Web Content</CardDescription>
            </div>
            <Zap className={cn("w-6 h-6 text-primary/50 transition-all duration-500", loading && "animate-pulse text-primary")} />
          </CardHeader>

          <CardContent className="relative">
            <Textarea
              placeholder="System awaiting data injection..."
              className="min-h-[180px] text-base resize-none bg-black/20 border-white/5 focus-visible:ring-primary/50 scan-text leading-relaxed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {loading && (
              <div className="absolute inset-x-6 bottom-4 h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between items-center bg-white/5 py-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              <div className={cn("w-2 h-2 rounded-full", loading ? "bg-yellow-500 animate-pulse" : "bg-emerald-500")} />
              {loading ? "Neural Core Processing" : "Neural core active"}
            </div>
            <Button
              onClick={handleAnalyze}
              className="px-8 gap-2 font-bold uppercase tracking-wider h-12 box-glow"
              disabled={loading || !input}
              variant="neon"
            >
              {loading ? "Running Neural Scan..." : "Initiate Analysis"}
            </Button>
          </CardFooter>
        </Card>
      </section>

      {/* Results HUD */}
      <div className="min-h-[400px]">
        {loading ? (
          <SkeletonScanner />
        ) : result ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in transition-all duration-700">
            {/* Risk HUD Card */}
            <Card className="md:col-span-2 glass-panel border-white/10 relative overflow-hidden">
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-10 pointer-events-none",
                result.riskLevel === 'Critical' ? 'from-red-600' :
                  result.riskLevel === 'High' ? 'from-orange-600' :
                    result.riskLevel === 'Medium' ? 'from-yellow-600' : 'from-emerald-600'
              )} />

              <CardContent className="pt-8 flex flex-col md:flex-row items-center gap-12">
                <div className="relative">
                  <RadialProgress value={result.score} riskLevel={result.riskLevel} size={160} strokeWidth={12} />
                  <div className={cn(
                    "absolute -top-2 -right-2 p-2 rounded-xl glass-panel text-[10px] font-black uppercase tracking-tighter border-white/10",
                    result.riskLevel === 'Critical' ? 'text-red-500 border-red-500/50 underline' :
                      result.riskLevel === 'High' ? 'text-orange-500 border-orange-500/50' :
                        result.riskLevel === 'Medium' ? 'text-yellow-500 border-yellow-500/50' : 'text-emerald-500 border-emerald-500/50'
                  )}>
                    STATUS: {result.riskLevel}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-black uppercase italic flex items-center gap-3">
                    {result.riskLevel === 'Critical' || result.riskLevel === 'High' ? (
                      <AlertOctagon className="w-8 h-8 text-red-500 animate-pulse" />
                    ) : (
                      <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    )}
                    Threat Intelligence Report
                  </h3>
                  <p className="text-muted-foreground scan-text text-sm leading-relaxed border-l-2 border-primary/20 pl-4 py-2 bg-white/5 rounded-r-lg">
                    Detected {result.riskLevel.toUpperCase()} probability of fraud in source transmission. System recommends immediate protective action.
                  </p>

                  {result.flags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {result.flags.map((flag, i) => (
                        <Badge key={i} variant="secondary" className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors py-1 px-3 rounded-md text-[10px] uppercase font-bold tracking-widest text-[#10b981]">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* FIR Transmission Data */}
            {result.firDraft && (
              <Card className="md:col-span-2 glass-panel border-white/5 bg-black/40">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm uppercase font-black tracking-widest">Compromise Report Draft (FIR)</CardTitle>
                      <CardDescription className="text-[10px] uppercase tracking-wider">Draft ready for authority submission</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs font-bold hover:bg-primary/20 hover:text-primary transition-all rounded-xl border border-white/5" onClick={() => copyToClipboard(result.firDraft!)}>
                    <Copy className="w-4 h-4 mr-2" /> COPY DATA STRINGS
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap scan-text text-xs p-6 rounded-xl bg-black/60 border border-white/5 text-primary/80 max-h-[400px] overflow-auto leading-relaxed shadow-inner">
                    {result.firDraft}
                  </pre>
                </CardContent>
                <CardFooter className="pt-0">
                  <p className="text-[9px] text-muted-foreground uppercase font-medium tracking-tight bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    * AI SYSTEM GENERATED PROXY DATA. REVIEW REQUIRED BEFORE OFFICIAL LEGAL FILING.
                  </p>
                </CardFooter>
              </Card>
            )}
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground animate-fade-in">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 mb-6 flex items-center justify-center opacity-40">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <p className="text-sm uppercase font-black tracking-widest opacity-40">System awaiting analysis request</p>
          </div>
        )}
      </div>
    </div>
  );
}

