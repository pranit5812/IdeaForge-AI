import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import api from '../services/api';
import ArchitectureView from '../components/Project/ArchitectureView';
import GlowCard from '../components/Common/GlowCard';
import {
  OverviewSection,
  OriginalitySection,
  RoadmapSection,
  VivaSection,
} from '../components/Project/ProjectTabSections';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Copy, Award, ShieldAlert, BrainCircuit, Calendar, 
  Check, Download, RefreshCw, ArrowLeft 
} from 'lucide-react';

const tabs = [
  { id: 'overview', name: 'Overview & Tech', icon: FileText },
  { id: 'originality', name: 'Originality Scanner', icon: ShieldAlert },
  { id: 'architecture', name: 'System Architecture', icon: BrainCircuit },
  { id: 'roadmap', name: 'Development Roadmap', icon: Calendar },
  { id: 'viva', name: 'Viva Prep Bank', icon: Award }
];

const ProjectResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [projectMeta, setProjectMeta] = useState({ role: 'owner', owner_name: null });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Micro-interaction states
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedQA, setCopiedQA] = useState({});
  const [exportingPDF, setExportingPDF] = useState(false);
  const [regeneratingViva, setRegeneratingViva] = useState(false);
  const [vivaTab, setVivaTab] = useState('technical');

  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await api.get(`/api/projects/${id}`);
      setProject(response.data.project_data);
      setProjectMeta({
        role: response.data.role || 'owner',
        owner_name: response.data.owner_name,
        team_member_emails: response.data.team_member_emails || [],
      });
    } catch (error) {
      console.error('Failed to load project details:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchProjectDetails();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchProjectDetails]);

  const handleCopyAll = () => {
    if (!project) return;
    const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : [];
    const features = Array.isArray(project.features) ? project.features : [];
    const roadmap = Array.isArray(project.roadmap) ? project.roadmap : [];
    const text = `
IdeaForge AI - Project Plan: ${project.title}
---------------------------------------------
Problem Statement:
${project.problem_statement}

Suggested Tech Stack:
${techStack.join(', ')}

Features:
${features.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Roadmap:
${roadmap.map((r) => `- [${r.timeline}] ${r.title}: ${r.description}`).join('\n')}
    `;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyQuestion = (index, question, answer) => {
    const text = `Q: ${question}\nA: ${answer}`;
    navigator.clipboard.writeText(text);
    setCopiedQA((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setCopiedQA((prev) => ({ ...prev, [index]: false }));
    }, 2000);
  };

  const handleExportPDF = async () => {
    if (exportingPDF) return;
    setExportingPDF(true);
    try {
      const response = await api.get(`/api/projects/${id}/export/pdf`, {
        responseType: 'blob'
      });
      // Stream PDF download in browser
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `IdeaForge_${project.title.replace(/\s+/g, '_')}.pdf`;
      link.click();
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setExportingPDF(false);
    }
  };

  const handleRegenerateViva = async () => {
    setRegeneratingViva(true);
    try {
      // Endpoint to regenerate viva questions specifically
      const response = await api.post(`/api/projects/${id}/viva/regenerate`);
      setProject(response.data.project_data);
    } catch (error) {
      console.error('Failed to regenerate viva:', error);
    } finally {
      setRegeneratingViva(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex">
        <Sidebar />
        <div className="flex-1 pl-64 flex flex-col min-h-screen">
          <Header title="COMPILING DESIGN..." />
          <div className="flex-grow p-8 flex items-center justify-center">
            <div className="space-y-4 text-center max-w-sm">
              <RefreshCw className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Reading blueprint databases...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const originality = project.originality || {};
  const innovationScore = originality.innovation_score ?? 0;
  const originalityStatus = innovationScore >= 80 ? 'Highly Unique' : 'Moderate Match';

  return (
    <div className="min-h-screen bg-transparent flex">
      <Sidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header title={project.title} />

        <main className="flex-grow p-8 space-y-6 max-w-6xl w-full mx-auto">
          {/* Back button and quick actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyAll}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-brand-600 hover:border-brand-200 transition-colors shadow-sm"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedAll ? 'Blueprint Copied' : 'Copy All'}
              </button>

              <button
                onClick={handleExportPDF}
                disabled={exportingPDF}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-extrabold shadow-lg shadow-brand-500/10 transition-colors"
              >
                {exportingPDF ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                {exportingPDF ? 'Compiling PDF...' : 'Download PDF Report'}
              </button>
            </div>
          </div>

          {projectMeta.role === 'member' && (
            <div className="p-3 rounded-xl border border-cyan-200 bg-cyan-50/70 text-xs text-cyan-700 shadow-sm">
              You are viewing this blueprint as a <strong>team member</strong>
              {projectMeta.owner_name ? ` - project lead: ${projectMeta.owner_name}` : ''}.
            </div>
          )}

          {projectMeta.team_member_emails?.length > 0 && projectMeta.role === 'owner' && (
            <div className="p-3 rounded-xl border border-slate-200 bg-white/70 text-xs text-slate-600 shadow-sm">
              <span className="font-bold text-slate-800">Invited teammates: </span>
              {projectMeta.team_member_emails.join(', ')}
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
              <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Difficulty Rating</span>
                <p className="text-xs font-extrabold text-slate-800 uppercase mt-0.5">{project.difficulty}</p>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
              <div className="p-2.5 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Originality Status</span>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{originalityStatus}</p>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Resume Impact Score</span>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{project.resume_impact} / 100</p>
              </div>
            </div>
          </div>

          {/* Elegant Tabs Selector */}
          <div className="border-b border-slate-200 flex gap-2 overflow-x-auto pb-px">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 py-3 px-4 font-semibold text-xs tracking-wide uppercase border-b-2 whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-brand-500 text-brand-600 bg-brand-50/70'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="pt-2 min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && <OverviewSection project={project} />}

              {activeTab === 'originality' && <OriginalitySection project={project} />}

              {activeTab === 'architecture' && (
                <motion.div
                  key="architecture"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <GlowCard className="space-y-2 border-slate-200/80 bg-white/75 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      System Architecture
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                      This section explains your project from the first user action through each
                      technology layer. Use the overview and numbered journey when presenting or
                      defending your design in a viva.
                    </p>
                  </GlowCard>
                  <GlowCard className="p-6 md:p-8 border-slate-200/80 bg-white/75 shadow-sm">
                    <ArchitectureView architecture={project.architecture} />
                  </GlowCard>
                </motion.div>
              )}

              {activeTab === 'roadmap' && <RoadmapSection project={project} />}

              {activeTab === 'viva' && (
                <VivaSection
                  project={project}
                  vivaTab={vivaTab}
                  onVivaTabChange={setVivaTab}
                  onCopyQuestion={handleCopyQuestion}
                  copiedQA={copiedQA}
                  canRegenerate={projectMeta.role === 'owner'}
                  onRegenerate={handleRegenerateViva}
                  regeneratingViva={regeneratingViva}
                />
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectResult;
