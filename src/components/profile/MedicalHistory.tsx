import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Bell, Eye, EyeOff } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

interface MedicalRecord {
  date: string;
  note: string;
  doctor: string;
  isNew: boolean;
}

export default function MedicalHistory() {
  const { userProfile, currentUser } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [hasNewRecords, setHasNewRecords] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
      const data = doc.data();
      if (data?.medicalHistory) {
        const records = data.medicalHistory.map((record: any) => ({
          ...record,
          isNew: record.date > (localStorage.getItem('lastMedicalCheck') || '0')
        }));
        setMedicalRecords(records);
        setHasNewRecords(records.some((record) => record.isNew));
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleMarkAsRead = () => {
    localStorage.setItem('lastMedicalCheck', new Date().toISOString());
    setMedicalRecords(medicalRecords.map(record => ({ ...record, isNew: false })));
    setHasNewRecords(false);
  };

  const displayRecords = showAll ? medicalRecords : medicalRecords.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Dossier Médical</h2>
          <div className="flex items-center space-x-4">
            {hasNewRecords && (
              <button
                onClick={handleMarkAsRead}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Bell className="h-5 w-5" />
                <span>Marquer comme lu</span>
              </button>
            )}
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-700"
            >
              {showAll ? (
                <>
                  <EyeOff className="h-5 w-5" />
                  <span>Voir moins</span>
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" />
                  <span>Voir tout</span>
                </>
              )}
            </button>
          </div>
        </div>

        {medicalRecords.length > 0 ? (
          <div className="space-y-4">
            {displayRecords.map((record, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg transition-all duration-300 ${
                  record.isNew ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      record.isNew ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <FileText className={`h-6 w-6 ${
                        record.isNew ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">Dr. {record.doctor}</p>
                    </div>
                  </div>
                  {record.isNew && (
                    <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                      Nouveau
                    </span>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{record.note}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun antécédent médical</h3>
            <p className="mt-1 text-sm text-gray-500">
              Votre historique médical apparaîtra ici.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}