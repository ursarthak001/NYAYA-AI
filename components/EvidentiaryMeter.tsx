'use client';

import React from 'react';
import { TrendingUp, Shield } from 'lucide-react';
import { EvidentiaryMetrics } from '@/types';

interface EvidentiaryMeterProps {
  metrics: EvidentiaryMetrics;
}

export function EvidentiaryMeter({ metrics }: EvidentiaryMeterProps) {
  return (
    <div className="meter-card">
      <div className="meter-header">
        <div className="meter-title">
          <TrendingUp size={16} color="var(--blue)" />
          <span>Evidentiary Readiness</span>
        </div>
        <div className="meter-score-badge">
          <Shield size={12} />
          <span>{metrics.score}% Score</span>
        </div>
      </div>

      <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginBottom: 12 }}>
        Current Status:{' '}
        <strong style={{ color: metrics.score >= 80 ? 'var(--green)' : '#7badff' }}>
          {metrics.grade}
        </strong>
      </div>

      <div className="meter-grid">
        <div className="meter-stat-item">
          <div className="meter-stat-label">
            <span>Contract Scope Terms</span>
            <span>{metrics.coverage}%</span>
          </div>
          <div className="meter-bar-track">
            <div
              className="meter-bar-fill"
              style={{
                width: `${metrics.coverage}%`,
                background: metrics.coverage > 75 ? 'var(--green)' : 'var(--blue)',
              }}
            />
          </div>
        </div>

        <div className="meter-stat-item">
          <div className="meter-stat-label">
            <span>Timestamp Audit Integrity</span>
            <span>{metrics.timeline}%</span>
          </div>
          <div className="meter-bar-track">
            <div
              className="meter-bar-fill"
              style={{
                width: `${metrics.timeline}%`,
                background: metrics.timeline > 75 ? 'var(--green)' : 'var(--amber)',
              }}
            />
          </div>
        </div>

        <div className="meter-stat-item">
          <div className="meter-stat-label">
            <span>Gateway Compliance</span>
            <span>{metrics.compliance}%</span>
          </div>
          <div className="meter-bar-track">
            <div
              className="meter-bar-fill"
              style={{
                width: `${metrics.compliance}%`,
                background: metrics.compliance > 75 ? '#8b5cf6' : 'var(--blue)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
