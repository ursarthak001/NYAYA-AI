'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { DisputePreset } from '@/types';
import { PRESETS } from '@/lib/constants';

interface ScenarioPresetsProps {
  activePreset: string | null;
  onSelect: (preset: DisputePreset) => void;
}

export function ScenarioPresets({ activePreset, onSelect }: ScenarioPresetsProps) {
  return (
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
            onClick={() => onSelect(p)}
          >
            <div className="preset-title">
              <span>{p.title}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: p.badge === 'High Win-Rate' ? 'var(--green)' : '#7badff',
                  background:
                    p.badge === 'High Win-Rate' ? 'rgba(34,197,94,0.1)' : 'rgba(59,126,255,0.1)',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                {p.badge}
              </span>
            </div>
            <div className="preset-desc">{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
