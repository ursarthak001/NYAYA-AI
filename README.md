# ⚖️ Nyaya (न्याय AI) — Autonomous Dispute Shield for Creators & Merchants

> **The Sovereign Legal Defense Engine for the Global Independent Economy.**  
> Built for the **BharatCode Build League Hackathon** (Deadline: November 10, 2026).  
> Powered by the **BharatCode Sovereign LLM Gateway** (`qwen-3.8-27b`).

---

![Nyaya AI Banner Placeholder](https://raw.githubusercontent.com/bharatcode-build-league/assets/main/nyaya-banner.png)

[![BharatCode Build League](https://img.shields.io/badge/Hackathon-BharatCode%20Build%20League%202026-orange?style=for-the-badge)](https://bharatcode.ai)
[![Model](https://img.shields.io/badge/Model-BharatCode%20qwen--3.8--27b-blueviolet?style=for-the-badge)](https://bharatcode.ai)
[![Next.js](https://img.shields.io/badge/Next.js-14%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## 📽️ Demo Preview
```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                   [ DEMO GIF: NYAYA IN ACTION ]                                   |
|   Upload Contract PDF -> Ingest Communication History -> Run BharatCode AI        |
|               -> Instant Bank-Compliant Dispute Rebuttal Dossier                  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```
*(Add `nyaya-demo.gif` in root or embed your demo video link here)*

---

## 💥 The Problem: The $110B Unfair Chargeback Epidemic
Every year, freelancers, independent software developers, and small merchants lose billions of dollars to **fraudulent chargebacks**, **"friendly fraud"**, and **scope creep extortion**:

1. **The Asymmetric System:** When a client issues a chargeback via Stripe, PayPal, Razorpay, or credit cards, the payment gateway freezes the merchant's funds immediately, plus assesses a $15–$25 dispute fee.
2. **The 180-Second Review Window:** Payment gateway dispute analysts evaluate hundreds of disputes a day. They spend an average of **90 to 180 seconds** reviewing each submission. If a merchant submits chaotic screenshots, emotional rants, or disarranged emails, the dispute is automatically resolved in the buyer's favor.
3. **The Weaponization of Scope Creep:** Unscrupulous clients routinely sign off on agreed project deliverables, demand unpaid extra revisions outside the Statement of Work, and then claw back original funds when the freelancer sets boundaries.
4. **Prohibitive Cost of Representation:** Retaining a commercial litigation attorney costs $400+/hour—exceeding the entire invoice value of most freelance jobs.

---

## 🛡️ The Solution: Nyaya (न्याय AI)
**Nyaya** (*Sanskrit for Justice, Logic, and Rectitude*) levels the playing field. It acts as an autonomous, veteran dispute mediator and commercial litigation attorney in your browser:

- 📄 **Contract Ingestion Engine:** Upload your executed Master Services Agreement or Statement of Work (`.pdf`). Nyaya parses clauses, scope terms, milestones, and change-order provisions in volatile memory via serverless `pdf-parse`.
- 💬 **Timeline Cross-Examination:** Paste raw communication threads (Slack, WhatsApp, Email). Nyaya chronologically anchors dates, deliverables, and explicit client approvals.
- 🗺️ **Evidence Anchor Map (Killer Feature):** Directly binds strict contractual clauses to informal chat timestamps in a structured 3-column verification matrix, making client sign-offs undeniable to dispute investigators.
- 🧠 **Sovereign Intelligence (`qwen-3.8-27b`):** Directly integrated with the **BharatCode LLM API** (`https://bharatcode.ai/api/model/v1/chat/completions`), Nyaya cross-examines client claims against contract clauses with surgical precision.
- 📑 **Six-Section Bank-Grade Evidentiary Dossier:** Synthesizes an official dispute letter formatted to Visa, Mastercard, and Stripe dispute evaluation standards.
- 📥 **One-Click Client PDF Export:** Instantly downloads a clean, formal legal PDF ready to be uploaded directly to Stripe, PayPal, or bank dispute portals.

---

## ⚡ Tech Stack & Architecture

| Layer | Component | Description |
|---|---|---|
| **Framework** | Next.js (App Router) | High-performance React framework with serverless Node.js Route Handlers. |
| **Language** | TypeScript | Strong typing across API contracts, forms, and inference schemas. |
| **Styling** | Tailwind CSS | Sleek, modern dark-themed dashboard with micro-interactions and glassmorphism. |
| **Icons** | Lucide React | Modern, minimalist UI icons. |
| **Document Parser** | `pdf-parse` | Serverless in-memory binary parsing for contractual PDFs. |
| **Document Export** | `html2pdf.js` | Zero-server client-side PDF synthesis with clean print styles. |
| **AI Engine** | **BharatCode `qwen-3.8-27b`** | Direct native `fetch` integration with BharatCode sovereign completions API. |

### Architectural Data Flow:
```
[User Browser]
      │
      │ 1. Multipart Form (Contract PDF + Dispute Details + Chat Logs)
      ▼
[Next.js API Route: /api/generate-rebuttal]
      │
      │ 2. In-memory binary buffer extraction via pdf-parse
      ▼
[Legal Prompt Synthesizer & Delimiter Engine]
      │
      │ 3. Native HTTP POST (Strictly fetch, No external AI SDKs)
      │    Bearer Token Auth
      ▼
[BharatCode LLM Endpoint: https://bharatcode.ai/api/model/v1/chat/completions]
      │
      │ 4. qwen-3.8-27b sovereign inference
      ▼
[Next.js API Route] ──> Returns JSON ──> [Next.js Client UI]
                                               │
                                               ├─► Interactive Markdown Viewer
                                               ├─► One-Click Copy to Clipboard
                                               └─► Client-Side PDF Export (html2pdf.js)
```

---

## 🏛️ The Five-Pillar Dossier Standard
Nyaya doesn't just write a letter; it builds an indisputable evidentiary submission:
1. **Section I: Executive Summary & Merchant Declaration:** Transaction ID, disputed amount, merchant credentials, and direct refutation of the gateway reason code.
2. **Section II: Contractual Scope & Governing Clauses:** Verbatim citations of signed SOW clauses, change-order protocols, and acceptance rules.
3. **Section III: Evidentiary Timeline & Written Client Approvals:** Concrete chronological record of milestone shipments and client sign-offs.
4. **Section IV: Systematic Rebuttal of Buyer Allegations:** Point-by-point demolition of buyer claims using contractual and communication evidence.
5. **Section V: Formal Conclusion & Demand for Immediate Fund Release:** Uncompromising legal closing urging immediate reversal of the provisional chargeback.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- **BharatCode API Key**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nyaya.git
cd nyaya
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Add your BharatCode API key:
```env
BHARATCODE_API_KEY=your_bharatcode_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```

.

---

## 🧪 Quick Test Drive (Demo Mode)
Don't have a contract PDF handy?
Click the **"⚡ Load Sample Dispute"** button on the dashboard to instantly populate:
- A $3,200 Web Application Scope Creep dispute.
- A parsed sample Master Services Agreement with change-order terms.
- A realistic Slack communication thread showing client approval followed by unjustified reversal.

Click **"Generate Rebuttal Letter"** and watch Nyaya compile your dispute dossier!

---

## 🔒 Security & Privacy by Design
- **Zero Disk Retention:** Uploaded contracts and communication logs are handled strictly in transient RAM.
- **Ephemeral Processing:** Files are converted to buffers, parsed, injected into the inference payload, and immediately collected by runtime garbage collection.
- **Server-Side API Key Isolation:** `BHARATCODE_API_KEY` is never leaked to the client bundle.

---

## 🌐 Netlify Deployment Guide (BharatCode Build League)

Nyaya AI is configured for instant, zero-configuration deployment to Netlify via Next.js App Router and `@netlify/plugin-nextjs`.

### 1. `netlify.toml` Configuration
The project includes a production-ready [`netlify.toml`](file:///d:/opensource/New%20folder/netlify.toml) file:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  node_bundler = "esbuild"
  included_files = ["node_modules/pdf-parse/**"]

[build.environment]
  NODE_VERSION = "20"
  NEXT_USE_NETLIFY_EDGE = "false"
```

### 2. Secure Server-Side Environment Variables
> [!IMPORTANT]
> **Strict Secret Protection:** `BHARATCODE_API_KEY` must **NEVER** have the `NEXT_PUBLIC_` prefix. This restricts the secret strictly to serverless execution environments and build-time Node.js processes, preventing leakage to client browsers.

1. Navigate to your site on **Netlify Dashboard** -> **Site configuration** -> **Environment variables**.
2. Click **Add a variable** -> **Add a single variable**:
   - **Key:** `BHARATCODE_API_KEY`
   - **Value:** `<your-sovereign-bharatcode-api-key>`
   - **Scopes:** Select *Builds*, *Functions*, and *Runtime*.
3. Trigger a deploy from the `main` branch or run:
   ```bash
   npx netlify deploy --prod
   ```

---

## 📜 Official Hackathon Declaration
See [`BharatCode.txt`](./BharatCode.txt) in the root directory:
> *This repository is an official submission for the BharatCode Build League hackathon. It utilizes the BharatCode sovereign model API running the qwen-3.8-27b model for its core intelligent dispute analysis and legal rebuttal generation functionality.*

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
