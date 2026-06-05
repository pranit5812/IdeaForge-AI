import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Compass, FolderHeart, ShieldAlert, Award, Star, Search, Plus, Trash2, ExternalLink } from 'lucide-react';
import GlowCard from '../components/Common/GlowCard';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSavedProjects();
  }, []);

  const fetchSavedProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load saved projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this blueprint?')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Delete blueprint failed:', error);
    }
  };

  // Filter projects based on title search
  const filteredProjects = projects.filter((p) =>
    p.project_data.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ownedProjects = filteredProjects.filter((p) => p.role === 'owner' || !p.role);
  const teamProjects = filteredProjects.filter((p) => p.role === 'member');

  // Compute stat averages
  const avgInnovation = projects.length
    ? Math.round(projects.reduce((acc, p) => acc + (p.project_data.originality?.innovation_score || 0), 0) / projects.length)
    : 0;

  const avgResume = projects.length
    ? Math.round(projects.reduce((acc, p) => acc + (p.project_data.resume_impact || 0), 0) / projects.length)
    : 0;

  const renderProjectCard = (project, isOwner) => (
    <Link
      key={project.id}
      to={`/project/${project.id}`}
      className={`glass-panel p-5 rounded-2xl border hover:bg-white/40 transition-all duration-300 block text-left relative group cursor-pointer ${
        isOwner ? 'border-slate-200 hover:border-brand-500/30' : 'border-cyan-200 hover:border-cyan-500/35'
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-50 border border-brand-100 text-brand-600 text-[10px] font-bold uppercase tracking-wider">
              {project.project_data.difficulty}
            </span>
            {!isOwner && (
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-cyan-50 border border-cyan-100 text-cyan-600 text-[10px] font-bold uppercase tracking-wider">
                Team member
              </span>
            )}
          </div>
          <h4 className="font-extrabold text-sm text-slate-800 mt-2 tracking-wide truncate max-w-[240px] group-hover:text-brand-600 transition-colors">
            {project.project_data.title}
          </h4>
          {!isOwner && project.owner_name && (
            <p className="text-[10px] text-slate-500 mt-1">Led by {project.owner_name}</p>
          )}
        </div>
        {isOwner && (
          <button
            onClick={(e) => handleDelete(project.id, e)}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all duration-200 z-10 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
        {project.project_data.problem_statement}
      </p>
      <div className="flex flex-wrap gap-1 mt-4 border-t border-slate-100 pt-3.5 items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {project.project_data.tech_stack.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-slate-600 text-[9px] font-medium"
            >
              {t}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 group-hover:text-brand-600 transition-colors">
          Inspect <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-transparent flex">
      <Sidebar />
      
      {/* Central content pane */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header title="ACADEMIC CONSOLE" />

        <main className="flex-grow p-8 space-y-8 max-w-6xl w-full mx-auto">
          {/* Welcome block */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-white to-brand-50/30 border border-slate-200/80 relative overflow-hidden shadow-md">
            <div className="absolute right-0 top-0 w-64 h-full bg-ambient-purple opacity-30 pointer-events-none" />
            <div className="max-w-xl space-y-2">
              <h2 className="text-xl font-extrabold text-slate-800">Welcome to IdeaForge AI, {user?.name}!</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Forge startup-grade academic designs in seconds. Enter your core technologies, estimate team sizes, and customize timelines to synthesize comprehensive, high-score blueprints.
              </p>
              <div className="pt-2">
                <Link
                  to="/generate"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all duration-300 transform active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Forge New Blueprint
                </Link>
              </div>
            </div>
          </div>

          {user?.pending_team_invitations > 0 && (
            <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/60 shadow-sm">
              <p className="text-xs font-bold text-cyan-700">
                You have {user.pending_team_invitations} team project invitation
                {user.pending_team_invitations > 1 ? 's' : ''} waiting.
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                Teammates must sign up with the exact invited email to see shared projects below.
              </p>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlowCard isDark={false} className="p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Saved Blueprints</span>
                <h3 className="text-2xl font-extrabold text-slate-800">{projects.length}</h3>
              </div>
              <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 text-brand-600">
                <FolderHeart className="w-5 h-5" />
              </div>
            </GlowCard>

            <GlowCard isDark={false} className="p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Avg Innovation</span>
                <h3 className="text-2xl font-extrabold text-cyan-600">{avgInnovation}%</h3>
              </div>
              <div className="p-3 rounded-xl bg-cyan-5 border border-cyan-100 text-cyan-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </GlowCard>

            <GlowCard isDark={false} className="p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Avg Resume Score</span>
                <h3 className="text-2xl font-extrabold text-indigo-600">{avgResume}/100</h3>
              </div>
              <div className="p-3 rounded-xl bg-indigo-5 border border-indigo-100 text-indigo-600">
                <Award className="w-5 h-5" />
              </div>
            </GlowCard>

            <GlowCard isDark={false} className="p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Domain</span>
                <h3 className="text-sm font-extrabold text-slate-800 truncate max-w-[130px]">
                  {user?.domain ? user.domain.split('/')[0] : 'All Domains'}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                <Compass className="w-5 h-5" />
              </div>
            </GlowCard>
          </div>

          {/* History Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 tracking-wide uppercase">Saved Blueprints Collection</h3>
                <p className="text-[10px] text-slate-500">Search and manage your compiled AI project reports.</p>
              </div>

              {/* Search Widget */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full glass-input text-xs pl-9 py-2 rounded-xl"
                />
              </div>
            </div>

            {loading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-800 rounded w-2/3" />
                    <div className="h-3 bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                    <div className="h-8 bg-slate-800 rounded-xl w-full pt-2" />
                  </div>
                ))}
              </div>
            ) : ownedProjects.length === 0 && teamProjects.length === 0 ? (
              /* Empty state page */
              <div className="glass-panel p-12 rounded-2xl border border-slate-250 text-center space-y-4 max-w-xl mx-auto shadow-md">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
                  <FolderHeart className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800">No project blueprints stored yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  You haven't generated or saved any project designs yet. Open the forge simulator to generate your first idea!
                </p>
                <div className="pt-2">
                  <Link
                    to="/generate"
                    className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-colors"
                  >
                    Forge First Idea
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {ownedProjects.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Blueprints</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ownedProjects.map((project) => renderProjectCard(project, true))}
                    </div>
                  </div>
                )}
                {teamProjects.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Team Projects (shared with you)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teamProjects.map((project) => renderProjectCard(project, false))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
