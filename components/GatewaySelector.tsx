'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';
import { GatewayType } from '@/types';
import { GATEWAYS } from '@/lib/constants';

interface GatewaySelectorProps {
  activeGateway: GatewayType;
  onChange: (gw: GatewayType) => void;
}

export function GatewaySelector({ activeGateway, onChange }: GatewaySelectorProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="field-label" style={{ marginBottom: 8 }}>
        <span className="field-label-text">Target Payment Gateway / Network</span>
        <span className="field-hint">Tailors formatting to gateway evaluator</span>
      </div>
      <div className="gateway-bar">
        {GATEWAYS.map((gw) => (
          <button
            key={gw}
            type="button"
            className={`gateway-btn${activeGateway === gw ? ' active' : ''}`}
            onClick={() => onChange(gw)}
          >
            <CreditCard size={13} />
            <span>{gw}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
