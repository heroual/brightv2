import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Stethoscope, CheckCircle2, Calendar, AlertTriangle } from 'lucide-react';
import ProgressTracker from './health/ProgressTracker';
import DailyRoutine from './health/DailyRoutine';
import { OralHealthPlan } from '../../types/health';

export default function OralHealthPlanView() {
  const { currentUser } = useAuth();
  const [healthPlan, setHealthPlan] = useState<OralHealthPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
      const data = doc.data();
      if (data?.healthPlan) {
        setHealthPlan(data.healthPlan);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const updateProgress = async (date: string, routineType: string, completed: boolean) => {
    if (!currentUser || !healthPlan) return;

    const updatedProgress = {
      ...healthPlan.progress,
      [date]: {
        ...healthPlan.progress[date],
        [routineType]: completed
      }
    };

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        'healthPlan.progress': updatedProgress
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

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

  if (!healthPlan) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-6">
          <Stethoscope className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Pas de plan de santé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Votre dentiste n'a pas encore créé de plan de santé personnalisé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Plan de Santé Bucco-dentaire</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              Mis à jour le {new Date(healthPlan.lastUpdated).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

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
          onUpdateProgress={updateProgress}
        />
      </div>
    </div>
  );
}