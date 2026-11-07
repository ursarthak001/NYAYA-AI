'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function DefenseMatrix() {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-neutral-900">
          [ DEFENSE_MATRIX // EVIDENTIARY_CROSS_CHECK ]
        </h3>
        <span className="text-[11px] font-mono text-neutral-500">VISA CE 3.0 // STRIPE</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-900">
            <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
            <span>Evidence Anchor Map</span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed font-light">
            Directly binds strict contractual clauses to informal chat timestamps (Slack/Email/WhatsApp), neutralizing friendly fraud by establishing irrevocable buyer sign-off prior to dispute filing.
          </p>
        </div>

        <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-900">
            <CheckCircle2 size={14} className="text-neutral-900 flex-shrink-0" />
            <span>Scope Boundary Enforcement</span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed font-light">
            Unbilled feature requests are verified outside the original Statement of Work and explicitly rebutted under contractual change-order covenants.
          </p>
        </div>

        <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-900">
            <CheckCircle2 size={14} className="text-neutral-900 flex-shrink-0" />
            <span>Compelling Evidence 3.0</span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed font-light">
            The Evidence Anchor Map satisfies Visa Compelling Evidence 3.0 standards and Stripe dispute guidelines, leaving zero ambiguity for the payment gateway investigator.
          </p>
        </div>
      </div>
    </div>
  );
}
