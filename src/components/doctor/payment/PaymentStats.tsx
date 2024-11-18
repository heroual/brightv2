import React, { useState, useEffect } from 'react';
import { CreditCard, Users, TrendingUp, Calendar } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Payment, DailyStats } from '../../../types/payment';

export default function PaymentStats() {
  const [stats, setStats] = useState<DailyStats>({
    totalRevenue: 0,
    totalPatients: 0,
    treatments: {},
    paymentMethods: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyStats();
  }, []);

  const fetchDailyStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, 'payments'),
        where('date', '>=', today.toISOString())
      );

      const querySnapshot = await getDocs(q);
      const payments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];

      const stats: DailyStats = {
        totalRevenue: 0,
        totalPatients: new Set(payments.map(p => p.patientId)).size,
        treatments: {},
        paymentMethods: {}
      };

      payments.forEach(payment => {
        stats.totalRevenue += payment.amount;
        stats.treatments[payment.treatmentType] = (stats.treatments[payment.treatmentType] || 0) + 1;
        stats.paymentMethods[payment.paymentMethod] = (stats.paymentMethods[payment.paymentMethod] || 0) + 1;
      });

      setStats(stats);
    } catch (error) {
      console.error('Error fetching daily stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Revenus du jour</h3>
          <TrendingUp className="h-6 w-6 text-green-500" />
        </div>
        <p className="text-3xl font-bold text-gray-900">
          {stats.totalRevenue.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'MAD'
          })}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Patients du jour</h3>
          <Users className="h-6 w-6 text-blue-500" />
        </div>
        <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Traitements</h3>
          <Calendar className="h-6 w-6 text-purple-500" />
        </div>
        <div className="space-y-2">
          {Object.entries(stats.treatments).map(([type, count]) => (
            <div key={type} className="flex justify-between items-center">
              <span className="text-gray-600">{type}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Méthodes de paiement</h3>
          <CreditCard className="h-6 w-6 text-indigo-500" />
        </div>
        <div className="space-y-2">
          {Object.entries(stats.paymentMethods).map(([method, count]) => (
            <div key={method} className="flex justify-between items-center">
              <span className="text-gray-600 capitalize">{method}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}