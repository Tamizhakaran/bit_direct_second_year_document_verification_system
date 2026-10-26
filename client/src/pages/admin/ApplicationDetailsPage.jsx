import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import DocumentViewerModal from '../../components/DocumentViewerModal';
import Modal from '../../components/Modal';
import { adminAPI } from '../../services/api';
import {
  CheckCircle,
  XCircle,
  Eye,
  ArrowLeft,
  FileText,
  User,
  ShieldCheck,
  AlertTriangle,
  Send,
  Building2,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admission, setAdmission] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Rejection Modal State
  const [rejectingDocId, setRejectingDocId] = useState(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Global Status Update State
  const [globalStatus, setGlobalStatus] = useState('Under Verification');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const res = await adminAPI.getApplicationById(id);
      if (res.data.success) {
        setAdmission(res.data.admission);
        setDocuments(res.data.documents);
        setGlobalStatus(res.data.admission.status);
        setAdminRemarks(res.data.admission.adminRemarks || '');
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (docId) => {
    setActionLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await adminAPI.verifyDocument(docId, 'Document verified & validated by verifier.');
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchApplicationDetails();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to verify document.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDocument = async () => {
    if (!rejectionRemarks.trim()) {
      alert('Please enter mandatory remarks explaining the rejection reason.');
      return;
    }

    setActionLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await adminAPI.rejectDocument(rejectingDocId, rejectionRemarks);
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        setRejectingDocId(null);
        setRejectionRemarks('');
        fetchApplicationDetails();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to reject document.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateGlobalStatus = async (newStatus) => {
    setActionLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await adminAPI.updateApplicationStatus(id, newStatus, adminRemarks);
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchApplicationDetails();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update application status.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-semibold">Loading Student Dossier...</p>
        </div>
      </div>
    );
  }

  if (!admission) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-center">
        <p className="text-slate-500 text-sm font-semibold">Application not found.</p>
        <Link to="/admin/dashboard" className="text-blue-600 text-xs underline mt-2 block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const studentUser = admission.studentId?.userId || {};
  const student = admission.studentId || {};

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          
          {/* Header Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-500 font-bold">App Status:</span>
              <StatusBadge status={admission.status} />
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-xs mb-6 flex items-start space-x-2 border ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Student Dossier Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-5 mb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {admission.applicationNumber}
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs text-slate-500 font-medium">
                    Reg No: {admission.academicDetails?.registerNumber}
                  </span>
                </div>

                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {studentUser.name}
                </h1>
                <p className="text-xs font-bold text-blue-700 mt-0.5">
                  Target Choice: {admission.preferredDepartment}
                </p>
              </div>

              <div className="mt-4 md:mt-0 text-right">
                <p className="text-[11px] text-slate-400">Diploma Percentage / CGPA</p>
                <p className="text-3xl font-black text-emerald-600 mt-0.5">
                  {admission.academicDetails?.percentageCGPA}%
                </p>
              </div>
            </div>

            {/* Candidate Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-400 block mb-1">Contact Email & Phone</span>
                <p className="font-bold text-slate-800 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{studentUser.email}</span>
                </p>
                <p className="font-bold text-slate-800 flex items-center space-x-1 mt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{studentUser.mobileNumber || 'N/A'}</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-400 block mb-1">Diploma College</span>
                <p className="font-bold text-slate-800">{admission.academicDetails?.diplomaCollege}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Branch: {admission.academicDetails?.diplomaBranch}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-400 block mb-1">Passing Year & Community</span>
                <p className="font-bold text-slate-800">Passed: {admission.academicDetails?.passingYear}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Category: {student.personalDetails?.community || 'BC'}</p>
              </div>
            </div>

          </div>

          {/* Document Verification & Audit Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Uploaded Certificates & Verification Controls</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {documents.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No documents uploaded by student yet.</p>
              ) : (
                documents.map((doc) => (
                  <div key={doc._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-800">{doc.documentType}</h4>
                          <StatusBadge status={doc.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{doc.fileName}</p>
                        {doc.remarks && (
                          <p className="text-[11px] text-rose-600 font-semibold mt-1">
                            Remarks: {doc.remarks}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview File</span>
                      </button>

                      <button
                        onClick={() => handleVerifyDocument(doc._id)}
                        disabled={actionLoading || doc.status === 'Verified'}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => setRejectingDocId(doc._id)}
                        disabled={actionLoading}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* Global Application Status Updater Box */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Final Verifier Decision & Application Status Control</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Update Official Application Lifecycle Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Under Verification', 'Correction Required', 'Approved', 'Rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setGlobalStatus(st)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        globalStatus === st
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Remarks for Candidate (Required if Correction Needed or Rejected)
                </label>
                <textarea
                  rows={2}
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder="e.g. Verified with state board register. Admission approved for lateral entry CSE."
                  className="w-full p-3 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleUpdateGlobalStatus(globalStatus)}
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{actionLoading ? 'Updating Status...' : `Set Status to "${globalStatus}"`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Document Previewer Popup */}
          <DocumentViewerModal
            isOpen={!!selectedDoc}
            onClose={() => setSelectedDoc(null)}
            document={selectedDoc}
          />

          {/* Rejection Remarks Prompt Modal */}
          <Modal
            isOpen={!!rejectingDocId}
            onClose={() => setRejectingDocId(null)}
            title="Reject Document & Request Correction"
            maxWidth="max-w-md"
          >
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Please enter mandatory rejection remarks explaining why this certificate was rejected. The student will be notified to re-upload.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rejection Remarks *</label>
                <textarea
                  rows={3}
                  required
                  value={rejectionRemarks}
                  onChange={(e) => setRejectionRemarks(e.target.value)}
                  placeholder="e.g. Scanned image is blurry or certificate seal is missing."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setRejectingDocId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectDocument}
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </Modal>

        </main>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
