import React from 'react';
import { Shield, Clock, Lock } from 'lucide-react';

export function Hero() {
  return (
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
        bank-compliant dispute rebuttal dossier with an <strong>Evidence Anchor Map</strong> in seconds.
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
  );
}
