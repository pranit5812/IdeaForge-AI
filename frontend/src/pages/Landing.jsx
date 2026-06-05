import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, BrainCircuit, ShieldAlert, Award, ArrowRight, Star, Heart } from 'lucide-react';
import GlowCard from '../components/Common/GlowCard';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between bg-transparent">
      {/* Header / Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md text-white">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-slate-900">
            IdeaForge <span className="text-brand-600 text-xs font-mono">AI</span>
          </span>
        </div>
        <Link
          to="/login"
          className="px-5 py-2 rounded-xl bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white hover:text-brand-600 transition-all shadow-md backdrop-blur-sm"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center justify-center text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl space-y-6"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 text-xs font-semibold uppercase">
            <BrainCircuit className="w-3.5 h-3.5" /> Next-Gen AI Academics
          </motion.div>

          {/* Title */}
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold leading-none text-slate-950 font-sans">
            Forge Outstanding <br />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Student Project Blueprints
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop building generic attendance systems. Generate industry-grade, startup-level academic ideas equipped with structural roadmap timelines, originality meters, and viva banks.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-brand-500/15 flex items-center gap-2 group transition-all duration-300 transform active:scale-95"
            >
              Start Forging Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-white hover:text-brand-600 transition-all shadow-md backdrop-blur-sm"
            >
              Explore Capabilities
            </a>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <div id="features" className="w-full max-w-6xl mt-24 lg:mt-32 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Startup-Level Features</h2>
            <p className="text-xs text-slate-500">Fully equipped with unique tools to impress your college department heads.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlowCard isDark={false} className="text-left space-y-4 shadow-sm border border-slate-200/80 bg-white/70">
              <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-600 w-12 h-12 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">AI Project Synthesizer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates robust titles, problem scopes, roadmap weeks, dataset references, and resume impact weights aligned directly to your target skills.
              </p>
            </GlowCard>

            <GlowCard isDark={false} className="text-left space-y-4 shadow-sm border border-slate-200/80 bg-white/70">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 w-12 h-12 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Originality Scanner</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flags copycat student topics instantly. Performs detailed keyword analyses and returns strict scores representing Innovation and Market Trends.
              </p>
            </GlowCard>

            <GlowCard isDark={false} className="text-left space-y-4 shadow-sm border border-slate-200/80 bg-white/70">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 w-12 h-12 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Viva Prep Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates tailored viva interview banks containing core questions spanning deep programming layers, systems design, and continuous deployments.
              </p>
            </GlowCard>
          </div>
        </div>

        {/* Dynamic Reviews Section */}
        <div className="w-full max-w-4xl mt-24 lg:mt-32 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Loved by A-Grade Students</h2>
            <p className="text-xs text-slate-500">How IdeaForge helped developers build high-impact final year projects.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel-glow p-6 rounded-2xl text-left border border-slate-200/80 bg-white/70 space-y-4 shadow-md">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "Our professors were tired of seeing the same old face recognition projects. IdeaForge recommended a decoupled multi-agent threat firewall. We got a perfect score and a job offer from the showcase!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-600">A</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Arjun Sharma</h4>
                  <p className="text-[10px] text-slate-500">Computer Science Graduate</p>
                </div>
              </div>
            </div>

            <div className="glass-panel-glow p-6 rounded-2xl text-left border border-slate-200/80 bg-white/70 space-y-4 shadow-md">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "The Viva Question Generator alone saved me days of exam anxiety. It predicted 80% of the questions my external examiner asked. Absolutely essential tool for college presentations."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-600">R</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Riya Kapoor</h4>
                  <p className="text-[10px] text-slate-500">Information Technology Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-slate-200/80 z-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>&copy; {new Date().getFullYear()} IdeaForge AI. Startup-ready student blueprints.</p>
        <div className="flex items-center gap-1.5 text-slate-500">
          Made with <Heart className="w-3.5 h-3.5 text-red-500/60 fill-current" /> for engineering excellence.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
