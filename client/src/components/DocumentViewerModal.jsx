import React from 'react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import { ExternalLink, Download, FileText, AlertCircle } from 'lucide-react';

const DocumentViewerModal = ({ isOpen, onClose, document }) => {
  if (!document) return null;

  const isPDF = document.mimeType?.includes('pdf') || document.filePath?.endsWith('.pdf');
  const fileUrl = document.filePath;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Preview: ${document.documentType}`} maxWidth="max-w-4xl">
      <div className="space-y-4">
        {/* Doc Header summary */}
        <div className="flex flex-wrap items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <p className="font-bold text-slate-800">{document.fileName}</p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Uploaded: {new Date(document.uploadedAt || document.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
            <StatusBadge status={document.status} />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-600 font-semibold hover:underline"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Remarks Banner if Rejected */}
        {document.status === 'Rejected' && document.remarks && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Verifier Rejection Remarks: </span>
              <span>{document.remarks}</span>
            </div>
          </div>
        )}

        {/* File Previewer Canvas */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 min-h-[400px] flex items-center justify-center">
          {isPDF ? (
            <iframe
              src={fileUrl}
              title={document.documentType}
              className="w-full h-[550px]"
            />
          ) : (
            <img
              src={fileUrl}
              alt={document.documentType}
              className="max-h-[550px] w-auto object-contain p-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `
                  <div class="text-center p-8">
                    <p class="text-slate-500 text-sm font-semibold mb-2">Sample File Record</p>
                    <p class="text-xs text-slate-400 mb-4">${document.fileName}</p>
                    <a href="${fileUrl}" target="_blank" class="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg shadow">Download / View File</a>
                  </div>
                `;
              }}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DocumentViewerModal;
