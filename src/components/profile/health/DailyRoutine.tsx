import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { DailyRoutine as RoutineType } from '../../../types/health';

interface DailyRoutineProps {
  routine: RoutineType;
}

export default function DailyRoutine({ routine }: DailyRoutineProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Routine Quotidienne</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Morning Routine */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium text-gray-900">Routine du Matin</h4>
          </div>
          <ul className="space-y-3">
            {routine.morning.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-gray-600">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Evening Routine */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-indigo-500" />
            <h4 className="font-medium text-gray-900">Routine du Soir</h4>
          </div>
          <ul className="space-y-3">
            {routine.evening.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-gray-600">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}