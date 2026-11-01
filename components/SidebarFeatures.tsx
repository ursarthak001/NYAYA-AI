import React from 'react';
import { FileText, MessageSquare, Shield, Sparkles } from 'lucide-react';

export function SidebarFeatures() {
  return (
    <>
      <div className="info-card">
        <div
          className="info-card-icon"
          style={{ background: 'rgba(59,126,255,0.1)', border: '1px solid rgba(59,126,255,0.2)' }}
        >
          <FileText size={18} color="#7badff" />
        </div>
        <div className="info-card-title">Evidence Anchor Map</div>
        <div className="info-card-desc">
          Constructs a 3-column verification matrix directly anchoring governing contractual clauses to informal chat timestamps (Slack, WhatsApp, Email) to defeat friendly fraud.
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
    </>
  );
}
