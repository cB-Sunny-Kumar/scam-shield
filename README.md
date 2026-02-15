# Scam Shield
**Protecting the Vulnerable from Digital Fraud with AI-Powered Detection.**

## 🚨 Problem Statement
Cyber-fraud is escalating at an alarming rate, with "Digital Arrest" scams and sophisticated phishing attacks targeting vulnerable citizens. Victims often lose their life savings to criminals impersonating law enforcement or bank officials, creating a desperate need for a real-time, accessible defense mechanism.

## 🛡️ The Solution
**Scam Shield** is an intelligent defense platform that works two-fold:
1.  **For Citizens**: An AI-powered analysis engine that instantly detects fraud patterns in messages (SMS, WhatsApp, Email).
2.  **For Authorities**: A secure **Department Portal** that aggregates reported cases, categorizes risks, and provides actionable intelligence to stop scams before they inevitably escalate.

## ✨ Core Features
*   **Scam Pattern Recognition**: Advanced weighted scoring system detects "Digital Arrest", "Lottery", and "KYC Blocked" scams with high precision.
*   **Risk Scoring**: Automatically categorizes threats as Low, Medium, High, or **Critical** (e.g., Fake Police + Money Demand).
*   **FIR Generation**: Auto-generates a draft First Information Report (FIR) for victims to file complaints immediately.
*   **Admin Analytics**: A Department Portal with a sticky navbar, searchable case table, and interactive charts for fraud trend analysis.

## 🚀 Installation

Follow these steps to set up the project locally:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    - Copy the `.env.example` file to create a `.env` file.
    - Add your **Google Gemini API Key** to the `GEMINI_API_KEY` variable. You can get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Ensure your `DATABASE_URL` is set (defaults to `file:./dev.db`).

3.  **Initialize Database**:
    ```bash
    npx prisma db push
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛡️ Security

> [!IMPORTANT]
> **API Key Protection**: Never commit your `.env` file to version control. This project includes `.env` in the `.gitignore` to prevent accidental exposure. If you suspect your API key has been compromised, revoke it immediately via the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

## 🔑 Credentials

To access the **Department Portal** (Admin Dashboard):
-   **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
-   **Access Key**: `admin123`

## 🛠️ Tech Stack
-   **Framework**: Next.js 16 (App Router + Turbopack)
-   **AI**: Google Gemini 2.0 Flash
-   **Styling**: Tailwind CSS 4.0 (Dark Glassmorphism)
-   **Database**: SQLite with Prisma ORM (Singleton Pattern)
-   **Visualization**: Recharts
-   **Language**: TypeScript 5.0
