from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import UserRegister, UserLogin, UserOut, Token
from app.database.connection import get_db
from app.utils.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.services.team_service import link_invitations_for_user, count_pending_invitations, list_pending_invitations
from datetime import datetime
from psycopg.types.json import Jsonb

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=Token)
def signup(user_data: UserRegister):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is unavailable")

    email = normalize_email(user_data.email)
    existing_user = db.execute("SELECT id FROM users WHERE email = %s", (email,)).fetchone()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
        
    hashed_password = get_password_hash(user_data.password)
    new_user = db.execute(
        """
        INSERT INTO users (name, email, password, skills, domain, created_at)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        (
            user_data.name,
            email,
            hashed_password,
            Jsonb(user_data.skills or []),
            user_data.domain or "",
            datetime.utcnow()
        )
    ).fetchone()
    link_invitations_for_user(db, new_user["id"], email)
    access_token = create_access_token(data={"sub": email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(credentials: UserLogin):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is unavailable")

    email = normalize_email(credentials.email)
    user = db.execute(
        "SELECT id, email, password FROM users WHERE email = %s",
        (email,)
    ).fetchone()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No account found for this email. Use “Create profile here” to sign up first.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password for this email.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    link_invitations_for_user(db, user["id"], email)
    access_token = create_access_token(data={"sub": email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    db = get_db()
    pending = 0
    invitations = []
    if db is not None:
        pending = count_pending_invitations(db, current_user["email"])
        invitations = [
            {
                "id": str(row["id"]),
                "project_id": str(row["project_id"]),
                "project_title": row.get("project_title") or "Untitled Project",
                "invited_by_name": row.get("invited_by_name"),
                "created_at": row["created_at"],
            }
            for row in list_pending_invitations(db, current_user["email"])
        ]
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "skills": current_user.get("skills", []),
        "domain": current_user.get("domain", ""),
        "created_at": current_user["created_at"],
        "pending_team_invitations": pending,
        "team_invitations": invitations,
    }

def normalize_email(email: str) -> str:
    return email.strip().lower()
