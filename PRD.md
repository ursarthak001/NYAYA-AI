# Product Requirements Document (PRD)
## Project Name: Nyaya (न्याय AI)
### Subtitle: Automated Chargeback Defense & Scope Creep Dispute Shield
**Hackathon:** BharatCode Build League (Deadline: November 10, 2026)  
**Track:** AI Applications & Sovereign Developer Infrastructure  
**Version:** 1.0.0  
**Status:** Approved for Implementation  

---

## 1. Executive Summary & Product Overview
**Nyaya** (derived from the Sanskrit word *न्याय*, signifying justice, balance, and logical adjudication) is an autonomous, high-precision dispute defense platform built specifically for freelancers, independent software developers, digital agencies, and SMB merchants.

In today's global digital economy, independent creators and merchants lose millions of dollars to bad-faith chargebacks, "friendly fraud," and scope creep extortion. When a client initiates a chargeback via Stripe, PayPal, Razorpay, or credit card networks claiming "Work Not Completed" or "Product Unacceptable," the burden of proof falls entirely on the merchant. Payment network adjudicators review evidence in under 3 minutes; unstructured emails, screenshots, and angry explanations are dismissed outright.

**Nyaya** solves this existential problem through automated, legally-rigorous dispute synthesis. By ingesting:
1. The original executed contract or Statement of Work (PDF),
2. The client's dispute claim and transaction metadata, and
3. The raw communication history (Slack, Email, WhatsApp milestones),

Nyaya leverages the sovereign **BharatCode `qwen-3.8-27b`** model to perform algorithmic cross-examination: pinpointing signed scope boundaries, matching milestone sign-offs against buyer claims, and producing an unassailable, bank-compliant **Chargeback Rebuttal Dossier**. Users can inspect, refine, and export this legal-grade package as an official PDF in seconds.

---

## 2. Problem Statement & Market Opportunity
- **The Asymmetric Chargeback Crisis:** Global chargeback volume exceeds $110B. Payment gateways operate on "guilty until proven innocent" rules for merchants.
- **The 180-Second Evidentiary Window:** Payment dispute analysts review hundreds of files daily. They demand standardized formats: Executive Summary, Contractual Terms, Delivery Timeline, and Point-by-Point Rebuttal. Freelancers rarely have legal training to present their case in this strict taxonomy.
- **Scope Creep Weaponization:** Clients frequently demand unpaid iterations outside the Statement of Work, then claw back payments on prior completed phases when the merchant draws a boundary.
- **Prohibitive Legal Costs:** Hiring a commercial contracts attorney to draft a formal dispute package costs $500–$1,500—often greater than the value of the disputed invoice.

---

## 3. Target Audience & User Personas
| Persona | Background | Core Challenge |
|---|---|---|
| **Rohan — Senior Freelance Engineer** | Builds React/Node applications for international startups. | Client approved Phase 1 & 2 deliverables, demanded free migration services, and filed a $4,500 Stripe chargeback when Rohan refused. Needs contractual proof of phase sign-offs. |
| **Ananya — Creative Studio Director** | Delivers branding, UI/UX, and marketing collateral on monthly retainers. | Client claims "Designs were not delivered" despite receiving all Figma links and approval emails. Needs an undeniable timeline of deliveries. |
| **Dev — Digital Goods & SaaS Merchant** | Sells custom developer tools and API access via Stripe and Razorpay. | Faces automated "Unauthorized Transaction" or "Product Not as Described" claims from buyers attempting to keep digital goods for free. |

---

## 4. Core User Journey
The Nyaya user workflow is streamlined for maximum urgency and zero friction:

```
+-----------------------------------------------------------------------------------------+
| 1. Dispute Intake (Claim Context)                                                       |
| Merchant enters dispute claim, reason code, transaction amount, and buyer allegations.  |
+-------------------------------------------+---------------------------------------------+
                                            |
                                            v
+-----------------------------------------------------------------------------------------+
| 2. Contract Upload (.pdf)                                                               |
| Upload signed Master Services Agreement / SOW. Serverless pdf-parse extracts legal AST. |
+-------------------------------------------+---------------------------------------------+
                                            |
                                            v
+-----------------------------------------------------------------------------------------+
| 3. Communication History Import                                                         |
| Paste raw communication logs (Slack messages, email threads, approval timestamps).      |
+-------------------------------------------+---------------------------------------------+
                                            |
                                            v
+-----------------------------------------------------------------------------------------+
| 4. Sovereign AI Adjudication (BharatCode qwen-3.8-27b)                                  |
| Engine cross-references contractual obligations against explicit communication proofs.  |
+-------------------------------------------+---------------------------------------------+
                                            |
                                            v
+-----------------------------------------------------------------------------------------+
| 5. Rebuttal Synthesis & Interactive Preview                                             |
| Generates structured, formal rebuttal formatted for Visa, Mastercard, and Stripe teams. |
+-------------------------------------------+---------------------------------------------+
                                            |
                                            v
+-----------------------------------------------------------------------------------------+
| 6. One-Click PDF Dossier Export (html2pdf.js)                                           |
| Downloads high-resolution, print-ready legal PDF ready for instant gateway submission.  |
+-----------------------------------------------------------------------------------------+
```

