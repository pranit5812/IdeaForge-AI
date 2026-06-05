from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from app.models.project import ProjectCreateRequest, ProjectSaveRequest, ProjectIdea
from app.utils.security import get_current_user
from app.database.connection import get_db
from app.services.gemini_service import generate_project_idea
from app.services.originality_service import scan_project_originality
from app.services.team_service import (
    validate_team_emails,
    add_team_members,
    list_projects_for_user,
    user_can_access_project,
)
from datetime import datetime
from psycopg.types.json import Jsonb
from uuid import UUID
import json
import logging
from io import BytesIO

# ReportLab imports for PDF generation
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

logger = logging.getLogger("uvicorn")
router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.post("/generate", response_model=ProjectIdea)
def generate_idea(req: ProjectCreateRequest, current_user: dict = Depends(get_current_user)):
    """Protected endpoint generating the complete project blueprint using Gemini AI and scanning originality."""
    try:
        # 1. Trigger Gemini API Project Generator
        raw_project = generate_project_idea(
            domain=req.domain,
            skills=req.skills,
            difficulty=req.difficulty,
            team_size=req.team_size,
            duration=req.duration
        )
        
        # 2. Trigger Originality Scanner check to override common topics
        scanned_originality = scan_project_originality(
            title=raw_project.get("title", ""),
            problem_statement=raw_project.get("problem_statement", ""),
            base_originality=raw_project.get("originality", {})
        )
        
        raw_project["originality"] = scanned_originality
        
        return raw_project
    except Exception as e:
        logger.error(f"Generation router failure: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate project idea: {str(e)}"
        )

@router.post("/save")
def save_project(req: ProjectSaveRequest, current_user: dict = Depends(get_current_user)):
    """Saves the fully generated project blueprint into Supabase Postgres."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is unavailable")
        
    try:
        team_size = req.team_size or 1
        expected_teammates = max(0, team_size - 1)
        raw_emails = [str(e) for e in (req.team_member_emails or [])]
        try:
            teammate_emails = validate_team_emails(
                raw_emails,
                current_user["email"],
                expected_teammates if team_size > 1 else 0,
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

        project_payload = req.project_data.model_dump(mode="json")
        project_payload["team_size"] = team_size
        project_payload["team_member_emails"] = teammate_emails

        owner_id = parse_uuid(current_user["id"], "Invalid user ID format")
        result = db.execute(
            """
            INSERT INTO projects (user_id, project_data, created_at)
            VALUES (%s, %s, %s)
            RETURNING id
            """,
            (
                owner_id,
                Jsonb(project_payload),
                datetime.utcnow()
            )
        ).fetchone()

        if teammate_emails:
            add_team_members(
                db,
                result["id"],
                owner_id,
                current_user["email"],
                teammate_emails,
            )

        return {
            "status": "success",
            "message": "Project saved successfully",
            "id": str(result["id"]),
            "team_invites_sent": len(teammate_emails),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Save project error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save project data")

@router.get("")
def list_saved_projects(current_user: dict = Depends(get_current_user)):
    """Retrieves all saved projects for the authenticated student."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is unavailable")
        
    try:
        user_id = parse_uuid(current_user["id"], "Invalid user ID format")
        rows = list_projects_for_user(db, user_id, current_user["email"])
        return [serialize_project(row) for row in rows]
    except Exception as e:
        logger.error(f"List projects error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve projects list")

@router.get("/{id}")
def get_project_details(id: str, current_user: dict = Depends(get_current_user)):
    """Retrieves full details of a saved project blueprint."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is unavailable")
        
    try:
        project_id = parse_project_id(id)
        user_id = parse_uuid(current_user["id"], "Invalid user ID format")
        doc = user_can_access_project(db, project_id, user_id, current_user["email"])
        if not doc:
            raise HTTPException(status_code=404, detail="Project not found or unauthorized")

        return serialize_project(doc)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Server error reading project details")

@router.delete("/{id}")
def delete_saved_project(id: str, current_user: dict = Depends(get_current_user)):
    """Removes a saved project blueprint from Supabase Postgres."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is unavailable")
        
    try:
        project_id = parse_project_id(id)
        result = db.execute(
            "DELETE FROM projects WHERE id = %s AND user_id = %s",
            (project_id, parse_uuid(current_user["id"], "Invalid user ID format"))
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Project not found or unauthorized")
            
        return {"status": "success", "message": "Project removed successfully"}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to delete project")

def parse_project_id(id: str) -> UUID:
    return parse_uuid(id, "Invalid project ID format")

def parse_uuid(id: str, message: str) -> UUID:
    try:
        return UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail=message)

