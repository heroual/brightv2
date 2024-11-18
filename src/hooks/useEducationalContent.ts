import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { EducationalContent } from '../types/education';

export function useEducationalContent() {
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      const q = query(collection(db, 'educational-content'));
      const snapshot = await getDocs(q);
      const contentList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EducationalContent));
      setContent(contentList);
      setError(null);
    } catch (err) {
      setError('Failed to fetch educational content');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const addContent = async (newContent: Omit<EducationalContent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'educational-content'), {
        ...newContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      await fetchContent();
      return docRef.id;
    } catch (err) {
      setError('Failed to add content');
      console.error('Error adding content:', err);
    }
  };

  const updateContent = async (id: string, updatedContent: Partial<EducationalContent>) => {
    try {
      const docRef = doc(db, 'educational-content', id);
      await updateDoc(docRef, {
        ...updatedContent,
        updatedAt: new Date().toISOString()
      });
      await fetchContent();
    } catch (err) {
      setError('Failed to update content');
      console.error('Error updating content:', err);
    }
  };

  const deleteContent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'educational-content', id));
      await fetchContent();
    } catch (err) {
      setError('Failed to delete content');
      console.error('Error deleting content:', err);
    }
  };

  return {
    content,
    loading,
    error,
    addContent,
    updateContent,
    deleteContent,
    refreshContent: fetchContent
  };
}