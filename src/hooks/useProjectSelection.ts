import { useState, useMemo, useCallback } from 'react';
import type { ProjectCategory } from '../types/project';
import { projects } from '../data/projects';

export const useProjectSelection = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        activeCategory === 'all' ||
        activeCategory === 'recent' ||
        project.category === activeCategory;

      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.stack.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || null;
  }, [selectedProjectId]);

  const selectProject = useCallback((id: string) => {
    setSelectedProjectId(id);
  }, []);

  const changeCategory = useCallback((category: ProjectCategory | 'all' | 'recent') => {
    setActiveCategory(category);
  }, []);

  return {
    activeCategory,
    changeCategory,
    searchQuery,
    setSearchQuery,
    filteredProjects,
    selectedProject,
    selectProject,
  };
};
