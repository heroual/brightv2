export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: MedicalRecord[];
  appointments: Appointment[];
  payments: Payment[];
  role: 'doctor' | 'patient';
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  reason: string;
  symptoms?: string;
  urgency?: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface MedicalRecord {
  date: string;
  note: string;
  doctor: string;
  isNew?: boolean;
}

export interface Payment {
  id: string;
  patientId: string;
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'card' | 'insurance';
  status: 'completed' | 'pending' | 'refunded';
  description: string;
  invoiceNumber: string;
  treatments: {
    name: string;
    code: string;
    price: number;
    quantity: number;
  }[];
  insuranceClaim?: {
    provider: string;
    policyNumber: string;
    coveragePercentage: number;
    status: 'pending' | 'approved' | 'rejected';
    claimNumber?: string;
  };
}