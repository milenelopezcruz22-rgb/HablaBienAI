"""Esquemas de autenticación."""
from pydantic import BaseModel, field_validator


class RegistroRequest(BaseModel):
    nombre: str
    apellido: str
    email: str
    password: str

    @field_validator("password")
    @classmethod
    def password_minimo(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("La contraseña debe tener al menos 6 caracteres")
        return v

    @field_validator("email")
    @classmethod
    def email_valido(cls, v: str) -> str:
        if "@" not in v or "." not in v:
            raise ValueError("Correo no válido")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str