def assert_project_owner(doc: dict, user_id: UUID) -> None:
    if str(doc["user_id"]) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the project owner can perform this action",
        )


def serialize_project(doc: dict) -> dict:
    project_data = doc["project_data"]
    team_emails = project_data.get("team_member_emails", []) if isinstance(project_data, dict) else []
    return {
        "id": str(doc["id"]),
        "user_id": str(doc["user_id"]),
        "project_data": project_data,
        "created_at": doc["created_at"],
        "role": doc.get("role", "owner"),
        "owner_name": doc.get("owner_name"),
        "team_member_emails": team_emails,
    }

def regenerate_viva_questions_via_ai(title: str, problem: str, tech: list) -> dict:
    from app.config import settings
    import google.generativeai as genai
    import random
    
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE" or not settings.GEMINI_API_KEY.strip():
        # Highly realistic scrambled fallback questions
        viva_options = [
            {"question": "How does your system handle database connection pool depletion under massive traffic spikes?", "answer": "By using Supabase's pooled Postgres endpoint and keeping backend queries short-lived, the API can reuse connections efficiently during traffic spikes."},
            {"question": "What is the primary architectural trade-off of selecting Supabase Postgres for this project?", "answer": "Postgres provides relational integrity, transactional guarantees, indexing, and JSONB flexibility, while requiring more deliberate schema design than a purely schemaless document store."},
            {"question": "How do you secure user credentials and ensure stateless scaling across instances?", "answer": "We secure passwords using salted Bcrypt hashes on creation, then issue cryptographically signed, stateless JWT claims containing 24-hour expiration envelopes."},
            {"question": "How would you build an active rate-limiter on these FastAPI routes to block malicious script attacks?", "answer": "We would define a middleware filter utilizing Redis-backed token buckets, evaluating incoming client request IP indexes in real-time."}
        ]
        random.shuffle(viva_options)
        return {
            "technical": [
                viva_options[0],
                {"question": f"Why is {tech[0] if tech else 'React'} optimal for driving this specific system architecture?", "answer": "It provides exceptional render loop efficiency, reactive state hook lifecycles, and rapid development turnarounds."}
            ],
            "hr": [
                {"question": "If your teammate suddenly leaves mid-sprint, how do you mitigate task deficits?", "answer": "We would assess the critical path features, scale back nice-to-have capabilities, and reorganize the remaining resources transparently."},
                {"question": "What would you do if your external examiner states this tech stack is outdated?", "answer": "We would defend our design choices by highlighting our active support community, fast production speeds, and the modular REST design which allows hot-swapping any layer."}
            ],
            "architecture": [
                viva_options[1],
                {"question": "Describe the security constraints of your API gateways.", "answer": "All routers require custom Authorization headers containing valid cryptographic Bearer JWT tokens signed with secure keys."}
            ],
            "deployment": [viva_options[2], viva_options[3]]
        }

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        tech_str = ", ".join(tech) if tech else "modern programming frameworks"
        prompt = f"""
        You are an elite external university examiner.
        Regenerate a brand new set of highly challenging viva interview questions and expert answers for a student project called '{title}' resolving: '{problem}' utilizing: {tech_str}.
        
        Your output MUST be a valid JSON object matching this schema PRECISELY:
        {{
            "technical": [
                {{"question": "Challenge 1", "answer": "Answer 1"}},
                {{"question": "Challenge 2", "answer": "Answer 2"}}
            ],
            "hr": [
                {{"question": "Challenge 1", "answer": "Answer 1"}},
                {{"question": "Challenge 2", "answer": "Answer 2"}}
            ],
            "architecture": [
                {{"question": "Challenge 1", "answer": "Answer 1"}},
                {{"question": "Challenge 2", "answer": "Answer 2"}}
            ],
            "deployment": [
                {{"question": "Challenge 1", "answer": "Answer 1"}},
                {{"question": "Challenge 2", "answer": "Answer 2"}}
            ]
        }}
        Return ONLY the raw JSON. Do not include markdown code block characters.
        """
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        logger.error(f"AI viva regeneration failed: {e}")
        return {
            "technical": [{"question": "Explain the advantages of asynchronous route management.", "answer": "FastAPI runs async loops, supporting massive simultaneous network connections with very little server overhead."}],
            "hr": [{"question": "How did you manage technical disagreements in the team?", "answer": "We ran rapid proof-of-concept tests, letting execution benchmarks and modular benchmarks resolve design choices."}],
            "architecture": [{"question": "Describe the security constraints of your API gateways.", "answer": "All routers require custom Authorization headers containing valid cryptographic Bearer JWT tokens signed with secure keys."}],
            "deployment": [{"question": "How is the system deployed?", "answer": "The client is hosted on Vercel's edge network, while the server runs in Render containers, automating builds via GitHub hooks."}]
        }

