import React from 'react';
import { EducationalContent } from '../../../types/education';
import { Edit2, Trash2, Video, FileText, HelpCircle, PieChart, Eye, EyeOff } from 'lucide-react';

interface ContentGridProps {
  content: EducationalContent[];
  onEdit: (content: EducationalContent) => void;
  onDelete: (id: string) => void;
}

export default function ContentGrid({ content, onEdit, onDelete }: ContentGridProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'article':
        return <FileText className="h-6 w-6" />;
      case 'quiz':
        return <HelpCircle className="h-6 w-6" />;
      case 'infographic':
        return <PieChart className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-600';
      case 'article':
        return 'bg-blue-100 text-blue-600';
      case 'quiz':
        return 'bg-purple-100 text-purple-600';
      case 'infographic':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className={`w-full h-48 flex items-center justify-center ${getTypeColor(item.type)}`}>
              {getIcon(item.type)}
            </div>
          )}
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.type)}`}>
                {item.type}
              </span>
              <span className="flex items-center text-sm text-gray-500">
                {item.published ? (
                  <Eye className="h-4 w-4 mr-1" />
                ) : (
                  <EyeOff className="h-4 w-4 mr-1" />
                )}
                {item.published ? 'Publié' : 'Brouillon'}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {new Date(item.updatedAt).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}