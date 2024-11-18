import React from 'react';
import { Book, Video, PieChart, Brain } from 'lucide-react';
import ArticleList from './ArticleList';
import VideoGallery from './VideoGallery';
import InteractiveQuiz from './InteractiveQuiz';

export default function EducationHub() {
  return (
    <section id="education" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Centre d'Apprentissage</h2>
          <p className="mt-4 text-xl text-gray-600">
            Découvrez nos ressources éducatives pour une meilleure santé bucco-dentaire
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <Book className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Articles</h3>
            <p className="text-gray-600">
              Explorez nos articles détaillés sur la santé dentaire
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <Video className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Vidéos</h3>
            <p className="text-gray-600">
              Regardez nos tutoriels et guides vidéo
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <PieChart className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Infographies</h3>
            <p className="text-gray-600">
              Visualisez des informations clés sur la santé dentaire
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <Brain className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz</h3>
            <p className="text-gray-600">
              Testez vos connaissances en santé bucco-dentaire
            </p>
          </div>
        </div>

        <ArticleList />
        <VideoGallery />
        <InteractiveQuiz />
      </div>
    </section>
  );
}