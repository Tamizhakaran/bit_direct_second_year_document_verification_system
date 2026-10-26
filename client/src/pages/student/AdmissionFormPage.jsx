import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ConfirmDialog from '../../components/ConfirmDialog';
import { admissionAPI, superAdminAPI, studentAPI } from '../../services/api';
import { FileText, Award, Building2, CheckCircle, ArrowRight, ArrowLeft, Send, AlertCircle, Edit3 } from 'lucide-react';

const AdmissionFormPage = () => {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [existingAdmission, setExistingAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState('');
  const [stepErrors, setStepErrors] = useState({});

  const [formData, setFormData] = useState({
    preferredDepartment: 'Computer Science and Engineering',
    secondaryDepartment: 'Information Technology',
    academicDetails: {
      diplomaCollege: '',
      diplomaBranch: 'Computer Engineering',
      registerNumber: '',
      passingYear: '2024',
      percentageCGPA: ''
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, profRes, admRes] = await Promise.all([
          superAdminAPI.getPublicDepartments(),
          studentAPI.getProfile(),
          admissionAPI.getMyApplication()
        ]);

        if (deptRes.data.success && deptRes.data.departments?.length > 0) {
          setDepartments(deptRes.data.departments);
          if (!formData.preferredDepartment) {
            setFormData(prev => ({
              ...prev,
              preferredDepartment: deptRes.data.departments[0].name
            }));
          }
        }
        if (profRes.data.success && profRes.data.student) {
          const stud = profRes.data.student;
          setStudentProfile(stud);
          setFormData(prev => ({
            ...prev,
            academicDetails: {
              ...prev.academicDetails,
              ...(stud.academicDetails || {}),
              registerNumber: stud.academicDetails?.registerNumber || prev.academicDetails.registerNumber || ''
            }
          }));
        }
        if (admRes.data.success && admRes.data.admission) {
          const adm = admRes.data.admission;
          setExistingAdmission(adm);
          if (adm.preferredDepartment) {
            setFormData({
              preferredDepartment: adm.preferredDepartment,
              secondaryDepartment: adm.secondaryDepartment || '',
              academicDetails: {
                diplomaCollege: adm.academicDetails?.diplomaCollege || '',
                diplomaBranch: adm.academicDetails?.diplomaBranch || 'Computer Engineering',
                registerNumber: adm.academicDetails?.registerNumber || '',
                passingYear: adm.academicDetails?.passingYear || '2024',
                percentageCGPA: adm.academicDetails?.percentageCGPA || ''
              }
            });
          }
        }
      } catch (error) {
        console.error('Error loading admission form data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAcademicChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      academicDetails: {
        ...formData.academicDetails,
        [name]: value
      }
    });
    if (stepErrors[name]) {
      setStepErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleStepChange = (targetStep) => {
    setError('');
    if (targetStep < step) {
      setStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Step 2 validation check when advancing beyond Step 2
    if (step === 2 && targetStep > 2) {
      const errors = {};
      if (!formData.academicDetails.diplomaCollege?.trim()) {
        errors.diplomaCollege = 'Diploma College / Polytechnic Institute is required';
      }
      if (!formData.academicDetails.diplomaBranch?.trim()) {
        errors.diplomaBranch = 'Diploma Branch / Discipline is required';
      }
      if (!formData.academicDetails.registerNumber?.trim()) {
        errors.registerNumber = 'Diploma Register Number is required';
      }
      if (!formData.academicDetails.passingYear) {
        errors.passingYear = 'Year of Passing is required';
      }
      if (!formData.academicDetails.percentageCGPA?.trim()) {
        errors.percentageCGPA = 'Overall Percentage / CGPA is required';
      }

      setStepErrors(errors);
      if (Object.keys(errors).length > 0) {
        setError(`Required Information Missing: ${Object.values(errors)[0]}.`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Step 3 check
    if (step === 3 && targetStep >= 4) {
      if (!formData.preferredDepartment?.trim()) {
        setError('Primary Department Choice is required.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setStepErrors({});
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    setError('');
    setSubmitting(true);

    try {
      const res = await admissionAPI.submitApplication(formData);
      if (res.data.success) {
        setShowConfirmModal(false);
        navigate('/student/documents');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please verify all details.');
      setShowConfirmModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-semibold">Loading DNY Application Form...</p>
        </div>
      </div>
    );
  }

  const isFormLocked = existingAdmission && existingAdmission.status !== 'Draft' && existingAdmission.status !== 'Correction Required';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
          
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">Direct Second Year (DNY) Admission Application</h1>
            <p className="text-xs text-slate-500 mt-1">
              Complete the 4-step lateral entry admission form for academic year 2026-27
            </p>
          </div>

          {isFormLocked && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-6 text-xs text-emerald-800 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Application Already Submitted ({existingAdmission.applicationNumber})</p>
                <p className="mt-1">
                  Status: <strong>{existingAdmission.status}</strong>. You have already submitted your DNY application. Form modification is disabled.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl mb-6 text-xs text-rose-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Stepper Tabs */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {[
              { id: 1, title: 'Personal Info' },
              { id: 2, title: 'Diploma Academics' },
              { id: 3, title: 'Dept Preference' },
              { id: 4, title: 'Review & Submit' }
            ].map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => handleStepChange(s.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  step === s.id
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md'
                    : s.id < step
                    ? 'bg-blue-50 text-blue-700 font-semibold border-blue-200 hover:bg-blue-100/60'
                    : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="text-[10px] uppercase font-semibold">Step {s.id}</p>
                <p className="text-xs truncate">{s.title}</p>
              </button>
            ))}
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Step 1: Personal Info Summary */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Step 1: Personal Details Review
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verify your saved personal information before proceeding.
                    </p>
                  </div>
                  <Link
                    to="/student/profile"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="font-semibold text-slate-500">Full Candidate Name:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{studentProfile?.personalDetails?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Register Number:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{formData.academicDetails?.registerNumber || studentProfile?.academicDetails?.registerNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Email Address:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{studentProfile?.personalDetails?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Mobile Number:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{studentProfile?.personalDetails?.mobileNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Community Category:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{studentProfile?.personalDetails?.community || 'BC'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Aadhaar Number:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{studentProfile?.personalDetails?.aadhaarNumber || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => handleStepChange(2)}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition-all"
                  >
                    <span>Proceed to Diploma Academics</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Diploma Academic Information */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Step 2: Diploma Qualification Details
                  </h3>
                  <span className="text-[11px] font-semibold text-rose-500">* All fields are mandatory</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Diploma College / Polytechnic Institute <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="diplomaCollege"
                      disabled={isFormLocked}
                      required
                      value={formData.academicDetails.diplomaCollege}
                      onChange={handleAcademicChange}
                      placeholder="e.g. Government Polytechnic College, Erode"
                      className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                        stepErrors.diplomaCollege ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                    {stepErrors.diplomaCollege && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{stepErrors.diplomaCollege}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Diploma Branch / Discipline <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="diplomaBranch"
                        disabled={isFormLocked}
                        required
                        value={formData.academicDetails.diplomaBranch}
                        onChange={handleAcademicChange}
                        placeholder="e.g. Computer Engineering"
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                          stepErrors.diplomaBranch ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                        }`}
                      />
                      {stepErrors.diplomaBranch && (
                        <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{stepErrors.diplomaBranch}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Diploma Register Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="registerNumber"
                        disabled={isFormLocked}
                        required
                        value={formData.academicDetails.registerNumber}
                        onChange={handleAcademicChange}
                        placeholder="e.g. 21DIPCS045"
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none uppercase transition-all ${
                          stepErrors.registerNumber ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                        }`}
                      />
                      {stepErrors.registerNumber && (
                        <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{stepErrors.registerNumber}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Year of Passing <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="passingYear"
                        disabled={isFormLocked}
                        value={formData.academicDetails.passingYear}
                        onChange={handleAcademicChange}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Overall Percentage / CGPA <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="percentageCGPA"
                        disabled={isFormLocked}
                        required
                        value={formData.academicDetails.percentageCGPA}
                        onChange={handleAcademicChange}
                        placeholder="e.g. 92.5 % or 9.25 CGPA"
                        className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-all ${
                          stepErrors.percentageCGPA ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                        }`}
                      />
                      {stepErrors.percentageCGPA && (
                        <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{stepErrors.percentageCGPA}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => handleStepChange(1)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepChange(3)}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition-all"
                  >
                    <span>Proceed to Department Selection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Preferred Department */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Step 3: Select Preferred B.E. / B.Tech Department
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Department Choice <span className="text-rose-500">*</span>
                    </label>
                    <select
                      disabled={isFormLocked}
                      value={formData.preferredDepartment}
                      onChange={(e) => setFormData({ ...formData, preferredDepartment: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map((d) => (
                        <option key={d._id} value={d.name}>
                          {d.name} ({d.code}) - {d.availableSeats} Lateral Seats
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Secondary Alternate Choice (Optional)
                    </label>
                    <select
                      disabled={isFormLocked}
                      value={formData.secondaryDepartment}
                      onChange={(e) => setFormData({ ...formData, secondaryDepartment: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Alternate Department --</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d.name}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => handleStepChange(2)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepChange(4)}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition-all"
                  >
                    <span>Proceed to Review & Submit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Application Review & Submit */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Step 4: Review Final Application
                </h3>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
                      Target B.E. / B.Tech Branch Choice
                    </span>
                    <p className="text-base font-extrabold text-blue-900">
                      {formData.preferredDepartment}
                    </p>
                    {formData.secondaryDepartment && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Alternate Choice: {formData.secondaryDepartment}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                    <div>
                      <span className="font-semibold text-slate-500">Diploma College:</span>
                      <p className="font-bold text-slate-800 mt-0.5">{formData.academicDetails.diplomaCollege}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">Diploma Branch:</span>
                      <p className="font-bold text-slate-800 mt-0.5">{formData.academicDetails.diplomaBranch}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">Register Number:</span>
                      <p className="font-bold text-slate-800 mt-0.5">{formData.academicDetails.registerNumber}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">Percentage / CGPA:</span>
                      <p className="font-bold text-emerald-700 mt-0.5">{formData.academicDetails.percentageCGPA}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  <p className="font-bold mb-1">Declaration & Notice:</p>
                  <p>
                    I hereby declare that all information provided in this application is true and correct to the best of my knowledge. Once submitted, my application will be forwarded to the departmental verifications desk.
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => handleStepChange(3)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  {!isFormLocked && (
                    <button
                      type="button"
                      onClick={() => setShowConfirmModal(true)}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Submission Confirmation Modal */}
          <ConfirmDialog
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleFinalSubmit}
            title="Submit DNY Admission Application?"
            message={`Are you sure you want to submit your application for ${formData.preferredDepartment}? After submission, editing will be locked until verifier review.`}
            confirmText="Yes, Submit Application"
            type="success"
            loading={submitting}
          />

        </main>
      </div>
    </div>
  );
};

export default AdmissionFormPage;
