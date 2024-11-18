import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { LearningObjective, Material } from '../../../types/education';

interface ContentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export default function ContentForm({ isOpen, onClose, onSubmit, initialData }: ContentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: '',
    learningObjectives: [{ id: Date.now(), text: '' }] as LearningObjective[],
    materials: [{ id: Date.now(), type: 'text', content: '', title: '' }] as Material[],
    prerequisites: '',
    published: false,
    status: 'draft'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        learningObjectives: initialData.learningObjectives || [{ id: Date.now(), text: '' }],
        materials: initialData.materials || [{ id: Date.now(), type: 'text', content: '', title: '' }]
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        duration: '',
        learningObjectives: [{ id: Date.now(), text: '' }],
        materials: [{ id: Date.now(), type: 'text', content: '', title: '' }],
        prerequisites: '',
        published: false,
        status: 'draft'
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      published: formData.status === 'published',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await onSubmit(submissionData);
  };

  const addLearningObjective = () => {
    setFormData({
      ...formData,
      learningObjectives: [
        ...formData.learningObjectives,
        { id: Date.now(), text: '' }
      ]
    });
  };

  const addMaterial = () => {
    setFormData({
      ...formData,
      materials: [
        ...formData.materials,
        { id: Date.now(), type: 'text', content: '', title: '' }
      ]
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Modifier le contenu' : 'Nouveau contenu éducatif'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="hygiene">Hygiène dentaire</option>
                <option value="prevention">Prévention</option>
                <option value="treatments">Traitements</option>
                <option value="nutrition">Nutrition</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Niveau</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Durée estimée</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="ex: 30 minutes"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Objectifs d'apprentissage</label>
              <button
                type="button"
                onClick={addLearningObjective}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un objectif
              </button>
            </div>
            <div className="space-y-2">
              {formData.learningObjectives.map((objective, index) => (
                <div key={objective.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={objective.text}
                    onChange={(e) => {
                      const newObjectives = [...formData.learningObjectives];
                      newObjectives[index].text = e.target.value;
                      setFormData({ ...formData, learningObjectives: newObjectives });
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Objectif d'apprentissage"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newObjectives = formData.learningObjectives.filter((_, i) => i !== index);
                      setFormData({ ...formData, learningObjectives: newObjectives });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Matériel pédagogique</label>
              <button
                type="button"
                onClick={addMaterial}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter du matériel
              </button>
            </div>
            <div className="space-y-4">
              {formData.materials.map((material, index) => (
                <div key={material.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <select
                      value={material.type}
                      onChange={(e) => {
                        const newMaterials = [...formData.materials];
                        newMaterials[index].type = e.target.value;
                        setFormData({ ...formData, materials: newMaterials });
                      }}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="text">Texte</option>
                      <option value="video">Vidéo</option>
                      <option value="pdf">PDF</option>
                      <option value="quiz">Quiz</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const newMaterials = formData.materials.filter((_, i) => i !== index);
                        setFormData({ ...formData, materials: newMaterials });
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={material.title}
                    onChange={(e) => {
                      const newMaterials = [...formData.materials];
                      newMaterials[index].title = e.target.value;
                      setFormData({ ...formData, materials: newMaterials });
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Titre du matériel"
                  />
                  <textarea
                    value={material.content}
                    onChange={(e) => {
                      const newMaterials = [...formData.materials];
                      newMaterials[index].content = e.target.value;
                      setFormData({ ...formData, materials: newMaterials });
                    }}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={`Contenu ${material.type === 'video' ? '(URL)' : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prérequis</label>
            <textarea
              value={formData.prerequisites}
              onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Connaissances requises pour suivre ce cours"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
            <div className="flex space-x-3">
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
                {initialData ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}