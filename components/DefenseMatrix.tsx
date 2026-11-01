'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function DefenseMatrix() {
  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 14 }}>
        Evidence Anchor Map & Contractual Defense Audit
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 14,
        }}
      >
        <div
          style={{
            padding: 14,
            background: 'var(--bg1)',
            border: '1px solid var(--border)',
            borderRadius: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--green)',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            <CheckCircle2 size={15} />
            Evidence Anchor Map (Core Defense)
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
            Directly binds strict contractual clauses to informal chat timestamps (Slack/Email/WhatsApp), neutralizing friendly fraud by establishing irrevocable buyer sign-off prior to dispute filing.
          </div>
        </div>

        <div
          style={{
            padding: 14,
            background: 'var(--bg1)',
            border: '1px solid var(--border)',
            borderRadius: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#7badff',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            <CheckCircle2 size={15} />
            Scope Boundary & Change Order Enforcement
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
            Unbilled feature requests are verified outside the original Statement of Work and explicitly rebutted under contractual change-order covenants.
          </div>
        </div>

        <div
          style={{
            padding: 14,
            background: 'var(--bg1)',
            border: '1px solid var(--border)',
            borderRadius: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#a78bfa',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            <CheckCircle2 size={15} />
            Compelling Evidence 3.0 Compliance
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
            The Evidence Anchor Map satisfies Visa Compelling Evidence 3.0 standards and Stripe dispute guidelines, leaving zero ambiguity for the payment gateway investigator.
          </div>
        </div>
      </div>
    </div>
  );
}
