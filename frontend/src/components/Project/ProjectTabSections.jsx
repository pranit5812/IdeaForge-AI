import { motion } from 'framer-motion';
import {
  BookOpen,
  Check,
  ClipboardList,
  Code2,
  Copy,
  Database,
  Gauge,
  Layers,
  MessageSquareText,
  RefreshCw,
  Rocket,
  SearchCheck,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import CircleProgress from '../Common/CircleProgress';
import GlowCard from '../Common/GlowCard';

const panelMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

const getList = (value) => (Array.isArray(value) ? value : []);

const SectionIntro = ({ icon: Icon, eyebrow, title, children }) => (
  <GlowCard className="space-y-3 border-slate-200/80 bg-white/75 shadow-sm">
    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
      <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 shrink-0 w-fit">
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">
          {eyebrow}
        </span>
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          {children}
        </p>
      </div>
    </div>
  </GlowCard>
);

const EmptyState = ({ children }) => (
  <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-5 text-center text-xs text-slate-500">
    {children}
  </div>
);

const scoreMetrics = [
  {
    key: 'innovation_score',
    label: 'Innovation Score',
    shortLabel: 'Innovation',
    color: '#6366F1',
    icon: Sparkles,
    note: 'How clearly this idea stands apart from template projects.',
  },
  {
    key: 'commonness_score',
    label: 'Commonness Score',
    shortLabel: 'Commonness',
    color: '#10B981',
    icon: ShieldAlert,
    note: 'Lower is better here; it estimates how familiar the pattern is.',
  },
  {
    key: 'trend_score',
    label: 'Market Trend Score',
    shortLabel: 'Trend Fit',
    color: '#F59E0B',
    icon: TrendingUp,
    note: 'How well the project matches current technical demand.',
  },
];

const vivaCategories = [
  {
    id: 'technical',
    label: 'Technical',
    icon: Code2,
    description: 'Framework choices, implementation details, algorithms, and tradeoffs.',
  },
  {
    id: 'hr',
    label: 'HR / Team',
    icon: MessageSquareText,
    description: 'Teamwork, ownership, scope control, planning, and presentation confidence.',
  },
  {
    id: 'architecture',
    label: 'Architecture',
    icon: Layers,
    description: 'System boundaries, database choices, request flow, and scaling logic.',
  },
  {
    id: 'deployment',
    label: 'Deployment',
    icon: Rocket,
    description: 'Hosting, CI/CD, environment variables, Docker, and reliability concerns.',
  },
];

export const OverviewSection = ({ project }) => {
  const features = getList(project.features);
  const techStack = getList(project.tech_stack);
  const futureScope = getList(project.future_scope);
  const primaryStack = techStack.slice(0, 4).join(' + ') || 'a modern full-stack setup';

  return (
    <motion.div key="overview" {...panelMotion} className="space-y-6">
      <SectionIntro
        icon={BookOpen}
        eyebrow="Overview & Tech"
        title="Project brief, scope, and implementation stack"
      >
        This tab now reads like a clean blueprint summary: the problem, the core
        build scope, the selected technologies, and where the project can grow next.
      </SectionIntro>

      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-5">
        <GlowCard className="space-y-4 border-slate-200/80 bg-white/75 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-600">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-sm uppercase font-bold text-slate-700 tracking-wider">
              Problem Statement
            </h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-sans">
            {project.problem_statement}
          </p>
          <div className="rounded-xl bg-slate-50/80 border border-slate-200 px-4 py-3">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Core build direction
            </span>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Build the first usable version around {primaryStack}, then use the
              roadmap tab to divide the work into presentable milestones.
            </p>
          </div>
        </GlowCard>

        <GlowCard className="space-y-4 border-slate-200/80 bg-white/75 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-lg bg-brand-50 border border-brand-100 text-brand-600">
              <Gauge className="w-4 h-4" />
            </div>
            <h3 className="text-sm uppercase font-bold text-slate-700 tracking-wider">
              Blueprint Profile
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Difficulty
              </span>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {project.difficulty}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Resume
              </span>
              <p className="text-sm font-extrabold text-brand-600 mt-1">
                {project.resume_impact}/100
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              Best pitch angle
            </span>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              Lead with the real-world gap, then explain how your stack makes the
              solution practical and defensible.
            </p>
          </div>
        </GlowCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-5">
        <GlowCard className="space-y-4 border-slate-200/80 bg-white/75 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
              <ClipboardList className="w-4 h-4" />
            </div>
            <h3 className="text-sm uppercase font-bold text-slate-700 tracking-wider">
              Core Capabilities & Scope
            </h3>
          </div>
          {features.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {features.map((feature, idx) => (
                <article
                  key={`${feature}-${idx}`}
                  className="rounded-xl border border-slate-200 bg-white/80 p-4 flex gap-3"
                >
                  <span className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-100 text-brand-600 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{feature}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState>No feature list was returned for this blueprint.</EmptyState>
          )}
        </GlowCard>

        <div className="space-y-5">
          <GlowCard className="space-y-4 border-slate-200/80 bg-white/75 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm uppercase font-bold text-slate-700 tracking-wider">
                Suggested Technologies
              </h3>
            </div>
            {techStack.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyState>No technology stack was returned for this blueprint.</EmptyState>
            )}
          </GlowCard>

          <GlowCard className="space-y-4 border-slate-200/80 bg-white/75 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
                <Rocket className="w-4 h-4" />
              </div>
              <h3 className="text-sm uppercase font-bold text-slate-700 tracking-wider">
                Future Expansion Scope
              </h3>
            </div>
            {futureScope.length > 0 ? (
              <ul className="space-y-2.5">
                {futureScope.map((scope, idx) => (
                  <li key={`${scope}-${idx}`} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    {scope}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState>No expansion notes were returned for this blueprint.</EmptyState>
            )}
          </GlowCard>
        </div>
      </div>
    </motion.div>
  );
};

export const OriginalitySection = ({ project }) => {
  const originality = project.originality || {};
  const commonness = originality.commonness_score ?? 0;
  const trend = originality.trend_score ?? 0;
  const nextMoves = [
    commonness > 45
      ? 'Make the target user group narrower so the idea feels less generic.'
      : 'Keep the narrow problem framing; that is helping the blueprint avoid boilerplate territory.',
    trend < 70
      ? 'Tie the project to a modern dataset, API, or workflow so the trend score is easier to defend.'
      : 'Mention the trend-aligned technologies and data choices clearly in your presentation.',
    'Use the architecture and viva tabs to connect originality claims to actual implementation choices.',
  ];

  return (
    <motion.div key="originality" {...panelMotion} className="space-y-6">
      <SectionIntro
        icon={SearchCheck}
        eyebrow="Originality Scanner"
        title="Audit scores, rationale, and practical next moves"
      >
        The scanner output is expanded into readable score cards so you can see
        why the project is unique and how to make the idea stronger before submission.
      </SectionIntro>

      <GlowCard className="space-y-6 border-slate-200/80 bg-white/75 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {scoreMetrics.map((metric) => {
            const Icon = metric.icon;
            const value = originality[metric.key] ?? 0;

            return (
              <article
                key={metric.key}
                className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-center space-y-4"
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon className="w-4 h-4 text-brand-600" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {metric.shortLabel}
                  </span>
                </div>
                <CircleProgress
                  percentage={value}
                  color={metric.color}
                  label={metric.label}
                  size={104}
                />
                <p className="text-xs text-slate-600 leading-relaxed">{metric.note}</p>
              </article>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-5">
          <div className="rounded-2xl bg-slate-50/80 border border-slate-200 p-5 space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900">
              Scanner Audit Analysis
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-sans">
              {originality.rationale || 'No scanner rationale was returned for this blueprint.'}
            </p>
          </div>

          <div className="rounded-2xl bg-brand-50/60 border border-brand-100 p-5 space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900">
              Make It More Defensible
            </h4>
            <ul className="space-y-2.5">
              {nextMoves.map((move, idx) => (
                <li key={move} className="flex gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-md bg-white border border-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  {move}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
};

export const RoadmapSection = ({ project }) => {
  const roadmap = getList(project.roadmap);
  const datasets = getList(project.datasets);

  return (
    <motion.div key="roadmap" {...panelMotion} className="space-y-6">
      <SectionIntro
        icon={ClipboardList}
        eyebrow="Development Roadmap"
        title="Milestones, deliverables, and supporting resources"
      >
        The generated roadmap is laid out as a build sequence, with resource
        suggestions kept beside it so implementation and research stay connected.
      </SectionIntro>

      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-6">
        <GlowCard className="space-y-5 border-slate-200/80 bg-white/75 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm uppercase font-bold text-slate-700 tracking-wider">
                Milestone Timeline
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {roadmap.length} generated phase{roadmap.length === 1 ? '' : 's'} for this blueprint.
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-brand-50 border border-brand-100 text-brand-600 text-[10px] font-bold uppercase tracking-wider w-fit">
              {project.difficulty || 'Medium'} scope
            </span>
          </div>

          {roadmap.length > 0 ? (
            <ol className="relative pl-2 space-y-0">
              {roadmap.map((phase, idx) => (
                <li key={`${phase.title}-${idx}`} className="relative flex gap-4 pb-7 last:pb-0">
                  {idx < roadmap.length - 1 && (
                    <span className="absolute left-[15px] top-9 bottom-0 w-px bg-gradient-to-b from-brand-300 to-slate-200" />
                  )}
                  <span className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-brand-200 text-brand-600 flex items-center justify-center text-xs font-extrabold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      {phase.timeline}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-2">
                      {phase.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1 font-sans">
                      {phase.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState>No roadmap milestones were returned for this blueprint.</EmptyState>
          )}
        </GlowCard>

        <GlowCard className="space-y-4 border-slate-200/80 bg-white/75 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-600">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm uppercase font-bold text-slate-700 tracking-wider">
                Recommended Datasets
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Research inputs and demo resources.</p>
            </div>
          </div>

          {datasets.length > 0 ? (
            <ul className="space-y-3">
              {datasets.map((dataset, idx) => (
                <li
                  key={`${dataset}-${idx}`}
                  className="rounded-xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-700 leading-relaxed"
                >
                  <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider block mb-1">
                    Resource {idx + 1}
                  </span>
                  {dataset}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>No dataset or resource suggestions were returned.</EmptyState>
          )}
        </GlowCard>
      </div>
    </motion.div>
  );
};

export const VivaSection = ({
  project,
  vivaTab,
  onVivaTabChange,
  onCopyQuestion,
  copiedQA,
  canRegenerate,
  onRegenerate,
  regeneratingViva,
}) => {
  const questions = project.viva_questions || {};
  const activeCategory =
    vivaCategories.find((category) => category.id === vivaTab) || vivaCategories[0];
  const activeQuestions = getList(questions[activeCategory.id]);
  const ActiveIcon = activeCategory.icon;

  return (
    <motion.div key="viva" {...panelMotion} className="space-y-6">
      <SectionIntro
        icon={MessageSquareText}
        eyebrow="Viva Prep Bank"
        title="Question sets with copy-ready answers"
      >
        The viva bank is grouped by what examiners usually ask: technical depth,
        teamwork, architecture, and deployment readiness.
      </SectionIntro>

      <GlowCard className="space-y-6 border-slate-200/80 bg-white/75 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-100 text-brand-600">
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm uppercase font-bold text-slate-700 tracking-wider">
                {activeCategory.label} Questions
              </h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
                {activeCategory.description}
              </p>
            </div>
          </div>

          {canRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={regeneratingViva}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:text-brand-600 hover:border-brand-200 disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${regeneratingViva ? 'animate-spin' : ''}`} />
              {regeneratingViva ? 'Regenerating...' : 'Regenerate QA Bank'}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {vivaCategories.map((category) => {
            const Icon = category.icon;
            const selected = activeCategory.id === category.id;

            return (
              <button
                key={category.id}
                onClick={() => onVivaTabChange(category.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                  selected
                    ? 'bg-brand-50 text-brand-600 border-brand-200 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {category.label}
              </button>
            );
          })}
        </div>

        {activeQuestions.length > 0 ? (
          <motion.div className="space-y-4">
            {activeQuestions.map((qa, index) => {
              const copyKey = `${activeCategory.id}-${index}`;

              return (
                <motion.article
                  key={copyKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-5 md:p-6 space-y-4 relative group"
                >
                  <button
                    onClick={() => onCopyQuestion(copyKey, qa.question, qa.answer)}
                    className="absolute right-4 top-4 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-brand-600 hover:border-brand-200 transition-colors"
                    aria-label="Copy viva question and answer"
                  >
                    {copiedQA[copyKey] ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <div className="pr-12">
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                      Question {index + 1}
                    </span>
                    <p className="text-sm md:text-base text-slate-900 leading-relaxed font-semibold mt-1">
                      {qa.question}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      Suggested Answer
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans mt-1">
                      {qa.answer}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <EmptyState>No viva questions were returned for this category.</EmptyState>
        )}
      </GlowCard>
    </motion.div>
  );
};
