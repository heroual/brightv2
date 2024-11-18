import React from 'react';
import { Appointment } from '../../../types/auth';
import AppointmentCard from './AppointmentCard';

interface PastAppointmentsProps {
  appointments: Appointment[];
}

export default function PastAppointments({ appointments }: PastAppointmentsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Historique des rendez-vous</h3>
      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isUpcoming={false}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">Aucun rendez-vous passé</p>
      )}
    </div>
  );
}