@router.post("/{id}/viva/regenerate")
def regenerate_viva(id: str, current_user: dict = Depends(get_current_user)):
    """Triggers external AI models to regenerate the project's viva QA deck and updates the record."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is unavailable")
        
    try:
        project_id = parse_project_id(id)
        user_id = parse_uuid(current_user["id"], "Invalid user ID format")
        doc = user_can_access_project(db, project_id, user_id, current_user["email"])
        if not doc:
            raise HTTPException(status_code=404, detail="Project not found or unauthorized")
        assert_project_owner(doc, user_id)
            
        project_data = doc["project_data"]
        title = project_data.get("title", "")
        problem = project_data.get("problem_statement", "")
        tech = project_data.get("tech_stack", [])
        
        new_viva = regenerate_viva_questions_via_ai(title, problem, tech)
        
        project_data["viva_questions"] = new_viva
        updated_doc = db.execute(
            """
            UPDATE projects
            SET project_data = %s
            WHERE id = %s AND user_id = %s
            RETURNING id, user_id, project_data, created_at
            """,
            (Jsonb(project_data), project_id, user_id)
        ).fetchone()
        if not updated_doc:
            raise HTTPException(status_code=404, detail="Project not found or unauthorized")

        return serialize_project(updated_doc)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Viva regeneration fail: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to regenerate viva QA: {str(e)}")

@router.get("/{id}/export/pdf")
def export_pdf(id: str, current_user: dict = Depends(get_current_user)):
    """Compiles the project details and streams a high-quality ReportLab PDF download."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is unavailable")
        
    try:
        project_id = parse_project_id(id)
        user_id = parse_uuid(current_user["id"], "Invalid user ID format")
        doc = user_can_access_project(db, project_id, user_id, current_user["email"])
        if not doc:
            raise HTTPException(status_code=404, detail="Project not found or unauthorized")
            
        project_data = doc["project_data"]
        title = project_data.get("title", "Project Report")
        
        pdf_buffer = generate_pdf_report(title, project_data)
        
        filename = f"IdeaForge_{title.replace(' ', '_')}.pdf"
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF export failure: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

