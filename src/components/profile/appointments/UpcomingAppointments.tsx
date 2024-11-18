import React from 'react';
import { Appointment } from '../../../types/auth';
import AppointmentCard from './AppointmentCard';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onReschedule: (appointment: Appointment) => void;
}

export default function UpcomingAppointments({ appointments, onReschedule }: UpcomingAppointmentsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Rendez-vous à venir</h3>
      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onReschedule={onReschedule}
              isUpcoming
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">Aucun rendez-vous à venir</p>
      )}
    </div>
  );
}