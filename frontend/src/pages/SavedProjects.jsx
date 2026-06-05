import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import api from '../services/api';
import { FolderHeart, Search, Trash2, ExternalLink, RefreshCw, Plus } from 'lucide-react';

const SavedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch saved projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this blueprint?')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const titleMatch = p.project_data.title.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = p.project_data.problem_statement.toLowerCase().includes(searchQuery.toLowerCase());
    const difficultyMatch = difficultyFilter === 'All' || p.project_data.difficulty === difficultyFilter;
    return (titleMatch || descMatch) && difficultyMatch;
  });

  return (
    <div className="min-h-screen bg-transparent flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header title="SAVED BLUEPRINTS" />

        <main className="flex-grow p-8 space-y-6 max-w-6xl w-full mx-auto">
          {/* Filtering Widgets Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wide">Dynamic Library</h2>
              <p className="text-[10px] text-slate-500">Manage and browse your persistent portfolio of generated systems.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full glass-input text-xs pl-9 py-2 rounded-xl"
                />
              </div>

              {/* Difficulty selector */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="glass-input text-xs bg-white/90 pr-8 appearance-none focus:border-brand-500"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Main Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="w-6 h-6 text-brand-500 animate-spin" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md mx-auto shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
                <FolderHeart className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-800">No project blueprints found</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Try modifying your search text or create a new academic blueprint inside the simulator.
              </p>
              <div className="pt-2">
                <Link
                  to="/generate"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all duration-300 transform active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Forge New Idea
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  className="glass-panel p-5 rounded-2xl border border-slate-200 hover:border-brand-500/30 hover:bg-white/40 transition-all duration-300 block text-left relative group cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-50 border border-brand-100 text-brand-600 text-[10px] font-bold uppercase tracking-wider">
                      {project.project_data.difficulty}
                    </span>
                    
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all duration-200 shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-800 mt-3 tracking-wide truncate group-hover:text-brand-600 transition-colors">
                    {project.project_data.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-sans">
                    {project.project_data.problem_statement}
                  </p>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>Score: {project.project_data.resume_impact}/100</span>
                    <span className="flex items-center gap-1 group-hover:text-brand-600 transition-colors">
                      Inspect <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SavedProjects;
