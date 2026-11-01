'use client';

import React, { useState } from 'react';
import {
  FileText,
  FileCode,
  Layers,
  Copy,
  Check,
  Printer,
  Download,
  Loader2,
} from 'lucide-react';
import { GatewayType } from '@/types';
import { RebuttalDocument } from './RebuttalDocument';
import { DefenseMatrix } from './DefenseMatrix';

interface ResultSectionProps {
  result: string;
  activeGateway: GatewayType;
  onCopy: () => void;
  copied: boolean;
  resultRef: React.RefObject<HTMLDivElement>;
}

export function ResultSection({
  result,
  activeGateway,
  onCopy,
  copied,
  resultRef,
}: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState<'dossier' | 'raw' | 'matrix'>('dossier');
  const [pdfBusy, setPdfBusy] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const downloadPdf = async () => {
    if (!result) return;
    setPdfBusy(true);
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const el = document.getElementById('rebuttal-pdf-content');
      if (!el) throw new Error('Export container not found.');
      await html2pdf()
        .set({
          margin: [12, 14, 12, 14],
          filename: `Nyaya-Rebuttal-${activeGateway.replace(/\W+/g, '_')}-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(el)
        .save();
    } catch (err: any) {
      alert('PDF export failed: ' + (err.message || 'Unknown error'));
    } finally {
      setPdfBusy(false);
    }
  };

  return (
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
              Certified evidentiary response with Evidence Anchor Map for payment network arbitration
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

            <button className="btn-action" onClick={onCopy} title="Copy to clipboard" type="button">
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

            <button className="btn-action" onClick={handlePrint} title="Print Dossier" type="button">
              <Printer size={13} />
              Print
            </button>

            <button
              className="btn-action primary"
              onClick={downloadPdf}
              disabled={pdfBusy}
              title="Export certified PDF"
              type="button"
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
        {activeTab === 'dossier' && <RebuttalDocument text={result} />}

        {/* Tab 2: Raw Monospace Text for Gateway Portal */}
        {activeTab === 'raw' && (
          <div style={{ padding: 20 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
                Characters: <strong>{result.length}</strong> · Ready to paste into {activeGateway}{' '}
                dispute resolution portal
              </span>
              <button
                className="btn-ghost"
                onClick={onCopy}
                style={{ padding: '4px 10px', fontSize: 11 }}
                type="button"
              >
                <Copy size={12} /> Copy All
              </button>
            </div>
            <pre className="raw-box">{result}</pre>
          </div>
        )}

        {/* Tab 3: Defense & Evidentiary Matrix */}
        {activeTab === 'matrix' && <DefenseMatrix />}
      </div>

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
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: 0.5,
                }}
              >
                FORMAL DISPUTE REBUTTAL DOSSIER
              </div>
              <div style={{ fontSize: 8.5, color: '#6b7280', marginTop: 2 }}>
                Nyaya AI — Commercial Dispute Defense & Payment Gateway Evidentiary Packet ({activeGateway})
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 8.5, color: '#4b5563' }}>
              <div>
                <strong>Submission Date:</strong>{' '}
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div>
                <strong>Arbitration Engine:</strong> BharatCode qwen-3.8-27b
              </div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#1f2937' }}>
            <RebuttalDocument text={result} />
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
