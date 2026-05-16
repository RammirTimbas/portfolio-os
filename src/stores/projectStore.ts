import { create } from 'zustand';
import { projects as staticProjects } from '../data/projects';
import { profileData } from '../data/profile';
import type { Project, ProjectCategory } from '../types/project';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: staticProjects,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const username = profileData.links.github.split('/').pop();
      if (!username) throw new Error('GitHub username not found in profile');

      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      if (!response.ok) throw new Error('Failed to fetch projects from GitHub');

      const repos = await response.json();

      const githubProjects: Project[] = repos
        .filter((repo: any) => !repo.fork)
        .map((repo: any) => {
          const existingProject = staticProjects.find(p =>
            p.github?.toLowerCase().includes(repo.name.toLowerCase()) ||
            p.id.toLowerCase() === repo.name.toLowerCase()
          );

          // Advanced categorization inference
          let inferredCategory: ProjectCategory = 'other';
          const topics = (repo.topics || []).map((t: string) => t.toLowerCase());
          const name = repo.name.toLowerCase();
          const lang = repo.language?.toLowerCase() || '';

          const isWeb = topics.some(t => ['webapp', 'frontend', 'website', 'react', 'nextjs', 'vue', 'tailwind'].includes(t)) ||
                        ['typescript', 'javascript', 'html'].includes(lang) ||
                        name.includes('web') || name.includes('site');

          const isAPI = topics.some(t => ['api', 'backend', 'server', 'microservice', 'database'].includes(t)) ||
                        ['go', 'python', 'rust', 'java'].includes(lang) ||
                        name.includes('api') || name.includes('backend');

          const isUI = topics.some(t => ['ui', 'design', 'components', 'css', 'ux'].includes(t)) ||
                       name.includes('ui') || name.includes('theme');

          if (isWeb) inferredCategory = 'web';
          else if (isAPI) inferredCategory = 'api';
          else if (isUI) inferredCategory = 'ui';

          return {
            id: repo.name,
            title: existingProject?.title || repo.name.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
            description: existingProject?.description || repo.description || 'No description provided.',
            longDescription: existingProject?.longDescription || repo.description,
            stack: existingProject?.stack || (repo.language ? [repo.language] : []),
            status: (existingProject?.status || (repo.archived ? 'archived' : 'completed')) as any,
            category: (existingProject?.category || inferredCategory),
            github: repo.html_url,
            demo: existingProject?.demo || repo.homepage || null,
            image: existingProject?.image,
            images: existingProject?.images,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            metadata: {
              version: existingProject?.metadata?.version || '1.0.0',
              size: `${(repo.size / 1024).toFixed(1)} MB`,
              lastModified: repo.updated_at.split('T')[0],
            }
          };
        });

      const githubIds = new Set(githubProjects.map(p => p.id));
      const remainingStatic = staticProjects.filter(p => !githubIds.has(p.id));

      set({ projects: [...githubProjects, ...remainingStatic], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
