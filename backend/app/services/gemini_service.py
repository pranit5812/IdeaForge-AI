import google.generativeai as genai
import json
import logging
import random
from app.config import settings

logger = logging.getLogger("uvicorn")

def get_mock_project_data(domain: str, skills: list, difficulty: str, team_size: int, duration: str) -> dict:
    """Generates extremely rich, startup-level mockup project data as a bulletproof fallback."""
    skills_str = ", ".join(skills) if skills else "Modern Technologies"
    
    # Select titles based on Domain
    domain_lower = domain.lower()
    if "web" in domain_lower or "full" in domain_lower:
        title = "IdeaForge: Decentralized Venture Hub"
        problem = "Navigating early-stage student hackathons is filled with duplicated ideas and inadequate architectural designs. Student founders lack structured pathways to translate spark ideas into production-ready MVP codebases."
        tech = ["React.js", "FastAPI", "Supabase Postgres", "Tailwind CSS", "Framer Motion", "Google Gemini API"] + skills[:2]
        datasets = ["Kaggle Startup Pitch Decks Dataset", "YC Company Directory Scrapes (Synthetic)", "HackerNews Top Threads Corpus"]
        features = [
            "Ambient Glassmorphic Dashboard showcasing personalized student project recommendations based on domain overlap.",
            "Dynamic Originality Scanner that checks key project tokens against a vector store of overused concepts.",
            "Visual Flowchart Architecture Generator utilizing SVG paths and CSS animations to represent state transitions.",
            "Comprehensive Automated Viva Question Bank spanning technical, team dynamics, database, and CI/CD pipelines."
        ]
        roadmap = [
            {"title": "Architecture & Security Foundation", "timeline": "Week 1", "description": "Set up the mono-repo structure. Configure FastAPI routers, secure JWT endpoints, and seed Supabase Postgres tables."},
            {"title": "AI Integration & Originality Scoring", "timeline": "Week 2", "description": "Interface with the Google Gemini API. Construct the structured parser and scoring algorithms for innovation assessment."},
            {"title": "Premium Glassmorphic Frontend", "timeline": "Week 3", "description": "Implement Framer Motion micro-animations, landing pages, dynamic form screens, and the responsive grid components."},
            {"title": "Export Utilities & Deployment", "timeline": "Week 4", "description": "Integrate PDF generation libraries, clean clipboard copy hooks, and deploy to Vercel/Render with automated CI/CD pipeline tests."}
        ]
        frontend_arch = (
            "The presentation layer is a React 18 single-page application powered by Vite. Students interact with glassmorphic dashboards, "
            "multi-step project forms, and tabbed result views. Global authentication state lives in React Context, while Axios interceptors "
            "attach JWT bearer tokens to every protected API call. Framer Motion provides smooth transitions between overview, architecture, "
            "roadmap, and viva-prep sections so the experience feels polished and startup-grade."
        )
        backend_arch = (
            "The application server is built with FastAPI and organized into focused routers for authentication and project management. "
            "Incoming JSON payloads are validated with Pydantic v2 models before any business logic runs. Passwords are hashed with bcrypt, "
            "and signed JWT access tokens gate every sensitive route. Dedicated service modules orchestrate Gemini AI generation, originality "
            "scoring, PDF export via ReportLab, and safe fallbacks when external APIs are unavailable."
        )
        db_arch = (
            "Persistent data is stored in MongoDB (or Supabase Postgres in cloud deployments) as flexible documents. The users collection "
            "stores hashed credentials and profile metadata with a unique index on email. The projects collection keeps full AI-generated "
            "blueprints—including architecture, roadmap, and viva banks—keyed by owner user ID and creation timestamp so dashboards load quickly."
        )
        api_flow = (
            "External intelligence is provided by the Google Gemini API. When a student submits a project brief, FastAPI composes a structured "
            "prompt, requests JSON-shaped output, parses and validates it, optionally merges originality scores, and returns a complete "
            "ProjectIdea object to the client. The same pipeline supports viva regeneration and PDF compilation without exposing API keys to the browser."
        )
        arch_overview = (
            "End to end, a student signs in through the React client, submits domain and skill preferences, and triggers a secured REST call. "
            "FastAPI authenticates the session, invokes Gemini (or a rich offline mock) to produce a full project blueprint, persists it in the database, "
            "and streams the structured JSON back to the UI—where architecture diagrams, roadmaps, and viva questions are rendered immediately."
        )
        arch_flow_steps = [
            "The student logs in and lands on the dashboard inside the React single-page application.",
            "They open the project generator, choose domain, skills, difficulty, team size, and duration, then click generate.",
            "The browser sends a POST request with form data and a JWT bearer token to the FastAPI /api/projects/generate endpoint.",
            "FastAPI verifies the token, validates the payload with Pydantic, and calls the Gemini service (or domain-aware mock fallback).",
            "The AI returns structured JSON; the backend scores originality, normalizes fields, and saves the blueprint in MongoDB.",
            "FastAPI responds with the complete project object; React navigates to the result page with tabs for overview, architecture, roadmap, and viva prep.",
            "The student reviews the system architecture flow, copies content, exports a PDF, or invites teammates—all without leaving the app.",
        ]
    elif "ai" in domain_lower or "ml" in domain_lower or "data" in domain_lower:
        title = "PulseScan: Bio-Thermal Diagnostic Sync"
        problem = "Rural medical clinics suffer from lack of access to diagnostic radiologists. Low-cost thermal sensors are available, but local healthcare professionals lack automatic tools to analyze complex heat anomalies."
        tech = ["PyTorch", "OpenCV", "FastAPI", "React.js", "Supabase Postgres", "Scikit-Learn"] + skills[:2]
        datasets = ["MIMIC-IV Multi-Modal Dataset", "FLIR Thermal Infrared Imagery Database", "Synthesized Clinical Anomalies Schema"]
        features = [
            "High-resolution OpenCV computer vision preprocessing pipelines for raw thermal telemetry mapping.",
            "Deep convolutional autoencoder network designed to isolate temperature distribution anomalies.",
            "Real-time patient reporting panel using canvas animations to overlay heat signatures.",
            "Edge-friendly inference server with sub-100ms response latencies for rural clinical deployment."
        ]
        roadmap = [
            {"title": "Hardware Bridge & Preprocessing", "timeline": "Weeks 1-2", "description": "Build raw image conversion decoders. Implement bilateral filtering and grid normalization libraries."},
            {"title": "Model Development & Training", "timeline": "Weeks 3-4", "description": "Train a multi-scale CNN autoencoder on normal profiles. Establish an anomaly thresholds classification layer."},
            {"title": "FastAPI Inference Integration", "timeline": "Week 5", "description": "Wrap model weights in an optimized FastAPI service. Set up multi-threaded query queues for high concurrent loads."},
            {"title": "Clinical Diagnostic Interface", "timeline": "Week 6", "description": "Design an elegant clinical console in React. Incorporate heatmap layers, slider adjustments, and patient download sheets."}
        ]
        frontend_arch = (
            "Clinicians and operators use a React single-page interface with HTML5 Canvas overlays for live thermal or imaging feeds. "
            "Upload panels, diagnostic summaries, and alert banners are animated with Framer Motion so critical findings are impossible to miss. "
            "State is kept lean: session context for auth, local component state for frame previews, and Axios for batched inference requests."
        )
        backend_arch = (
            "FastAPI exposes asynchronous endpoints that accept image or sensor payloads, queue them for PyTorch inference, and return "
            "structured anomaly scores. Pydantic models enforce tensor metadata, patient references, and confidence thresholds. "
            "Worker pools or background tasks prevent long-running model calls from blocking health-check and authentication routes."
        )
        db_arch = (
            "MongoDB or Postgres stores patient/session records, model version tags, and JSON diagnosis payloads. Indexes on medical IDs "
            "and created-at timestamps keep historical lookups fast for audit trails and follow-up visits."
        )
        api_flow = (
            "The ML pipeline receives preprocessed frames from FastAPI, runs convolutional or autoencoder models, applies threshold rules, "
            "and writes results back through the same API layer. Optional Gemini integration can narrate findings or suggest clinical next steps "
            "in natural language for student demonstration scenarios."
        )
        arch_overview = (
            "This pipeline begins when a clinician captures or uploads diagnostic imagery in the browser. The React client streams or posts frames "
            "to FastAPI, which runs computer-vision preprocessing and deep-learning inference, persists structured results, and returns an "
            "interpretable report the UI renders with heatmaps and downloadable summaries."
        )
        arch_flow_steps = [
            "A clinician or student operator opens the React diagnostic console and selects a patient session.",
            "Live camera frames or uploaded images are preprocessed in the browser (resize, normalize) before upload.",
            "Axios sends the frame batch to FastAPI /predict with authentication and content-type headers.",
            "FastAPI validates input, runs OpenCV preprocessing, and dispatches tensors to the PyTorch inference worker.",
            "Model outputs (heatmaps, anomaly scores) are packaged into Pydantic response models and saved in the database.",
            "The API returns diagnosis JSON; React overlays results on the canvas and updates the patient timeline.",
            "Optional export or Gemini-generated narrative text is attached for viva or clinical handoff documentation.",
        ]
    else:
        title = "SafeNet: Decoupled Multi-Agent Threat Sync"
        problem = "Modern enterprise intranets are constantly bombarded with distributed zero-day attacks. Centralized firewalls create single-point-of-failure vulnerabilities, leaving internal endpoints highly exposed."
        tech = ["Go", "Python/FastAPI", "Supabase Postgres", "React.js", "Docker", "RabbitMQ"] + skills[:2]
        datasets = ["CICIDS2017 Intrusion Detection Dataset", "MITRE ATT&CK Framework Mapping Rules", "Custom Honeynet Traffic Logs"]
        features = [
            "Distributed lightweight host-based monitoring agents written in Go for zero-latency system hooks.",
            "Centralized FastAPI analysis server compiling live endpoint streams and matching security profiles.",
            "Active firewall state manipulation via encrypted API handshakes across remote endpoint bridges.",
            "Animated security map rendering active threat vectors using vector curves and custom colors."
        ]
        roadmap = [
            {"title": "Agent Telemetry Hooks", "timeline": "Weeks 1-2", "description": "Write system logging daemons in Go. Implement standard encrypted TLS pipelines to transport telemetry streams."},
            {"title": "Centralized Message Hub", "timeline": "Weeks 3-4", "description": "Configure RabbitMQ clusters. Set up FastAPI backend worker nodes to ingest and parse JSON logs from queues."},
            {"title": "AI Threat Detection & Scoring", "timeline": "Week 5", "description": "Develop anomaly profiling scripts using Isolation Forests. Connect threat alerts to active firewall rule triggers."},
            {"title": "Visual Incident Command Center", "timeline": "Week 6", "description": "Create the visual React monitoring deck. Hook up active SVG status animations showing threat mitigations in real time."}
        ]
        frontend_arch = (
            "Security analysts monitor a React command-center dashboard wired to WebSockets for sub-second incident updates. "
            "SVG-based threat maps, severity badges, and timeline filters help teams see which endpoints triggered alerts. "
            "Role-aware routes ensure only authenticated operators can acknowledge or escalate incidents."
        )
        backend_arch = (
            "FastAPI acts as the central nervous system: ingesting agent telemetry from RabbitMQ, correlating events with MITRE-style rules, "
            "and exposing REST plus WebSocket channels for the UI. Background workers batch-write high-volume logs so API latency stays low "
            "during attack spikes. JWT-protected admin routes configure firewall hooks and agent policies."
        )
        db_arch = (
            "Incident documents land in MongoDB/Postgres with JSONB payloads for raw log lines, severity, source IP, and remediation status. "
            "TTL or archival indexes keep storage predictable while preserving enough history for forensic review during viva demonstrations."
        )
        api_flow = (
            "Lightweight Go agents on each host detect anomalies and publish JSON events to RabbitMQ. FastAPI consumers score threats, "
            "persist incidents, and push real-time updates to connected dashboards. Optional AI services can summarize attack chains "
            "or suggest containment playbooks for student presentations."
        )
        arch_overview = (
            "Distributed agents continuously watch endpoint behavior. When something suspicious occurs, events travel through a message broker "
            "to FastAPI analyzers, get stored as incidents, and surface instantly on the React security map—giving a complete start-to-finish "
            "picture from detection to operator response."
        )
        arch_flow_steps = [
            "Go-based agents on student lab machines collect syscall, network, or file-access telemetry.",
            "An anomaly rule fires locally; the agent encrypts and publishes an event to the RabbitMQ exchange.",
            "A FastAPI worker consumes the message, enriches it with threat intelligence metadata, and scores severity.",
            "The incident document is inserted into MongoDB with timestamps, agent ID, and raw JSON evidence.",
            "FastAPI broadcasts the new incident over WebSockets to all connected React dashboards.",
            "Analysts acknowledge, annotate, or trigger mock firewall API calls from the UI.",
            "Historical incidents remain queryable for reports, PDF exports, and architecture viva explanations.",
        ]

    # Mix matching percentages
    innovation = random.randint(78, 96)
    commonness = random.randint(12, 32)
    trend = random.randint(80, 97)
    resume = random.randint(82, 98)
    
    return {
        "title": title,
        "problem_statement": problem,
        "features": features,
        "tech_stack": tech,
        "future_scope": [
            "Commercialize as an open-source SaaS plugin for institutional departments.",
            "Integrate edge-computing models to run offline with zero server requirements.",
            "Utilize homomorphic encryption to ensure all processed data remains completely confidential."
        ],
        "roadmap": roadmap,
        "datasets": datasets,
        "difficulty": difficulty,
        "resume_impact": resume,
        "originality": {
            "innovation_score": innovation,
            "commonness_score": commonness,
            "trend_score": trend,
            "rationale": f"This system is highly unique because it circumvents common pitfalls in the '{domain}' space. It addresses custom gaps using a specialized combination of {skills_str}, avoiding boilerplate designs."
        },
        "architecture": {
            "overview": arch_overview,
            "flow_steps": arch_flow_steps,
            "frontend": frontend_arch,
            "backend": backend_arch,
            "database": db_arch,
            "api_flow": api_flow,
        },
        "viva_questions": {
            "technical": [
                {
                    "question": f"Why did you choose {tech[0]} over other alternatives for this project?",
                    "answer": f"{tech[0]} was chosen due to its high efficiency, modern community support, and seamless integration with our core stack, offering an optimal balance of developer productivity and high execution speed."
                },
                {
                    "question": "How did you manage application state and ensure smooth data propagation?",
                    "answer": "We separated global concerns (like authentication and user settings) into lightweight contexts, while using reactive state components to drive dynamic updates without redundant DOM calculations."
                }
            ],
            "hr": [
                {
                    "question": f"Given a team size of {team_size} and a timeline of {duration}, how did you delegate roles?",
                    "answer": "We adopted an agile approach, splitting work into frontend features and backend services. We ran weekly sprints to address blockers, ensuring key structural blocks were operational by mid-project."
                },
                {
                    "question": "What was the most challenging aspect of this project and how did you resolve it?",
                    "answer": "The most challenging part was managing the real-time parsing pipeline. We solved this by defining clear contract interfaces (Pydantic schemas) and implementing retry policies for external network services."
                }
            ],
            "architecture": [
                {
                    "question": "Explain the database collection indexes and why they are necessary.",
                    "answer": "We implemented a unique user email index and a composite project index on user ID plus creation time. This keeps lookups fast while preserving relational integrity."
                },
                {
                    "question": "How does the backend secure communication with the database?",
                    "answer": "All database connections are routed via TLS-encrypted connection strings. Credentials are bound strictly to environment variables and never committed directly to raw source code."
                }
            ],
            "deployment": [
                {
                    "question": "How would you containerize this app for horizontal scaling?",
                    "answer": "We would define a multi-stage Dockerfile for the React client and FastAPI server, then use Docker Compose to orchestrate service boundaries and balance incoming network loads."
                },
                {
                    "question": "What is your continuous deployment workflow?",
                    "answer": "We linked our GitHub repositories to Vercel (frontend) and Render (backend). Each validated git commit triggers an automated build check, deploying updates without system downtime."
                }
            ]
        }
    }


