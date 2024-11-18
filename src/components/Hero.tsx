import React from 'react';
import { CalendarDays, Phone } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Votre Voyage vers un
              <span className="text-blue-600"> Sourire Parfait </span>
              Commence Ici
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Découvrez des soins dentaires de classe mondiale avec notre équipe de professionnels expérimentés.
              Nous nous engageons à fournir des traitements confortables et personnalisés pour toute votre famille.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
                <CalendarDays className="h-5 w-5" />
                <span>Prendre Rendez-vous</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-md border-2 border-blue-600 hover:bg-blue-50 transition">
                <Phone className="h-5 w-5" />
                <span>Appelez-nous</span>
              </button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80"
              alt="Cabinet dentaire moderne"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80`}
                      alt={`Patient ${i}`}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Plus de 500 Patients Satisfaits</p>
                  <p className="text-gray-600">Rejoignez notre famille dentaire</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}