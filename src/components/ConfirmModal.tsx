import React from 'react';

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal: React.FC<Props> = ({ open, title, message, confirmText = 'Yes, Delete!', cancelText = 'No, keep it.', onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-center">
            <svg className="text-red-600" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="mb-2 text-center text-lg font-semibold text-black dark:text-white">{title}</h3>
          <p className="mb-6 text-center text-bodydark2">{message}</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onCancel} className="rounded border border-stroke px-4 py-2 text-bodydark2 hover:bg-gray-100 dark:hover:bg-[#1F2937]">{cancelText}</button>
            <button onClick={onConfirm} className="rounded border border-red-600 bg-red-600 px-4 py-2 text-white hover:bg-red-700">{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
