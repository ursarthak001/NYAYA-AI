'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Scale,
  Zap,
  RotateCcw,
  Shield,
  Clock,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  FileText,
  FileCheck2,
  Loader2,
  Download,
  Copy,
  Check,
  Printer,
  Layers,
  FileCode,
  Trash2,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { GatewayType, DisputePreset, ApiHealthState, EvidentiaryMetrics } from '@/types';
import { PRESETS, GATEWAYS } from '@/lib/constants';
import { RebuttalDocument } from '@/components/RebuttalDocument';
import { DefenseMatrix } from '@/components/DefenseMatrix';
import { Logo } from '@/components/Logo';

export default function Page() {
  // ─── Functional State Hooks (Preserved as required) ───────────
  const [loading, setLoading] = useState(false);
  const [rebuttal, setRebuttal] = useState<string | null>(null);

  // ─── Form Inputs State ────────────────────────────────────────
  const [disputeDescription, setDisputeDescription] = useState('');
  const [communicationHistory, setCommunicationHistory] = useState('');
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [contractText, setContractText] = useState('');

  // ─── Auxiliary UI & Evidentiary State ─────────────────────────
  const [activeGateway, setActiveGateway] = useState<GatewayType>('Stripe');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [chargeId, setChargeId] = useState('ch_3Mqat2Enz8V9kL0x ($3,200.00 USD)');
  const [reasonCode, setReasonCode] = useState('10.4: Other Fraud - Card Absent');
  const [phase, setPhase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [apiHealth, setApiHealth] = useState<ApiHealthState | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [activeTab, setActiveTab] = useState<'dossier' | 'raw' | 'matrix'>('dossier');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputPaneRef = useRef<HTMLDivElement>(null);

  // Check live API health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data: ApiHealthState) => setApiHealth(data))
      .catch(() => setApiHealth({ status: 'offline' }));
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Compute Evidentiary Strength dynamically
  const evidenceMetrics: EvidentiaryMetrics = useMemo(() => {
    let score = 25; // 25% baseline score as requested
    const hasDisputeText = disputeDescription.trim().length > 40;
    const hasContractContent = !!contractFile || contractText.trim().length > 60;
    const hasCommsContent = communicationHistory.trim().length > 60;

    const hasClauses = /clause|section|sow|agreement|acceptance|refund|milestone/i.test(contractText);
    const hasTimestamps = /\[.*?\d+.*?\]|\d{1,2}:\d{2}|oct|sep|nov|approved|live/i.test(communicationHistory);
    const hasReasonCode = /reason|code|amount|\$|₹|dispute|10\.4|4853|13\.1/i.test(disputeDescription);

    if (hasDisputeText) score += 15;
    if (hasReasonCode) score += 10;
    if (hasContractContent) score += 20;
    if (hasClauses) score += 10;
    if (hasCommsContent) score += 10;
    if (hasTimestamps) score += 10;

    const coverage = hasContractContent ? (hasClauses ? 95 : 70) : 35;
    const timeline = hasCommsContent ? (hasTimestamps ? 98 : 65) : 20;
    const compliance = hasReasonCode ? 92 : 20;

    return {
      score: Math.min(score, 98),
      coverage,
      timeline,
      compliance,
      grade:
        score >= 85
          ? 'High Win Probability'
          : score >= 60
          ? 'Moderate Evidence'
          : 'Preliminary State',
    };
  }, [disputeDescription, contractFile, contractText, communicationHistory]);

  // Load preset scenario into the form
  const selectPreset = useCallback(
    (preset: DisputePreset) => {
      setActivePreset(preset.id);
      setActiveGateway(preset.gateway as GatewayType);
      setDisputeDescription(preset.dispute);
      setContractText(preset.contract);
      setCommunicationHistory(preset.comms);
      setContractFile(null);
      setError(null);
      setRebuttal(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      showToast(`Loaded ${preset.title}`);
    },
    [showToast]
  );

  // Clear all inputs & reset state
  const clearAll = useCallback(() => {
    setDisputeDescription('');
    setCommunicationHistory('');
    setContractFile(null);
    setContractText('');
    setRebuttal(null);
    setError(null);
    setActivePreset(null);
    setAgreedToTerms(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Reset dispute workbench');
  }, [showToast]);

  const handleFileChange = (f: File | null | undefined) => {
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Only .pdf files are accepted.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File exceeds 5MB limit.');
      return;
    }
    setContractFile(f);
    setContractText('');
    setError(null);
    showToast(`Attached ${f.name}`);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setContractFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Removed contract file');
  };

  // ─── Required handleSubmit function using new FormData(e.currentTarget) ───
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy before proceeding.');
      return;
    }
    if (!disputeDescription.trim()) {
      setError('Please provide the customer dispute allegation or chargeback claim.');
      return;
    }
    if (!contractFile && !contractText.trim()) {
      setError('Please upload an executed contract PDF or select a scenario preset.');
      return;
    }

    setLoading(true);
    setPhase('Parsing contract document & scope clauses…');
    setRebuttal(null);

    try {
      const formData = new FormData(e.currentTarget);

      // If contractText exists from preset and no file was selected, ensure contractText is appended
      if (contractText && (!contractFile || contractFile.size === 0)) {
        if (!formData.get('contractText')) {
          formData.append('contractText', contractText);
        }
      }

      // Ensure active gateway is noted in form data
      if (!formData.get('gateway')) {
        formData.append('gateway', activeGateway);
      }

      const t1 = setTimeout(
        () => setPhase('Extracting contractual covenants & acceptance milestones…'),
        1200
      );
      const t2 = setTimeout(
        () => setPhase('Generating Evidence Anchor Map with BharatCode qwen-3.8-27b…'),
        2800
      );
      const t3 = setTimeout(
        () => setPhase('Formatting bank-grade evidentiary rebuttal packet…'),
        4200
      );

      const res = await fetch('/api/generate-rebuttal', {
        method: 'POST',
        body: formData,
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate rebuttal.');
      }

      setRebuttal(data.rebuttal);
      showToast('Rebuttal dossier compiled successfully.');
      setTimeout(() => {
        outputPaneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setPhase('');
    }
  };

  // ─── Required exportPDF function using html2pdf.js ─────────────
  const exportPDF = async () => {
    if (!rebuttal) return;
    setPdfBusy(true);
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const el = document.getElementById('rebuttal-pdf-export-content');
      if (!el) throw new Error('Export container not found.');
      await html2pdf()
        .set({
          margin: [12, 14, 12, 14],
          filename: `Nyaya-Chargeback-Rebuttal-${activeGateway.replace(/\W+/g, '_')}-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(el)
        .save();
      showToast('PDF downloaded successfully.');
    } catch (err: any) {
      alert('PDF export failed: ' + (err.message || 'Unknown error'));
    } finally {
      setPdfBusy(false);
    }
  };

  const copyRebuttalText = () => {
    if (!rebuttal) return;
    navigator.clipboard.writeText(rebuttal);
    setCopied(true);
    showToast('Copied rebuttal text to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const isLive = apiHealth?.status === 'active';

  return (
    <div className="min-h-screen bg-[#f6f6f4] text-neutral-900 font-sans antialiased selection:bg-black selection:text-white relative bg-technical-dots">
      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-6 z-50 flex items-center space-x-2 px-4 py-2 rounded-full bg-black text-white text-xs shadow-none border border-neutral-800 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span className="font-mono">{toast}</span>
        </div>
      )}

      {/* ── Top Header Bar (Ultra-Minimalist & Flat) ── */}
      <header className="w-full border-b border-neutral-200 bg-white/95 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Brand & Technical Jurisprudence Tag */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-85 transition cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center p-1.5 shadow-sm">
              <Logo size={20} className="text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm tracking-tight text-black uppercase">
                NYAYA
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-neutral-200 bg-neutral-100 text-neutral-700">
                न्याय · ENGINE
              </span>
            </div>
          </Link>

          {/* Center Technical Pill */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-mono">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLive ? 'bg-black animate-pulse' : 'bg-neutral-400'
              }`}
            />
            <span className="text-neutral-700 text-[11px]">
              {isLive
                ? `BHARATCODE LIVE · ${apiHealth?.keyPreview || 'bc_live...6dD0'}`
                : 'BHARATCODE · SOVEREIGN FALLBACK'}
            </span>
            <span className="text-neutral-300">|</span>
            <span className="text-neutral-900 font-medium text-[11px]">qwen-3.8-27b</span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => selectPreset(PRESETS[0])}
              type="button"
              className="rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-black px-3.5 py-1 text-xs font-mono font-medium text-black transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-black" />
              <span>DEMO_PRESET</span>
            </button>
            <button
              onClick={clearAll}
              title="Reset Workbench"
              type="button"
              className="rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-black p-1.5 text-neutral-600 hover:text-black transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Protocol Banner */}
        <div className="flex items-center justify-center mb-6">
          <div className="rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-[11px] font-mono text-neutral-600 uppercase tracking-wider inline-flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-black" />
            <span>BHARATCODE BUILD LEAGUE 2026 &middot; SOVEREIGN ARBITRATION PROTOCOL</span>
          </div>
        </div>

        {/* Display Header (Structural / Pixelated Font Simulation) */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-tight">
            FIGHT CHARGEBACKS WITH <br />
            <span className="bg-black text-white px-3 py-1 font-mono inline-block my-1 rounded-sm">
              CONTRACT EVIDENCE
            </span>{' '}
            <br className="hidden sm:inline" />
            NOT EMOTION.
          </h1>
          <p className="text-neutral-500 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed mt-4">
            Upload your signed Statement of Work, paste communication history, and generate an airtight,
            bank-compliant dispute rebuttal dossier with an{' '}
            <strong className="text-black font-medium">Evidence Anchor Map</strong> in seconds.
          </p>

          {/* Technical Pill Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs font-mono text-neutral-600">
            <div className="rounded-full border border-neutral-200 bg-white px-3.5 py-1 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-black" />
              <span>~20s Turnaround</span>
            </div>
            <div className="rounded-full border border-neutral-200 bg-white px-3.5 py-1 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-black" />
              <span>Zero Database Retention</span>
            </div>
            <div className="rounded-full border border-neutral-200 bg-white px-3.5 py-1 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-black" />
              <span>Visa · Mastercard · Stripe Standards</span>
            </div>
          </div>
        </div>

        {/* Quick Scenario Presets */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-3">
            <Zap className="w-3.5 h-3.5 text-black" />
            <span>[ REAL-WORLD DISPUTE SCENARIOS &middot; SELECT ONE TO TEST ]</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESETS.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectPreset(preset)}
                  className={`text-left p-4 rounded-xl bg-white border transition cursor-pointer ${
                    isSelected
                      ? 'border-black ring-1 ring-black bg-neutral-50/50'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-black uppercase">
                      {preset.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-neutral-200 bg-neutral-100 text-neutral-800">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    {preset.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-white border border-rose-300 flex items-start justify-between text-neutral-900 text-xs font-mono">
            <div className="flex items-start space-x-2.5">
              <AlertCircle size={15} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              type="button"
              className="text-neutral-400 hover:text-black p-0.5 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── MAIN TWO-COLUMN GRID LAYOUT (60% Form / 40% Status & Output Preview) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ══════════════════════════════════════════════════════════
              LEFT COLUMN: 60% (The Form - CRITICAL FIELDS)
             ══════════════════════════════════════════════════════════ */}
          <section className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hidden fields to preserve state through standard new FormData(e.currentTarget) */}
              <input type="hidden" name="contractText" value={contractText} />
              <input type="hidden" name="gateway" value={activeGateway} />

              {/* Target Gateway Selector */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-900">
                    TARGET PAYMENT GATEWAY / CARD NETWORK
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Arbitration standard
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GATEWAYS.map((gw) => (
                    <button
                      key={gw}
                      type="button"
                      onClick={() => setActiveGateway(gw)}
                      className={`py-2 px-3 rounded-full text-xs font-mono font-medium transition cursor-pointer border text-center ${
                        activeGateway === gw
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-black'
                      }`}
                    >
                      {gw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step Card 1: Dispute Allegation & Reason Code */}
              <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-black">[01]</span>
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-black">
                      Dispute Allegation &amp; Reason Code
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
                    {activeGateway} &middot; VISA CE 3.0
                  </span>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                  Specify the gateway charge ID, disputed amount, card network reason code, and the claimant&apos;s initial dispute statement.
                </p>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-600 uppercase tracking-wider mb-1">
                        Charge ID / Case Ref
                      </label>
                      <input
                        type="text"
                        value={chargeId}
                        onChange={(e) => setChargeId(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-600 uppercase tracking-wider mb-1">
                        Reason Code
                      </label>
                      <select
                        value={reasonCode}
                        onChange={(e) => setReasonCode(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                      >
                        <option value="10.4: Other Fraud - Card Absent">10.4: Other Fraud - Card Absent</option>
                        <option value="4853: Goods/Services Not Provided / Defective">4853: Goods/Services Not Provided / Defective</option>
                        <option value="13.1: Merchandise / Services Not Received">13.1: Merchandise / Services Not Received</option>
                        <option value="4837: Fraudulent Transaction - No Authorization">4837: Fraudulent Transaction - No Authorization</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="disputeDescription"
                      className="block text-[11px] font-mono text-neutral-600 uppercase tracking-wider mb-1"
                    >
                      Customer Claim Narrative &amp; Allegation
                    </label>
                    <textarea
                      id="disputeDescription"
                      name="disputeDescription"
                      rows={5}
                      value={disputeDescription}
                      onChange={(e) => setDisputeDescription(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-lg p-3 text-xs font-sans text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition leading-relaxed"
                      placeholder="Paste dispute claim details e.g., 'Customer claims via Stripe dispute portal that deliverables were never transferred, arguing code in repository did not work and demanding full $3,200 refund on Visa card ending in 4242 under reason code 10.4 Fraud / Services Not Rendered...'"
                      required
                    />
                  </div>

                  {/* Indicator Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-mono text-neutral-400">INDICATORS:</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                      #VISA_CE_3.0_ELIGIBLE
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                      #REASON_10.4
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                      #B2B_DIGITAL_IP
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Card 2: Contract / Statement of Work (SOW) */}
              <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-black">[02]</span>
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-black">
                      Contract / Statement of Work (SOW)
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-600 flex items-center space-x-1">
                    <CheckCircle2 size={12} className="text-black" />
                    <span>PDF Parser Active</span>
                  </span>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                  Upload the executed Master Services Agreement, Statement of Work (SOW), or digital sign-off document.
                </p>

                {/* Flat Drag-and-Drop File Upload Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const dropped = e.dataTransfer.files?.[0];
                    handleFileChange(dropped);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                    isDragging
                      ? 'border-black bg-neutral-100'
                      : contractFile
                      ? 'border-neutral-900 bg-neutral-50/70'
                      : contractText
                      ? 'border-neutral-400 bg-neutral-50/40'
                      : 'border-neutral-300 hover:border-black bg-white hover:bg-neutral-50/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="contractFile"
                    name="contractFile"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    <div className="w-9 h-9 rounded-full border border-neutral-200 bg-neutral-50 flex items-center justify-center text-black">
                      {contractFile ? (
                        <FileCheck2 className="w-4 h-4" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-mono font-medium text-black">
                        <span className="underline underline-offset-2">Click to select PDF</span> or drag and drop file
                      </p>
                      <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                        Supports signed agreements up to 5MB (DocuSign, PandaDoc, Adobe Sign, or countersigned scans)
                      </p>
                    </div>

                    {/* Attached File Pill */}
                    {contractFile && (
                      <div className="mt-2 inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-neutral-300 bg-white text-xs font-mono text-black pointer-events-auto">
                        <FileText size={13} className="text-black flex-shrink-0" />
                        <span className="font-medium text-[11px] max-w-xs truncate">
                          {contractFile.name} ({(contractFile.size / 1024).toFixed(1)} KB)
                        </span>
                        <span className="text-neutral-400 text-[10px]">
                          &middot; Attached
                        </span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-neutral-400 hover:text-black transition p-0.5 cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}

                    {/* Preset SOW Pill */}
                    {!contractFile && contractText && (
                      <div className="mt-2 inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-100 text-xs font-mono text-neutral-800 pointer-events-auto">
                        <FileText size={13} className="text-black flex-shrink-0" />
                        <span className="font-medium text-[11px]">
                          Preset Contract SOW Loaded ({contractText.length} chars)
                        </span>
                        <span className="text-neutral-500 text-[10px]">
                          &middot; Click to replace with your own PDF
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Clause Highlights */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    <span>Section 4.2 Non-Refundable Milestone</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    <span>Section 9.1 Deemed Acceptance (7-Day)</span>
                  </div>
                </div>
              </div>

              {/* Step Card 3: Communication Audit Trail */}
              <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-black">[03]</span>
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-black">
                      Communication Audit Trail
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
                    SLACK &middot; EMAIL &middot; WHATSAPP
                  </span>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                  Paste unedited, timestamped communication history showing explicit client review, approval timestamps, and deliverable handoffs.
                </p>

                <div className="relative">
                  <textarea
                    id="communicationHistory"
                    name="communicationHistory"
                    rows={6}
                    value={communicationHistory}
                    onChange={(e) => setCommunicationHistory(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg p-3 text-xs text-neutral-900 font-mono placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition leading-relaxed"
                    placeholder="[2024-10-12 14:22:04 UTC] Marcus Vance (Slack #client-staging): 'Staging deployment build verified. IP: 194.26.29.11 session confirmed and tested on our staging cluster.'&#10;[2024-10-12 16:45:10 UTC] Agency PM: 'Sending final deliverables SHA-256 bundle. Milestone 2 sign-off complete.'&#10;[2024-10-13 09:12:00 UTC] Marcus Vance: 'Looks great, thank you! Moving to production.'"
                  />
                  <div className="absolute top-2.5 right-3 text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200 pointer-events-none">
                    MONOSPACE AUDIT VIEW
                  </div>
                </div>

                {/* Mandatory Clickwrap Agreement */}
                <div className="border-t border-neutral-200 pt-4">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer"
                      required
                    />
                    <span className="text-xs text-neutral-700 leading-relaxed font-light">
                      I understand Nyaya AI is an administrative formatting tool, not a law firm, and this does not constitute legal advice. I agree to the{' '}
                      <Link
                        href="/terms"
                        className="text-black underline font-medium hover:text-neutral-700"
                      >
                        Terms of Service and Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                {/* Solid Black Pill Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !agreedToTerms}
                    className="w-full rounded-full bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed transition font-mono font-medium py-3 px-6 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SYNTHESIZING REBUTTAL DOSSIER…</span>
                      </>
                    ) : (
                      <>
                        <span>SYNTHESIZE &amp; COMPILE REBUTTAL DOSSIER</span>
                        <span className="opacity-60">&middot; qwen-3.8-27b</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>

                  {/* Loading Progress State */}
                  {loading && (
                    <div className="mt-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-black flex items-center space-x-1.5 font-medium">
                          <Loader2 size={12} className="animate-spin" />
                          <span>{phase}</span>
                        </span>
                        <span className="text-neutral-500 text-[11px]">BharatCode Sovereign</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-1 overflow-hidden">
                        <div className="bg-black h-1 rounded-full animate-pulse w-full" />
                      </div>
                    </div>
                  )}

                  {/* Muted Privacy Disclaimer */}
                  <p className="text-center text-[11px] text-neutral-500 mt-3 font-light leading-relaxed">
                    Files are processed entirely in-memory and never saved to our databases. However, extracted text is securely transmitted to the BharatCode API for AI processing. Do not upload files containing highly sensitive PII (Social Security Numbers, Credit Cards).
                  </p>
                </div>
              </div>
            </form>
          </section>

          {/* ══════════════════════════════════════════════════════════
              RIGHT COLUMN: 40% (Status & Output Preview)
             ══════════════════════════════════════════════════════════ */}
          <section className="lg:col-span-5 space-y-6" ref={outputPaneRef}>
            {!rebuttal ? (
              /* Case 1: Rebuttal is EMPTY -> Flat, Minimalist Info Cards */
              <>
                {/* Evidentiary Readiness Card */}
                <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
                  <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                        EVALUATION &middot; METRICS
                      </span>
                      <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black mt-0.5">
                        Evidentiary Readiness
                      </h3>
                      <p className="text-xs text-neutral-500 font-light mt-0.5">
                        Mathematical strength against bank arbitration guidelines
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="rounded-full bg-black text-white px-3 py-1 text-xs font-mono font-bold">
                        {evidenceMetrics.score}% Score
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 mt-1">
                        {evidenceMetrics.grade}
                      </span>
                    </div>
                  </div>

                  {/* Three Thin Flat Progress Bars */}
                  <div className="space-y-4 pt-1">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <span className="text-neutral-800">Contract Scope Terms</span>
                        <span className="text-neutral-500">{evidenceMetrics.coverage}%</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-black h-1 rounded-full transition-all duration-500"
                          style={{ width: `${evidenceMetrics.coverage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mt-1">
                        <span>{contractFile ? 'Executed PDF Attached' : contractText ? 'Clause 4.2 Parsed' : 'No SOW Attached'}</span>
                        <span className="text-neutral-700">{contractFile || contractText ? 'Verified Milestone Anchor' : 'Pending Contract Upload'}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <span className="text-neutral-800">Timestamp Audit Integrity</span>
                        <span className="text-neutral-500">{evidenceMetrics.timeline}%</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-black h-1 rounded-full transition-all duration-500"
                          style={{ width: `${evidenceMetrics.timeline}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mt-1">
                        <span>{communicationHistory ? 'Slack & WhatsApp Correlated' : 'Awaiting Communication Logs'}</span>
                        <span className="text-neutral-700">{communicationHistory ? 'Timestamps Verified' : 'Missing Server Auth Logs'}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <span className="text-neutral-800">Gateway Compliance</span>
                        <span className="text-neutral-500">{evidenceMetrics.compliance}%</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-black h-1 rounded-full transition-all duration-500"
                          style={{ width: `${evidenceMetrics.compliance}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mt-1">
                        <span>{activeGateway} Rules Match</span>
                        <span className="text-neutral-700">Visa CE 3.0 Standard</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-3 flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500">Win Rate Projection:</span>
                    <span className="font-bold text-black">88.4% with full audit trail</span>
                  </div>
                </div>

                {/* Flat Informational Cards */}
                <div className="space-y-4">
                  {/* Card 1: Evidence Anchor Map */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-center space-x-2 border-b border-neutral-100 pb-2.5">
                      <Shield className="w-3.5 h-3.5 text-black" />
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                        Evidence Anchor Map
                      </h4>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 space-y-1">
                        <div className="flex items-center space-x-1.5 font-mono text-[11px] font-semibold text-black">
                          <span>&check;</span>
                          <span>Contract Clause 9.1 &rarr; Acceptance Conferred</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-light pl-3.5">
                          Deemed approved automatically 72h after staging link transmission.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 space-y-1">
                        <div className="flex items-center space-x-1.5 font-mono text-[11px] font-semibold text-black">
                          <span>&check;</span>
                          <span>IP &amp; Telemetry Fingerprint Match</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-light pl-3.5">
                          Cardholder logged in from <span className="font-mono text-black font-medium">194.26.29.11</span> during feature verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Timeline & Acceptance Cross-Check */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-center space-x-2 border-b border-neutral-100 pb-2.5">
                      <Clock className="w-3.5 h-3.5 text-black" />
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                        Timeline &amp; Acceptance Cross-Check
                      </h4>
                    </div>

                    <div className="relative pl-5 border-l border-neutral-200 space-y-3 my-2 text-xs font-mono">
                      <div className="relative">
                        <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-black" />
                        <div className="text-[11px] font-bold text-black">Contract Executed &amp; Deposit</div>
                        <div className="text-[10px] text-neutral-500">Oct 02 &middot; DocuSign Hash Verified</div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-black" />
                        <div className="text-[11px] font-bold text-black">Deliverables Handed Off</div>
                        <div className="text-[10px] text-neutral-500">Oct 12 &middot; SHA-256 Commit Verified</div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full border-2 border-black bg-white" />
                        <div className="text-[11px] font-bold text-black">Dispute Filed (Reason 10.4)</div>
                        <div className="text-[10px] text-neutral-500">Oct 14 &middot; Rebuttal Window Open</div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Bank & Gateway Evidentiary Packet */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-center space-x-2 border-b border-neutral-100 pb-2.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-black" />
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                        Bank &amp; Gateway Packet Status
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2.5 rounded-lg border border-neutral-200 bg-white flex items-center justify-between">
                        <span className="text-neutral-700">Visa VROL API</span>
                        <span className="font-bold text-black">READY</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-neutral-200 bg-white flex items-center justify-between">
                        <span className="text-neutral-700">MasterCom</span>
                        <span className="font-bold text-black">READY</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-neutral-200 bg-white flex items-center justify-between">
                        <span className="text-neutral-700">Stripe Webhook</span>
                        <span className="font-bold text-black">ACTIVE</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-neutral-200 bg-white flex items-center justify-between">
                        <span className="text-neutral-700">Audit Dossier</span>
                        <span className="font-bold text-black">5 PAGES</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sovereign AI Trust Note */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-white text-center">
                  <div className="flex items-center justify-center space-x-2 text-xs font-mono text-black mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    <span className="font-bold uppercase tracking-wide">
                      POWERED BY BHARATCODE SOVEREIGN AI
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Direct native fetch to <span className="text-black font-semibold">qwen-3.8-27b</span>. Zero external SDKs.
                  </p>
                </div>
              </>
            ) : (
              /* Case 2: Rebuttal is NOT EMPTY -> Clean, Flat Output Container with Stark Black 'Export to PDF' Button */
              <div className="bg-white border border-neutral-200 rounded-xl p-6 sticky top-20 space-y-4">
                {/* Header of Rebuttal Output Pane */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                      <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black">
                        Rebuttal Dossier Compiled
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">
                      Target: <span className="text-black font-bold">{activeGateway}</span> &middot; Visa CE 3.0 Standard
                    </p>
                  </div>

                  {/* Actions Row with Stark Black Pill 'Export to PDF' Button as Requested */}
                  <div className="flex items-center space-x-2 flex-wrap">
                    <button
                      type="button"
                      onClick={exportPDF}
                      disabled={pdfBusy}
                      className="rounded-full bg-black text-white hover:bg-neutral-800 px-4 py-2 text-xs font-mono font-medium flex items-center space-x-1.5 transition cursor-pointer shadow-none disabled:opacity-50"
                      title="Download Certified PDF Dossier"
                    >
                      {pdfBusy ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Download size={13} />
                      )}
                      <span>{pdfBusy ? 'EXPORTING…' : 'EXPORT TO PDF'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={copyRebuttalText}
                      className="rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 px-3 py-2 text-xs font-mono font-medium text-black transition cursor-pointer flex items-center space-x-1"
                      title="Copy rebuttal text"
                    >
                      {copied ? <Check size={13} className="text-black" /> : <Copy size={13} />}
                      <span>{copied ? 'COPIED' : 'COPY'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 p-2 text-neutral-600 hover:text-black transition cursor-pointer"
                      title="Print Dossier"
                    >
                      <Printer size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setRebuttal(null)}
                      className="rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 px-3 py-2 text-xs font-mono text-neutral-600 hover:text-black transition cursor-pointer"
                      title="Return to Readiness View"
                    >
                      READINESS
                    </button>
                  </div>
                </div>

                {/* View Tabs */}
                <div className="flex items-center space-x-2 border-b border-neutral-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dossier')}
                    className={`rounded-full px-3 py-1 text-xs font-mono font-medium transition cursor-pointer ${
                      activeTab === 'dossier'
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:text-black'
                    }`}
                  >
                    FORMAL DOSSIER
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('raw')}
                    className={`rounded-full px-3 py-1 text-xs font-mono font-medium transition cursor-pointer ${
                      activeTab === 'raw'
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:text-black'
                    }`}
                  >
                    GATEWAY TEXT
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('matrix')}
                    className={`rounded-full px-3 py-1 text-xs font-mono font-medium transition cursor-pointer ${
                      activeTab === 'matrix'
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:text-black'
                    }`}
                  >
                    DEFENSE MATRIX
                  </button>
                </div>

                {/* Scrollable Rebuttal Output Pane */}
                <div className="max-h-[640px] overflow-y-auto pr-2 text-neutral-900">
                  {activeTab === 'dossier' && (
                    <div className="prose prose-neutral prose-sm max-w-none font-sans">
                      <RebuttalDocument text={rebuttal} />
                    </div>
                  )}

                  {activeTab === 'raw' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                        <span>{rebuttal.length} characters &middot; Ready to paste into {activeGateway} dispute portal</span>
                        <button
                          type="button"
                          onClick={copyRebuttalText}
                          className="text-xs text-black hover:underline flex items-center space-x-1 font-mono cursor-pointer"
                        >
                          <Copy size={11} />
                          <span>COPY ALL</span>
                        </button>
                      </div>
                      <pre className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-xs text-black whitespace-pre-wrap leading-relaxed">
                        {rebuttal}
                      </pre>
                    </div>
                  )}

                  {activeTab === 'matrix' && <DefenseMatrix />}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ── Hidden Print & PDF Export Element (Off-screen rendered for html2pdf.js) ── */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '794px',
          background: '#ffffff',
          color: '#0f172a',
          padding: '32px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div id="rebuttal-pdf-export-content">
          <div
            style={{
              borderBottom: '2px solid #0f172a',
              paddingBottom: '12px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#0f172a',
                  letterSpacing: '0.5px',
                  fontFamily: 'monospace',
                }}
              >
                OFFICIAL DISPUTE REBUTTAL DOSSIER
              </div>
              <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px', fontFamily: 'monospace' }}>
                Nyaya AI — Payment Gateway Dispute Arbitration Packet ({activeGateway})
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '9px', color: '#475569', fontFamily: 'monospace' }}>
              <div>
                <strong>Submission Date:</strong>{' '}
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div>
                <strong>Arbitration Standard:</strong> Visa CE 3.0 / Mastercard Chapter 8
              </div>
            </div>
          </div>

          {rebuttal && (
            <div style={{ fontSize: '10pt', color: '#0f172a', lineHeight: '1.6' }}>
              <RebuttalDocument text={rebuttal} />
            </div>
          )}

          <div
            style={{
              marginTop: '36px',
              paddingTop: '12px',
              borderTop: '1px solid #cbd5e1',
              fontSize: '8px',
              color: '#94a3b8',
              textAlign: 'center',
              fontFamily: 'monospace',
            }}
          >
            Certified Merchant Evidentiary Rebuttal Packet · Prepared via Nyaya AI · Non-Law Firm Administrative Record
          </div>
        </div>
      </div>

      {/* ── Flat Minimalist Footer ── */}
      <footer className="w-full border-t border-neutral-200 bg-white py-8 mt-16 text-center text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-neutral-600">
            <span className="font-bold text-black uppercase">Nyaya AI</span>
            <span>&middot;</span>
            <span>Sovereign Dispute Defense Engine</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px] text-neutral-500">
            <span>Visa Core Rules 5.4.2</span>
            <span>Mastercard Chapter 8</span>
            <span>PCI-DSS 4.0 Compliant</span>
            <Link
              href="/terms"
              className="text-black hover:underline underline-offset-2"
            >
              Terms &amp; Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
