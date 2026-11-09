export interface DisputePreset {
  id: string;
  title: string;
  gateway: string;
  badge: string;
  desc: string;
  dispute: string;
  contract: string;
  comms: string;
}

export type GatewayType = 'Stripe' | 'PayPal' | 'Razorpay / Bank' | 'Upwork / Escrow';

export interface EvidentiaryMetrics {
  score: number;
  coverage: number;
  timeline: number;
  compliance: number;
  grade: string;
}

export interface ApiHealthState {
  status: string;
  keyPreview?: string;
  model?: string;
  message?: string;
}

export interface RebuttalApiResponse {
  success: boolean;
  rebuttal?: string;
  gatewayTextSnippet?: string;
  evidentiaryReadiness?: number;
  model?: string;
  mode?: string;
  note?: string;
  error?: string;
  docRef?: string;
  gateway?: string;
  reasonCode?: string;
  exhibitLedger?: Array<{
    exhibitId: string;
    filename: string;
    proofType: string;
    sha256: string;
    byteSize: number;
    extractedText: string;
  }>;
}
