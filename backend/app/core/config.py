import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret-key-cambiar-en-produccion")

settings = Settings()
