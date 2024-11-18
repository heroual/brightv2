import React from 'react';
import { ArrowLeft, Clock, Tag, Calendar } from 'lucide-react';

interface ArticleViewerProps {
  article: {
    title: string;
    content: string;
    category: string;
    readTime: string;
    image?: string;
    date?: string;
  };
  onClose: () => void;
}

export default function ArticleViewer({ article, onClose }: ArticleViewerProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={onClose}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour
            </button>
          </div>
        </div>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-[400px] object-cover rounded-xl mb-8"
            />
          )}

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              <Tag className="h-4 w-4 mr-1" />
              {article.category}
            </span>
            <span className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {article.readTime} de lecture
            </span>
            {article.date && (
              <span className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(article.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>

          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}