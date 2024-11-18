import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Edit2, AlertTriangle, Calendar } from 'lucide-react';
import { OralHealthPlan } from '../../../types/health';
import EditHealthPlanModal from './EditHealthPlanModal';
import DailyRoutine from './DailyRoutine';
import ProgressTracker from './ProgressTracker';

interface HealthPlanDoctorProps {
  patientId: string;
}

export default function HealthPlanDoctor({ patientId }: HealthPlanDoctorProps) {
  const [healthPlan, setHealthPlan] = useState<OralHealthPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', patientId), (doc) => {
      const data = doc.data();
      if (data?.healthPlan) {
        setHealthPlan(data.healthPlan);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [patientId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Plan de Santé Bucco-dentaire</h2>
          <div className="flex items-center space-x-4">
            {healthPlan && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>
                  Mis à jour le {new Date(healthPlan.lastUpdated).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <Edit2 className="h-4 w-4" />
              <span>{healthPlan ? 'Modifier' : 'Créer'} le plan</span>
            </button>
          </div>
        </div>

        {healthPlan ? (
          <>
            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vue d'ensemble</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Recommandations personnalisées</h4>
                    <p className="mt-1 text-sm text-blue-700">{healthPlan.recommendations}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Routine */}
            <DailyRoutine routine={healthPlan.routine} />

            {/* Progress Tracking */}
            <ProgressTracker 
              progress={healthPlan.progress} 
              routine={healthPlan.routine}
              onUpdateProgress={() => {}} // Read-only for doctor
              readOnly
            />
          </>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun plan de santé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Créez un plan de santé personnalisé pour ce patient.
            </p>
          </div>
        )}
      </div>

      <EditHealthPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientId={patientId}
        currentPlan={healthPlan}
      />
    </div>
  );
}