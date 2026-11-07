'use client';

import React from 'react';
import { Zap, RotateCcw } from 'lucide-react';
import { ApiHealthState } from '@/types';
import { Logo } from '@/components/Logo';

interface NavbarProps {
  apiHealth: ApiHealthState | null;
  onQuickDemo: () => void;
  onReset: () => void;
}

export function Navbar({ apiHealth, onQuickDemo, onReset }: NavbarProps) {
  const isLive = apiHealth?.status === 'active';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="logo">
          <div className="logo-icon flex items-center justify-center p-1 bg-black text-white rounded-lg">
            <Logo size={18} className="text-white" />
          </div>
          <div>
            <div className="logo-wordmark">Nyaya</div>
            <div className="logo-subtitle">न्याय — AI Dispute Defense Engine</div>
          </div>
        </div>

        <div className="nav-right">
          <div
            className="badge-model"
            title={
              isLive
                ? `Live Key Active: ${apiHealth?.keyPreview} (Sovereign Model: qwen-3.8-27b)`
                : 'Running in sovereign fallback mode'
            }
          >
            <span
              className="dot"
              style={{
                background: isLive ? '#22c55e' : '#f59e0b',
                boxShadow: isLive ? '0 0 6px rgba(34,197,94,0.6)' : '0 0 6px rgba(245,158,11,0.6)',
              }}
            />
            <span>
              {isLive
                ? `BharatCode Live · ${apiHealth?.keyPreview}`
                : 'BharatCode · qwen-3.8-27b'}
            </span>
          </div>

          <button className="btn-ghost" onClick={onQuickDemo} type="button">
            <Zap size={13} />
            Quick Demo
          </button>

          <button className="btn-icon" onClick={onReset} title="Reset all fields" type="button">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
}
