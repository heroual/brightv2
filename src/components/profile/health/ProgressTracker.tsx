import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { Progress, DailyRoutine } from '../../../types/health';

interface ProgressTrackerProps {
  progress: Progress;
  routine: DailyRoutine;
  onUpdateProgress: (date: string, routineType: string, completed: boolean) => void;
  readOnly?: boolean;
}

export default function ProgressTracker({ 
  progress, 
  routine, 
  onUpdateProgress,
  readOnly = false 
}: ProgressTrackerProps) {
  const [currentWeek, setCurrentWeek] = useState(0);

  const getDaysInWeek = (weekOffset: number) => {
    const days = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const days = getDaysInWeek(currentWeek);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Suivi de Progression</h3>
      
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentWeek(prev => prev - 1)}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Semaine précédente</span>
        </button>
        <button
          onClick={() => setCurrentWeek(prev => prev + 1)}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
          disabled={currentWeek >= 0}
        >
          <span>Semaine suivante</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Grid */}
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Routine
              </th>
              {days.map(day => (
                <th
                  key={day.toISOString()}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  <br />
                  {day.toLocaleDateString('fr-FR', { day: 'numeric' })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Matin
              </td>
              {days.map(day => {
                const dateStr = formatDate(day);
                const completed = progress[dateStr]?.morning || false;
                return (
                  <td key={dateStr} className="px-6 py-4 text-center">
                    <button
                      onClick={() => !readOnly && onUpdateProgress(dateStr, 'morning', !completed)}
                      className={`focus:outline-none ${readOnly ? 'cursor-default' : ''}`}
                      disabled={day > new Date() || readOnly}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-gray-300" />
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Soir
              </td>
              {days.map(day => {
                const dateStr = formatDate(day);
                const completed = progress[dateStr]?.evening || false;
                return (
                  <td key={dateStr} className="px-6 py-4 text-center">
                    <button
                      onClick={() => !readOnly && onUpdateProgress(dateStr, 'evening', !completed)}
                      className={`focus:outline-none ${readOnly ? 'cursor-default' : ''}`}
                      disabled={day > new Date() || readOnly}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-gray-300" />
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}