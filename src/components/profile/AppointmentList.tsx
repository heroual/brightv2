import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Calendar, Clock, AlertCircle, Check, X, Edit2 } from 'lucide-react';
import NewAppointmentModal from './NewAppointmentModal';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Appointment } from '../../types/auth';

export default function AppointmentList() {
  const { currentUser, userProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
      const data = doc.data();
      if (data?.appointments) {
        const sortedAppointments = [...data.appointments].sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        setAppointments(sortedAppointments);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!currentUser || !window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;

    try {
      const updatedAppointments = appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      );

      await updateDoc(doc(db, 'users', currentUser.uid), {
        appointments: updatedAppointments
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
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
        return <X className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <Check className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const isUpcoming = (date: string, time: string) => {
    const appointmentDate = new Date(`${date} ${time}`);
    return appointmentDate > new Date();
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
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Mes Rendez-vous</h2>
          <button
            onClick={() => {
              setSelectedAppointment(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Rendez-vous</span>
          </button>
        </div>

        {appointments.length > 0 ? (
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Rendez-vous à venir</h3>
              <div className="space-y-4">
                {appointments
                  .filter(apt => isUpcoming(apt.date, apt.time))
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Calendar className="h-6 w-6 text-blue-600" />
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
                              {appointment.symptoms}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span>{appointment.status}</span>
                        </span>
                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleReschedule(appointment)}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 className="h-4 w-4" />
                              <span>Modifier</span>
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                              <span>Annuler</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Past Appointments */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Historique des rendez-vous</h3>
              <div className="space-y-4">
                {appointments
                  .filter(apt => !isUpcoming(apt.date, apt.time))
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-200 p-2 rounded-full">
                          <Calendar className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(appointment.date)}
                          </p>
                          <p className="text-gray-600">
                            {appointment.time} - {appointment.reason}
                          </p>
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
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rendez-vous</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer un nouveau rendez-vous.
            </p>
          </div>
        )}

        <NewAppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}