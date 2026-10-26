import React from 'react';
import { CheckCircle2, AlertCircle, Clock, XCircle, FileText } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Approved':
      case 'Verified':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
        };
      case 'Under Verification':
      case 'Submitted':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Clock className="w-4 h-4 text-blue-600 mr-1.5" />
        };
      case 'Pending':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock className="w-4 h-4 text-amber-600 mr-1.5" />
        };
      case 'Correction Required':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <AlertCircle className="w-4 h-4 text-orange-600 mr-1.5" />
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-4 h-4 text-rose-600 mr-1.5" />
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <FileText className="w-4 h-4 text-slate-500 mr-1.5" />
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg}`}>
      {style.icon}
      {status || 'Draft'}
    </span>
  );
};

export default StatusBadge;
