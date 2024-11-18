import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { OralHealthPlan } from '../../../types/health';

interface EditHealthPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  currentPlan: OralHealthPlan | null;
}

export default function EditHealthPlanModal({
  isOpen,
  onClose,
  patientId,
  currentPlan
}: EditHealthPlanModalProps) {
  const [formData, setFormData] = useState({
    recommendations: currentPlan?.recommendations || '',
    morningRoutine: currentPlan?.routine.morning || [''],
    eveningRoutine: currentPlan?.routine.evening || ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userRef = doc(db, 'users', patientId);
      await updateDoc(userRef, {
        healthPlan: {
          recommendations: formData.recommendations,
          routine: {
            morning: formData.morningRoutine.filter(step => step.trim() !== ''),
            evening: formData.eveningRoutine.filter(step => step.trim() !== '')
          },
          progress: currentPlan?.progress || {},
          lastUpdated: new Date().toISOString()
        }
      });
      onClose();
    } catch (error) {
      console.error('Error updating health plan:', error);
    }
  };

  const addRoutineStep = (type: 'morning' | 'evening') => {
    const key = `${type}Routine` as keyof typeof formData;
    setFormData({
      ...formData,
      [key]: [...formData[key], '']
    });
  };

  const removeRoutineStep = (type: 'morning' | 'evening', index: number) => {
    const key = `${type}Routine` as keyof typeof formData;
    setFormData({
      ...formData,
      [key]: formData[key].filter((_, i) => i !== index)
    });
  };

  const updateRoutineStep = (type: 'morning' | 'evening', index: number, value: string) => {
    const key = `${type}Routine` as keyof typeof formData;
    const newRoutine = [...formData[key]];
    newRoutine[index] = value;
    setFormData({
      ...formData,
      [key]: newRoutine
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="relative bg-white rounded-lg max-w-2xl w-full">
          <div className="absolute right-0 top-0 p-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Modifier le Plan de Santé Bucco-dentaire
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommandations
                </label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Entrez les recommandations personnalisées..."
                />
              </div>

              {/* Morning Routine */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routine du Matin
                </label>
                <div className="space-y-2">
                  {formData.morningRoutine.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateRoutineStep('morning', index, e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Étape de la routine..."
                      />
                      <button
                        type="button"
                        onClick={() => removeRoutineStep('morning', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addRoutineStep('morning')}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter une étape</span>
                  </button>
                </div>
              </div>

              {/* Evening Routine */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routine du Soir
                </label>
                <div className="space-y-2">
                  {formData.eveningRoutine.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateRoutineStep('evening', index, e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Étape de la routine..."
                      />
                      <button
                        type="button"
                        onClick={() => removeRoutineStep('evening', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addRoutineStep('evening')}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter une étape</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}