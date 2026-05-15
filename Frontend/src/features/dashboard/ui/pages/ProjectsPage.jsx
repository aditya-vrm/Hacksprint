import { useState } from 'react';
import { Plus, GitBranch, ExternalLink, X } from 'lucide-react';
import { useCommunity } from '../../../community/hooks/useCommunity';
import ProjectDetailModal from '../../../community/ui/components/ProjectDetailModal';
import axiosInstance from '../../../../app/config/axiosInstance';

const ProjectsPage = () => {
  const { projects, addProject } = useCommunity();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    githubRepo: '',
    deploymentLink: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.projectName) return;
    
    try {
      const res = await axiosInstance.post('/projects/create', {
        projectName: formData.projectName,
        githubRepo: formData.githubRepo,
        deploymentLink: formData.deploymentLink,
      });
      
      // Update local state for immediate feedback
      addProject({
        id: res.data.project._id,
        ...formData,
        status: 'Active',
        updatedAt: new Date().toLocaleDateString(),
      });
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to save project to database.');
    }

    setIsModalOpen(false);
    setFormData({ projectName: '', githubRepo: '', deploymentLink: '' });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between p-6 lg:px-8 border-b border-border/50 bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-sm text-text-muted mt-1">Manage and deploy your projects.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-hover text-[#0B1120] font-bold px-4 py-2 rounded-lg text-sm tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </button>
      </div>

      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center border border-dashed border-border/50 rounded-2xl bg-surface/30 p-12 min-h-[400px]">
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4 border border-border">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-text-muted max-w-sm">
              You haven't uploaded any projects yet. Click the button in the top right to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProject(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                className="text-left bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group cursor-pointer w-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{project.projectName}</h3>
                  <span className="px-2.5 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                    {project.status}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  {project.githubRepo && (
                    <div className="flex items-center text-sm text-text-muted">
                      <GitBranch className="w-4 h-4 mr-2 shrink-0" />
                      <a
                        href={project.githubRepo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-white hover:underline truncate"
                      >
                        {project.githubRepo}
                      </a>
                    </div>
                  )}
                  {project.deploymentLink && (
                    <div className="flex items-center text-sm text-text-muted">
                      <ExternalLink className="w-4 h-4 mr-2 shrink-0" />
                      <a
                        href={project.deploymentLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-white hover:underline truncate"
                      >
                        {project.deploymentLink}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs text-text-muted pt-4 border-t border-border/50">
                  <span>Updated {project.updatedAt}</span>
                  <span className="text-primary font-medium group-hover:text-primary-hover">View details</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Project Name</label>
                <input 
                  type="text" 
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required 
                  placeholder="My Awesome App" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Github Repo URL</label>
                <input 
                  type="url" 
                  name="githubRepo"
                  value={formData.githubRepo}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Deployment Link</label>
                <input 
                  type="url" 
                  name="deploymentLink"
                  value={formData.deploymentLink}
                  onChange={handleChange}
                  placeholder="https://myapp.domain.com" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-surface-hover hover:bg-border text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary-hover text-[#0B1120] font-bold py-2.5 rounded-lg text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default ProjectsPage;
