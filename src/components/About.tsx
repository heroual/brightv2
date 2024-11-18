import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">À Propos de Notre Cabinet</h2>
          <p className="mt-4 text-xl text-gray-600">Un environnement moderne pour des soins dentaires exceptionnels</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Notre Engagement</h3>
              <p className="text-gray-600 leading-relaxed">
                Situé au cœur de Taroudant, notre cabinet dentaire moderne combine expertise médicale et technologies de pointe pour offrir des soins dentaires exceptionnels. Nous nous engageons à fournir des traitements personnalisés dans un environnement accueillant et confortable.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Informations Pratiques</h3>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p>Ahmer Laglalcha, Taroudant, Maroc</p>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p>+212 808 551 720</p>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p>Lun - Ven: 9h00 - 18h00</p>
                  <p>Sam: 9h00 - 13h00</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p>contact@brightsmile-dentaire.ma</p>
              </div>
            </div>
          </div>

          <div className="h-[400px] bg-white rounded-xl shadow-lg overflow-hidden">
            <iframe
              src="https://frame.openstreetmap.org/export/embed.html?bbox=-8.887461,30.470216,-8.881625,30.474216&layer=mapnik&marker=30.472216,-8.884543"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Localisation du cabinet dentaire"
              className="w-full h-full"
            ></iframe>
            <div className="text-center mt-2">
              <a 
                href="https://frame.openstreetmap.org/?mlat=30.472216&mlon=-8.884543#map=18/30.472216/-8.884543"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Voir sur OpenStreetMap
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}