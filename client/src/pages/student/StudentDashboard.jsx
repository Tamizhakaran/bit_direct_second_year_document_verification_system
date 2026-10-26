import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProgressTracker from '../../components/ProgressTracker';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, admissionAPI, documentAPI } from '../../services/api';
import {
  User,
  FileText,
  UploadCloud,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Award,
  Bell,
  Clock
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, notifications } = useAuth();
  const [profile, setProfile] = useState(null);
  const [admission, setAdmission] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profRes, admRes, docRes] = await Promise.all([
          studentAPI.getProfile(),
          admissionAPI.getMyApplication(),
          documentAPI.getMyDocuments()
        ]);

        if (profRes.data.success) setProfile(profRes.data.student);
        if (admRes.data.success) setAdmission(admRes.data.admission);
        if (docRes.data.success) setDocuments(docRes.data.documents);
      } catch (error) {
        console.error('Error fetching student dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500 font-semibold">Loading Student Portal...</p>
        </div>
      </div>
    );
  }

  const profileCompletion = profile?.profileCompletion || 0;
  const applicationStatus = admission?.status || 'Draft';
  const docsUploadedCount = documents.length;
  const mandatoryDocsCount = 6;
  const mandatoryUploadedCount = documents.filter(d => d.documentType !== 'Other Certificate').length;
  const docsVerifiedCount = documents.filter(d => d.status === 'Verified').length;
  const docsRejectedCount = documents.filter(d => d.status === 'Rejected').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          
          {/* Welcome Banner Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg mb-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider bg-blue-500/20 px-2.5 py-1 rounded border border-blue-400/20">
                Register No: {user?.registerNumber || 'N/A'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
                Welcome, {user?.name}!
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Direct Second Year (DNY) Admission & Document Verification Portal
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <StatusBadge status={applicationStatus} />
              <Link
                to="/student/status"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center space-x-1"
              >
                <span>Live Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Action Required Banner if Rejected or Correction Required */}
          {(applicationStatus === 'Correction Required' || docsRejectedCount > 0) && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl mb-6 shadow-sm flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5 animate-bounce" />
              <div className="flex-1 text-xs">
                <h4 className="font-extrabold text-amber-900 text-sm">
                  Action Required: Document Correction Requested
                </h4>
                <p className="text-amber-800 mt-1 leading-relaxed">
                  {admission?.adminRemarks || 'One or more uploaded documents require correction or re-upload. Please review verifier remarks.'}
                </p>
                <Link
                  to="/student/documents"
                  className="inline-flex items-center space-x-1 mt-2 text-xs font-bold text-amber-900 underline hover:text-black"
                >
                  <span>Go to Document Manager & Re-Upload</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* 4 Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Completion</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{profileCompletion}%</p>
                <div className="w-32 bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all" style={{ width: `${profileCompletion}%` }} />
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application Status</p>
                <div className="mt-2">
                  <StatusBadge status={applicationStatus} />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Dept: {admission?.preferredDepartment || 'Not Selected'}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mandatory Docs</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{mandatoryUploadedCount} / {mandatoryDocsCount}</p>
                <p className="text-[11px] text-slate-500 mt-1">{docsUploadedCount} Total Certificates Uploaded</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Docs</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">{docsVerifiedCount} Docs</p>
                <p className="text-[11px] text-slate-500 mt-1">{docsRejectedCount} Rejected</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Visual Progress Tracker Pipeline */}
          <ProgressTracker
            currentStatus={applicationStatus}
            profileCompletion={profileCompletion}
            documentsUploaded={docsUploadedCount}
          />

          {/* Quick Action Shortcuts Grid */}
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
            Quick Actions & Portal Sections
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <Link
              to="/student/profile"
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                1. Student Profile
              </h4>
              <p className="text-xs text-slate-500 mt-1">Personal, Address, and Guardian Details</p>
            </Link>

            <Link
              to="/student/admission"
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                2. DNY Application
              </h4>
              <p className="text-xs text-slate-500 mt-1">Diploma Academics & Dept Selection</p>
            </Link>

            <Link
              to="/student/documents"
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                3. Upload Documents
              </h4>
              <p className="text-xs text-slate-500 mt-1">10th, Diploma Marksheets, TC, Community</p>
            </Link>

            <Link
              to="/student/status"
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                4. Application Status
              </h4>
              <p className="text-xs text-slate-500 mt-1">Track Verification & Remarks</p>
            </Link>
          </div>

          {/* Recent Activity / Notifications Widget */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Recent Application Alerts & Notifications</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No notifications yet.</p>
              ) : (
                notifications.slice(0, 4).map((item) => (
                  <div key={item._id} className="py-3 flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-slate-800">{item.title}</p>
                      <p className="text-slate-600 mt-0.5">{item.message}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
