import { useState, useMemo, useCallback, useEffect } from 'react';
import type { ProjectCategory } from '../types/project';
import { useProjectStore } from '../stores/projectStore';

export const useProjectSelection = () => {
  const { projects, fetchProjects, isLoading } = useProjectStore();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch if empty
    if (projects.length <= 4) { // Only fetch if we only have the static placeholders
       fetchProjects();
    }
  }, []);

  // Sync selected project once projects are loaded
  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

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
  }, [projects, activeCategory, searchQuery]);

  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

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
    isLoading
  };
};
