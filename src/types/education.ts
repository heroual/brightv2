export interface LearningObjective {
  id: number;
  text: string;
}

export interface Material {
  id: number;
  type: 'text' | 'video' | 'pdf' | 'quiz';
  title: string;
  content: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  learningObjectives: LearningObjective[];
  materials: Material[];
  prerequisites: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ContentFilters {
  search: string;
  category: string;
  level: string;
  status: string;
}