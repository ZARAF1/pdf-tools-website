import React from 'react';
import { AlertTriangle } from 'lucide-react';

const OfficeConversionNotice = ({ format }) => (
  <section className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950" aria-labelledby="office-conversion-status">
    <div className="flex items-start gap-3">
      <AlertTriangle className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        <h2 id="office-conversion-status" className="text-lg font-bold">
          {format} to PDF conversion is not available yet
        </h2>
        <p className="mt-2 text-sm leading-relaxed">
          This project has no spreadsheet or presentation rendering engine capable of preserving sheet/slides layout. We will not extract partial text, rename the source file, or send your document to a conversion service without your approval.
        </p>
        <p className="mt-2 text-sm leading-relaxed">
          A reliable converter would require a compatible local rendering dependency or an explicitly approved backend. Until that is selected and its fidelity, privacy, deployment, and cost are reviewed, this page does not accept or process files.
        </p>
      </div>
    </div>
  </section>
);

export default OfficeConversionNotice;
