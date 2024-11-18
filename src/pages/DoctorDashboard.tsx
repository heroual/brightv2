import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, BookOpen, CreditCard } from 'lucide-react';
import PatientList from '../components/doctor/PatientList';
import EducationManager from '../components/doctor/education/EducationManager';
import PaymentManager from '../components/doctor/payment/PaymentManager';

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState<'patients' | 'education' | 'payments'>('patients');
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Tableau de bord du Docteur</h1>
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('patients')}
              className={`${
                activeTab === 'patients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Users className="h-5 w-5 mr-2" />
              Patients
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`${
                activeTab === 'education'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Contenu Éducatif
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Paiements
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'patients' ? (
          <PatientList />
        ) : activeTab === 'education' ? (
          <EducationManager />
        ) : (
          <PaymentManager />
        )}
      </div>
    </div>
  );
}