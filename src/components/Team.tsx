import React from 'react';
import { Award, GraduationCap } from 'lucide-react';

const doctors = [
  {
    name: 'Dr. Salah Eddine',
    role: 'Chirurgien-Dentiste',
    education: 'Professeur en France',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80',
    description: 'Expert en implantologie et chirurgie maxillo-faciale, le Dr. Salah Eddine apporte son expertise internationale acquise en France. Il se spécialise dans les cas complexes nécessitant une approche chirurgicale avancée.'
  },
  {
    name: 'Dr. Kaoutar',
    role: 'Chirurgien-Dentiste',
    education: 'Doctorante au Canada',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    description: 'Poursuivant ses études doctorales au Canada, Dr. Kaoutar excelle en dentisterie esthétique et restauratrice. Elle combine les dernières techniques nord-américaines avec une approche personnalisée des soins.'
  }
];

export default function Team() {
  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Notre Équipe</h2>
          <p className="mt-4 text-xl text-gray-600">Des professionnels dévoués à votre santé dentaire</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="aspect-w-3 aspect-h-2 mb-6">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium">{doctor.role}</p>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <span>{doctor.education}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Award className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 leading-relaxed">{doctor.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 p-8 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Notre Engagement Professionnel</h3>
          <p className="text-gray-600 leading-relaxed">
            Notre équipe combine expertise internationale et formation continue pour vous offrir les meilleurs soins dentaires. 
            Formés dans des institutions prestigieuses en France et au Canada, nos praticiens maintiennent les plus hauts standards 
            de qualité et de sécurité. Nous utilisons les dernières technologies et techniques pour garantir des résultats optimaux 
            et une expérience patient exceptionnelle.
          </p>
        </div>
      </div>
    </section>
  );
}