import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, X, BrainCircuit, Users, Calendar, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlowCard from '../components/Common/GlowCard';
import { DOMAIN_TECHNOLOGIES } from '../constants/domainTechnologies';

const loadingStatuses = [
  "Bootstrapping AI project architect...",
  "Analyzing skill synergies...",
  "Scanning academic database for copycats...",
  "Isolating overused attendance system templates...",
  "Formatting database collection schema models...",
  "Synthesizing advanced technical viva bank questions...",
  "Mapping out weekly timeline milestones...",
  "Calculating resume impact scores..."
];

const GenerateProject = () => {
  const [domain, setDomain] = useState('');
  const [skills, setSkills] = useState([]);
  const [difficulty, setDifficulty] = useState('Medium');
  const [teamSize, setTeamSize] = useState(2);
  const [teamEmails, setTeamEmails] = useState(['']);
  const [duration, setDuration] = useState('2 Months');
  
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [statusIdx, setStatusIdx] = useState(0);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setStatusIdx((prev) => (prev + 1) % loadingStatuses.length);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const teammateSlots = Math.max(0, teamSize - 1);

  const availableTechnologies = domain ? DOMAIN_TECHNOLOGIES[domain] || [] : [];

  const handleDomainChange = (newDomain) => {
    setDomain(newDomain);
    setSkills([]);
  };

  const toggleTechnology = (tech) => {
    setSkills((prev) =>
      prev.includes(tech) ? prev.filter((s) => s !== tech) : [...prev, tech]
    );
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleTeamSizeChange = (nextSize) => {
    setTeamSize(nextSize);
    const nextSlots = Math.max(0, nextSize - 1);
    setTeamEmails((prev) => {
      const next = [...prev];
      while (next.length < nextSlots) next.push('');
      return next.slice(0, nextSlots);
    });
  };

  const handleSynthesize = async (e) => {
    e.preventDefault();
    if (!domain) {
      setError('Please select a domain.');
      return;
    }
    if (skills.length === 0) {
      setError('Please select at least one target technology.');
      return;
    }
    if (teamSize > 1) {
      const filled = teamEmails.map((e) => e.trim()).filter(Boolean);
      if (filled.length !== teammateSlots) {
        setError(`Add ${teammateSlots} teammate email(s). They must sign up with that email to access the project.`);
        return;
      }
      const ownEmail = user?.email?.toLowerCase();
      if (filled.some((e) => e.trim().toLowerCase() === ownEmail)) {
        setError('You cannot invite your own email as a teammate.');
        return;
      }
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/projects/generate', {
        domain,
        skills,
        difficulty,
        team_size: teamSize,
        duration
      });
      
      const saveResponse = await api.post('/api/projects/save', {
        project_data: response.data,
        team_size: teamSize,
        team_member_emails: teamSize > 1 ? teamEmails.map((e) => e.trim()) : [],
      });
      
      navigate(`/project/${saveResponse.data.id}`);
    } catch (err) {
      console.error('Generation pipeline failed:', err);
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? detail.map((d) => d.msg || JSON.stringify(d)).join(' ')
            : 'Failed to synthesize project idea. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-grow lg:pl-64 flex flex-col min-h-screen">
        <Header title="PROJECT SYNTHESIZER" />

        <main className="flex-grow p-8 flex items-center justify-center max-w-4xl w-full mx-auto relative">
          <AnimatePresence mode="wait">
            {!loading ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full space-y-6"
              >
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 tracking-wide flex items-center gap-2 uppercase">
                    <Compass className="w-5 h-5 text-brand-500 animate-spin-slow" />
                    Forge AI Simulator
                  </h2>
                  <p className="text-xs text-slate-500">Configure parameters to generate your next high-impact academic project.</p>
                </div>

                <GlowCard isDark={false} className="border border-slate-200/80 bg-white/70 shadow-md">
                  <form onSubmit={handleSynthesize} className="space-y-6">
                    
                    {error && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                        {error}
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Target Domain</label>
                      <select
                        value={domain}
                        onChange={(e) => handleDomainChange(e.target.value)}
                        className="w-full glass-input text-sm pr-8 bg-white/90 appearance-none focus:border-brand-500"
                      >
                        <option value="">Select Domain...</option>
                        <option value="Artificial Intelligence / ML">AI / Machine Learning</option>
                        <option value="Full-Stack Web Development">Full-Stack Web</option>
                        <option value="Mobile App Development">Mobile App Dev</option>
                        <option value="BlockChain / Web3">Web3 / Blockchain</option>
                        <option value="Internet of Things (IoT)">IoT / Edge Computing</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Target Technologies
                        {domain && (
                          <span className="text-slate-600 font-normal normal-case ml-1">
                            ({skills.length} selected)
                          </span>
                        )}
                      </label>

                      {!domain ? (
                        <p className="text-xs text-slate-500 py-3 px-4 rounded-xl border border-dashed border-slate-200 bg-white/60">
                          Select a target domain above to see available technologies.
                        </p>
                      ) : (
                        <motion.div
                          key={domain}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 bg-white/60 max-h-40 overflow-y-auto"
                        >
                          {availableTechnologies.map((tech) => {
                            const selected = skills.includes(tech);
                            return (
                              <button
                                key={tech}
                                type="button"
                                onClick={() => toggleTechnology(tech)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                                  selected
                                    ? 'bg-brand-50 border-brand-100 text-brand-600 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-600'
                                }`}
                              >
                                {tech}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}

                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 py-1">
                          <span className="text-[10px] text-slate-500 w-full uppercase font-bold tracking-wider">
                            Selected stack
                          </span>
                          {skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold"
                            >
                              {skill}
                              <button type="button" onClick={() => handleRemoveSkill(skill)}>
                                <X className="w-3 h-3 hover:text-red-500 transition-colors" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-200 pt-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Estimated Difficulty</label>
                        <div className="flex gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                          {['Easy', 'Medium', 'Hard'].map((d) => (
                            <button
                              type="button"
                              key={d}
                              onClick={() => setDifficulty(d)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                                difficulty === d
                                  ? 'bg-white text-brand-600 border border-brand-200 shadow-sm'
                                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/70 border border-transparent'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-500" /> Team Sizing
                        </label>
                        <select
                          value={teamSize}
                          onChange={(e) => handleTeamSizeChange(parseInt(e.target.value))}
                          className="w-full glass-input text-sm pr-8 bg-white/90 appearance-none focus:border-brand-500"
                        >
                          <option value={1}>Solo Project (1 Person)</option>
                          <option value={2}>Duo Team (2 People)</option>
                          <option value={3}>Trio Team (3 People)</option>
                          <option value={4}>Quad Team (4 People)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" /> Time Allocated
                        </label>
                        <select
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full glass-input text-sm pr-8 bg-white/90 appearance-none focus:border-brand-500"
                        >
                          <option value="2 Weeks">Rapid Sprint (2 Weeks)</option>
                          <option value="1 Month">1 Month Timeline</option>
                          <option value="2 Months">2 Months Timeline</option>
                          <option value="3 Months">Capstone Term (3 Months)</option>
                          <option value="6 Months">Final Year Thesis (6 Months)</option>
                        </select>
                      </div>
                    </div>

                    {teamSize > 1 && (
                      <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200 bg-white/60">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            Teammate Emails
                          </label>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Invite {teammateSlots} teammate{teammateSlots > 1 ? 's' : ''}. Each person must sign up on IdeaForge with the same email to view this project on their dashboard.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {teamEmails.map((email, index) => (
                            <div key={index} className="flex flex-col gap-1">
                              <span className="text-[10px] text-slate-500 font-semibold">
                                Member {index + 2} email
                              </span>
                              <input
                                type="email"
                                required
                                placeholder="teammate@college.edu"
                                value={email}
                                onChange={(e) => {
                                  const next = [...teamEmails];
                                  next[index] = e.target.value;
                                  setTeamEmails(next);
                                }}
                                className="w-full glass-input text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-xl shadow-brand-500/20 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
                    >
                      <BrainCircuit className="w-5 h-5 animate-pulse" />
                      Synthesize Academic Blueprint
                    </button>
                  </form>
                </GlowCard>
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md text-center space-y-8"
              >
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border border-brand-500/30 animate-ping" />
                  <div className="absolute -inset-2 rounded-full border border-cyan-500/10 animate-pulse" />
                  
                  <div className="w-24 h-24 rounded-full bg-white border-2 border-brand-500 shadow-2xl shadow-brand-500/20 flex items-center justify-center text-brand-600">
                    <BrainCircuit className="w-10 h-10 animate-spin-slow" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-wide uppercase">IdeaForge AI Core Active</h3>
                  <div className="h-6 overflow-hidden relative w-full">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={statusIdx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs text-slate-500 font-semibold tracking-wide"
                      >
                        {loadingStatuses[statusIdx]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-200 text-left space-y-3 opacity-70">
                  <div className="h-3.5 bg-slate-200 rounded w-2/3 animate-pulse" />
                  <div className="h-2 bg-slate-200 rounded w-full animate-pulse" />
                  <div className="h-2 bg-slate-200 rounded w-5/6 animate-pulse" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-5 bg-slate-200 rounded w-16 animate-pulse" />
                    <div className="h-5 bg-slate-200 rounded w-20 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default GenerateProject;