# PDF generation helper using ReportLab
def generate_pdf_report(project_title: str, project_data: dict) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=letter, 
        rightMargin=45, 
        leftMargin=45, 
        topMargin=45, 
        bottomMargin=45
    )
    
    styles = getSampleStyleSheet()
    
    # Custom startup design system style sheets
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#6366F1'), # Startup-level soft Indigo
        spaceAfter=15
    )
    
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E1B4B'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#374151'),
        spaceAfter=8
    )
    
    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )
    
    story = []
    
    # Header tag
    story.append(Paragraph("<b>IDEAFORGE AI | DYNAMIC STUDENT BLUEPRINT</b>", ParagraphStyle('SubHeader', parent=body_style, textColor=colors.HexColor('#9CA3AF'), fontSize=7.5)))
    story.append(Spacer(1, 4))
    
    # Title
    story.append(Paragraph(project_title, title_style))
    story.append(Spacer(1, 10))
    
    # Problem Statement
    story.append(Paragraph("PROBLEM STATEMENT", heading_style))
    story.append(Paragraph(project_data.get("problem_statement", "No problem statement specified."), body_style))
    story.append(Spacer(1, 5))
    
    # Originality Score Matrix Table
    story.append(Paragraph("ORIGINALITY SCANNER METRICS", heading_style))
    orig = project_data.get("originality", {})
    scores_data = [
        [
            Paragraph(f"<font color='#4F46E5'><b>INNOVATION SCORE:</b></font><br/><font size='14'><b>{orig.get('innovation_score', 0)}%</b></font>", body_style),
            Paragraph(f"<font color='#059669'><b>COMMONNESS SCORE:</b></font><br/><font size='14'><b>{orig.get('commonness_score', 0)}%</b></font>", body_style),
            Paragraph(f"<font color='#D97706'><b>TREND SCORE:</b></font><br/><font size='14'><b>{orig.get('trend_score', 0)}%</b></font>", body_style)
        ]
    ]
    t = Table(scores_data, colWidths=[174, 174, 174])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EEF2F6')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t)
    story.append(Spacer(1, 6))
    story.append(Paragraph(f"<b>Scanner Audit Rationale:</b> {orig.get('rationale', '')}", body_style))
    story.append(Spacer(1, 10))
    
    # Tech Stack & Details
    story.append(Paragraph("TECHNICAL STACK & CONFIGURATION", heading_style))
    techs = ", ".join(project_data.get("tech_stack", []))
    story.append(Paragraph(f"<b>Suggested Technologies:</b> {techs}", body_style))
    story.append(Paragraph(f"<b>Difficulty:</b> {project_data.get('difficulty', 'Medium')} | <b>Resume Impact Score:</b> {project_data.get('resume_impact', 80)}/100", body_style))
    story.append(Spacer(1, 5))
    
    # Features
    story.append(Paragraph("CORE CAPABILITIES & SCOPE", heading_style))
    for feature in project_data.get("features", []):
        story.append(Paragraph(f"&bull; {feature}", bullet_style))
    story.append(Spacer(1, 5))
    
    # Roadmap
    story.append(Paragraph("DEVELOPMENT ROADMAP TIMELINE", heading_style))
    for phase in project_data.get("roadmap", []):
        story.append(Paragraph(f"<b>{phase.get('timeline', 'Phase')}: {phase.get('title', 'Milestone')}</b>", body_style))
        story.append(Paragraph(phase.get("description", ""), bullet_style))
    story.append(Spacer(1, 5))
    
    # Datasets
    dsets = project_data.get("datasets", [])
    if dsets:
        story.append(Paragraph("RECOMMENDED DATASETS / RESOURCES", heading_style))
        for d in dsets:
            story.append(Paragraph(f"&bull; {d}", bullet_style))
        story.append(Spacer(1, 5))
        
    # Architecture Overview
    arch = project_data.get("architecture", {})
    if arch:
        story.append(Paragraph("ONE-CLICK SYSTEM ARCHITECTURE BLUEPRINTS", heading_style))
        story.append(Paragraph(f"<b>Frontend Layer:</b> {arch.get('frontend', '')}", body_style))
        story.append(Paragraph(f"<b>Backend Layer:</b> {arch.get('backend', '')}", body_style))
        story.append(Paragraph(f"<b>Database Layer:</b> {arch.get('database', '')}", body_style))
        story.append(Paragraph(f"<b>API Orchestration:</b> {arch.get('api_flow', '')}", body_style))
        story.append(Spacer(1, 5))
        
    # Viva Prep
    viva = project_data.get("viva_questions", {})
    if viva:
        story.append(Paragraph("AI VIVA PREPARATION BANK (PREVIEW)", heading_style))
        
        # Add 1 tech, 1 architecture question
        tech_q = viva.get("technical", [])
        if tech_q:
            story.append(Paragraph(f"<b>Technical Question:</b> {tech_q[0].get('question', '')}", body_style))
            story.append(Paragraph(f"<i>Suggested Answer:</i> {tech_q[0].get('answer', '')}", bullet_style))
            
        arch_q = viva.get("architecture", [])
        if arch_q:
            story.append(Paragraph(f"<b>Architecture Question:</b> {arch_q[0].get('question', '')}", body_style))
            story.append(Paragraph(f"<i>Suggested Answer:</i> {arch_q[0].get('answer', '')}", bullet_style))
            
    doc.build(story)
    buffer.seek(0)
    return buffer
