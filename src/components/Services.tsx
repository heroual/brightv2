import React from 'react';
import { Sparkles, ShieldCheck, Heart, Clock } from 'lucide-react';

const services = [
  {
    icon: Sparkles,
    title: 'Dentisterie Esthétique',
    description: 'Transformez votre sourire avec nos procédures cosmétiques avancées, incluant le blanchiment et les facettes.'
  },
  {
    icon: ShieldCheck,
    title: 'Soins Préventifs',
    description: 'Examens et nettoyages réguliers pour maintenir votre santé bucco-dentaire et prévenir les problèmes futurs.'
  },
  {
    icon: Heart,
    title: 'Dentisterie Familiale',
    description: 'Soins dentaires complets pour toute votre famille, des enfants aux seniors.'
  },
  {
    icon: Clock,
    title: 'Soins d\'Urgence',
    description: 'Services dentaires d\'urgence 24h/24 et 7j/7 pour une attention immédiate.'
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Nos Services</h2>
          <p className="mt-4 text-xl text-gray-600">Des soins dentaires complets adaptés à vos besoins</p>
        </div>
        
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <service.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}