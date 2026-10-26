import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { adminAPI, superAdminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';

const COLORS = ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDept, selectedStatus]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, appRes, deptRes] = await Promise.all([
        adminAPI.getAdminStats(),
        adminAPI.getApplications({ department: selectedDept, status: selectedStatus }),
        superAdminAPI.getPublicDepartments()
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (appRes.data.success) setApplications(appRes.data.applications);
      if (deptRes.data.success) setDepartments(deptRes.data.departments);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const name = app.studentId?.userId?.name?.toLowerCase() || '';
    const regNo = app.academicDetails?.registerNumber?.toLowerCase() || '';
    const appNo = app.applicationNumber?.toLowerCase() || '';
    return name.includes(term) || regNo.includes(term) || appNo.includes(term);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-semibold">Loading Admin Verification Console...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const pieData = [
    { name: 'Submitted', value: stats?.submitted || 0 },
    { name: 'Under Verification', value: stats?.underVerification || 0 },
    { name: 'Approved', value: stats?.approved || 0 },
    { name: 'Rejected', value: stats?.rejected || 0 },
    { name: 'Correction Needed', value: stats?.correctionRequired || 0 }
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          
          {/* Admin Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg mb-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider bg-amber-500/20 px-2.5 py-1 rounded border border-amber-400/20">
                Department: {user?.department || 'All Engineering Departments'}
              </span>
              <h1 className="text-2xl font-extrabold mt-2">
                Document Verification & Admission Audit Console
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Faculty Verifier Interface for BIT Direct Second Year (DNY) Candidates
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Total Applications</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalApplications || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[11px] font-bold text-blue-600 uppercase">Pending Review</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{stats?.pending || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[11px] font-bold text-orange-600 uppercase">Correction Needed</p>
              <p className="text-2xl font-extrabold text-orange-600 mt-1">{stats?.correctionRequired || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[11px] font-bold text-emerald-600 uppercase">Approved Admissions</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats?.approved || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[11px] font-bold text-rose-600 uppercase">Rejected Applications</p>
              <p className="text-2xl font-extrabold text-rose-600 mt-1">{stats?.rejected || 0}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                Verification Progress Breakdown
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                Verification Legend & Actions Summary
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="font-semibold text-blue-900">Submitted & Pending Review</span>
                  <span className="font-bold text-blue-700">{stats?.submitted || 0} Applications</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="font-semibold text-amber-900">Under Active Verification</span>
                  <span className="font-bold text-amber-700">{stats?.underVerification || 0} Applications</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="font-semibold text-emerald-900">Verified & Approved Seat</span>
                  <span className="font-bold text-emerald-700">{stats?.approved || 0} Applications</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar & Applications Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student, Reg No, or App No..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 font-medium outline-none"
                >
                  <option value="All">All Departments</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d.name}>{d.name}</option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 font-medium outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Verification">Under Verification</option>
                  <option value="Correction Required">Correction Required</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                    <th className="p-4">App Number</th>
                    <th className="p-4">Student Candidate Name</th>
                    <th className="p-4">Register No</th>
                    <th className="p-4">Preferred Department</th>
                    <th className="p-4">Diploma %</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No student applications found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-4 font-bold text-blue-700">{app.applicationNumber}</td>
                        <td className="p-4 font-bold text-slate-800">
                          {app.studentId?.userId?.name || 'Candidate'}
                        </td>
                        <td className="p-4 text-slate-600 font-mono">{app.academicDetails?.registerNumber}</td>
                        <td className="p-4 font-semibold text-slate-700">{app.preferredDepartment}</td>
                        <td className="p-4 font-bold text-emerald-700">{app.academicDetails?.percentageCGPA}%</td>
                        <td className="p-4"><StatusBadge status={app.status} /></td>
                        <td className="p-4 text-right">
                          <Link
                            to={`/admin/applications/${app._id}`}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg shadow transition-all inline-flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Verify Dossier</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
