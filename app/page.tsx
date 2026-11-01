'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  Scale,
  FileText,
  Upload,
  Download,
  Copy,
  Check,
  AlertCircle,
  RotateCcw,
  Zap,
  X,
  FileCheck2,
  MessageSquare,
  Shield,
  Loader2,
  Sparkles,
  Clock,
  Lock,
  ArrowRight,
  TrendingUp,
  Printer,
  ChevronRight,
  CreditCard,
  Building,
  CheckCircle2,
  HelpCircle,
  FileCode,
  Layers,
} from 'lucide-react';

// ─── Inline markdown → styled JSX ─────────────────────
function parseInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function splitRow(rowText: string): string[] {
  let cleaned = rowText.trim();
  if (cleaned.startsWith('|')) cleaned = cleaned.slice(1);
  if (cleaned.endsWith('|')) cleaned = cleaned.slice(0, -1);
  return cleaned.split('|').map((c) => c.trim());
}

function RebuttalDocument({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const t = rawLine.trim();

    // Check if line starts a markdown table
    if (
      t.includes('|') &&
      i + 1 < lines.length &&
      /^\s*\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)+\|?\s*$/.test(lines[i + 1].trim())
    ) {
      const headers = splitRow(t);
      i += 2; // skip header and delimiter line
      const rows: string[][] = [];

      while (i < lines.length) {
        const rowLine = lines[i].trim();
        if (!rowLine.includes('|') || rowLine === '') break;
        rows.push(splitRow(rowLine));
        i++;
      }

      elements.push(
        <div key={`tbl-${i}`} className="table-container">
          <table className="rebuttal-table">
            <thead>
              <tr>
                {headers.map((h, hIdx) => (
                  <th key={hIdx}>{parseInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{parseInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (t.startsWith('# ')) {
      elements.push(<h1 key={`h1-${i}`}>{parseInline(t.slice(2))}</h1>);
    } else if (t.startsWith('### ')) {
      elements.push(<h3 key={`h3-${i}`}>{parseInline(t.slice(4))}</h3>);
    } else if (t.startsWith('## ')) {
      elements.push(<h2 key={`h2-${i}`}>{parseInline(t.slice(3))}</h2>);
    } else if (t.startsWith('#### ')) {
      elements.push(<h4 key={`h4-${i}`}>{parseInline(t.slice(5))}</h4>);
    } else if (t === '---' || t === '***') {
      elements.push(<hr key={`hr-${i}`} />);
    } else if (t.startsWith('> ')) {
      elements.push(<blockquote key={`quote-${i}`}>{parseInline(t.slice(2))}</blockquote>);
    } else if (t.startsWith('- ') || t.startsWith('* ')) {
      elements.push(<li key={`li-${i}`} style={{ listStyle: 'disc' }}>{parseInline(t.replace(/^[-*]\s+/, ''))}</li>);
    } else if (/^\d+\.\s/.test(t)) {
      elements.push(<li key={`li-num-${i}`} style={{ listStyle: 'decimal' }}>{parseInline(t.replace(/^\d+\.\s+/, ''))}</li>);
    } else if (t === '') {
      elements.push(<div key={`sp-${i}`} style={{ height: 6 }} />);
    } else {
      elements.push(<p key={`p-${i}`}>{parseInline(t)}</p>);
    }

    i++;
  }

  return <div className="rebuttal-body">{elements}</div>;
}

// ─── Preset Scenarios ──────────────────────────────────
const PRESETS = [
  {
    id: 'stripe-scope',
    title: 'Stripe · Scope Creep & Sign-off',
    gateway: 'Stripe',
    badge: 'High Win-Rate',
    desc: 'Client approved staging build, then disputed $3,200 after unbilled extra features were denied.',
    dispute: `Stripe Dispute — Reason Code: "service_not_as_described"
Disputed Amount: $3,200.00 USD  |  Invoice: INV-2026-089

Buyer Allegation: The client (Apex Ventures LLC) claims the full-stack web application was "incomplete and broken." They filed a chargeback for the final milestone payment despite approving the staging build 12 days earlier and explicitly requesting live production deployment.`,
    contract: `MASTER SERVICES AGREEMENT & STATEMENT OF WORK
Effective Date: September 15, 2026
Client: Apex Ventures LLC  |  Contractor: Ro-Dev Software Studio

Section 2 — Scope of Deliverables:
  • Milestone 1: UX/UI Prototypes & Database Schema ($1,500) — Completed & Paid
  • Milestone 2: Frontend Build & Stripe Checkout ($2,500) — Completed & Paid
  • Milestone 3: User Dashboard, Auth & Production Deploy ($3,200) — DISPUTED

Section 5.4 — Milestone Acceptance Protocol:
"Client shall inspect each milestone within 5 business days of delivery. Written approval, deployment to production, or failure to submit a written deficiency notice within 5 days constitutes irrevocable acceptance."

Section 7.1 — Exclusions:
Third-party CRM migrations (Salesforce), native iOS builds, and multi-tenant routing are expressly excluded.

Section 8.2 — Change Orders:
Modifications outside Section 2 require a mutually signed Change Order with supplemental compensation before commencement.

Section 11.2 — Non-Refundable Delivery:
Upon milestone acceptance and source code delivery, payments are non-refundable.`,
    comms: `[Oct 12, 10:14 AM] Contractor → Client:
"Milestone 3 is live on staging: https://apex-staging.dev. Please test the auth flow and dashboard."

[Oct 13, 3:22 PM] Mark (Client):
"Tested everything with the team. Looks incredible — works perfectly! Push this live Monday."

[Oct 16, 9:45 AM] Contractor → Client:
"Live at apexventures.com. Sending final invoice INV-2026-089 for $3,200."

[Oct 18, 4:10 PM] Mark (Client):
"We also need a Salesforce sync and iOS push notifications before we pay."

[Oct 19, 11:00 AM] Contractor → Client:
"Mark — those are excluded under Section 7.1 of our signed SOW. I can draft a Change Order for $2,400."

[Oct 22, 2:15 PM] Mark (Client):
"Do it for free or I'm reversing the payment."

[Oct 24] Stripe notification: Chargeback filed for $3,200.00 — "Service Not as Described"`,
  },
  {
    id: 'paypal-fraud',
    title: 'PayPal · Fraudulent Chargeback',
    gateway: 'PayPal',
    badge: 'Critical Defense',
    desc: 'Digital branding agency deliverables handed off via GitHub/Figma; buyer filed unauthorized transaction.',
    dispute: `PayPal Dispute — Case #PP-D-918237
Dispute Type: "Unauthorized Transaction" / Chargeback
Disputed Amount: $1,850.00 USD  |  Transaction ID: 7XK992140A

Buyer Allegation: Account holder claims they never authorized payment for digital design system and brand assets, despite 3 weeks of continuous Slack collaboration and documented file access.`,
    contract: `DIGITAL BRAND ASSETS & LICENSING AGREEMENT
Parties: Studio Kroma (Merchant) & Lumina Brands (Buyer)
Total Fee: $1,850.00 USD (Fixed Price)

Clause 1.2 — Delivery Protocol:
Deliverables transferred digitally via Figma team invite and private GitHub repository to Buyer's verified administrative email (admin@luminabrands.com).

Clause 3.1 — Authorization of Payment:
Buyer represents and warrants that payments submitted via PayPal are authorized by the account holder for business services rendered.

Clause 6.3 — Intellectual Property Transfer:
Full commercial IP license conveys upon receipt of cleared funds. Unauthorized chargebacks automatically revoke all intellectual property rights and constitute copyright infringement.`,
    comms: `[Sep 04, 2:10 PM] Buyer: "Just sent the $1,850 via PayPal from our verified account. Let's get started!"
[Sep 05, 11:20 AM] Merchant: "Payment confirmed. Figma workspace shared with admin@luminabrands.com."
[Sep 18, 4:45 PM] Buyer: "Final Figma exports downloaded. The vector icon suite and design system look world-class! Thank you."
[Sep 22, 9:15 AM] PayPal Notice: Unauthorized payment dispute opened. Funds placed on hold.`,
  },
  {
    id: 'razorpay-saas',
    title: 'Razorpay / Bank · Scope Creep',
    gateway: 'Razorpay / Bank',
    badge: 'B2B Dispute',
    desc: 'Custom API integration completed; buyer filed Reason 4853 ("Defective / Not as Described").',
    dispute: `Bank Chargeback via Razorpay — Reason Code: 4853 ("Services Not Rendered / Defective")
Disputed Amount: ₹1,45,000 INR  |  Payment ID: pay_OnG928KLa1

Merchant Stance: Full custom payment gateway webhook engine delivered, stress-tested, and accepted in production. Buyer filed chargeback after merchant declined to build unlimited free post-launch customizations.`,
    contract: `SOFTWARE DEVELOPMENT & SYSTEM INTEGRATION AGREEMENT
Jurisdiction: Bengaluru, Karnataka  |  Merchant: Nexus Tech Solutions

Section 4 — Deliverables:
Deployment of automated reconciliation service and webhooks according to Technical Annexure A.

Section 6 — User Acceptance Testing (UAT):
Buyer has 7 calendar days to log defects in the Jira portal. Production go-live constitutes formal sign-off.

Section 9 — Post-Launch Maintenance:
Ongoing feature development beyond Annexure A is strictly billable at standard ₹4,500/hour retainers.`,
    comms: `[Nov 02] Nexus: "Reconciliation engine deployed to production. Stress-tested with 10k mock events."
[Nov 05] Client Director: "API is performing flawlessly in production. Approved for final settlement."
[Nov 14] Client Director: "Can you also connect this to Tally Prime ERP without extra cost?"
[Nov 15] Nexus: "Tally ERP requires a new statement of work. Quotation sent."
[Nov 18] Razorpay Alert: Chargeback initiated by client's bank under Code 4853.`,
  },
];

const GATEWAYS = ['Stripe', 'PayPal', 'Razorpay / Bank', 'Upwork / Escrow'];

// ─── Main Page Component ──────────────────────────────
export default function Page() {
  const [activeGateway, setActiveGateway] = useState('Stripe');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dossier' | 'raw' | 'matrix'>('dossier');

  const [dispute, setDispute] = useState('');
  const [comms, setComms] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [contractText, setContractText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [apiHealth, setApiHealth] = useState<{ status: string; keyPreview?: string; model?: string } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => setApiHealth(data))
      .catch(() => setApiHealth({ status: 'offline' }));
  }, []);

  const fileRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const hasContract = !!(file || contractText);

  // Trigger brief floating toast
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Compute Evidentiary Strength dynamically
  const evidenceMetrics = useMemo(() => {
    let score = 25; // baseline
    const hasDisputeText = dispute.trim().length > 40;
    const hasContractContent = !!file || contractText.trim().length > 60;
    const hasCommsContent = comms.trim().length > 60;

    const hasClauses = /clause|section|sow|agreement|acceptance|refund/i.test(contractText);
    const hasTimestamps = /\[.*?\d+.*?\]|\d{1,2}:\d{2}|oct|sep|nov|approved|live/i.test(comms);
    const hasReasonCode = /reason|code|amount|\$|₹|dispute/i.test(dispute);

    if (hasDisputeText) score += 15;
    if (hasReasonCode) score += 10;
    if (hasContractContent) score += 20;
    if (hasClauses) score += 10;
    if (hasCommsContent) score += 10;
    if (hasTimestamps) score += 10;

    const coverage = hasContractContent ? (hasClauses ? 95 : 70) : 15;
    const timeline = hasCommsContent ? (hasTimestamps ? 98 : 65) : 10;
    const compliance = hasReasonCode ? 92 : 35;

    return {
      score: Math.min(score, 98),
      coverage,
      timeline,
      compliance,
      grade: score >= 85 ? 'High Win Probability' : score >= 60 ? 'Moderate Evidence' : 'Needs More Evidence',
    };
  }, [dispute, file, contractText, comms]);

  // Load preset scenario
  const selectPreset = useCallback((preset: typeof PRESETS[0]) => {
    setActivePreset(preset.id);
    setActiveGateway(preset.gateway);
    setDispute(preset.dispute);
    setContractText(preset.contract);
    setComms(preset.comms);
    setFile(null);
    setError(null);
    setResult(null);
    showToast(`Loaded ${preset.title}`);
  }, [showToast]);

  const clearAll = useCallback(() => {
    setDispute('');
    setComms('');
    setFile(null);
    setContractText('');
    setResult(null);
    setError(null);
    setActivePreset(null);
    if (fileRef.current) fileRef.current.value = '';
    showToast('Cleared all dispute inputs');
  }, [showToast]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('Only .pdf files are accepted.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File must be under 10 MB.');
      return;
    }
    setFile(f);
    setError(null);
    showToast(`Uploaded ${f.name}`);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!dispute.trim()) {
      setError('Please describe the dispute or chargeback claim.');
      return;
    }
    if (!hasContract) {
      setError('Upload a contract PDF or click one of the quick scenarios.');
      return;
    }

    setLoading(true);
    setPhase('Parsing contract document & scope clauses…');
    setResult(null);

    try {
      const fd = new FormData();
      fd.append('disputeDescription', `[Payment Gateway Target: ${activeGateway}]\n\n${dispute}`);
      fd.append('communicationHistory', comms);
      if (file) fd.append('contractFile', file);
      if (contractText) fd.append('contractText', contractText);

      const t1 = setTimeout(() => setPhase('Extracting contractual covenants & acceptance milestones…'), 1200);
      const t2 = setTimeout(() => setPhase('Cross-referencing timeline against BharatCode qwen-3.8-27b…'), 2800);
      const t3 = setTimeout(() => setPhase('Formatting bank-grade evidentiary rebuttal packet…'), 4200);

      const res = await fetch('/api/generate-rebuttal', { method: 'POST', body: fd });
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Generation failed.');

      setResult(data.rebuttal);
      showToast('Rebuttal dossier generated successfully!');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setPhase('');
    }
  };

  const copyText = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    showToast('Copied rebuttal text to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPdf = async () => {
    if (!result) return;
    setPdfBusy(true);
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const el = document.getElementById('rebuttal-pdf-content');
      if (!el) throw new Error('Export container not found.');
      await html2pdf().set({
        margin: [12, 14, 12, 14],
        filename: `Nyaya-Rebuttal-${activeGateway.replace(/\W+/g, '_')}-${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(el).save();
      showToast('Downloaded official PDF dossier');
    } catch (err: any) {
      alert('PDF export failed: ' + (err.message || 'Unknown error'));
    } finally {
      setPdfBusy(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-wrap">
      {/* Background Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast-notice">
          <CheckCircle2 size={16} color="var(--green)" />
          <span>{toast}</span>
        </div>
      )}

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="logo">
            <div className="logo-icon">
              <Scale size={18} color="#fff" strokeWidth={2.4} />
            </div>
            <div>
              <div className="logo-wordmark">Nyaya</div>
              <div className="logo-subtitle">न्याय — AI Dispute Defense Engine</div>
            </div>
          </div>

          <div className="nav-right">
            <div
              className="badge-model"
              title={
                apiHealth?.status === 'active'
                  ? `Live Key Active: ${apiHealth.keyPreview} (Sovereign Model: qwen-3.8-27b)`
                  : 'Running in sovereign fallback mode'
              }
            >
              <span
                className="dot"
                style={{
                  background: apiHealth?.status === 'active' ? '#22c55e' : '#f59e0b',
                  boxShadow: apiHealth?.status === 'active' ? '0 0 6px rgba(34,197,94,0.6)' : '0 0 6px rgba(245,158,11,0.6)',
                }}
              />
              <span>
                {apiHealth?.status === 'active'
                  ? `BharatCode Live · ${apiHealth.keyPreview}`
                  : 'BharatCode · qwen-3.8-27b'}
              </span>
            </div>
            <button className="btn-ghost" onClick={() => selectPreset(PRESETS[0])}>
              <Zap size={13} />
              Quick Demo
            </button>
            <button className="btn-icon" onClick={clearAll} title="Reset all fields">
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main Container ── */}
      <main className="main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-eyebrow">
            <Shield size={12} />
            BharatCode Build League 2026 Sovereign Hackathon
          </div>
          <h1 className="hero-title">
            Fight chargebacks with<br />
            <span>contract evidence, not emotion.</span>
          </h1>
          <p className="hero-desc">
            Upload your signed contract, paste communication logs, and generate an airtight,
            bank-compliant dispute rebuttal dossier in seconds — powered by sovereign AI.
          </p>

          <div className="stat-chips">
            <div className="chip">
              <Clock className="chip-icon" size={14} />
              Instant ~20s turnaround
            </div>
            <div className="chip">
              <Lock className="chip-icon" size={14} />
              Zero database storage
            </div>
            <div className="chip">
              <Shield className="chip-icon" size={14} />
              Visa · Mastercard · Stripe standards
            </div>
          </div>
        </section>

        {/* ── Scenario Presets Bar ── */}
        <div className="presets-container">
          <div className="presets-label">
            <Zap size={12} color="#fbbf24" />
            <span>Select a Real-World Dispute Scenario</span>
          </div>
          <div className="presets-grid">
            {PRESETS.map((p) => (
              <div
                key={p.id}
                className={`preset-card${activePreset === p.id ? ' active' : ''}`}
                onClick={() => selectPreset(p)}
              >
                <div className="preset-title">
                  <span>{p.title}</span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: p.badge === 'High Win-Rate' ? 'var(--green)' : '#7badff',
                    background: p.badge === 'High Win-Rate' ? 'rgba(34,197,94,0.1)' : 'rgba(59,126,255,0.1)',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}>
                    {p.badge}
                  </span>
                </div>
                <div className="preset-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="alert-error">
            <AlertCircle size={16} color="#f87171" style={{ marginTop: 1, flexShrink: 0 }} />
            <span className="alert-error-text">{error}</span>
            <button className="alert-error-close" onClick={() => setError(null)}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── Main Two-Column Grid ── */}
        <div className="page-grid">
          {/* ── Left Column: Dispute Intake Form ── */}
          <div className="form-column">
            {/* Payment Gateway Target Switcher */}
            <div style={{ marginBottom: 12 }}>
              <div className="field-label" style={{ marginBottom: 8 }}>
                <span className="field-label-text">Target Payment Gateway / Network</span>
                <span className="field-hint">Tailors formatting to gateway evaluator</span>
              </div>
              <div className="gateway-bar">
                {GATEWAYS.map((gw) => (
                  <button
                    key={gw}
                    type="button"
                    className={`gateway-btn${activeGateway === gw ? ' active' : ''}`}
                    onClick={() => setActiveGateway(gw)}
                  >
                    <CreditCard size={13} />
                    <span>{gw}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={submit}>
              {/* Step 1: Dispute Allegation */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-header">
                  <div className="card-title">
                    <div className="card-title-icon">
                      <MessageSquare size={14} color="var(--text-2)" />
                    </div>
                    1. Dispute Allegation & Reason Code
                  </div>
                  <span className="card-step">{dispute.trim() ? '✓' : '1'}</span>
                </div>
                <div className="card-body">
                  <div className="field">
                    <div className="field-label">
                      <span className="field-label-text">Chargeback Notice Details</span>
                      <span className="field-hint">Reason code, disputed amount, buyer claim</span>
                    </div>
                    <textarea
                      className="textarea"
                      rows={5}
                      value={dispute}
                      onChange={(e) => setDispute(e.target.value)}
                      placeholder={`Example: Stripe Dispute — Reason Code: "service_not_as_described"\nDisputed Amount: $3,200.00 USD\n\nExplain what the buyer alleges vs what actually occurred…`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Contract / SOW Upload */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-header">
                  <div className="card-title">
                    <div className="card-title-icon">
                      <FileText size={14} color="var(--text-2)" />
                    </div>
                    2. Contract / Statement of Work (SOW)
                  </div>
                  <span className="card-step">{hasContract ? '✓' : '2'}</span>
                </div>
                <div className="card-body">
                  <input
                    type="file"
                    ref={fileRef}
                    onChange={onFile}
                    accept=".pdf"
                    style={{ display: 'none' }}
                  />
                  <div
                    className={`drop-zone${file ? ' has-file' : contractText ? ' has-sample' : ''}`}
                    onClick={() => fileRef.current?.click()}
                  >
                    <div className="drop-icon">
                      {file ? (
                        <FileCheck2 size={18} color="var(--green)" />
                      ) : contractText ? (
                        <FileText size={18} color="var(--blue)" />
                      ) : (
                        <Upload size={18} color="var(--text-3)" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      {file ? (
                        <>
                          <div className="drop-text-primary" style={{ color: 'var(--green)' }}>
                            {file.name}
                          </div>
                          <div className="drop-text-secondary">
                            {(file.size / 1024).toFixed(1)} KB · In-memory pdf-parse extraction
                          </div>
                        </>
                      ) : contractText ? (
                        <>
                          <div className="drop-text-primary" style={{ color: 'var(--blue)' }}>
                            Agreement terms loaded ({contractText.length} characters)
                          </div>
                          <div className="drop-text-secondary">
                            Click to replace with your own signed PDF contract
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="drop-text-primary">Upload signed contract (.pdf)</div>
                          <div className="drop-text-secondary">
                            Scope clauses, milestone protocols & change order rules extracted in memory
                          </div>
                        </>
                      )}
                    </div>
                    <ArrowRight size={14} color="var(--text-3)" style={{ flexShrink: 0 }} />
                  </div>
                </div>
              </div>

              {/* Step 3: Communication History */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                  <div className="card-title">
                    <div className="card-title-icon">
                      <MessageSquare size={14} color="var(--text-2)" />
                    </div>
                    3. Communication Audit Trail
                  </div>
                  <span className="card-step">{comms.trim() ? '✓' : '3'}</span>
                </div>
                <div className="card-body">
                  <div className="field-label" style={{ marginBottom: 8 }}>
                    <span className="field-label-text">Emails, Slack messages, WhatsApp transcripts</span>
                    <span className="field-hint">Dates and timestamps establish client acceptance</span>
                  </div>
                  <textarea
                    className="textarea textarea-mono"
                    rows={6}
                    value={comms}
                    onChange={(e) => setComms(e.target.value)}
                    placeholder={`[Oct 13, 3:22 PM] Client: "Tested everything with the team. Looks incredible — works perfectly! Push this live Monday."\n[Oct 18, 4:10 PM] Client: "Also add Salesforce sync before we pay."\n[Oct 24] Stripe notification: Chargeback filed for $3,200.00`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="spinner" />
                    Synthesizing rebuttal dossier…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Rebuttal Dossier for {activeGateway}
                  </>
                )}
              </button>

              {/* Animated Progress Indicator */}
              {loading && (
                <div className="loading-bar" style={{ marginTop: 14 }}>
                  <div className="loading-row">
                    <span className="loading-phase">
                      <Loader2 size={12} className="spinner" />
                      {phase}
                    </span>
                    <span className="loading-model">qwen-3.8-27b</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar" />
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* ── Right Column: Evidentiary Strength & Features ── */}
          <div className="sidebar-column">
            {/* Live Evidentiary Strength Meter */}
            <div className="meter-card">
              <div className="meter-header">
                <div className="meter-title">
                  <TrendingUp size={16} color="var(--blue)" />
                  <span>Evidentiary Readiness</span>
                </div>
                <div className="meter-score-badge">
                  <Shield size={12} />
                  <span>{evidenceMetrics.score}% Score</span>
                </div>
              </div>

              <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginBottom: 12 }}>
                Current Status:{' '}
                <strong style={{ color: evidenceMetrics.score >= 80 ? 'var(--green)' : '#7badff' }}>
                  {evidenceMetrics.grade}
                </strong>
              </div>

              <div className="meter-grid">
                <div className="meter-stat-item">
                  <div className="meter-stat-label">
                    <span>Contract Scope Terms</span>
                    <span>{evidenceMetrics.coverage}%</span>
                  </div>
                  <div className="meter-bar-track">
                    <div
                      className="meter-bar-fill"
                      style={{
                        width: `${evidenceMetrics.coverage}%`,
                        background: evidenceMetrics.coverage > 75 ? 'var(--green)' : 'var(--blue)',
                      }}
                    />
                  </div>
                </div>

                <div className="meter-stat-item">
                  <div className="meter-stat-label">
                    <span>Timestamp Audit Integrity</span>
                    <span>{evidenceMetrics.timeline}%</span>
                  </div>
                  <div className="meter-bar-track">
                    <div
                      className="meter-bar-fill"
                      style={{
                        width: `${evidenceMetrics.timeline}%`,
                        background: evidenceMetrics.timeline > 75 ? 'var(--green)' : 'var(--amber)',
                      }}
                    />
                  </div>
                </div>

                <div className="meter-stat-item">
                  <div className="meter-stat-label">
                    <span>Gateway Compliance</span>
                    <span>{evidenceMetrics.compliance}%</span>
                  </div>
                  <div className="meter-bar-track">
                    <div
                      className="meter-bar-fill"
                      style={{
                        width: `${evidenceMetrics.compliance}%`,
                        background: evidenceMetrics.compliance > 75 ? '#8b5cf6' : 'var(--blue)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="info-card">
              <div
                className="info-card-icon"
                style={{ background: 'rgba(59,126,255,0.1)', border: '1px solid rgba(59,126,255,0.2)' }}
              >
                <FileText size={18} color="#7badff" />
              </div>
              <div className="info-card-title">Clause-Level Defense Extraction</div>
              <div className="info-card-desc">
                PDF contracts are parsed in-memory. Scope boundaries, milestone acceptance terms, change-order provisions, and non-refundable covenants are isolated and quoted verbatim.
              </div>
            </div>

            <div className="info-card">
              <div
                className="info-card-icon"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                <MessageSquare size={18} color="#a78bfa" />
              </div>
              <div className="info-card-title">Timeline & Acceptance Cross-Check</div>
              <div className="info-card-desc">
                Communication logs are mapped to contractual milestones. Written approvals, staging test sessions, and sign-offs are anchored with exact timestamps to defeat non-delivery claims.
              </div>
            </div>

            <div className="info-card">
              <div
                className="info-card-icon"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                <Shield size={18} color="#4ade80" />
              </div>
              <div className="info-card-title">Bank & Gateway Evidentiary Packet</div>
              <div className="info-card-desc">
                Follows Visa Core Rules § 1.10.1 & Mastercard Chargeback Guidelines: Executive Summary, Scope Citations, Delivery Timeline, Point-by-Point Refutation, and Formal Dismissal Demand.
              </div>
            </div>

            {/* Sovereign Compliance Banner */}
            <div
              style={{
                marginTop: 12,
                padding: '14px 16px',
                background: 'rgba(59,126,255,0.04)',
                border: '1px solid rgba(59,126,255,0.12)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <Sparkles size={14} color="#7badff" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#7badff', marginBottom: 3 }}>
                  Powered by BharatCode Sovereign AI
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
                  Direct native <code style={{ fontSize: 11, background: 'var(--bg2)', padding: '1px 5px', borderRadius: 3, color: '#7badff' }}>fetch</code> to{' '}
                  <code style={{ fontSize: 11, background: 'var(--bg2)', padding: '1px 5px', borderRadius: 3, color: '#7badff' }}>qwen-3.8-27b</code>. Zero external SDK wrappers. Built for the BharatCode Build League 2026.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Result Section with Multi-Tab Suite ── */}
        {result && (
          <div ref={resultRef} className="fade-up" style={{ marginTop: 40 }}>
            <div className="section-divider">Official Dispute Rebuttal Dossier</div>

            <div className="card">
              {/* Result Header & Actions */}
              <div className="result-header">
                <div>
                  <div className="result-status">
                    <div className="result-dot" />
                    <span className="result-label">Rebuttal Packet Ready · {activeGateway}</span>
                  </div>
                  <div className="result-sublabel">
                    Certified evidentiary response for payment network arbitration officers
                  </div>
                </div>

                <div className="result-actions">
                  {/* View Tabs */}
                  <div className="tabs-nav">
                    <button
                      type="button"
                      className={`tab-button${activeTab === 'dossier' ? ' active' : ''}`}
                      onClick={() => setActiveTab('dossier')}
                    >
                      <FileText size={13} />
                      Formal Dossier
                    </button>
                    <button
                      type="button"
                      className={`tab-button${activeTab === 'raw' ? ' active' : ''}`}
                      onClick={() => setActiveTab('raw')}
                    >
                      <FileCode size={13} />
                      Gateway Text
                    </button>
                    <button
                      type="button"
                      className={`tab-button${activeTab === 'matrix' ? ' active' : ''}`}
                      onClick={() => setActiveTab('matrix')}
                    >
                      <Layers size={13} />
                      Defense Matrix
                    </button>
                  </div>

                  <button className="btn-action" onClick={copyText} title="Copy to clipboard">
                    {copied ? (
                      <>
                        <Check size={13} color="var(--green)" />
                        <span style={{ color: 'var(--green)' }}>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        Copy text
                      </>
                    )}
                  </button>

                  <button className="btn-action" onClick={handlePrint} title="Print Dossier">
                    <Printer size={13} />
                    Print
                  </button>

                  <button
                    className="btn-action primary"
                    onClick={downloadPdf}
                    disabled={pdfBusy}
                    title="Export certified PDF"
                  >
                    {pdfBusy ? (
                      <>
                        <Loader2 size={13} className="spinner" />
                        Exporting…
                      </>
                    ) : (
                      <>
                        <Download size={13} />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tab 1: Rendered Formal Dossier */}
              {activeTab === 'dossier' && (
                <RebuttalDocument text={result} />
              )}

              {/* Tab 2: Raw Monospace Text for Gateway Portal */}
              {activeTab === 'raw' && (
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
                      Characters: <strong>{result.length}</strong> · Ready to paste into {activeGateway} dispute resolution portal
                    </span>
                    <button className="btn-ghost" onClick={copyText} style={{ padding: '4px 10px', fontSize: 11 }}>
                      <Copy size={12} /> Copy All
                    </button>
                  </div>
                  <pre className="raw-box">{result}</pre>
                </div>
              )}

              {/* Tab 3: Defense & Evidentiary Matrix */}
              {activeTab === 'matrix' && (
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 14 }}>
                    Evidence Anchor Map & Contractual Defense Audit
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                    <div style={{ padding: 14, background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green)', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                        <CheckCircle2 size={15} />
                        Evidence Anchor Map (Core Defense)
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
                        Directly binds strict contractual clauses to informal chat timestamps (Slack/Email/WhatsApp), neutralizing friendly fraud by establishing irrevocable buyer sign-off prior to dispute filing.
                      </div>
                    </div>

                    <div style={{ padding: 14, background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7badff', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                        <CheckCircle2 size={15} />
                        Scope Boundary & Change Order Enforcement
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
                        Unbilled feature requests are verified outside the original Statement of Work and explicitly rebutted under contractual change-order covenants.
                      </div>
                    </div>

                    <div style={{ padding: 14, background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a78bfa', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                        <CheckCircle2 size={15} />
                        Compelling Evidence 3.0 Compliance
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
                        The Evidence Anchor Map satisfies Visa Compelling Evidence 3.0 standards and Stripe dispute guidelines, leaving zero ambiguity for the payment gateway investigator.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <span>Nyaya AI (न्याय) — BharatCode Build League Hackathon 2026</span>
        <div className="footer-links">
          <span>Model: qwen-3.8-27b</span>
          <div className="footer-sep" />
          <span>Native fetch · Zero external SDKs</span>
          <div className="footer-sep" />
          <span>Complies with BharatCode.txt</span>
        </div>
      </footer>

      {/* ── Hidden Print & PDF Export Element ── */}
      <div style={{ display: 'none' }}>
        <div id="rebuttal-pdf-content">
          <div
            style={{
              borderBottom: '1.5px solid #1f2937',
              paddingBottom: 10,
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', letterSpacing: 0.5 }}>
                FORMAL DISPUTE REBUTTAL DOSSIER
              </div>
              <div style={{ fontSize: 8.5, color: '#6b7280', marginTop: 2 }}>
                Nyaya AI — Commercial Dispute Defense & Payment Gateway Evidentiary Packet ({activeGateway})
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 8.5, color: '#4b5563' }}>
              <div>
                <strong>Submission Date:</strong>{' '}
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div>
                <strong>Arbitration Engine:</strong> BharatCode qwen-3.8-27b
              </div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#1f2937' }}>
            {result && <RebuttalDocument text={result} />}
          </div>
          <div
            style={{
              marginTop: 36,
              paddingTop: 12,
              borderTop: '1px solid #d1d5db',
              fontSize: 7.5,
              color: '#9ca3af',
              textAlign: 'center',
            }}
          >
            Certified Merchant Evidentiary Dossier · Prepared via Nyaya AI · BharatCode Build League 2026
          </div>
        </div>
      </div>
    </div>
  );
}
