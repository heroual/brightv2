import React from 'react';
import { Calendar, Clock, AlertCircle, Check, X as XIcon, Edit2 } from 'lucide-react';
import { Appointment } from '../../../types/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../contexts/AuthContext';

interface AppointmentCardProps {
  appointment: Appointment;
  onReschedule?: (appointment: Appointment) => void;
  isUpcoming: boolean;
}

export default function AppointmentCard({ 
  appointment, 
  onReschedule,
  isUpcoming 
}: AppointmentCardProps) {
  const { currentUser } = useAuth();

  const handleCancelAppointment = async () => {
    if (!currentUser || !window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        appointments: (await doc(userRef).get()).data()?.appointments.map((apt: Appointment) =>
          apt.id === appointment.id ? { ...apt, status: 'cancelled' } : apt
        )
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XIcon className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <Check className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg ${
      isUpcoming ? 'hover:bg-gray-50' : 'bg-gray-50'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-full ${isUpcoming ? 'bg-blue-100' : 'bg-gray-200'}`}>
          <Calendar className={`h-6 w-6 ${isUpcoming ? 'text-blue-600' : 'text-gray-600'}`} />
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {formatDate(appointment.date)}
          </p>
          <p className="text-gray-600">
            {appointment.time} - {appointment.reason}
          </p>
          {appointment.urgency && appointment.urgency !== 'normal' && (
            <div className="flex items-center mt-1">
              <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm text-red-500 capitalize">
                {appointment.urgency}
              </span>
            </div>
          )}
          {appointment.symptoms && (
            <p className="text-sm text-gray-500 mt-1">
              Symptômes: {appointment.symptoms}
            </p>
          )}
          {appointment.notes && (
            <p className="text-sm text-gray-500 mt-1">
              Notes: {appointment.notes}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
          {getStatusIcon(appointment.status)}
          <span>{appointment.status}</span>
        </span>
        {isUpcoming && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <div className="flex space-x-2">
            {onReschedule && (
              <button
                onClick={() => onReschedule(appointment)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
              >
                <Edit2 className="h-4 w-4" />
                <span>Modifier</span>
              </button>
            )}
            <button
              onClick={handleCancelAppointment}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <XIcon className="h-4 w-4" />
              <span>Annuler</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}