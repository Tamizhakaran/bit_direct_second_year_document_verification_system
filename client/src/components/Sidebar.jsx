import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileText,
  UploadCloud,
  CheckSquare,
  ShieldCheck,
  Building2,
  Users,
  Activity,
  Award
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const studentLinks = [
    { name: 'Dashboard Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Student Profile', path: '/student/profile', icon: User },
    { name: 'Admission Application', path: '/student/admission', icon: FileText },
    { name: 'Document Uploads', path: '/student/documents', icon: UploadCloud },
    { name: 'Track Application Status', path: '/student/status', icon: CheckSquare }
  ];

  const adminLinks = [
    { name: 'Verifier Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Student Applications', path: '/admin/applications', icon: FileText }
  ];

  const superAdminLinks = [
    { name: 'Executive Overview', path: '/superadmin/dashboard', icon: LayoutDashboard },
    { name: 'Landing Page & Banners', path: '/superadmin/landing', icon: Award },
    { name: 'Department Seats', path: '/superadmin/departments', icon: Building2 },
    { name: 'Manage Administrators', path: '/superadmin/admins', icon: Users },
    { name: 'System Audit Logs', path: '/superadmin/audit-logs', icon: Activity }
  ];

  const links =
    user.role === 'superadmin'
      ? superAdminLinks
      : user.role === 'admin'
      ? adminLinks
      : studentLinks;

  const getAccentColor = () => {
    if (user.role === 'superadmin') return { active: 'bg-purple-600 text-white shadow-sm', hover: 'hover:bg-purple-50 hover:text-purple-700', badge: 'bg-purple-100 text-purple-700 border-purple-200', icon: 'text-purple-500' };
    if (user.role === 'admin') return { active: 'bg-amber-500 text-white shadow-sm', hover: 'hover:bg-amber-50 hover:text-amber-700', badge: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'text-amber-500' };
    return { active: 'bg-blue-600 text-white shadow-sm', hover: 'hover:bg-blue-50 hover:text-blue-700', badge: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'text-blue-500' };
  };

  const accent = getAccentColor();

  return (
    <aside className="w-64 bg-white min-h-[calc(100vh-4rem)] border-r border-slate-200 hidden md:flex flex-col">

      {/* Role Badge */}
      <div className="px-4 pt-5 pb-4 border-b border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Logged in as</p>
        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-bold ${accent.badge}`}>
          <Award className="w-3.5 h-3.5" />
          <span className="capitalize">
            {user.role === 'admin' ? `Verifier · ${user.department?.split(' ')[0] || 'Dept'}` : user.role === 'superadmin' ? 'Super Admin' : 'DNY Candidate'}
          </span>
        </div>
        <p className="text-[11px] font-semibold text-slate-700 mt-2 truncate">{user.name}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? accent.active
                    : `text-slate-500 ${accent.hover}`
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : accent.icon}`} />
                  <span>{link.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom branding */}
      <div className="p-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          BIT DNY Portal © 2026–27<br />
          <span className="font-semibold text-slate-500">Bannari Amman Institute of Technology</span>
        </p>
      </div>

    </aside>
  );
};

export default Sidebar;
