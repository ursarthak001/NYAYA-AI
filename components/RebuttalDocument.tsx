'use client';

import React from 'react';

// ─── Inline markdown → styled JSX ─────────────────────
function parseInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-black">{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-mono text-[11px] text-neutral-800">{part.slice(1, -1)}</code>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i} className="italic text-neutral-700">{part.slice(1, -1)}</em>;
    return part;
  });
}

function splitRow(rowText: string): string[] {
  let cleaned = rowText.trim();
  if (cleaned.startsWith('|')) cleaned = cleaned.slice(1);
  if (cleaned.endsWith('|')) cleaned = cleaned.slice(0, -1);
  return cleaned.split('|').map((c) => c.trim());
}

interface RebuttalDocumentProps {
  text: string;
}

export function RebuttalDocument({ text }: RebuttalDocumentProps) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const t = rawLine.trim();

    // Check if line starts a markdown table (e.g. Evidence Anchor Map, Exhibit Ledger)
    if (
      t.includes('|') &&
      i + 1 < lines.length &&
      /^\s*\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)+\|?\s*$/.test(lines[i + 1].trim())
    ) {
      const headers = splitRow(t);
      i += 2; // skip header and delimiter line
      const rows: string[][] = [];

      while (i < lines.length) {
        const rowLine = lines[i].trim();
        if (!rowLine.includes('|') || rowLine === '') break;
        rows.push(splitRow(rowLine));
        i++;
      }

      elements.push(
        <div key={`tbl-${i}`} className="table-container overflow-x-auto my-4 border border-neutral-200 rounded-lg">
          <table className="rebuttal-table w-full text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200">
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-3 py-2 text-left font-mono text-[11px] font-bold text-neutral-900 border-r last:border-r-0 border-neutral-200">
                    {parseInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className={`border-b last:border-b-0 border-neutral-200 ${rIdx % 2 === 1 ? 'bg-neutral-50/60' : 'bg-white'}`}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-neutral-700 font-sans text-xs border-r last:border-r-0 border-neutral-200 leading-relaxed">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (t.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="font-mono text-xl sm:text-2xl font-black text-black tracking-tight mt-2 mb-2 uppercase border-b border-neutral-200 pb-2">
          {parseInline(t.slice(2))}
        </h1>
      );
    } else if (t.startsWith('### ')) {
      const isMajorSection = /SECTION (III|VI|VII|VIII)/i.test(t);
      elements.push(
        <h3 key={`h3-${i}`} className={`font-mono text-sm sm:text-base font-bold text-black uppercase tracking-wider mt-6 mb-3 flex items-center gap-2 ${isMajorSection ? 'print-break-before pt-2' : ''}`}>
          <span className="w-1.5 h-3.5 bg-black rounded-sm inline-block" />
          <span>{parseInline(t.slice(4))}</span>
        </h3>
      );
    } else if (t.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="font-mono text-base font-bold text-black uppercase tracking-wide mt-4 mb-2">
          {parseInline(t.slice(3))}
        </h2>
      );
    } else if (t.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="font-mono text-xs font-bold text-neutral-800 uppercase tracking-wide mt-3 mb-1">
          {parseInline(t.slice(5))}
        </h4>
      );
    } else if (t === '---' || t === '***') {
      elements.push(<hr key={`hr-${i}`} className="my-5 border-neutral-200" />);
    } else if (t.startsWith('> [!WARNING]')) {
      elements.push(
        <div key={`warn-${i}`} className="p-3.5 my-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-mono">
          {parseInline(t.replace('> [!WARNING]', '').trim())}
        </div>
      );
    } else if (t.startsWith('> ')) {
      elements.push(
        <blockquote key={`quote-${i}`} className="pl-3 border-l-2 border-neutral-400 italic text-neutral-600 my-2 text-xs">
          {parseInline(t.slice(2))}
        </blockquote>
      );
    } else if (t.startsWith('- ') || t.startsWith('* ')) {
      elements.push(
        <li key={`li-${i}`} className="ml-5 list-disc text-xs text-neutral-700 my-1 leading-relaxed">
          {parseInline(t.replace(/^[-*]\s+/, ''))}
        </li>
      );
    } else if (/^\d+\.\s/.test(t)) {
      elements.push(
        <li key={`li-num-${i}`} className="ml-5 list-decimal text-xs text-neutral-700 my-1.5 leading-relaxed">
          {parseInline(t.replace(/^\d+\.\s+/, ''))}
        </li>
      );
    } else if (t === '') {
      elements.push(<div key={`sp-${i}`} className="h-1" />);
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-xs text-neutral-700 leading-relaxed my-1.5 font-light">
          {parseInline(t)}
        </p>
      );
    }

    i++;
  }

  return <div className="rebuttal-body space-y-1">{elements}</div>;
}
