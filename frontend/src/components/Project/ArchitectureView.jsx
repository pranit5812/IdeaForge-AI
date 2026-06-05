import { motion } from 'framer-motion';
import {
  Layout,
  Server,
  Database,
  BrainCircuit,
  User,
  ArrowDown,
  Route,
  Layers,
} from 'lucide-react';

const DEFAULT_OVERVIEW =
  'This diagram walks through how your project moves from the person using the app to the server, database, and any external services - and then back with the result they see on screen. Each step below is written so you can explain it clearly in a demo or viva.';

const DEFAULT_FLOW_STEPS = [
  'The end user opens the application in a web browser and signs in or continues as an authenticated student.',
  'They fill in project details (domain, skills, timeline) and submit the form from the React interface.',
  'The frontend sends a secure HTTP request with a JWT token to the FastAPI backend.',
  'The backend validates the payload, runs business logic, and may call external AI or data services.',
  'Results and user data are read from or written to the database as structured documents or rows.',
  'The API returns a JSON response; the frontend updates the dashboard with architecture, roadmap, and viva content.',
];

const LAYER_STEPS = [
  {
    key: 'frontend',
    stage: 'Layer 1',
    title: 'Presentation Layer (Frontend)',
    subtitle: 'What the user sees and interacts with',
    icon: Layout,
    iconClass: 'text-cyan-600',
    borderClass: 'border-cyan-200 hover:border-cyan-300',
    bgClass: 'bg-cyan-50/60',
    fallback:
      'The React client provides dashboards, forms, and result tabs. Students navigate between overview, architecture, roadmap, and viva preparation without full page reloads.',
  },
  {
    key: 'backend',
    stage: 'Layer 2',
    title: 'Application Layer (Backend)',
    subtitle: 'Business rules, security, and API orchestration',
    icon: Server,
    iconClass: 'text-brand-600',
    borderClass: 'border-brand-200 hover:border-brand-300',
    bgClass: 'bg-brand-50/60',
    fallback:
      'FastAPI receives requests, validates them with Pydantic, enforces JWT authentication, and coordinates services such as AI generation, scoring, and PDF export.',
  },
  {
    key: 'database',
    stage: 'Layer 3',
    title: 'Data Layer (Database)',
    subtitle: 'Where accounts and project blueprints live',
    icon: Database,
    iconClass: 'text-emerald-600',
    borderClass: 'border-emerald-200 hover:border-emerald-300',
    bgClass: 'bg-emerald-50/60',
    fallback:
      'MongoDB stores user profiles and saved project documents. Indexes on email and user-plus-date fields keep login and library views fast.',
  },
  {
    key: 'api_flow',
    stage: 'Layer 4',
    title: 'External Services & Integrations',
    subtitle: 'AI, ML, queues, or third-party APIs',
    icon: BrainCircuit,
    iconClass: 'text-purple-600',
    borderClass: 'border-purple-200 hover:border-purple-300',
    bgClass: 'bg-purple-50/60',
    fallback:
      'Google Gemini (or project-specific services) generate structured project content. Keys stay on the server; only sanitized JSON reaches the browser.',
  },
];

const CONNECTOR_LABELS = [
  'User action in the browser',
  'HTTPS + JWT to the API',
  'Validated request reaches services',
  'Read / write persistent data',
  'External intelligence & enrichment',
  'Response rendered in the UI',
];

const ArchitectureView = ({ architecture }) => {
  if (!architecture) return null;

  const overview = architecture.overview?.trim() || DEFAULT_OVERVIEW;
  const flowSteps =
    architecture.flow_steps?.length > 0 ? architecture.flow_steps : DEFAULT_FLOW_STEPS;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      {/* High-level summary */}
      <section className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 rounded-xl bg-brand-50 border border-brand-100 shrink-0"
          >
            <Route className="w-5 h-5 text-brand-600" />
          </motion.div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              How the system works (start to finish)
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Read this overview first, then follow the numbered journey and layer details below.
            </p>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-sm md:text-base text-slate-700 leading-relaxed font-sans pl-0 md:pl-14"
        >
          {overview}
        </motion.p>
      </section>

      {/* Numbered journey timeline */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Request journey
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              From the first user action to the final screen update
            </p>
          </motion.div>
        </div>

        <ol className="relative space-y-0 pl-1">
          {flowSteps.map((step, idx) => (
            <li key={idx} className="relative flex gap-4 pb-8 last:pb-0">
              {idx < flowSteps.length - 1 && (
                <span
                  className="absolute left-[15px] top-10 bottom-0 w-px bg-gradient-to-b from-brand-300 to-slate-200"
                  aria-hidden
                />
              )}

              <div className="relative z-10 flex flex-col items-center shrink-0">
                <span className="w-8 h-8 rounded-full bg-white border-2 border-brand-200 flex items-center justify-center text-xs font-bold text-brand-600">
                  {idx + 1}
                </span>
                {idx === 0 && (
                  <span className="text-[10px] font-semibold text-emerald-600 mt-1 uppercase tracking-wider">
                    Start
                  </span>
                )}
                {idx === flowSteps.length - 1 && (
                  <span className="text-[10px] font-semibold text-cyan-600 mt-1 uppercase tracking-wider">
                    End
                  </span>
                )}
              </div>

              <div className="flex-grow min-w-0 pt-0.5">
                {idx > 0 && CONNECTOR_LABELS[idx] && (
                  <p className="text-[11px] font-medium text-brand-600 uppercase tracking-wider mb-1.5">
                    {CONNECTOR_LABELS[idx] || 'Next step'}
                  </p>
                )}
                <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                {idx < flowSteps.length - 1 && (
                  <div className="flex items-center gap-1.5 mt-3 text-slate-500 lg:hidden">
                    <ArrowDown className="w-4 h-4" />
                    <span className="text-xs">continues below</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Layer breakdown */}
      <section className="space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <Layers className="w-4 h-4 text-slate-600" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              System layers explained
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              What each major part of the stack is responsible for
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {LAYER_STEPS.map((layer, idx) => {
            const Icon = layer.icon;
            const description =
              architecture[layer.key]?.trim() || layer.fallback;

            return (
              <motion.article
                key={layer.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * idx }}
                className={`rounded-2xl border p-6 md:p-7 transition-colors duration-300 ${layer.borderClass} ${layer.bgClass} bg-white/80`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * idx }}
                    className="flex items-center gap-3 sm:flex-col sm:items-center sm:w-20 shrink-0"
                  >
                    <div className="p-3 rounded-xl bg-white/90 border border-slate-200">
                      <Icon className={`w-6 h-6 ${layer.iconClass}`} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest sm:text-center">
                      {layer.stage}
                    </span>
                  </motion.div>

                  <div className="flex-grow space-y-2">
                    <div>
                      <h5 className="text-base font-bold text-slate-900">{layer.title}</h5>
                      <p className="text-xs text-slate-500 mt-1">{layer.subtitle}</p>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{description}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
};

export default ArchitectureView;