---

## 5. Functional Requirements

### 5.1 Intake & User Interface (`app/page.tsx`)
- **FR-1.1 Dispute Context Module:** Multiline input for the user to document the dispute reason (e.g., "Service Not Delivered", "Product Not as Described"), disputed amount, invoice reference, and client's exact claims.
- **FR-1.2 Contract Ingestion Engine:** Validated `.pdf` file uploader supporting contracts up to 10MB, displaying file metadata (name, size) with interactive clear/replace capability.
- **FR-1.3 Communication Log Stream:** Fast text area for pasting chronological email threads, Slack chats, or ticket resolutions.
- **FR-1.4 Instant Demo Preloader:** One-click "Load Sample Dispute" feature for judges to test a real-world $3,200 web design scope creep dispute without manual typing.
- **FR-1.5 State-Driven Action Controls:** Dynamic button with animated visual status indicators ("Reading Contract PDF...", "Auditing Timeline...", "Synthesizing Legal Rebuttal with BharatCode AI...").

### 5.2 Serverless Processing & Legal Analysis (`app/api/generate-rebuttal/route.ts`)
- **FR-2.1 Multipart Form Handler:** Secure Node.js Next.js route parsing incoming binary PDF and UTF-8 text streams.
- **FR-2.2 In-Memory PDF Extraction:** Efficient text extraction via `pdf-parse` without disk caching to guarantee data confidentiality.
- **FR-2.3 Sovereign Model Prompt Architecture:**
  - *System Directive:* Instills the persona of a relentless, legally-trained commercial dispute specialist and payment arbitrator.
  - *Contextual Fusion:* Combines the extracted contract clauses, client allegations, and communication logs with strict gateway formatting standards.
- **FR-2.4 BharatCode LLM Integration:**
  - Direct HTTP `fetch` to `https://bharatcode.ai/api/model/v1/chat/completions`.
  - Strictly targets the `qwen-3.8-27b` model with `Bearer` authentication.
  - Zero reliance on unauthorized third-party SDKs (OpenAI, Anthropic).
- **FR-2.5 Gateway Evidentiary Schema:** Output must strictly adhere to the standardized five-pillar rebuttal structure:
  1. **Section I: Executive Summary & Dispute Declaration**
  2. **Section II: Contractual Scope & Governing Clauses**
  3. **Section III: Evidentiary Timeline & Written Client Approvals**
  4. **Section IV: Point-by-Point Refutation of Buyer Claims**
  5. **Section V: Formal Demand for Immediate Dispute Dismissal & Fund Release**

### 5.3 Evidentiary Presentation & Export
- **FR-3.1 Live Markdown Presentation:** Styled output container with typography tailored for high legibility, clause highlighting, and visual hierarchy.
- **FR-3.2 Clipboard Sync:** Single-click copy of the entire rebuttal letter formatted for gateway text forms.
- **FR-3.3 Client-Side PDF Generation:** High-fidelity PDF rendering via `html2pdf.js` with professional header, timestamps, and page margin management.

---

## 6. Non-Functional Requirements
- **NFR-1 Latency:** Full end-to-end extraction and AI inference cycle completed within 15–30 seconds.
- **NFR-2 Security & Zero-Storage:** No contract or communication data is saved to a persistent database. All processing is ephemeral in memory.
- **NFR-3 Reliability & Fallback:** Resilient error trapping for corrupted PDFs, missing environment keys, or upstream timeouts with clear UI diagnostics.
- **NFR-4 Visual Excellence:** Sleek modern interface using Tailwind CSS, glassmorphism accents, responsive layouts, and modern dark-mode aesthetics.

---

## 7. Hackathon Submission Deliverables
1. `PRD.md` — Product Requirements Document (this document)
2. `ARCHITECTURE.md` — Technical System Architecture & API Specifications
3. `BharatCode.txt` — 2-sentence official submission declaration
4. `README.md` — Complete hackathon project presentation and setup guide
5. Full working Next.js App Router codebase (`app/page.tsx`, `app/api/generate-rebuttal/route.ts`, styles, and configuration).
