import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, arrayUnion, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { X, Calendar, Clock, FileText } from 'lucide-react';
import { Appointment } from '../../types/auth';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  isDoctor?: boolean;
}

const WORKING_HOURS = {
  morning: { start: 9, end: 12 },
  afternoon: { start: 14, end: 18 }
};

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const APPOINTMENT_DURATION = 30; // minutes

export default function NewAppointmentModal({ isOpen, onClose, patientId, isDoctor = false }: NewAppointmentModalProps) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    symptoms: '',
    urgency: 'normal',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (formData.date) {
      fetchExistingAppointments(formData.date);
    }
  }, [formData.date]);

  const fetchExistingAppointments = async (selectedDate: string) => {
    const appointmentsRef = collection(db, 'users');
    const q = query(appointmentsRef, where('appointments', 'array-contains', { date: selectedDate }));
    const querySnapshot = await getDocs(q);
    
    const appointments: Appointment[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.appointments) {
        appointments.push(...userData.appointments.filter((apt: Appointment) => apt.date === selectedDate));
      }
    });
    
    setExistingAppointments(appointments);
    generateTimeSlots(selectedDate, appointments);
  };

  const generateTimeSlots = (selectedDate: string, bookedAppointments: Appointment[]) => {
    const date = new Date(selectedDate);
    const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
    
    if (dayOfWeek === 'sunday' || dayOfWeek === 'saturday') {
      setAvailableSlots([]);
      return;
    }

    const slots: string[] = [];
    const bookedTimes = new Set(bookedAppointments.map(apt => apt.time));
    
    // Morning slots
    for (let hour = WORKING_HOURS.morning.start; hour < WORKING_HOURS.morning.end; hour++) {
      for (let minutes of ['00', '30']) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minutes}`;
        if (!bookedTimes.has(timeSlot)) {
          slots.push(timeSlot);
        }
      }
    }
    
    // Afternoon slots
    for (let hour = WORKING_HOURS.afternoon.start; hour < WORKING_HOURS.afternoon.end; hour++) {
      for (let minutes of ['00', '30']) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minutes}`;
        if (!bookedTimes.has(timeSlot)) {
          slots.push(timeSlot);
        }
      }
    }

    setAvailableSlots(slots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser && !patientId) return;

    try {
      setLoading(true);
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        symptoms: formData.symptoms,
        urgency: formData.urgency as 'normal' | 'urgent' | 'emergency',
        status: isDoctor ? 'confirmed' : 'pending',
        notes: formData.notes
      };

      const userRef = doc(db, 'users', patientId || currentUser?.uid || '');
      await updateDoc(userRef, {
        appointments: arrayUnion(newAppointment)
      });

      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

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
              {isDoctor ? 'Programmer un rendez-vous de suivi' : 'Nouveau Rendez-vous'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    required
                    min={today}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Heure
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez une heure</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Motif
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="reason"
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={isDoctor ? "Contrôle de suivi" : "Ex: Consultation, Contrôle..."}
                  />
                </div>
              </div>

              {!isDoctor && (
                <div>
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                    Symptômes ou Description
                  </label>
                  <textarea
                    id="symptoms"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Décrivez vos symptômes ou la raison de votre visite..."
                  />
                </div>
              )}

              {isDoctor && (
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes médicales
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Notes pour le rendez-vous de suivi..."
                  />
                </div>
              )}

              {!isDoctor && (
                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                    Niveau d'urgence
                  </label>
                  <select
                    id="urgency"
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Urgence immédiate</option>
                  </select>
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Création...' : isDoctor ? 'Programmer le suivi' : 'Créer le rendez-vous'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}