import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { admissionAPI, documentAPI } from '../../services/api';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Printer, FileText, Award, Calendar } from 'lucide-react';

const ApplicationStatusPage = () => {
  const [admission, setAdmission] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [admRes, docRes] = await Promise.all([
        admissionAPI.getMyApplication(),
        documentAPI.getMyDocuments()
      ]);

      if (admRes.data.success) setAdmission(admRes.data.admission);
      if (docRes.data.success) setDocuments(docRes.data.documents);
    } catch (error) {
      console.error('Error fetching application status data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-semibold">Fetching Application Status...</p>
        </div>
      </div>
    );
  }

  const currentStatus = admission?.status || 'Draft';

  const stages = [
    { title: 'Application Submitted', key: 'Submitted', done: true },
    { title: 'Profile & Academics Verification', key: 'Profile', done: currentStatus !== 'Draft' },
    { title: 'Document Verification', key: 'Document', done: currentStatus === 'Approved' || currentStatus === 'Under Verification' },
    { title: 'Department Review & Merit Ranking', key: 'Review', done: currentStatus === 'Approved' },
    { title: 'Seat Allocation & Admission Confirmation', key: 'Approved', done: currentStatus === 'Approved' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
          
          <div className="mb-6 flex items-center justify-between no-print">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Application Status & Audit Track</h1>
              <p className="text-xs text-slate-500 mt-1">
                Real-time verification log for Direct Second Year (DNY) Admission 2026
              </p>
            </div>

            {admission && (
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Application Summary</span>
              </button>
            )}
          </div>

          {!admission ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Active Application Found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                You have not submitted your Direct Second Year admission application yet.
              </p>
              <a
                href="/student/admission"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow"
              >
                Start Application Form Now
              </a>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Status Header Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-400">Application No:</span>
                    <span className="text-base font-extrabold text-slate-900">{admission.applicationNumber}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Submitted On: {new Date(admission.submittedAt || admission.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                  <span className="text-xs text-slate-500 font-semibold">Current Verification Status:</span>
                  <StatusBadge status={currentStatus} />
                </div>
              </div>

              {/* Remarks Box if Correction Required */}
              {admission.adminRemarks && (
                <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs text-amber-900 shadow-sm">
                  <div className="flex items-center space-x-2 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Verifier Official Remarks:</span>
                  </div>
                  <p className="leading-relaxed pl-6">{admission.adminRemarks}</p>
                </div>
              )}

              {/* Stage-by-Stage Timeline */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">
                  Verification Lifecycle Timeline
                </h3>

                <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
                  {stages.map((stg, idx) => {
                    return (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          stg.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {stg.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{stg.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {stg.done ? 'Completed & Validated' : 'Pending Verification'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Document Status Table Summary */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Uploaded Certificates Verification Audit
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider">
                        <th className="p-3">Document Name</th>
                        <th className="p-3">File Name</th>
                        <th className="p-3">Uploaded Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Verifier Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {documents.map((doc) => (
                        <tr key={doc._id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-800">{doc.documentType}</td>
                          <td className="p-3 text-slate-600 truncate max-w-[150px]">{doc.fileName}</td>
                          <td className="p-3 text-slate-500">{new Date(doc.uploadedAt || doc.createdAt).toLocaleDateString()}</td>
                          <td className="p-3"><StatusBadge status={doc.status} /></td>
                          <td className="p-3 text-slate-600 font-medium">{doc.remarks || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ApplicationStatusPage;
