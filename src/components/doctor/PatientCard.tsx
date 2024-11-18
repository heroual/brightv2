import React, { useState } from 'react';
import { UserProfile, Appointment } from '../../types/auth';
import { Calendar, Phone, Mail, MapPin, ChevronDown, ChevronUp, Clock, Receipt } from 'lucide-react';
import NewAppointmentModal from '../profile/NewAppointmentModal';
import HealthPlanDoctor from '../profile/health/HealthPlanDoctor';
import PaymentModal from '../pos/PaymentModal';
import PaymentHistory from '../pos/PaymentHistory';

interface PatientCardProps {
  patient: UserProfile;
}

export default function PatientCard({ patient }: PatientCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const getUpcomingAppointments = () => {
    if (!patient.appointments) return [];
    const now = new Date();
    return patient.appointments
      .filter((apt: Appointment) => {
        const aptDate = new Date(`${apt.date} ${apt.time}`);
        return aptDate > now && apt.status !== 'cancelled';
      })
      .sort((a: Appointment, b: Appointment) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
  };

  const upcomingAppointments = getUpcomingAppointments();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{patient.displayName}</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{patient.phoneNumber}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{patient.address}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              <Receipt className="h-4 w-4" />
              <span>Nouveau Paiement</span>
            </button>
            
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <Calendar className="h-4 w-4" />
              <span>Nouveau Rendez-vous</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">Prochains rendez-vous</h4>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{upcomingAppointments.length} à venir</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            {upcomingAppointments.slice(0, 2).map((apt: Appointment) => (
              <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(apt.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">{apt.time} - {apt.reason}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-6 flex items-center text-blue-600 hover:text-blue-700"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-5 w-5 mr-1" />
              <span>Voir moins</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-5 w-5 mr-1" />
              <span>Voir plus</span>
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="p-6">
            <HealthPlanDoctor patientId={patient.uid} />
          </div>
          <div className="p-6 border-t border-gray-200">
            <PaymentHistory payments={patient.payments || []} />
          </div>
        </div>
      )}

      <NewAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        patientId={patient.uid}
        isDoctor={true}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        patientId={patient.uid}
        onSuccess={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}