# System Architecture & Technical Specification
## Project Name: Nyaya (न्याय AI)
### Subtitle: Automated Chargeback Defense & Scope Creep Dispute Shield
**Hackathon Submission:** BharatCode Build League (Deadline: November 10, 2026)  
**Primary Engine:** BharatCode LLM Gateway (`qwen-3.8-27b`)  

---

## 1. High-Level System Architecture

Nyaya is architected as a modern, high-throughput, serverless web application using the Next.js App Router. It bridges client-side rich interaction, server-side document parsing, and sovereign LLM inference without any intermediate persistent data retention, ensuring total client data sovereignty.

```mermaid
graph TD
    subgraph Client ["Client Browser (Next.js React Client Component)"]
        UI["Dashboard UI (app/page.tsx)"]
        Form["Form State (Dispute text, PDF, Chat text)"]
        ExportPDF["Client PDF Exporter (html2pdf.js)"]
        Preview["Rebuttal Viewer & Markdown Renderer"]
    end

    subgraph Serverless ["Next.js Serverless Runtime (Node.js)"]
        APIRoute["API Route Handler (app/api/generate-rebuttal/route.ts)"]
        PDFParser["PDF Parser Engine (pdf-parse)"]
        PromptEngine["System & Context Prompt Synthesizer"]
        FetchClient["Native Fetch Client (No External AI SDKs)"]
    end

    subgraph BharatCodeGateway ["BharatCode Sovereign AI Infrastructure"]
        LLM["BharatCode API Endpoint: /api/model/v1/chat/completions"]
        Model["Model: qwen-3.8-27b"]
    end

    Form -->|1. Multipart FormData (POST)| APIRoute
    APIRoute -->|2. Binary Buffer Extraction| PDFParser
    PDFParser -->|3. Extracted Contract Text| PromptEngine
    PromptEngine -->|4. Constructed Payload| FetchClient
    FetchClient -->|5. Native HTTP POST (Bearer Token)| LLM
    LLM -->|6. Inference Evaluation| Model
    Model -->|7. JSON Stream / Completion Response| FetchClient
    FetchClient -->|8. Parsed Rebuttal String| APIRoute
    APIRoute -->|9. JSON Response { success, rebuttal }| UI
    UI -->|10. Render Markdown| Preview
    Preview -->|11. Trigger DOM Export| ExportPDF
```

---

## 2. Technology Stack Breakdown

| Layer | Technology | Version / Specification | Rationale & Responsibility |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 14 / 15 (Node.js runtime) | Hybrid rendering, optimized bundle, serverless route handlers. |
| **Language** | TypeScript | 5.x | Strict type safety for dispute payloads, API contracts, and form states. |
| **Styling** | Tailwind CSS & PostCSS | 3.x / Latest | Responsive, high-contrast, modern dark-themed aesthetic with zero runtime CSS overhead. |
| **Icons** | Lucide React | Latest | Clean, consistent icons (Shield, FileText, CheckCircle2, AlertTriangle, Download, Copy, Sparkles). |
| **PDF Extraction** | `pdf-parse` | 1.1.x | Server-side binary buffer parsing to extract raw text from executed client contracts/SOWs. |
| **Client PDF Export** | `html2pdf.js` | 0.10.x | Direct DOM-to-canvas-to-PDF compilation on the client without round-tripping to a server. |
| **AI Inference** | BharatCode Model API | Native HTTP `fetch` | Direct integration with `https://bharatcode.ai/api/model/v1/chat/completions` using sovereign `qwen-3.8-27b`. |

---

## 3. End-to-End Data Flow Sequence

The interaction follows an unyielding 6-phase lifecycle:

### Phase 1: Client Ingestion (`app/page.tsx`)
- The user provides three data inputs:
  1. `disputeDescription`: String detailing the dispute reason (e.g., Stripe Dispute Reason: "Service Not as Described"), disputed amount, invoice ID, and buyer claims.
  2. `contractFile`: Binary `.pdf` file of the executed contract or Statement of Work.
  3. `communicationHistory`: Multiline string containing email logs, Slack exports, or message threads showing client sign-offs.
- The client encapsulates these into standard browser `FormData` and sends a `POST` request to `/api/generate-rebuttal`.

### Phase 2: Serverless Route Processing (`app/api/generate-rebuttal/route.ts`)
- Next.js receives the multipart form data.
- The `contractFile` is converted from a `Blob` into a Node.js `Buffer`.
- `pdf-parse` extracts raw textual content from the PDF buffer, handling multi-page contracts, headers, and signature blocks.
- Input validation verifies that sufficient context is present (contract text length > 50 characters, dispute description present).

### Phase 3: Prompt Construction & Legal Persona Injection
- The prompt engine constructs a specialized two-tier prompt architecture:
  - **System Prompt:** Instructs the model to act as an unyielding, veteran commercial dispute mediator and merchant payment arbitrator. It specifies the 5-part gateway standard structure, instructing the model to quote exact contract clauses, cite dates/timestamps from the communication logs, and construct an ironclad defense.
  - **User Context Prompt:** Combines the extracted contract text, dispute description, and communication logs with clear delimiter tokens (`--- CONTRACT CLAUSES ---`, `--- DISPUTE DETAILS ---`, `--- COMMUNICATION LOGS ---`).

