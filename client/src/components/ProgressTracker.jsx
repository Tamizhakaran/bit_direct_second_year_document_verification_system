import React from 'react';
import { Check, Clock, AlertTriangle, XCircle } from 'lucide-react';

const ProgressTracker = ({ currentStatus, profileCompletion = 0, documentsUploaded = 0 }) => {
  // Determine active step index (0 to 5)
  let activeIndex = 0;
  if (profileCompletion > 0) activeIndex = 1;
  if (currentStatus === 'Submitted') activeIndex = 3;
  if (currentStatus === 'Under Verification') activeIndex = 4;
  if (currentStatus === 'Correction Required') activeIndex = 3;
  if (currentStatus === 'Approved') activeIndex = 5;
  if (currentStatus === 'Rejected') activeIndex = 4;

  const steps = [
    { title: 'Registration', desc: 'Account Created' },
    { title: 'Profile', desc: 'Personal & Parent Details' },
    { title: 'Application', desc: 'Diploma & Dept Preference' },
    { title: 'Documents', desc: 'Required Certificates' },
    { title: 'Verification', desc: 'Admin Document Audit' },
    { title: 'Admission', desc: 'Seat Confirmation' }
  ];

  return (
    <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
        Admission Onboarding Progress Pipeline
      </h3>

      <div className="relative">
        {/* Connecting Track Line */}
        <div className="hidden md:block absolute top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
        <div 
          className="hidden md:block absolute top-5 left-6 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 92}%` }}
        />

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
          {steps.map((step, index) => {
            const isCompleted = index < activeIndex || (index === 5 && currentStatus === 'Approved');
            const isCurrent = index === activeIndex && currentStatus !== 'Approved';
            const isCorrection = currentStatus === 'Correction Required' && index === 3;
            const isRejected = currentStatus === 'Rejected' && index === 4;

            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                    isCorrection
                      ? 'bg-orange-500 text-white ring-4 ring-orange-100 animate-pulse'
                      : isRejected
                      ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                      : isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-bounce-short'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isCorrection ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : isRejected ? (
                    <XCircle className="w-5 h-5" />
                  ) : isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>

                <span className={`mt-3 text-xs font-bold ${isCurrent || isCorrection ? 'text-blue-900 font-extrabold' : 'text-slate-700'}`}>
                  {step.title}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
