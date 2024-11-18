import React from 'react';
import { X } from 'lucide-react';
import PaymentForm from './PaymentForm';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, patientId, onSuccess }: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="relative bg-white rounded-lg max-w-3xl w-full">
          <div className="absolute right-0 top-0 p-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <PaymentForm
              patientId={patientId}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}