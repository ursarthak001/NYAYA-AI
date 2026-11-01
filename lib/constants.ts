import { DisputePreset, GatewayType } from '@/types';

export const GATEWAYS: GatewayType[] = ['Stripe', 'PayPal', 'Razorpay / Bank', 'Upwork / Escrow'];

export const PRESETS: DisputePreset[] = [
  {
    id: 'stripe-scope',
    title: 'Stripe · Scope Creep & Sign-off',
    gateway: 'Stripe',
    badge: 'High Win-Rate',
    desc: 'Client approved staging build, then disputed $3,200 after unbilled extra features were denied.',
    dispute: `Stripe Dispute — Reason Code: "service_not_as_described"
Disputed Amount: $3,200.00 USD  |  Invoice: INV-2026-089

Buyer Allegation: The client (Apex Ventures LLC) claims the full-stack web application was "incomplete and broken." They filed a chargeback for the final milestone payment despite approving the staging build 12 days earlier and explicitly requesting live production deployment.`,
    contract: `MASTER SERVICES AGREEMENT & STATEMENT OF WORK
Effective Date: September 15, 2026
Client: Apex Ventures LLC  |  Contractor: Ro-Dev Software Studio

Section 2 — Scope of Deliverables:
  • Milestone 1: UX/UI Prototypes & Database Schema ($1,500) — Completed & Paid
  • Milestone 2: Frontend Build & Stripe Checkout ($2,500) — Completed & Paid
  • Milestone 3: User Dashboard, Auth & Production Deploy ($3,200) — DISPUTED

Section 5.4 — Milestone Acceptance Protocol:
"Client shall inspect each milestone within 5 business days of delivery. Written approval, deployment to production, or failure to submit a written deficiency notice within 5 days constitutes irrevocable acceptance."

Section 7.1 — Exclusions:
Third-party CRM migrations (Salesforce), native iOS builds, and multi-tenant routing are expressly excluded.

Section 8.2 — Change Orders:
Modifications outside Section 2 require a mutually signed Change Order with supplemental compensation before commencement.

Section 11.2 — Non-Refundable Delivery:
Upon milestone acceptance and source code delivery, payments are non-refundable.`,
    comms: `[Oct 12, 10:14 AM] Contractor → Client:
"Milestone 3 is live on staging: https://apex-staging.dev. Please test the auth flow and dashboard."

[Oct 13, 3:22 PM] Mark (Client):
"Tested everything with the team. Looks incredible — works perfectly! Push this live Monday."

[Oct 16, 9:45 AM] Contractor → Client:
"Live at apexventures.com. Sending final invoice INV-2026-089 for $3,200."

[Oct 18, 4:10 PM] Mark (Client):
"We also need a Salesforce sync and iOS push notifications before we pay."

[Oct 19, 11:00 AM] Contractor → Client:
"Mark — those are excluded under Section 7.1 of our signed SOW. I can draft a Change Order for $2,400."

[Oct 22, 2:15 PM] Mark (Client):
"Do it for free or I'm reversing the payment."

[Oct 24] Stripe notification: Chargeback filed for $3,200.00 — "Service Not as Described"`,
  },
  {
    id: 'paypal-fraud',
    title: 'PayPal · Fraudulent Chargeback',
    gateway: 'PayPal',
    badge: 'Critical Defense',
    desc: 'Digital branding agency deliverables handed off via GitHub/Figma; buyer filed unauthorized transaction.',
    dispute: `PayPal Dispute — Case #PP-D-918237
Dispute Type: "Unauthorized Transaction" / Chargeback
Disputed Amount: $1,850.00 USD  |  Transaction ID: 7XK992140A

Buyer Allegation: Account holder claims they never authorized payment for digital design system and brand assets, despite 3 weeks of continuous Slack collaboration and documented file access.`,
    contract: `DIGITAL BRAND ASSETS & LICENSING AGREEMENT
Parties: Studio Kroma (Merchant) & Lumina Brands (Buyer)
Total Fee: $1,850.00 USD (Fixed Price)

Clause 1.2 — Delivery Protocol:
Deliverables transferred digitally via Figma team invite and private GitHub repository to Buyer's verified administrative email (admin@luminabrands.com).

Clause 3.1 — Authorization of Payment:
Buyer represents and warrants that payments submitted via PayPal are authorized by the account holder for business services rendered.

Clause 6.3 — Intellectual Property Transfer:
Full commercial IP license conveys upon receipt of cleared funds. Unauthorized chargebacks automatically revoke all intellectual property rights and constitute copyright infringement.`,
    comms: `[Sep 04, 2:10 PM] Buyer: "Just sent the $1,850 via PayPal from our verified account. Let's get started!"
[Sep 05, 11:20 AM] Merchant: "Payment confirmed. Figma workspace shared with admin@luminabrands.com."
[Sep 18, 4:45 PM] Buyer: "Final Figma exports downloaded. The vector icon suite and design system look world-class! Thank you."
[Sep 22, 9:15 AM] PayPal Notice: Unauthorized payment dispute opened. Funds placed on hold.`,
  },
  {
    id: 'razorpay-saas',
    title: 'Razorpay / Bank · Scope Creep',
    gateway: 'Razorpay / Bank',
    badge: 'B2B Dispute',
    desc: 'Custom API integration completed; buyer filed Reason 4853 ("Defective / Not as Described").',
    dispute: `Bank Chargeback via Razorpay — Reason Code: 4853 ("Services Not Rendered / Defective")
Disputed Amount: ₹1,45,000 INR  |  Payment ID: pay_OnG928KLa1

Merchant Stance: Full custom payment gateway webhook engine delivered, stress-tested, and accepted in production. Buyer filed chargeback after merchant declined to build unlimited free post-launch customizations.`,
    contract: `SOFTWARE DEVELOPMENT & SYSTEM INTEGRATION AGREEMENT
Jurisdiction: Bengaluru, Karnataka  |  Merchant: Nexus Tech Solutions

Section 4 — Deliverables:
Deployment of automated reconciliation service and webhooks according to Technical Annexure A.

Section 6 — User Acceptance Testing (UAT):
Buyer has 7 calendar days to log defects in the Jira portal. Production go-live constitutes formal sign-off.

Section 9 — Post-Launch Maintenance:
Ongoing feature development beyond Annexure A is strictly billable at standard ₹4,500/hour retainers.`,
    comms: `[Nov 02] Nexus: "Reconciliation engine deployed to production. Stress-tested with 10k mock events."
[Nov 05] Client Director: "API is performing flawlessly in production. Approved for final settlement."
[Nov 14] Client Director: "Can you also connect this to Tally Prime ERP without extra cost?"
[Nov 15] Nexus: "Tally ERP requires a new statement of work. Quotation sent."
[Nov 18] Razorpay Alert: Chargeback initiated by client's bank under Code 4853.`,
  },
];
