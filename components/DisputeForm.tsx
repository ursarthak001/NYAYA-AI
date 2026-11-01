'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  FileText,
  FileCheck2,
  Upload,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { GatewayType } from '@/types';

interface DisputeFormProps {
  dispute: string;
  setDispute: (val: string) => void;
  comms: string;
  setComms: (val: string) => void;
  contractText: string;
  file: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  phase: string;
  activeGateway: GatewayType;
  hasContract: boolean;
  children?: React.ReactNode;
  agreedToTerms?: boolean;
  setAgreedToTerms?: (val: boolean) => void;
  termsCheckbox?: React.ReactNode;
}

export function DisputeForm({
  dispute,
  setDispute,
  comms,
  setComms,
  contractText,
  file,
  onFileSelect,
  onSubmit,
  loading,
  phase,
  activeGateway,
  hasContract,
  children,
  agreedToTerms = false,
  setAgreedToTerms = () => {},
  termsCheckbox,
}: DisputeFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={onSubmit}>
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
            onChange={onFileSelect}
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

      {/* Clickwrap Agreement Checkbox */}
      <div className="terms-checkbox-wrap" style={{ marginBottom: 14 }}>
        {termsCheckbox || (
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              fontSize: 12,
              color: 'var(--text-2)',
              cursor: 'pointer',
              lineHeight: 1.5,
            }}
          >
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              style={{ marginTop: 2, accentColor: '#3b7eff', cursor: 'pointer' }}
              required
            />
            <span>
              I understand Nyaya AI is an administrative formatting tool, not a law firm, and this does not constitute legal advice. I agree to the{' '}
              <Link href="/terms" style={{ color: '#7badff', textDecoration: 'underline' }}>
                Terms of Service and Privacy Policy
              </Link>
              .
            </span>
          </label>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn-primary" disabled={loading || !agreedToTerms}>
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

      {/* Muted Privacy Disclaimer */}
      {children || (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Files are processed entirely in-memory and never saved to our databases. However, extracted text is securely transmitted to the BharatCode API for AI processing. Do not upload files containing highly sensitive PII (Social Security Numbers, Credit Cards).
        </p>
      )}

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
  );
}
