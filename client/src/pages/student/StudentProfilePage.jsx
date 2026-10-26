import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { studentAPI } from '../../services/api';
import { User, MapPin, Users, Save, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const formatDateForInput = (val) => {
  if (!val) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  if (typeof val === 'string' && val.includes('T')) return val.split('T')[0];
  if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
    const [d, m, y] = val.split('-');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
    const [d, m, y] = val.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return val;
};

const StudentProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    mobileNumber: '',
    email: '',
    aadhaarNumber: '',
    bloodGroup: 'B+',
    nationality: 'Indian',
    community: 'BC'
  });

  const [address, setAddress] = useState({
    doorNo: '',
    street: '',
    city: '',
    district: '',
    state: 'Tamil Nadu',
    pincode: ''
  });

  const [parentDetails, setParentDetails] = useState({
    parentName: '',
    relationship: 'Father',
    parentMobile: '',
    parentEmail: '',
    occupation: '',
    annualIncome: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await studentAPI.getProfile();
      if (res.data.success && res.data.student) {
        const p = res.data.student;
        if (p.personalDetails) {
          let loadedGender = p.personalDetails.gender || '';
          if (loadedGender) {
            const lower = loadedGender.toLowerCase();
            if (lower === 'male') loadedGender = 'Male';
            else if (lower === 'female') loadedGender = 'Female';
            else if (lower === 'other') loadedGender = 'Other';
          }
          setPersonalDetails(prev => ({
            ...prev,
            ...p.personalDetails,
            gender: loadedGender || prev.gender || 'Male',
            dob: formatDateForInput(p.personalDetails.dob)
          }));
        }
        if (p.address) setAddress(prev => ({ ...prev, ...p.address }));
        if (p.parentDetails) setParentDetails(prev => ({ ...prev, ...p.parentDetails }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Validation helpers for sections
  const validatePersonal = () => {
    const errors = {};
    if (!personalDetails.fullName?.trim()) {
      errors.fullName = 'Full Name is required (as in Diploma Certificate)';
    }
    if (!personalDetails.dob) {
      errors.dob = 'Date of Birth is required';
    }
    if (!personalDetails.gender) {
      errors.gender = 'Gender selection is required';
    }
    if (!personalDetails.mobileNumber?.trim()) {
      errors.mobileNumber = 'Candidate Mobile Number is required';
    } else if (!/^\d{10}$/.test(personalDetails.mobileNumber.trim())) {
      errors.mobileNumber = 'Mobile Number must be exactly 10 digits';
    }
    if (!personalDetails.email?.trim()) {
      errors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalDetails.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!personalDetails.aadhaarNumber?.trim()) {
      errors.aadhaarNumber = '12-digit Aadhaar Number is required';
    } else if (!/^\d{12}$/.test(personalDetails.aadhaarNumber.trim())) {
      errors.aadhaarNumber = 'Aadhaar Number must be exactly 12 digits';
    }
    return errors;
  };

  const validateAddress = () => {
    const errors = {};
    if (!address.doorNo?.trim()) {
      errors.doorNo = 'Door / Flat Number is required';
    }
    if (!address.street?.trim()) {
      errors.street = 'Street / Landmark is required';
    }
    if (!address.city?.trim()) {
      errors.city = 'City / Taluk is required';
    }
    if (!address.district?.trim()) {
      errors.district = 'District is required';
    }
    if (!address.pincode?.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(address.pincode.trim())) {
      errors.pincode = 'Pincode must be exactly 6 digits';
    }
    return errors;
  };

  const validateParent = () => {
    const errors = {};
    if (!parentDetails.parentName?.trim()) {
      errors.parentName = 'Parent / Guardian Name is required';
    }
    if (!parentDetails.parentMobile?.trim()) {
      errors.parentMobile = 'Parent Mobile Number is required';
    } else if (!/^\d{10}$/.test(parentDetails.parentMobile.trim())) {
      errors.parentMobile = 'Parent Mobile Number must be exactly 10 digits';
    }
    if (!parentDetails.occupation?.trim()) {
      errors.occupation = 'Parent Occupation is required';
    }
    return errors;
  };

  // Save current section and optionally advance to next tab
  const handleSaveAndNext = async (currentTabName, nextTabName) => {
    setMessage({ type: '', text: '' });
    let errors = {};

    if (currentTabName === 'personal') errors = validatePersonal();
    if (currentTabName === 'address') errors = validateAddress();
    if (currentTabName === 'parent') errors = validateParent();

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setMessage({
        type: 'danger',
        text: `Please complete the required fields: ${Object.values(errors)[0]}`
      });
      return;
    }

    setSaving(true);
    try {
      const res = await studentAPI.updateProfile({
        personalDetails,
        address,
        parentDetails
      });

      if (res.data.success) {
        setMessage({
          type: 'success',
          text: `Section details saved successfully! Proceeding to next section.`
        });
        if (nextTabName) {
          setActiveTab(nextTabName);
        }
      }
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to save profile changes.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Main Save All handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validate current active tab fields so user sees immediate feedback
    let currentTabErrors = {};
    if (activeTab === 'personal') currentTabErrors = validatePersonal();
    if (activeTab === 'address') currentTabErrors = validateAddress();
    if (activeTab === 'parent') currentTabErrors = validateParent();

    setFieldErrors(currentTabErrors);

    setSaving(true);
    try {
      const res = await studentAPI.updateProfile({
        personalDetails,
        address,
        parentDetails
      });

      if (res.data.success) {
        const isComplete = personalValid && addressValid && parentValid;
        setMessage({
          type: 'success',
          text: isComplete
            ? 'Profile updated successfully! All mandatory sections have been verified and saved.'
            : 'Profile changes saved successfully! (Note: Complete all 3 sections to reach 100% profile status).'
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to update profile.'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  // Tab validation indicators
  const personalValid = !!(personalDetails.fullName?.trim() && personalDetails.dob && personalDetails.mobileNumber?.trim() && personalDetails.email?.trim() && personalDetails.aadhaarNumber?.trim());
  const addressValid = !!(address.doorNo?.trim() && address.street?.trim() && address.city?.trim() && address.district?.trim() && address.pincode?.trim());
  const parentValid = !!(parentDetails.parentName?.trim() && parentDetails.parentMobile?.trim() && parentDetails.occupation?.trim());

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-semibold">Loading Profile Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
          
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">Student Profile Master</h1>
            <p className="text-xs text-slate-500 mt-1">
              Please enter your details accurately. Your candidate profile must be complete to proceed with DNY lateral entry admission application.
            </p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-xs mb-6 flex items-start space-x-2 border shadow-sm ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              )}
              <span className="font-semibold">{message.text}</span>
            </div>
          )}

          {/* Profile Navigation Tabs with Status Indicators */}
          <div className="flex border-b border-slate-200 mb-6 space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'personal' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>1. Personal Details</span>
              {personalValid ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Section Completed" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400" title="Pending Fields" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('address')}
              className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'address' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>2. Address & Communication</span>
              {addressValid ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Section Completed" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400" title="Pending Fields" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('parent')}
              className={`pb-3 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'parent' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>3. Parent / Guardian Info</span>
              {parentValid ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Section Completed" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400" title="Pending Fields" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Tab 1: Personal Details */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Personal Information
                  </h3>
                  <span className="text-[11px] font-semibold text-rose-500">* All fields are mandatory</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name (As in Diploma Cert) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={personalDetails.fullName}
                      onChange={(e) => {
                        setPersonalDetails({ ...personalDetails, fullName: e.target.value });
                        clearFieldError('fullName');
                      }}
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.fullName ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                      placeholder="e.g. Tamizhakaran K"
                    />
                    {fieldErrors.fullName && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date of Birth <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={personalDetails.dob}
                      onChange={(e) => {
                        setPersonalDetails({ ...personalDetails, dob: e.target.value });
                        clearFieldError('dob');
                      }}
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.dob ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.dob && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.dob}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={personalDetails.gender || 'Male'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPersonalDetails(prev => ({ ...prev, gender: val }));
                        clearFieldError('gender');
                      }}
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.gender ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {fieldErrors.gender && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.gender}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={personalDetails.mobileNumber}
                      onChange={(e) => {
                        setPersonalDetails({ ...personalDetails, mobileNumber: e.target.value });
                        clearFieldError('mobileNumber');
                      }}
                      placeholder="10-digit mobile number"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.mobileNumber ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.mobileNumber && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.mobileNumber}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={personalDetails.email}
                      onChange={(e) => {
                        setPersonalDetails({ ...personalDetails, email: e.target.value });
                        clearFieldError('email');
                      }}
                      placeholder="name@gmail.com"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.email ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Aadhaar / ID Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      required
                      value={personalDetails.aadhaarNumber}
                      onChange={(e) => {
                        setPersonalDetails({ ...personalDetails, aadhaarNumber: e.target.value });
                        clearFieldError('aadhaarNumber');
                      }}
                      placeholder="12 digit Aadhaar number"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.aadhaarNumber ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.aadhaarNumber && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.aadhaarNumber}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Blood Group <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={personalDetails.bloodGroup}
                      onChange={(e) => {
                        setPersonalDetails({ ...personalDetails, bloodGroup: e.target.value });
                        clearFieldError('bloodGroup');
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="A+positive">A+ (Positive)</option>
                      <option value="A-negative">A- (Negative)</option>
                      <option value="B+positive">B+ (Positive)</option>
                      <option value="B-negative">B- (Negative)</option>
                      <option value="O+positive">O+ (Positive)</option>
                      <option value="O-negative">O- (Negative)</option>
                      <option value="AB+positive">AB+ (Positive)</option>
                      <option value="AB-negative">AB- (Negative)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Community Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={personalDetails.community}
                      onChange={(e) => {
                        setPersonalDetails({ ...personalDetails, community: e.target.value });
                        clearFieldError('community');
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="OC">OC (Open Competition)</option>
                      <option value="BC">BC (Backward Class)</option>
                      <option value="BCM">BCM (Backward Class Muslim)</option>
                      <option value="MBC">MBC / DNC</option>
                      <option value="SC">SC (Scheduled Caste)</option>
                      <option value="SCA">SCA (SC Arunthathiyar)</option>
                      <option value="ST">ST (Scheduled Tribe)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveAndNext('personal', 'address')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center space-x-1.5"
                  >
                    <span>Save & Next: Address Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Address Details */}
            {activeTab === 'address' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Communication Address
                  </h3>
                  <span className="text-[11px] font-semibold text-rose-500">* All fields are mandatory</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Door / Flat Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address.doorNo}
                      onChange={(e) => {
                        setAddress({ ...address, doorNo: e.target.value });
                        clearFieldError('doorNo');
                      }}
                      placeholder="e.g. 42/A, Flat 3B"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.doorNo ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.doorNo && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.doorNo}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Street / Landmark <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => {
                        setAddress({ ...address, street: e.target.value });
                        clearFieldError('street');
                      }}
                      placeholder="e.g. Gandhi Nagar Main Road"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.street ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.street && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.street}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Taluk <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => {
                        setAddress({ ...address, city: e.target.value });
                        clearFieldError('city');
                      }}
                      placeholder="e.g. Sathyamangalam"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.city ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.city && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.city}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      District <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address.district}
                      onChange={(e) => {
                        setAddress({ ...address, district: e.target.value });
                        clearFieldError('district');
                      }}
                      placeholder="e.g. Erode"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.district ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.district && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.district}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => {
                        setAddress({ ...address, state: e.target.value });
                        clearFieldError('state');
                      }}
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.state ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.state && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.state}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pincode (6 digits) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={address.pincode}
                      onChange={(e) => {
                        setAddress({ ...address, pincode: e.target.value });
                        clearFieldError('pincode');
                      }}
                      placeholder="e.g. 638401"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.pincode ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.pincode && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.pincode}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('personal')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back: Personal Info</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveAndNext('address', 'parent')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center space-x-1.5"
                  >
                    <span>Save & Next: Parent Info</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Parent / Guardian Details */}
            {activeTab === 'parent' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Parent / Guardian Information
                  </h3>
                  <span className="text-[11px] font-semibold text-rose-500">* All fields are mandatory</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parent / Guardian Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={parentDetails.parentName}
                      onChange={(e) => {
                        setParentDetails({ ...parentDetails, parentName: e.target.value });
                        clearFieldError('parentName');
                      }}
                      placeholder="e.g. Kandasamy M"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.parentName ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.parentName && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.parentName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Relationship <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={parentDetails.relationship}
                      onChange={(e) => {
                        setParentDetails({ ...parentDetails, relationship: e.target.value });
                        clearFieldError('relationship');
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parent Mobile Number (10 digits) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={parentDetails.parentMobile}
                      onChange={(e) => {
                        setParentDetails({ ...parentDetails, parentMobile: e.target.value });
                        clearFieldError('parentMobile');
                      }}
                      placeholder="e.g. 9876543210"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.parentMobile ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.parentMobile && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.parentMobile}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Occupation <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={parentDetails.occupation}
                      onChange={(e) => {
                        setParentDetails({ ...parentDetails, occupation: e.target.value });
                        clearFieldError('occupation');
                      }}
                      placeholder="e.g. Agriculture / Private / Business"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        fieldErrors.occupation ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {fieldErrors.occupation && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{fieldErrors.occupation}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('address')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back: Address Details</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveAndNext('parent', null)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Guardian Info</span>
                  </button>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-medium">
                * Complete all 3 sections (Personal, Address, Parent Info) to complete your student profile master.
              </span>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
};

export default StudentProfilePage;
