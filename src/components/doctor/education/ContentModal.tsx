import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image } from 'lucide-react';
import { EducationalContent, QuizQuestion } from '../../../types/education';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: EducationalContent | null;
  onSubmit: (data: any) => Promise<void>;
}

export default function ContentModal({
  isOpen,
  onClose,
  content,
  onSubmit
}: ContentModalProps) {
  const [formData, setFormData] = useState({
    type: 'article',
    title: '',
    description: '',
    content: '',
    thumbnail: '',
    category: '',
    videoUrl: '',
    published: false,
    readTime: '',
    questions: [] as QuizQuestion[],
    images: [] as string[]
  });

  useEffect(() => {
    if (content) {
      setFormData({
        type: content.type,
        title: content.title,
        description: content.description,
        content: content.content,
        thumbnail: content.thumbnail || '',
        category: content.category,
        videoUrl: content.videoUrl || '',
        published: content.published,
        readTime: content.readTime || '',
        questions: content.questions || [],
        images: content.images || []
      });
    } else {
      setFormData({
        type: 'article',
        title: '',
        description: '',
        content: '',
        thumbnail: '',
        category: '',
        videoUrl: '',
        published: false,
        readTime: '',
        questions: [],
        images: []
      });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...formData.images];
    newImages[index] = url;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  // ... rest of the existing modal code ...

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="absolute right-0 top-0 p-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {content ? 'Modifier le contenu' : 'Nouveau contenu'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Existing form fields... */}

              {/* Images Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Images du contenu</label>
                  <button
                    type="button"
                    onClick={addImage}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter une image
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Image className="h-5 w-5 text-gray-400" />
                          <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => updateImage(index, e.target.value)}
                            placeholder="URL de l'image"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={`Preview ${index + 1}`}
                            className="mt-2 h-32 w-full object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {content ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}