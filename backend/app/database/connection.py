from psycopg import connect
from psycopg.rows import dict_row
from app.config import settings
import logging

logger = logging.getLogger("uvicorn")

class Database:
    client = None

    def connect(self):
        try:
            logger.info("Connecting to Supabase Postgres...")
            database_url = settings.DATABASE_URL
            if "sslmode=" not in database_url:
                separator = "&" if "?" in database_url else "?"
                database_url = f"{database_url}{separator}sslmode=require"

            self.client = connect(database_url, row_factory=dict_row, autocommit=True)
            self.client.execute("SELECT 1")
            self.ensure_schema()
            logger.info("Connected to Supabase Postgres successfully!")
        except Exception as e:
            logger.error(f"Failed to connect to Supabase Postgres: {e}")
            logger.warning("Will proceed, but DB operations will fail until connection is fixed.")
            self.client = None

    def ensure_schema(self):
        self.client.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
        self.client.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                skills JSONB NOT NULL DEFAULT '[]'::jsonb,
                domain TEXT NOT NULL DEFAULT '',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """)
        self.client.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                project_data JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """)
        self.client.execute("CREATE INDEX IF NOT EXISTS idx_projects_user_created ON projects(user_id, created_at DESC)")
        self.client.execute("""
            CREATE TABLE IF NOT EXISTS project_team_members (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                invited_email TEXT NOT NULL,
                invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                member_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
                joined_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                UNIQUE (project_id, invited_email)
            )
        """)
        self.client.execute(
            "CREATE INDEX IF NOT EXISTS idx_team_members_email ON project_team_members(LOWER(invited_email))"
        )
        self.client.execute(
            "CREATE INDEX IF NOT EXISTS idx_team_members_user ON project_team_members(member_user_id)"
        )

    def disconnect(self):
        if self.client:
            self.client.close()
            logger.info("Supabase Postgres connection closed.")

db_manager = Database()

def get_db():
    if db_manager.client is None or db_manager.client.closed:
        db_manager.connect()
    return db_manager.client
