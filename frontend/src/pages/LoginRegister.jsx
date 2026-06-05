import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Mail, Lock, User, Plus, X, ShieldAlert } from 'lucide-react';
import GlowCard from '../components/Common/GlowCard';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password, skills, domain);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth action failed:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setSkills([]);
    setDomain('');
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative overflow-hidden">

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Banner */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-xl text-white">
            <Terminal className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-sans tracking-wide">
            IdeaForge <span className="text-brand-600 font-semibold text-xs font-mono ml-0.5">AI</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isLogin ? 'Enter credentials to open your dashboard.' : 'Bootstrap your student profile to forge blueprints.'}
          </p>
        </div>

        {/* GlowCard Wrapper */}
        <GlowCard isDark={false} className="shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2.5"
                >
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fields container */}
            <div className="space-y-3.5">
              {!isLogin && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full glass-input pl-10 text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-input pl-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-input pl-10 text-sm"
                  />
                </div>
              </div>

              {/* Registration Extra Fields */}
              {!isLogin && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Preferred Domain</label>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full glass-input text-sm pr-8 bg-white/90 text-slate-800 appearance-none"
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

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Skills / Technologies</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="React, Python, Go..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className="w-full glass-input text-sm flex-grow"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-brand-500/40 hover:text-brand-600 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Skill tags display */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
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
                </>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-brand-500/10 transition-all duration-300 transform active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              ) : isLogin ? (
                'Open Session Dashboard'
              ) : (
                'Create Student Profile'
              )}
            </button>
          </form>

          {/* Toggle auth mode link */}
          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            {isLogin ? "New to IdeaForge? " : "Already have a profile? "}
            <button
              onClick={toggleAuthMode}
              className="text-brand-600 hover:text-brand-500 font-bold transition-colors cursor-pointer"
            >
              {isLogin ? 'Create profile here' : 'Sign in here'}
            </button>
          </div>
        </GlowCard>
      </div>
    </div>
  );
};

export default LoginRegister;