def generate_project_idea(domain: str, skills: list, difficulty: str, team_size: int, duration: str) -> dict:
    """Core AI service linking input fields to Google's Gemini models for structured project designs."""
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE" or not settings.GEMINI_API_KEY.strip():
        logger.warning("Gemini API key is not configured. Falling back to mockup startup dummy data.")
        return get_mock_project_data(domain, skills, difficulty, team_size, duration)

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Using gemini-1.5-flash which is ideal for fast JSON generation tasks
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        skills_str = ", ".join(skills) if skills else "modern technologies"
        
        prompt = f"""
        You are an elite, world-class AI Project Advisor and startup Incubator Coach.
        Generate a unique, highly attractive, startup-level student project idea based on:
        - Domain: {domain}
        - Required Skills: {skills_str}
        - Difficulty: {difficulty}
        - Team Size: {team_size} people
        - Available Duration: {duration}

        Your output MUST be a valid JSON object matching this schema PRECISELY:
        {{
            "title": "A highly creative, premium, startup-sounding project name",
            "problem_statement": "An elegant, brief, 2-3 sentence problem statement describing the exact gap this project fills.",
            "features": [
                "4-5 core high-impact, modern, technical features. Describe each with rich details (e.g., 'Real-time sync via WebSockets...')"
            ],
            "tech_stack": [
                "Suggested modern, premium stack items. Make sure to include some of the student's skills along with complementary top-tier packages."
            ],
            "future_scope": [
                "3 interesting directions for expansion, scaling, or commercialization."
            ],
            "roadmap": [
                {{
                    "title": "Roadmap phase 1 title (e.g., Foundation Setup)",
                    "timeline": "e.g., Week 1-2 or Phase 1",
                    "description": "Specific deliverables and technical sub-tasks for this milestone."
                }},
                {{
                    "title": "Roadmap phase 2 title",
                    "timeline": "Timeline",
                    "description": "Description"
                }},
                {{
                    "title": "Roadmap phase 3 title",
                    "timeline": "Timeline",
                    "description": "Description"
                }},
                {{
                    "title": "Roadmap phase 4 title",
                    "timeline": "Timeline",
                    "description": "Description"
                }}
            ],
            "datasets": [
                "2-3 relevant public datasets or mock generation methodologies with exact suggestions (e.g., Kaggle, UCI, or synthetic script models)."
            ],
            "difficulty": "{difficulty}",
            "resume_impact": 85,
            "originality": {{
                "innovation_score": 85,
                "commonness_score": 25,
                "trend_score": 90,
                "rationale": "A 2-3 sentence concise analysis explaining the innovation metrics, why it stands out, and how to make it even more unique."
            }},
            "architecture": {{
                "overview": "A clear 3-5 sentence paragraph explaining the entire system journey from the student's first click through storage and back to the UI. Write in plain, teachable language suitable for a viva defense.",
                "flow_steps": [
                    "6-8 numbered-style sentences as array items. Each item is one complete step in order: user action, frontend, API call, backend processing, database, AI/external services if any, and response back to UI. Be specific to this project's domain."
                ],
                "frontend": "4-6 sentences describing React pages, state management, styling, and what the student actually sees and does. Avoid one-line summaries.",
                "backend": "4-6 sentences on FastAPI routers, validation, auth, services, and error handling tailored to this project.",
                "database": "4-6 sentences on collections/tables, what is stored, indexes, and why those choices fit the domain.",
                "api_flow": "4-6 sentences on external APIs (e.g. Gemini, ML inference, message queues) and how they connect to the backend—not a single arrow chain."
            }},
            "viva_questions": {{
                "technical": [
                    {{
                        "question": "An advanced technical question about the implementations or frameworks?",
                        "answer": "A precise, professional-grade answer that helps the student score full marks."
                    }},
                    {{
                        "question": "Another advanced technical question?",
                        "answer": "Detailed answer."
                    }}
                ],
                "hr": [
                    {{
                        "question": "A typical HR/Management question regarding teamwork, scope, or timeline?",
                        "answer": "A confident, student-appropriate professional answer."
                    }},
                    {{
                        "question": "Another team management question?",
                        "answer": "Detailed answer."
                    }}
                ],
                "architecture": [
                    {{
                        "question": "An architectural question about database choices or workflow latency?",
                        "answer": "Detailed answer explaining database schemas or security."
                    }},
                    {{
                        "question": "Another architecture question?",
                        "answer": "Detailed answer."
                    }}
                ],
                "deployment": [
                    {{
                        "question": "A question about Dockerizing or deploying to Vercel/Render, CI/CD?",
                        "answer": "Clear DevOps answer."
                    }},
                    {{
                        "question": "Another deployment question?",
                        "answer": "Detailed answer."
                    }}
                ]
            }}
        }}

        IMPORTANT:
        - Return ONLY the raw JSON object. Do not wrap the JSON output inside backticks (like ```json ... ```) or include conversational preambles.
        - Ensure all key names are EXACTLY as specified.
        - The project MUST NOT be a basic, generic topic. Make it sound professional, premium, and startup-ready.
        - Do not include comments or trailing commas in the JSON output, as it must be valid JSON.
        """

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        result_text = response.text.strip()
        # Fallback if markdown formatting persists
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
        result_text = result_text.strip()
        
        project_dict = json.loads(result_text)
        
        # Verify the structure matches expected schema. If missing core keys, fall back to mock data
        required_keys = ["title", "problem_statement", "features", "tech_stack", "roadmap", "originality", "architecture", "viva_questions"]
        if not all(k in project_dict for k in required_keys):
            logger.warning("Gemini output was incomplete. Using mock fallback values.")
            return get_mock_project_data(domain, skills, difficulty, team_size, duration)
            
        return project_dict
    except Exception as e:
        logger.error(f"Gemini generation error: {e}")
        logger.warning("Using mock fallback data due to Gemini API failure.")
        return get_mock_project_data(domain, skills, difficulty, team_size, duration)
