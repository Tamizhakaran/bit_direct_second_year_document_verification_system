import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { superAdminAPI } from '../services/api';
import {
  GraduationCap,
  User,
  Mail,
  Phone,
  Lock,
  Hash,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Building2,
  Sparkles
} from 'lucide-react';

const RegisterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';
  const [role, setRole] = useState(initialRole); // 'student' | 'admin' | 'superadmin'

  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    registerNumber: '',
    department: 'Computer Science and Engineering',
    securityCode: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, registerStaff } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const qRole = searchParams.get('role');
    if (qRole && ['student', 'admin', 'superadmin'].includes(qRole)) {
      setRole(qRole);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await superAdminAPI.getPublicDepartments();
        if (res.data.success && res.data.departments.length > 0) {
          setDepartments(res.data.departments);
          setFormData((prev) => ({ ...prev, department: res.data.departments[0].name }));
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };
    fetchDepts();
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setSearchParams({ role: newRole });
    setError('');
    // Clear security code when switching roles — user must enter manually
    setFormData((prev) => ({ ...prev, securityCode: '' }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const pass = formData.password;
    if (!pass) return { label: '', color: '' };
    if (pass.length < 6) return { label: 'Too Short', color: 'text-rose-500' };
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { label: 'Strong', color: 'text-emerald-600' };
    }
    return { label: 'Fair', color: 'text-amber-500' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (role === 'admin' || role === 'superadmin') {
      if (!formData.securityCode.trim()) {
        setError('Security Access Code is required for staff registration');
        return;
      }
    }

    setSubmitting(true);

    try {
      if (role === 'student') {
        await register({
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          registerNumber: formData.registerNumber,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        navigate('/student/dashboard');
      } else {
        const res = await registerStaff({
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          role: role,
          department: role === 'admin' ? formData.department : undefined,
          securityCode: formData.securityCode,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        if (role === 'superadmin') {
          navigate('/superadmin/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please verify the security code and information.');
    } finally {
      setSubmitting(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-6">

          {/* Header */}
          <div className="text-center">
            <div className={`w-14 h-14 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 ${
              role === 'superadmin'
                ? 'bg-purple-600 shadow-purple-600/30'
                : role === 'admin'
                ? 'bg-amber-600 shadow-amber-600/30'
                : 'bg-blue-600 shadow-blue-600/30'
            }`}>
              {role === 'superadmin' ? (
                <ShieldCheck className="w-8 h-8" />
              ) : role === 'admin' ? (
                <KeyRound className="w-8 h-8" />
              ) : (
                <GraduationCap className="w-8 h-8" />
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {role === 'superadmin'
                ? 'Super Admin Registration'
                : role === 'admin'
                ? 'Faculty Verifier Registration'
                : 'Candidate DNY Registration'}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">
              {role === 'superadmin'
                ? 'Create master institutional administrator account with master security passkey'
                : role === 'admin'
                ? 'Create departmental verifier account with verified faculty security passkey'
                : 'Create your Direct Second Year (Lateral Entry) candidate admission account'}
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                role === 'student'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Candidate</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                role === 'admin'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Faculty Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('superadmin')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                role === 'superadmin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Super Admin</span>
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Name and RegNo/Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {role === 'student' ? 'Full Name' : 'Staff / Administrator Name'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={role === 'student' ? 'e.g. Kaviyarasan M' : 'e.g. Dr. R. K. Sharma'}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {role === 'student' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Diploma Register Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="registerNumber"
                        required
                        value={formData.registerNumber}
                        onChange={handleChange}
                        placeholder="e.g. 21DIPCS045"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                      />
                    </div>
                  </div>
                ) : role === 'admin' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Assigned Department <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                      >
                        {departments.length > 0 ? (
                          departments.map((dept) => (
                            <option key={dept._id} value={dept.name}>{dept.name}</option>
                          ))
                        ) : (
                          <>
                            <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                            <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Executive Role
                    </label>
                    <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-xs font-bold text-purple-800 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <span>Institutional Super Administrator</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 2: Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={
                        role === 'admin'
                          ? 'faculty.name@bitsathy.ac.in'
                          : role === 'superadmin'
                          ? 'superadmin@bitsathy.ac.in'
                          : 'student@gmail.com'
                      }
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  {role === 'admin' && (
                    <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
                      Must end with @bitsathy.ac.in
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="e.g. 9842100001"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Security Access Code Row for Admin / SuperAdmin */}
              {(role === 'admin' || role === 'superadmin') && (
                <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-xl border border-blue-200">
                  <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <span>{role === 'superadmin' ? 'Master Super Admin Security Code' : 'Faculty Verifier Security Code'} <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="password"
                    name="securityCode"
                    required
                    autoComplete="off"
                    value={formData.securityCode}
                    onChange={handleChange}
                    placeholder="Enter your security access code"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    This code is issued by the institution. Contact your administrator if you don't have it.
                  </p>
                </div>
              )}

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    {strength.label && (
                      <span className={`text-[10px] font-bold ${strength.color}`}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3.5 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 mt-4 ${
                  role === 'superadmin'
                    ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
                    : role === 'admin'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                }`}
              >
                <span>
                  {submitting
                    ? 'Creating Account...'
                    : role === 'superadmin'
                    ? 'Complete Super Admin Registration'
                    : role === 'admin'
                    ? 'Complete Faculty Verifier Registration'
                    : 'Complete Candidate Registration'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:underline">
                Sign In Here
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
