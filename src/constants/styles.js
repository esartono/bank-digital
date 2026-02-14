export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;