import React, { useState } from 'react';
import { Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import ContentList from './ContentList';
import ContentGrid from './ContentGrid';
import ContentForm from './ContentForm';
import ContentFilters from './ContentFilters';
import { useEducationalContent } from '../../../hooks/useEducationalContent';

export default function EducationManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedContent, setSelectedContent] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    level: 'all',
    status: 'all'
  });
  const { content, loading, error, addContent, updateContent, deleteContent } = useEducationalContent();

  const handleContentSubmit = async (formData: any) => {
    if (selectedContent) {
      await updateContent(selectedContent.id, formData);
    } else {
      await addContent(formData);
    }
    setIsFormOpen(false);
    setSelectedContent(null);
  };

  const handleEdit = (content: any) => {
    setSelectedContent(content);
    setIsFormOpen(true);
  };

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         item.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'all' || item.category === filters.category;
    const matchesLevel = filters.level === 'all' || item.level === filters.level;
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'published' && item.published) ||
                         (filters.status === 'draft' && !item.published);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Contenu Éducatif</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <Plus className="h-5 w-5" />
          <span>Nouveau Contenu</span>
        </button>
      </div>

      <ContentFilters filters={filters} onFilterChange={setFilters} />

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
        >
          <ListIcon className="h-5 w-5" />
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <ContentGrid content={filteredContent} onEdit={handleEdit} onDelete={deleteContent} />
      ) : (
        <ContentList content={filteredContent} onEdit={handleEdit} onDelete={deleteContent} />
      )}

      <ContentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedContent(null);
        }}
        onSubmit={handleContentSubmit}
        initialData={selectedContent}
      />
    </div>
  );
}