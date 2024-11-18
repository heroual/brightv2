import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';
import { Payment, Treatment } from '../../types/payment';
import { CreditCard, Banknote, Shield, Plus, Trash2, Receipt } from 'lucide-react';

const TREATMENTS = [
  { code: 'CONS01', name: 'Consultation', price: 50 },
  { code: 'CLEAN01', name: 'Nettoyage dentaire', price: 80 },
  { code: 'FILL01', name: 'Obturation simple', price: 120 },
  { code: 'FILL02', name: 'Obturation complexe', price: 180 },
  { code: 'ROOT01', name: 'Traitement de canal', price: 300 },
  { code: 'XRAY01', name: 'Radiographie', price: 60 }
];

interface PaymentFormProps {
  patientId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaymentForm({ patientId, onSuccess, onClose }: PaymentFormProps) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'insurance'>('cash');
  const [insuranceDetails, setInsuranceDetails] = useState({
    provider: '',
    policyNumber: '',
    coveragePercentage: 0
  });

  const addTreatment = () => {
    const defaultTreatment = TREATMENTS[0];
    setTreatments([
      ...treatments,
      {
        code: defaultTreatment.code,
        name: defaultTreatment.name,
        price: defaultTreatment.price,
        quantity: 1
      }
    ]);
  };

  const removeTreatment = (index: number) => {
    setTreatments(treatments.filter((_, i) => i !== index));
  };

  const updateTreatment = (index: number, field: keyof Treatment, value: any) => {
    const updatedTreatments = [...treatments];
    if (field === 'code') {
      const treatment = TREATMENTS.find(t => t.code === value);
      if (treatment) {
        updatedTreatments[index] = {
          ...updatedTreatments[index],
          code: treatment.code,
          name: treatment.name,
          price: treatment.price
        };
      }
    } else {
      updatedTreatments[index] = {
        ...updatedTreatments[index],
        [field]: value
      };
    }
    setTreatments(updatedTreatments);
  };

  const calculateTotal = () => {
    return treatments.reduce((sum, t) => sum + (t.price * t.quantity), 0);
  };

  const calculateInsuranceCoverage = () => {
    const total = calculateTotal();
    return (total * insuranceDetails.coveragePercentage) / 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payment: Payment = {
        id: Date.now().toString(),
        patientId,
        amount: calculateTotal(),
        date: new Date().toISOString(),
        paymentMethod,
        status: 'completed',
        description: treatments.map(t => `${t.name} x${t.quantity}`).join(', '),
        invoiceNumber: `INV-${Date.now()}`,
        treatments,
        ...(paymentMethod === 'insurance' && {
          insuranceClaim: {
            ...insuranceDetails,
            status: 'pending'
          }
        })
      };

      const userRef = doc(db, 'users', patientId);
      await updateDoc(userRef, {
        payments: arrayUnion(payment)
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Nouveau Paiement</h2>
        <Receipt className="h-6 w-6 text-gray-400" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Treatments */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">Traitements</label>
            <button
              type="button"
              onClick={addTreatment}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </button>
          </div>
          
          <div className="space-y-4">
            {treatments.map((treatment, index) => (
              <div key={index} className="flex items-center space-x-4">
                <select
                  value={treatment.code}
                  onChange={(e) => updateTreatment(index, 'code', e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {TREATMENTS.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.name} - {t.price}€
                    </option>
                  ))}
                </select>
                
                <input
                  type="number"
                  min="1"
                  value={treatment.quantity}
                  onChange={(e) => updateTreatment(index, 'quantity', parseInt(e.target.value))}
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                
                <div className="w-24 text-right font-medium">
                  {(treatment.price * treatment.quantity).toFixed(2)}€
                </div>
                
                <button
                  type="button"
                  onClick={() => removeTreatment(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Mode de paiement
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 ${
                paymentMethod === 'cash'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Banknote className="h-5 w-5" />
              <span>Espèces</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span>Carte</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('insurance')}
              className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 ${
                paymentMethod === 'insurance'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>Assurance</span>
            </button>
          </div>
        </div>

        {/* Insurance Details */}
        {paymentMethod === 'insurance' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assureur
              </label>
              <input
                type="text"
                value={insuranceDetails.provider}
                onChange={(e) => setInsuranceDetails({
                  ...insuranceDetails,
                  provider: e.target.value
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de police
              </label>
              <input
                type="text"
                value={insuranceDetails.policyNumber}
                onChange={(e) => setInsuranceDetails({
                  ...insuranceDetails,
                  policyNumber: e.target.value
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pourcentage de couverture
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={insuranceDetails.coveragePercentage}
                onChange={(e) => setInsuranceDetails({
                  ...insuranceDetails,
                  coveragePercentage: parseInt(e.target.value)
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-medium">
            <span>Total</span>
            <span>{calculateTotal().toFixed(2)}€</span>
          </div>
          
          {paymentMethod === 'insurance' && (
            <>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                <span>Couverture assurance</span>
                <span>-{calculateInsuranceCoverage().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center text-lg font-medium mt-2">
                <span>Reste à charge</span>
                <span>{(calculateTotal() - calculateInsuranceCoverage()).toFixed(2)}€</span>
              </div>
            </>
          )}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Valider le paiement
          </button>
        </div>
      </form>
    </div>
  );
}