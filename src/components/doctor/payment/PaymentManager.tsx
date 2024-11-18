import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PaymentStats from './PaymentStats';
import PaymentHistory from './PaymentHistory';
import NewPaymentModal from './NewPaymentModal';
import TreatmentManager from './TreatmentManager';

export default function PaymentManager() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsTreatmentModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Gérer les Traitements</span>
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Nouveau Paiement</span>
          </button>
        </div>
      </div>

      <PaymentStats />
      <PaymentHistory />

      <NewPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      <TreatmentManager
        isOpen={isTreatmentModalOpen}
        onClose={() => setIsTreatmentModalOpen(false)}
      />
    </div>
  );
}