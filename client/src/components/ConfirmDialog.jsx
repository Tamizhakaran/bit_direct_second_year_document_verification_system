import React from 'react';
import Modal from './Modal';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="text-center py-2">
        <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4 ${
          type === 'danger' ? 'bg-rose-100 text-rose-600' :
          type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
        }`}>
          {type === 'danger' || type === 'warning' ? (
            <AlertTriangle className="w-8 h-8" />
          ) : type === 'success' ? (
            <CheckCircle className="w-8 h-8" />
          ) : (
            <Info className="w-8 h-8" />
          )}
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center space-x-3 justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-xs font-bold text-white rounded-lg shadow transition-all ${
              type === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : type === 'success'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
            }`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
