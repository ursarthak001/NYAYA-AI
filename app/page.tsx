'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { GatewayType, DisputePreset, ApiHealthState, EvidentiaryMetrics } from '@/types';
import { PRESETS } from '@/lib/constants';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ScenarioPresets } from '@/components/ScenarioPresets';
import { GatewaySelector } from '@/components/GatewaySelector';
import { DisputeForm } from '@/components/DisputeForm';
import { EvidentiaryMeter } from '@/components/EvidentiaryMeter';
import { SidebarFeatures } from '@/components/SidebarFeatures';
import { ResultSection } from '@/components/ResultSection';
import { Footer } from '@/components/Footer';

export default function Page() {
  const [activeGateway, setActiveGateway] = useState<GatewayType>('Stripe');
  const [activePreset, setActivePreset] = useState<string | null>(null);

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
  const [apiHealth, setApiHealth] = useState<ApiHealthState | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const hasContract = !!(file || contractText);

  // Check live API health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data: ApiHealthState) => setApiHealth(data))
      .catch(() => setApiHealth({ status: 'offline' }));
  }, []);

  // Trigger floating toast notification
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Compute Evidentiary Strength dynamically
  const evidenceMetrics: EvidentiaryMetrics = useMemo(() => {
    let score = 25;
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
      grade:
        score >= 85
          ? 'High Win Probability'
          : score >= 60
          ? 'Moderate Evidence'
          : 'Needs More Evidence',
    };
  }, [dispute, file, contractText, comms]);

  // Load preset scenario
  const selectPreset = useCallback(
    (preset: DisputePreset) => {
      setActivePreset(preset.id);
      setActiveGateway(preset.gateway as GatewayType);
      setDispute(preset.dispute);
      setContractText(preset.contract);
      setComms(preset.comms);
      setFile(null);
      setError(null);
      setResult(null);
      showToast(`Loaded ${preset.title}`);
    },
    [showToast]
  );

  const clearAll = useCallback(() => {
    setDispute('');
    setComms('');
    setFile(null);
    setContractText('');
    setResult(null);
    setError(null);
    setActivePreset(null);
    showToast('Cleared all dispute inputs');
  }, [showToast]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <Navbar
        apiHealth={apiHealth}
        onQuickDemo={() => selectPreset(PRESETS[0])}
        onReset={clearAll}
      />

      {/* ── Main Container ── */}
      <main className="main">
        {/* Hero Section */}
        <Hero />

        {/* Scenario Presets Bar */}
        <ScenarioPresets activePreset={activePreset} onSelect={selectPreset} />

        {/* Error banner */}
        {error && (
          <div className="alert-error">
            <AlertCircle size={16} color="#f87171" style={{ marginTop: 1, flexShrink: 0 }} />
            <span className="alert-error-text">{error}</span>
            <button className="alert-error-close" onClick={() => setError(null)} type="button">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── Main Two-Column Grid ── */}
        <div className="page-grid">
          {/* Left Column: Form Intake */}
          <div className="form-column">
            <GatewaySelector activeGateway={activeGateway} onChange={setActiveGateway} />
            <DisputeForm
              dispute={dispute}
              setDispute={setDispute}
              comms={comms}
              setComms={setComms}
              contractText={contractText}
              file={file}
              onFileSelect={onFileSelect}
              onSubmit={submit}
              loading={loading}
              phase={phase}
              activeGateway={activeGateway}
              hasContract={hasContract}
            />
          </div>

          {/* Right Column: Evidentiary Meter & Feature Highlights */}
          <div className="sidebar-column">
            <EvidentiaryMeter metrics={evidenceMetrics} />
            <SidebarFeatures />
          </div>
        </div>

        {/* ── Result Section with Multi-Tab Suite ── */}
        {result && (
          <ResultSection
            result={result}
            activeGateway={activeGateway}
            onCopy={copyText}
            copied={copied}
            resultRef={resultRef}
          />
        )}
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
