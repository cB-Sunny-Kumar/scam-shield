# Scam Shield: Prompt Blueprint

This document contains the core engineering prompts used to develop the Scam Shield portal, categorized by technical domain.

## 1. Core Logic & AI Resilience
- **Objective**: Solve Gemini API quota limits (429 errors) and ensure high availability.
- **Prompt**: 
  > "Architect a 2-stage fraud analysis engine. Stage 1 should attempt a deep NLP scan using Gemini 2.0 Flash. If the API returns a 429 Rate Limit error or fail, Stage 2 must immediately trigger a high-fidelity local 'Keyword & Regex Engine' to ensure the user receives analysis without delay. The local engine should calculate scores based on Authority, Financial, and Phishing patterns."

## 2. Security & Infrastructure
- **Objective**: Establish a secure admin environment and protected routing.
- **Prompt**:
  > "Implement an admin authentication system using HTTP-only cookies and Next.js Server Actions. Once authenticated, migrate all route protection logic into a central `proxy.ts` middleware. This middleware must intercept any unauthorized requests to `/admin/*` and redirect them to `/admin/login` while preventing authenticated users from resetting into the login screen."

## 3. Modern UI/UX Design
- **Objective**: Transform a functional MVP into a premium 'Cyber-Security' product.
- **Prompt**:
  > "Overhaul the entire application UI to match a futuristic 'Cyber-Security Dashboard' aesthetic. Apply a 'Deep Charcoal' palette (#0A0A0A) with electric green accents. Use Glassmorphism (heavy backdrop blur + 1px borders) for all cards. Structure the Admin Portal as a multi-column Bento Grid to organize stats, charts, and investigation logs efficiently."

## 4. Micro-Interactions & HUD
- **Objective**: Enhance user immersion and feedback loops.
- **Prompt**:
  > "Develop an immersive 'Neural Scanning' HUD. Include a pulsing high-tech scanning progress bar for the analysis phase. Build a custom SVG `RadialProgress` component for the risk score that dynamically changes colors (Emerald to Crimson) and adds a corresponding glow effect based on the hazard level. Integrate high-fidelity skeleton loaders to bridge the gap during API processing."

## 5. UI Layout & Navigation
- **Objective**: Ensure a native-app feel across all device types.
- **Prompt**:
  > "Replace the standard navigation with a responsive dual-layer system. For desktop, build a floating glass sidebar that expands on hover. For mobile, implement a fixed bottom navigation bar similar to high-end security apps. Ensure the layout remains balanced across all breakpoints with appropriate padding shifts."
