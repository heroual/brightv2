import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { CalendarDays, FileText, Clock, Settings } from 'lucide-react';
import Navbar from '../components/Navbar';
import AppointmentList from '../components/profile/AppointmentList';
import MedicalHistory from '../components/profile/MedicalHistory';
import OralHealthPlanView from '../components/profile/OralHealthPlan';

export default function ProfilePage() {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) return null;
  if (!currentUser) return <Navigate to="/signin" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="h-24 w-24 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {userProfile?.displayName.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{userProfile?.displayName}</h2>
                <p className="text-gray-600">{userProfile?.email}</p>
              </div>
              
              <nav className="space-y-2">
                <a href="#appointments" className="flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600">
                  <CalendarDays className="h-5 w-5" />
                  <span>Rendez-vous</span>
                </a>
                <a href="#health-plan" className="flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600">
                  <Clock className="h-5 w-5" />
                  <span>Plan de Santé</span>
                </a>
                <a href="#medical-history" className="flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600">
                  <FileText className="h-5 w-5" />
                  <span>Dossier Médical</span>
                </a>
                <a href="#settings" className="flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600">
                  <Settings className="h-5 w-5" />
                  <span>Paramètres</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <section id="appointments">
              <AppointmentList />
            </section>

            <section id="health-plan">
              <OralHealthPlanView />
            </section>

            <section id="medical-history">
              <MedicalHistory />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}