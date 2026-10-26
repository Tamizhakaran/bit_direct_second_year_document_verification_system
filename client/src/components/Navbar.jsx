import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  GraduationCap, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle, 
  ShieldCheck, 
  ChevronDown,
  Info,
  AlertTriangle
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, notifications, unreadCount, markNotificationRead } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collegeLogo, setCollegeLogo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/superadmin/landing-content')
      .then((res) => {
        if (res.data.success && res.data.landingContent?.collegeLogo) {
          setCollegeLogo(res.data.landingContent.collegeLogo);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200 uppercase tracking-wide">Super Admin</span>;
      case 'admin':
        return <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wide">Verifier</span>;
      case 'student':
        return <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 uppercase tracking-wide">Candidate</span>;
      default:
        return null;
    }
  };

  const getAvatarColor = (role) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-600';
      case 'admin': return 'bg-amber-500';
      default: return 'bg-blue-600';
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 sticky top-0 z-40 shadow-sm border-b border-blue-100">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            {collegeLogo ? (
              <img
                src={collegeLogo}
                alt="College Logo"
                className="w-10 h-10 object-contain rounded-full bg-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform"
                style={{ minWidth: '2.5rem' }}
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">
                  BIT DNY Portal
                </span>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200">
                  2026-27
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Bannari Amman Institute of Technology
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to={
                    user.role === 'superadmin'
                      ? '/superadmin/dashboard'
                      : user.role === 'admin'
                      ? '/admin/dashboard'
                      : '/student/dashboard'
                  }
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {user.role === 'student' && (
                  <>
                    <Link to="/student/profile" className="text-sm font-medium text-slate-500 hover:text-slate-900">Profile</Link>
                    <Link to="/student/admission" className="text-sm font-medium text-slate-500 hover:text-slate-900">Application</Link>
                    <Link to="/student/documents" className="text-sm font-medium text-slate-500 hover:text-slate-900">Documents</Link>
                    <Link to="/student/status" className="text-sm font-medium text-slate-500 hover:text-slate-900">Status</Link>
                  </>
                )}
              </>
            ) : (
              <>
                <a href="#about" className="text-sm font-medium text-slate-500 hover:text-slate-900">About</a>
                <a href="#process" className="text-sm font-medium text-slate-500 hover:text-slate-900">Process</a>
                <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900">Features</a>
              </>
            )}
          </nav>

          {/* Right Action Icons & User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Notification Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-900 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-800">Notifications</h4>
                        <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                          {unreadCount} Unread
                        </span>
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-xs">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => markNotificationRead(notif._id)}
                              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                                !notif.isRead ? 'bg-blue-50/40' : ''
                              }`}
                            >
                              {notif.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              ) : notif.type === 'danger' || notif.type === 'warning' ? (
                                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                              ) : (
                                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 text-xs">
                                <p className="font-semibold text-slate-800">{notif.title}</p>
                                <p className="text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left border border-transparent hover:border-slate-200"
                  >
                    <div className={`w-8 h-8 rounded-full ${getAvatarColor(user.role)} text-white font-bold flex items-center justify-center text-sm shadow-sm`}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
                      <div className="mt-1">{getRoleBadge(user.role)}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-900 py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="font-bold text-sm text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors mt-1 font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg">
          {user ? (
            <>
              <div className="pb-3 border-b border-slate-100 flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-full ${getAvatarColor(user.role)} text-white font-bold flex items-center justify-center text-sm`}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <div className="mt-0.5">{getRoleBadge(user.role)}</div>
                </div>
              </div>
              <Link
                to={
                  user.role === 'superadmin'
                    ? '/superadmin/dashboard'
                    : user.role === 'admin'
                    ? '/admin/dashboard'
                    : '/student/dashboard'
                }
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-blue-600 py-1"
              >
                Dashboard
              </Link>
              {user.role === 'student' && (
                <>
                  <Link to="/student/profile" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-600 py-1">Profile</Link>
                  <Link to="/student/admission" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-600 py-1">Application</Link>
                  <Link to="/student/documents" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-600 py-1">Documents</Link>
                  <Link to="/student/status" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-600 py-1">Status</Link>
                </>
              )}
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left text-sm text-rose-500 font-semibold py-2 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 border border-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm"
              >
                Register Application
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
