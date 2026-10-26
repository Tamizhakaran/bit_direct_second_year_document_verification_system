import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck, KeyRound, Sparkles, Building2, UserPlus } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'admin' | 'superadmin'
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.user.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Role switcher without auto-filling credentials
  const handleRoleSelect = (role) => {
    setError('');
    setSelectedRole(role);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          
          {/* Header */}
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-600/30 mb-4">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Portal Account Login
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">
              Access Student DNY Application, Faculty Verification, or Master Control
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white p-4 rounded-2xl shadow-md border border-slate-800 text-xs">
            <p className="font-bold text-slate-300 mb-2.5 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Select Role:</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                className={`py-2 px-2 rounded-xl font-bold text-[11px] transition-all truncate border flex items-center justify-center space-x-1 ${
                  selectedRole === 'student'
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/40 scale-105'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`py-2 px-2 rounded-xl font-bold text-[11px] transition-all truncate border flex items-center justify-center space-x-1 ${
                  selectedRole === 'admin'
                    ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-600/40 scale-105'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('superadmin')}
                className={`py-2 px-2 rounded-xl font-bold text-[11px] transition-all truncate border flex items-center justify-center space-x-1 ${
                  selectedRole === 'superadmin'
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/40 scale-105'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Super Admin</span>
              </button>
            </div>
          </div>

          {/* Login Form Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'superadmin'
                        ? 'superadmin@bitsathy.ac.in'
                        : selectedRole === 'admin'
                        ? 'admin@bitsathy.ac.in'
                        : 'student@gmail.com'
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 mt-2 ${
                  selectedRole === 'superadmin'
                    ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
                    : selectedRole === 'admin'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                }`}
              >
                <span>{submitting ? 'Authenticating...' : `Sign In as ${selectedRole === 'superadmin' ? 'Super Admin' : selectedRole === 'admin' ? 'Faculty Verifier' : 'Candidate'}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Role-Specific Registration Links */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              {selectedRole === 'student' && (
                <div>
                  New DNY Lateral Entry Candidate?{' '}
                  <Link to="/register?role=student" className="font-bold text-blue-600 hover:underline inline-flex items-center space-x-1">
                    <span>Register New Application</span>
                  </Link>
                </div>
              )}

              {selectedRole === 'admin' && (
                <div className="space-y-1">
                  <p className="text-slate-600">New Faculty Verifier / Department Coordinator?</p>
                  <Link
                    to="/register?role=admin"
                    className="inline-flex items-center space-x-1.5 font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3.5 py-1.5 rounded-xl transition-colors mt-1"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>Register Admin with Security Code</span>
                  </Link>
                </div>
              )}

              {selectedRole === 'superadmin' && (
                <div className="space-y-1">
                  <p className="text-slate-600">New Institutional Super Administrator?</p>
                  <Link
                    to="/register?role=superadmin"
                    className="inline-flex items-center space-x-1.5 font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-1.5 rounded-xl transition-colors mt-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Register Super Admin with Master Code</span>
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;

