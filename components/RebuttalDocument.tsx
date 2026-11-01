'use client';

import React from 'react';

// ─── Inline markdown → styled JSX ─────────────────────
function parseInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i}>{part.slice(1, -1)}</code>;
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

    // Check if line starts a markdown table (e.g. Section VI Evidence Anchor Map)
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
        <div key={`tbl-${i}`} className="table-container">
          <table className="rebuttal-table">
            <thead>
              <tr>
                {headers.map((h, hIdx) => (
                  <th key={hIdx}>{parseInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{parseInline(cell)}</td>
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
      elements.push(<h1 key={`h1-${i}`}>{parseInline(t.slice(2))}</h1>);
    } else if (t.startsWith('### ')) {
      elements.push(<h3 key={`h3-${i}`}>{parseInline(t.slice(4))}</h3>);
    } else if (t.startsWith('## ')) {
      elements.push(<h2 key={`h2-${i}`}>{parseInline(t.slice(3))}</h2>);
    } else if (t.startsWith('#### ')) {
      elements.push(<h4 key={`h4-${i}`}>{parseInline(t.slice(5))}</h4>);
    } else if (t === '---' || t === '***') {
      elements.push(<hr key={`hr-${i}`} />);
    } else if (t.startsWith('> ')) {
      elements.push(<blockquote key={`quote-${i}`}>{parseInline(t.slice(2))}</blockquote>);
    } else if (t.startsWith('- ') || t.startsWith('* ')) {
      elements.push(
        <li key={`li-${i}`} style={{ listStyle: 'disc' }}>
          {parseInline(t.replace(/^[-*]\s+/, ''))}
        </li>
      );
    } else if (/^\d+\.\s/.test(t)) {
      elements.push(
        <li key={`li-num-${i}`} style={{ listStyle: 'decimal' }}>
          {parseInline(t.replace(/^\d+\.\s+/, ''))}
        </li>
      );
    } else if (t === '') {
      elements.push(<div key={`sp-${i}`} style={{ height: 6 }} />);
    } else {
      elements.push(<p key={`p-${i}`}>{parseInline(t)}</p>);
    }

    i++;
  }

  return <div className="rebuttal-body">{elements}</div>;
}
