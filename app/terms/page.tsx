import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Cpu,
  Lock,
  Scale,
  ExternalLink,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

export const metadata = {
  title: 'Terms of Service & Privacy Policy — Nyaya AI',
  description:
    'Legal framework, No Legal Advice Disclaimer, Limitation of Liability, and Sovereign Data Processing Boundary for Nyaya AI.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f4] text-neutral-900 font-sans antialiased selection:bg-black selection:text-white relative bg-technical-grid overflow-hidden">
      {/* ── Background Floating Technical Watermarks / Structural Text ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Top-left floating watermark */}
        <div className="absolute top-20 left-6 text-[10px] font-mono tracking-widest text-neutral-400/40 uppercase">
          [ PROTOCOL_LEGAL_FRAMEWORK {'//'} CE_3.0 ]
        </div>

        {/* Top-right floating watermark */}
        <div className="absolute top-24 right-8 text-[10px] font-mono tracking-widest text-neutral-400/35 uppercase text-right">
          EPHEMERAL_RAM_ONLY {'//'} NON_RETENTION_STANDARD
        </div>

        {/* Mid-left floating watermark */}
        <div className="absolute top-1/3 -left-12 rotate-90 text-[11px] font-mono tracking-[0.25em] text-neutral-400/25 uppercase">
          SEC_01 &middot; ADMINISTRATIVE_RECORD_COMPLIANCE
        </div>

        {/* Mid-right floating watermark */}
        <div className="absolute top-1/2 -right-16 -rotate-90 text-[11px] font-mono tracking-[0.25em] text-neutral-400/25 uppercase">
          BHARATCODE_SOVEREIGN_GATEWAY_ROUTING
        </div>

        {/* Bottom-left floating watermark */}
        <div className="absolute bottom-40 left-8 text-[10px] font-mono tracking-widest text-neutral-400/30 uppercase">
          {'//'} ZERO_INTERNAL_DATABASE_RETENTION
        </div>

        {/* Bottom-right floating watermark */}
        <div className="absolute bottom-32 right-10 text-[10px] font-mono tracking-widest text-neutral-400/35 uppercase">
          [ 28_USC_1746_FORMATTING_AID {'//'} ISO_27001 ]
        </div>

        {/* Diagonal architectural accent marks */}
        <div className="absolute top-80 left-1/4 text-[9px] font-mono text-neutral-300/60">
          +----------------------- ARBITRATION BOUNDARY -----------------------+
        </div>
        <div className="absolute bottom-72 right-1/4 text-[9px] font-mono text-neutral-300/60">
          +------------------------ VOLATILE BUFFER REDACTION -------------------+
        </div>
      </div>

      {/* ── Top Header Navigation Bar ── */}
      <header className="w-full border-b border-neutral-200 bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo & Brand Tag */}
          <Link
            href="/"
            className="flex items-center space-x-3 group hover:opacity-85 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center p-1.5 shadow-sm">
              <Logo size={20} className="text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm tracking-tight text-black uppercase">
                NYAYA
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-neutral-200 bg-neutral-100 text-neutral-700">
                न्याय · LEGAL
              </span>
            </div>
          </Link>

          {/* Center Technical Pill Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-mono text-neutral-600">
            <Shield className="w-3.5 h-3.5 text-black" />
            <span className="text-[11px] font-medium text-black">
              GOVERNING JURISPRUDENCE &amp; POLICIES
            </span>
          </div>

          {/* Back to Dashboard Pill Action */}
          <Link
            href="/"
            className="rounded-full bg-black hover:bg-neutral-800 text-white px-4 py-1.5 text-xs font-mono font-medium transition flex items-center space-x-1.5 cursor-pointer shadow-none"
          >
            <ArrowLeft size={13} />
            <span>DASHBOARD</span>
          </Link>
        </div>
      </header>

      {/* ── Main Legal Container ── */}
      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Document Classification Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-[11px] font-mono text-neutral-600 uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-black inline-block" />
            <span>OPERATIONAL SPECIFICATION &middot; REVISION 2026.11</span>
          </div>

          <h1 className="font-mono text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black leading-tight">
            TERMS OF SERVICE &amp;{' '}
            <span className="bg-black text-white px-2.5 py-0.5 font-mono inline-block rounded-sm">
              PRIVACY POLICY
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-500 font-mono mt-3">
            Last updated: November 2, 2026 &middot; Certified Merchant Operating Disclaimers
          </p>

          {/* Quick-Jump Section Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <a
              href="#section-1"
              className="text-xs font-mono px-3 py-1 rounded-full border border-neutral-200 bg-white hover:border-black text-neutral-700 hover:text-black transition cursor-pointer"
            >
              [01] No Legal Advice
            </a>
            <a
              href="#section-2"
              className="text-xs font-mono px-3 py-1 rounded-full border border-neutral-200 bg-white hover:border-black text-neutral-700 hover:text-black transition cursor-pointer"
            >
              [02] Limitation of Liability
            </a>
            <a
              href="#section-3"
              className="text-xs font-mono px-3 py-1 rounded-full border border-neutral-200 bg-white hover:border-black text-neutral-700 hover:text-black transition cursor-pointer"
            >
              [03] Third-Party Processing
            </a>
          </div>
        </div>

        {/* Fast Security Architecture Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-black flex-shrink-0 mt-0.5 border border-neutral-200">
              <Lock size={14} />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-black uppercase">
                Zero Storage
              </div>
              <div className="text-[11px] text-neutral-500 font-light mt-0.5">
                No database or disk writes; purely volatile Node.js RAM.
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-black flex-shrink-0 mt-0.5 border border-neutral-200">
              <Shield size={14} />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-black uppercase">
                PII Redacted
              </div>
              <div className="text-[11px] text-neutral-500 font-light mt-0.5">
                Pre-inference regex sanitizer scrubs CC, SSN &amp; emails.
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-black flex-shrink-0 mt-0.5 border border-neutral-200">
              <Cpu size={14} />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-black uppercase">
                Sovereign Gateway
              </div>
              <div className="text-[11px] text-neutral-500 font-light mt-0.5">
                BharatCode API provides inference for rebuttal generation.
              </div>
            </div>
          </div>
        </div>

        {/* ── Section Cards (Flat Minimalist Light Aesthetic) ── */}
        <div className="space-y-6">
          {/* ══════════════════════════════════════════════════════════
              SECTION 1: NO LEGAL ADVICE
             ══════════════════════════════════════════════════════════ */}
          <section
            id="section-1"
            className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-none"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 text-black flex items-center justify-center border border-neutral-200 font-mono text-xs font-bold">
                  01
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-black">
                    No Legal Advice &amp; Administrative Status
                  </h2>
                  <span className="text-[10px] font-mono text-neutral-400">
                    DISCLAIMER &middot; NON-LAW FIRM ENTITY
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200 hidden sm:inline-block">
                CIVIL_PROCEDURE_3.1
              </span>
            </div>

            <div className="text-neutral-700 text-xs sm:text-sm leading-relaxed space-y-3 font-normal">
              <p>
                <strong>Nyaya AI is an administrative formatting utility, not a law firm.</strong>{' '}
                Nyaya AI does not provide legal representation, legal advice, legal counsel, or attorney
                services. The generated rebuttal dossiers, evidentiary anchor maps, document summaries,
                and templates are purely technical formatting aids intended to assist users in
                structuring project records for payment processor review (e.g., Stripe, PayPal,
                Razorpay, Visa, Mastercard).
              </p>
              <p>
                Output generated by this service does not constitute legal advice, nor does using this
                service establish an attorney-client relationship. If you require legal representation,
                consultation, or formal advice, please consult a qualified, licensed commercial attorney
                in your relevant jurisdiction.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-[11px] font-mono text-neutral-600 flex items-center space-x-2">
              <Scale size={14} className="text-black flex-shrink-0" />
              <span>
                Statutory Status: Purely non-attorney technical compilation engine. No attorney-client privilege is created.
              </span>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECTION 2: LIMITATION OF LIABILITY
             ══════════════════════════════════════════════════════════ */}
          <section
            id="section-2"
            className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-none"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 text-black flex items-center justify-center border border-neutral-200 font-mono text-xs font-bold">
                  02
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-black">
                    Limitation of Liability &amp; &quot;As Is&quot; Warranty
                  </h2>
                  <span className="text-[10px] font-mono text-neutral-400">
                    WARRANTY DISCLAIMER &middot; NO OUTCOME GUARANTEE
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200 hidden sm:inline-block">
                COMMERCIAL_REMEDY_EXCLUSION
              </span>
            </div>

            <div className="text-neutral-700 text-xs sm:text-sm leading-relaxed space-y-3 font-normal">
              <p>
                The tool is provided <strong>&quot;as is&quot;</strong> without warranty of any kind,
                whether express, implied, statutory, or otherwise. Nyaya AI, its contributors,
                affiliates, and creators are not liable for lost chargebacks, financial damages, or
                account bans, nor for unfavorable arbitration decisions, merchant dispute fees,
                payment processor account suspensions, lost revenue, or any consequential, incidental,
                indirect, or punitive damages arising out of or in connection with the use of, or
                inability to use, this application or the dossiers it compiles.
              </p>
              <p>
                Users bear sole responsibility for verifying the accuracy, veracity, and completeness
                of all materials submitted to payment acquirers and dispute portals.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-[11px] font-mono text-neutral-600 flex items-center space-x-2">
              <AlertTriangle size={14} className="text-black flex-shrink-0" />
              <span>
                Financial Caution: Final arbitration outcome depends exclusively on the issuer and card network review.
              </span>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECTION 3: THIRD-PARTY DATA PROCESSING
             ══════════════════════════════════════════════════════════ */}
          <section
            id="section-3"
            className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-none"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 text-black flex items-center justify-center border border-neutral-200 font-mono text-xs font-bold">
                  03
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-black">
                    Third-Party Data Processing Boundary &amp; Privacy
                  </h2>
                  <span className="text-[10px] font-mono text-neutral-400">
                    SOVEREIGN LLM INFERENCE &middot; ZERO INTERNAL DB RETENTION
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200 hidden sm:inline-block">
                RAM_ISOLATION_v2.0
              </span>
            </div>

            <div className="text-neutral-700 text-xs sm:text-sm leading-relaxed space-y-3 font-normal">
              <p>
                While Nyaya AI operates under a strict internal <strong>Zero Data Retention policy</strong> with zero internal database retention (processing files strictly as ephemeral Node.js buffers in volatile RAM), users are explicitly informed that extracted contract text and communication logs are transmitted securely via HTTP POST to the external BharatCode Gateway (
                <code className="text-black bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded font-mono text-xs">
                  https://bharatcode.ai/api/model/v1/chat/completions
                </code>
                ) for sovereign LLM inference.
              </p>
              <p>
                Users must review and agree to BharatCode&apos;s platform terms, data handling policies,
                prompt logging, and retention rules before submitting sensitive client agreements,
                Statements of Work, or confidential communication logs.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-[11px] font-mono text-neutral-600 flex items-center space-x-2">
              <CheckCircle2 size={14} className="text-black flex-shrink-0" />
              <span>
                In-Memory PII Redaction: Credit card numbers, Social Security Numbers, and email addresses are automatically scrubbed prior to dispatch.
              </span>
            </div>
          </section>
        </div>

        {/* ── Return CTA Button ── */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 rounded-full bg-black hover:bg-neutral-800 text-white px-6 py-2.5 text-xs font-mono font-medium transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>RETURN TO DISPUTE DEFENSE DASHBOARD</span>
          </Link>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-neutral-200 bg-white py-8 mt-16 text-center text-xs text-neutral-500 font-mono relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-neutral-600">
            <span className="font-bold text-black uppercase">Nyaya AI</span>
            <span>&middot;</span>
            <span>Sovereign Dispute Defense Engine</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px] text-neutral-500">
            <span>Visa Core Rules 5.4.2</span>
            <span>Mastercard Chapter 8</span>
            <span>PCI-DSS 4.0 Compliant</span>
            <span className="text-black font-semibold">Terms &amp; Privacy (Active)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
