import React, { useState, useEffect } from 'react';
import { X, CreditCard, User } from 'lucide-react';
import { collection, addDoc, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { TreatmentType } from '../../../types/payment';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewPaymentModal({ isOpen, onClose }: NewPaymentModalProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    treatmentType: '',
    amount: 0,
    paymentMethod: 'cash',
    notes: ''
  });
  const [treatments, setTreatments] = useState<TreatmentType[]>([]);
  const [patients, setPatients] = useState<{ id: string; name: string; }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTreatments();
      fetchPatients();
    }
  }, [isOpen]);

  const fetchTreatments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'treatments'));
      const treatmentList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TreatmentType[];
      setTreatments(treatmentList);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const patientList = querySnapshot.docs
        .filter(doc => doc.data().role === 'patient')
        .map(doc => ({
          id: doc.id,
          name: doc.data().displayName
        }));
      setPatients(patientList);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedTreatment = treatments.find(t => t.id === formData.treatmentType);
      
      await addDoc(collection(db, 'payments'), {
        ...formData,
        amount: selectedTreatment?.basePrice || formData.amount,
        date: new Date().toISOString(),
        status: 'paid'
      });

      onClose();
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="relative bg-white rounded-lg max-w-md w-full">
          <div className="absolute right-0 top-0 p-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nouveau Paiement
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={formData.patientId}
                    onChange={(e) => {
                      const patient = patients.find(p => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        patientId: e.target.value,
                        patientName: patient?.name || ''
                      });
                    }}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Traitement</label>
                <select
                  value={formData.treatmentType}
                  onChange={(e) => {
                    const treatment = treatments.find(t => t.id === e.target.value);
                    setFormData({
                      ...formData,
                      treatmentType: e.target.value,
                      amount: treatment?.basePrice || 0
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un traitement</option>
                  {treatments.map((treatment) => (
                    <option key={treatment.id} value={treatment.id}>
                      {treatment.name} - {treatment.basePrice.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'MAD'
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Méthode de paiement</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="cash">Espèces</option>
                    <option value="card">Carte bancaire</option>
                    <option value="transfer">Virement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Notes supplémentaires..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Création...' : 'Créer le paiement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}