from datetime import datetime
from uuid import UUID
import re

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def normalize_email(email: str) -> str:
    return email.strip().lower()


def validate_team_emails(emails: list[str], owner_email: str, expected_count: int) -> list[str]:
    cleaned: list[str] = []
    owner = normalize_email(owner_email)

    for raw in emails:
        email = normalize_email(raw)
        if not email:
            continue
        if not EMAIL_RE.match(email):
            raise ValueError(f"Invalid email address: {raw}")
        if email == owner:
            raise ValueError("You cannot invite your own email as a teammate.")
        if email in cleaned:
            raise ValueError(f"Duplicate teammate email: {raw}")
        cleaned.append(email)

    if expected_count > 0 and len(cleaned) != expected_count:
        raise ValueError(
            f"Please add exactly {expected_count} teammate email(s) for your team size."
        )

    return cleaned


def link_invitations_for_user(db, user_id: UUID, email: str) -> int:
    result = db.execute(
        """
        UPDATE project_team_members
        SET member_user_id = %s, joined_at = COALESCE(joined_at, %s)
        WHERE LOWER(invited_email) = %s AND member_user_id IS NULL
        """,
        (user_id, datetime.utcnow(), normalize_email(email)),
    )
    return result.rowcount


def add_team_members(db, project_id: UUID, owner_id: UUID, owner_email: str, emails: list[str]) -> None:
    for email in emails:
        db.execute(
            """
            INSERT INTO project_team_members (project_id, invited_email, invited_by, member_user_id, joined_at, created_at)
            VALUES (%s, %s, %s,
                (SELECT id FROM users WHERE LOWER(email) = %s LIMIT 1),
                CASE WHEN EXISTS (SELECT 1 FROM users WHERE LOWER(email) = %s) THEN %s ELSE NULL END,
                %s)
            ON CONFLICT (project_id, invited_email) DO NOTHING
            """,
            (
                project_id,
                email,
                owner_id,
                email,
                email,
                datetime.utcnow(),
                datetime.utcnow(),
            ),
        )


def user_can_access_project(db, project_id: UUID, user_id: UUID, user_email: str) -> dict | None:
    row = db.execute(
        """
        SELECT p.id, p.user_id, p.project_data, p.created_at,
               u.name AS owner_name, u.email AS owner_email,
               CASE WHEN p.user_id = %s THEN 'owner'
                    ELSE 'member' END AS role
        FROM projects p
        JOIN users u ON u.id = p.user_id
        WHERE p.id = %s
          AND (
            p.user_id = %s
            OR EXISTS (
              SELECT 1 FROM project_team_members m
              WHERE m.project_id = p.id
                AND (
                  m.member_user_id = %s
                  OR (m.member_user_id IS NULL AND LOWER(m.invited_email) = %s)
                )
            )
          )
        """,
        (user_id, project_id, user_id, user_id, normalize_email(user_email)),
    ).fetchone()
    return row


def list_projects_for_user(db, user_id: UUID, user_email: str) -> list[dict]:
    rows = db.execute(
        """
        SELECT p.id, p.user_id, p.project_data, p.created_at,
               u.name AS owner_name,
               CASE WHEN p.user_id = %s THEN 'owner' ELSE 'member' END AS role
        FROM projects p
        JOIN users u ON u.id = p.user_id
        WHERE p.user_id = %s
           OR EXISTS (
             SELECT 1 FROM project_team_members m
             WHERE m.project_id = p.id
               AND (
                 m.member_user_id = %s
                 OR (m.member_user_id IS NULL AND LOWER(m.invited_email) = %s)
               )
           )
        ORDER BY p.created_at DESC
        """,
        (user_id, user_id, user_id, normalize_email(user_email)),
    ).fetchall()
    return rows


def count_pending_invitations(db, user_email: str) -> int:
    row = db.execute(
        """
        SELECT COUNT(*)::int AS cnt
        FROM project_team_members m
        JOIN users u ON u.id = m.invited_by
        WHERE LOWER(m.invited_email) = %s AND m.member_user_id IS NULL
        """,
        (normalize_email(user_email),),
    ).fetchone()
    return row["cnt"] if row else 0


def list_pending_invitations(db, user_email: str) -> list[dict]:
    return db.execute(
        """
        SELECT m.id, m.project_id, m.invited_email, m.created_at,
               u.name AS invited_by_name,
               p.project_data->>'title' AS project_title
        FROM project_team_members m
        JOIN projects p ON p.id = m.project_id
        JOIN users u ON u.id = m.invited_by
        WHERE LOWER(m.invited_email) = %s AND m.member_user_id IS NULL
        ORDER BY m.created_at DESC
        """,
        (normalize_email(user_email),),
    ).fetchall()
