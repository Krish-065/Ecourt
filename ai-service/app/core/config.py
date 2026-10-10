import os

def load_env_file(filepath: str):
    """Pure Python standard library .env parser."""
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip("'\"")
                    if key:
                        os.environ[key] = val

# Load root .env
root_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"))
load_env_file(root_env)

class Settings:
    PROJECT_NAME: str = "ECourt AI Legal Engine"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "postgresql://ecourt_admin:ecourt_secure_pass_2026@localhost:5432/ecourt_db")
    OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.environ.get("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.environ.get("GROQ_API_KEY", "")
    EMBEDDING_MODEL_NAME: str = os.environ.get("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

settings = Settings()
