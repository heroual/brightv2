import React from 'react';
import { Payment } from '../../types/payment';
import { Receipt, CreditCard, Banknote, Shield, Calendar } from 'lucide-react';

interface PaymentHistoryProps {
  payments: Payment[];
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'cash':
        return <Banknote className="h-5 w-5" />;
      case 'insurance':
        return <Shield className="h-5 w-5" />;
      default:
        return <Receipt className="h-5 w-5" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Historique des paiements</h2>

        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {payment.invoiceNumber}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'refunded'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{payment.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(payment.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-medium text-gray-900">
                      {payment.amount.toFixed(2)}€
                    </span>
                    {payment.insuranceClaim && (
                      <div className="text-sm text-gray-600 mt-1">
                        <div>Assurance: {payment.insuranceClaim.provider}</div>
                        <div>Couverture: {payment.insuranceClaim.coveragePercentage}%</div>
                        <div className={`mt-1 text-xs font-medium ${
                          payment.insuranceClaim.status === 'approved'
                            ? 'text-green-600'
                            : payment.insuranceClaim.status === 'rejected'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}>
                          {payment.insuranceClaim.status}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Détail des traitements</h4>
                  <div className="space-y-2">
                    {payment.treatments.map((treatment, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {treatment.name} x{treatment.quantity}
                        </span>
                        <span className="font-medium">
                          {(treatment.price * treatment.quantity).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun paiement</h3>
            <p className="mt-1 text-sm text-gray-500">
              L'historique des paiements apparaîtra ici.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}