import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import DocumentViewerModal from '../../components/DocumentViewerModal';
import { documentAPI } from '../../services/api';
import { UploadCloud, FileText, Eye, Trash2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

const DOCUMENT_CONFIG = [
  {
    type: '10th Mark Sheet',
    required: true,
    description: 'SSLC / 10th Standard Marksheet'
  },
  {
    type: 'Diploma Mark Sheet',
    required: true,
    description: 'Consolidated / All Semester Marksheets'
  },
  {
    type: 'Transfer Certificate',
    required: true,
    description: 'TC issued by Diploma Institution'
  },
  {
    type: 'Community Certificate',
    required: true,
    description: 'Permanent Community Certificate Card'
  },
  {
    type: 'Aadhaar / Identity Proof',
    required: true,
    description: 'Government Issued Identity Proof'
  },
  {
    type: 'Passport Size Photograph',
    required: true,
    description: 'Recent Color Passport Photograph'
  },
  {
    type: 'Other Certificate',
    required: false,
    description: 'Sports, NCC, First Graduate, Gap Certificate, or Extracurriculars (Optional)'
  }
];

const DocumentUploadPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingDocType, setUploadingDocType] = useState(null);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await documentAPI.getMyDocuments();
      if (res.data.success) {
        setDocuments(res.data.documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (docType, file) => {
    if (!file) return;

    // Client-side file size validation (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'danger', text: 'File size exceeds 5MB limit. Please upload a smaller scan.' });
      return;
    }

    const formData = new FormData();
    formData.append('documentType', docType);
    formData.append('file', file);

    setUploadingDocType(docType);
    setMessage({ type: '', text: '' });

    try {
      const res = await documentAPI.uploadDocument(formData);
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchDocuments();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to upload document' });
    } finally {
      setUploadingDocType(null);
    }
  };

  const handleDelete = async (id, docType) => {
    if (!window.confirm(`Are you sure you want to delete ${docType}?`)) return;

    try {
      const res = await documentAPI.deleteDocument(id);
      if (res.data.success) {
        setMessage({ type: 'success', text: `${docType} removed.` });
        fetchDocuments();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to delete document.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-semibold">Loading Document Manager...</p>
        </div>
      </div>
    );
  }

  const mandatoryDocs = DOCUMENT_CONFIG.filter(d => d.required);
  const mandatoryUploadedCount = documents.filter(d => mandatoryDocs.some(m => m.type === d.documentType)).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Document Upload Manager</h1>
              <p className="text-xs text-slate-500 mt-1">
                Upload clear scanned copies of required certificates (PDF, JPG, or PNG under 5MB).
              </p>
            </div>

            <div className="mt-4 sm:mt-0 text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-1.5">
              <span>Mandatory:</span>
              <span className="text-blue-600 font-extrabold">{mandatoryUploadedCount} / {mandatoryDocs.length}</span>
              <span className="text-slate-400 font-normal">({documents.length} Total Uploaded)</span>
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-xs mb-6 flex items-start space-x-2 border ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Document Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DOCUMENT_CONFIG.map((docItem) => {
              const docType = docItem.type;
              const isRequired = docItem.required;
              const uploadedDoc = documents.find(d => d.documentType === docType);
              const isUploading = uploadingDocType === docType;
              const isRejected = uploadedDoc?.status === 'Rejected';

              return (
                <div
                  key={docType}
                  className={`bg-white p-6 rounded-2xl border transition-all ${
                    isRejected
                      ? 'border-rose-300 ring-2 ring-rose-50 shadow-sm'
                      : uploadedDoc
                      ? 'border-slate-200 shadow-sm'
                      : isRequired
                      ? 'border-dashed border-slate-300 bg-slate-50/50'
                      : 'border-dashed border-slate-200 bg-slate-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        uploadedDoc
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : isRequired
                          ? 'bg-slate-200 text-slate-500'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-800">{docType}</h4>
                          {!isRequired && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {uploadedDoc
                            ? `${(uploadedDoc.fileSize / 1024).toFixed(0)} KB • ${uploadedDoc.fileName}`
                            : docItem.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      {uploadedDoc ? (
                        <StatusBadge status={uploadedDoc.status} />
                      ) : isRequired ? (
                        <span className="text-[10px] font-bold text-rose-600 uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Required
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Optional
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rejection Remarks Prompt */}
                  {isRejected && uploadedDoc.remarks && (
                    <div className="my-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                      <p className="font-bold">Verifier Correction Request:</p>
                      <p className="mt-0.5">{uploadedDoc.remarks}</p>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    {uploadedDoc ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedPreviewDoc(uploadedDoc)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Doc</span>
                        </button>

                        {uploadedDoc.status !== 'Verified' && (
                          <button
                            onClick={() => handleDelete(uploadedDoc._id, docType)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {isRequired ? 'Upload PDF, JPG or PNG' : 'Optional document upload'}
                      </span>
                    )}

                    {/* File Upload Input */}
                    <label className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow cursor-pointer transition-all flex items-center space-x-1.5 ${
                      uploadedDoc
                        ? 'bg-slate-800 hover:bg-slate-700'
                        : isRequired
                        ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                        : 'bg-slate-700 hover:bg-slate-600 shadow-slate-700/20'
                    }`}>
                      {isUploading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )}
                      <span>{uploadedDoc ? 'Replace File' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(docType, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Document Viewer Popup Modal */}
          <DocumentViewerModal
            isOpen={!!selectedPreviewDoc}
            onClose={() => setSelectedPreviewDoc(null)}
            document={selectedPreviewDoc}
          />

        </main>
      </div>
    </div>
  );
};

export default DocumentUploadPage;
