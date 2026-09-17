/** Isolate print content so workspace layout cannot offset or clip a ticket. */
export function printDocument(content: HTMLElement, title: string, paper: 'receipt' | 'a4' = 'receipt'): Promise<void> {
  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe');
    frame.title = 'Print preview';
    frame.setAttribute('aria-hidden', 'true');
    Object.assign(frame.style, { position: 'fixed', width: '1px', height: '1px', left: '-10000px', border: '0' });
    const cleanup = () => frame.remove();
    const cloned = content.cloneNode(true) as HTMLElement;
    cloned.querySelectorAll('button, .no-print').forEach(node => node.remove());
    const escapedTitle = title.replace(/[<>&"]/g, '');
    frame.onload = async () => {
      try {
        const target = frame.contentWindow;
        if (!target) throw new Error('Print preview could not be opened.');
        await frame.contentDocument?.fonts.ready;
        await Promise.all([...frame.contentDocument!.images].map(image => image.decode()));
        target.addEventListener('afterprint', cleanup, { once: true });
        target.focus();
        target.print();
        window.setTimeout(cleanup, 300000);
        resolve();
      } catch (error) { cleanup(); reject(error); }
    };
    frame.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><title>' + escapedTitle + '</title><style>' +
      '@page { size: ' + (paper === 'a4' ? 'A4' : 'auto') + '; margin:' + (paper === 'a4' ? '12mm' : '3mm') + '; }' +
      '* { box-sizing:border-box; color:#000 !important; background:transparent !important; box-shadow:none !important; text-shadow:none !important; }' +
      'body { margin:0; width:' + (paper === 'receipt' ? '72mm' : 'auto') + '; font:12px/1.45 Arial,sans-serif; }' +
      'h1,h2,h3,p { margin:0 0 6px; } h1 { font-size:22px; } h2 { font-size:18px; } h3 { font-size:12px; }' +
      '.kot-identity { font-size:11px; } .kot-lead { display:flex; justify-content:space-between; gap:12px; border-bottom:2px solid; padding:8px 0; }' +
      '.kot-meta { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin:10px 0; } dt { font-size:10px; } dd { margin:0; font-weight:600; }' +
      '.kot-notes { border:1px solid; padding:8px; margin:10px 0; } .kot-line { display:grid; grid-template-columns:32px 1fr; gap:8px; padding:9px 0; border-bottom:1px dashed; break-inside:avoid; }' +
      '.kot-quantity { font-size:20px; font-weight:700; } .kot-line strong { font-size:14px; } .kot-line small { display:block; font-size:11px; } .kot-station { font-size:10px; text-transform:uppercase; }' +
      '.kot-total { display:flex; justify-content:space-between; border-top:1px solid; margin-top:10px; padding-top:8px; }' +
      'table { width:100%; border-collapse:collapse; } th,td { padding:6px; border-bottom:1px solid #888; text-align:left; } thead { display:table-header-group; } tr { break-inside:avoid; }' +
      '.work-metrics { display:flex; gap:20px; margin:16px 0; } .work-metric > * { display:block; } .work-metric strong { font-size:16px; } .report-basis { margin:8px 0 14px; }' +
      '.kot-paper.is-compact .kot-line { padding:5px 0; } .qr-print-sheet { display:grid; grid-template-columns:1fr 1fr; gap:10mm; } .stand { border:1px solid; padding:8mm; text-align:center; break-inside:avoid; } .stand img { width:58mm; height:58mm; display:block; margin:5mm auto; } .stand .url { font-size:8px; overflow-wrap:anywhere; } .stand .powered { font-size:9px; border-top:1px solid; padding-top:3mm; }' +
      '</style></head><body>' + cloned.outerHTML + '</body></html>';
    document.body.appendChild(frame);
  });
}
