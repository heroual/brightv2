export interface Payment {
    id: string;
    patientId: string;
    patientName: string;
    treatmentType: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'cancelled';
    paymentMethod: 'cash' | 'card' | 'transfer';
    notes?: string;
  }
  
  export interface TreatmentType {
    id: string;
    name: string;
    basePrice: number;
    description: string;
    category: string;
  }
  
  export interface DailyStats {
    totalRevenue: number;
    totalPatients: number;
    treatments: {
      [key: string]: number;
    };
    paymentMethods: {
      [key: string]: number;
    };
  }