### Phase 4: BharatCode Native Fetch Call
- The server initiates an asynchronous HTTP `fetch` request to `https://bharatcode.ai/api/model/v1/chat/completions`.
- **Constraint Strictness:** No OpenAI, LangChain, or Anthropic client libraries are used. Only native Node.js global `fetch` is executed.
- Headers include `Authorization: Bearer ${process.env.BHARATCODE_API_KEY}` and `Content-Type: application/json`.
- The request specifies `model: "qwen-3.8-27b"`.

### Phase 5: Response Parsing & Client Hydration
- The server checks response `res.ok`. If successful, parses the JSON payload and extracts `data.choices[0].message.content`.
- The server returns `{ success: true, rebuttal: data.choices[0].message.content }`.
- If an upstream error occurs, it catches the error and returns a clean `{ success: false, error: "..." }` status.

### Phase 6: Client Display & Export
- The client receives the rebuttal markdown, renders it with clear visual typography, and enables:
  - Instant clipboard copy for payment processor text fields.
  - One-click PDF download via `html2pdf.js` with formal dispute letter layout.

---

## 4. Exact BharatCode API Payload Specification

### Endpoint:
```http
POST https://bharatcode.ai/api/model/v1/chat/completions
```

### HTTP Headers:
```http
Content-Type: application/json
Authorization: Bearer <BHARATCODE_API_KEY>
```

### Request JSON Payload:
```json
{
  "model": "qwen-3.8-27b",
  "messages": [
    {
      "role": "system",
      "content": "You are Nyaya AI, a senior commercial contracts attorney and payment gateway dispute arbitrator. Your mission is to defend freelancers and merchants against unfair client chargebacks, friendly fraud, and scope creep. Analyze the provided contract clauses, client dispute allegations, and communication logs to produce an uncompromising, legally-sound Dispute Rebuttal Dossier formatted strictly for payment gateway analysts (Stripe, PayPal, Visa, Mastercard).\n\nStructure the rebuttal with the following five formal sections:\n1. EXECUTIVE SUMMARY & TRANSACTION DECLARATION (Transaction ID, Amount, Merchant stance, Gateway dispute reason refutation)\n2. CONTRACTUAL PROVISIONS & SCOPE DEFINITION (Direct quotes of signed clauses, Change Order terms, Milestone acceptance conditions)\n3. TIMELINE OF DELIVERABLES & WRITTEN ACCEPTANCE (Chronological sequence of milestone submissions and explicit client approvals from communication logs)\n4. SYSTEMATIC REBUTTAL OF BUYER ALLEGATIONS (Itemized demolition of the client's false claims using contractual facts)\n5. FORMAL CONCLUSION & DEMAND FOR IMMEDIATE DISPUTE DISMISSAL (Unconditional closing request to release escrow/chargeback funds to merchant)\n\nMaintain an authoritative, objective, professional, and unyielding tone."
    },
    {
      "role": "user",
      "content": "Generate a comprehensive Dispute Rebuttal Letter based on the following verified project records:\n\n### 1. DISPUTE / CLAIM CONTEXT\nClient Dispute Claim: The client claims the website was never delivered and filed a chargeback for $3,200.00.\nDisputed Amount: $3,200.00 USD\nReason Code: Service Not Rendered / Unacceptable Quality\n\n### 2. EXTRACTED CONTRACT / STATEMENT OF WORK (SOW)\n[Raw text parsed from PDF contract including scope, deliverables, payment milestones, revision clauses, and sign-off agreements]\n\n### 3. COMMUNICATION HISTORY & MILESTONE LOGS\n[Chronological chat/email transcript demonstrating client approval, staging review links, and positive feedback]"
    }
  ],
  "temperature": 0.2,
  "max_tokens": 3000
}
```

### Expected Response JSON Structure:
```json
{
  "id": "chatcmpl-bharatcode-nyaya-001",
  "object": "chat.completion",
  "created": 1730460000,
  "model": "qwen-3.8-27b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "# FORMAL CHARGEBACK DISPUTE REBUTTAL DOSSIER\n\n**TO:** Payment Disputes Review Division / Merchant Acquiring Bank..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 1420,
    "completion_tokens": 850,
    "total_tokens": 2270
  }
}
```

---

## 5. Security & Privacy Guarantees
1. **Zero Data Retention:** Neither uploaded contracts nor chat histories are written to any disk, cache, or external database.
2. **In-Memory Buffering:** Files are received as streaming `FormData`, converted to ephemeral Node.js buffers for `pdf-parse`, and discarded upon garbage collection.
3. **Environment Security:** `BHARATCODE_API_KEY` is loaded strictly on the server runtime via `process.env`, never exposed to the client bundle.
4. **CORS & CSRF Isolation:** Serverless route handler accepts requests strictly from the same origin.
- **Third-Party Processing Boundary:** While Nyaya AI operates a strict internal Zero Data Retention policy (processing files as ephemeral Node.js buffers), extracted contract text and communication logs are transmitted securely via HTTP POST to the external BharatCode Gateway for LLM inference. Users must review BharatCode's platform policies regarding prompt logging before uploading agreements.
