<div align="center">

<br/>

```
██╗  ██╗ █████╗ ██████╗ ██╗      █████╗     ██████╗ ██╗███████╗███╗   ██╗
██║  ██║██╔══██╗██╔══██╗██║     ██╔══██╗    ██╔══██╗██║██╔════╝████╗  ██║
███████║███████║██████╔╝██║     ███████║    ██████╔╝██║█████╗  ██╔██╗ ██║
██╔══██║██╔══██║██╔══██╗██║     ██╔══██║    ██╔══██╗██║██╔══╝  ██║╚██╗██║
██║  ██║██║  ██║██████╔╝███████╗██║  ██║    ██████╔╝██║███████╗██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚═════╝ ╚═╝╚══════╝╚═╝  ╚═══╝
```

# 🎤 Habla Bien · IA

### Entrenador Personal de Oratoria con Inteligencia Artificial

<br/>

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Python](https://img.shields.io/badge/Backend-Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Deploy-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

<br/>

> *¿Tienes el conocimiento pero te traiciona el nerviosismo al hablar?*
> **Habla Bien IA** analiza tu voz, postura y lenguaje corporal en tiempo real
> y te da feedback personalizado para que domines cada sustentación.
</div>

---

## 📌 El problema que resolvemos

| Problema | Impacto |
|----------|---------|
| 🎯 **Brecha de empleabilidad** | Egresados talentosos pierden oportunidades por no saber comunicarse |
| 😰 **Pánico escénico** | El miedo a hablar en público bloquea el desempeño en sustentaciones de grado |
| 📋 **Falta de feedback individual** | Un profesor no puede corregir a 40 alumnos uno por uno |

---

## ✨ ¿Cómo funciona?

El estudiante activa su cámara o sube un video. La IA analiza **tres capas simultáneas**:

```
┌─────────────────────────────────────────────────────────────┐
│                     HABLA BIEN · IA                         │
│                                                             │
│   🎤 VOZ          🧍 CUERPO         🧠 FUSIÓN IA            │
│   ─────────       ────────────      ─────────────           │
│   Muletillas      Postura           Gemini 1.5 Flash        │
│   Velocidad       Manos             Análisis integrado      │
│   Pausas          Contacto visual   Puntuación 0-100        │
│                                                             │
│              📊 DASHBOARD DE RESULTADOS                     │
│              📈 HISTORIAL DE PROGRESO                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitectura del proyecto

```
habla-bien-ia/
│
├── 📁 frontend/                    # React 18 · Interfaz de usuario
│   └── src/
│       ├── components/
│       │   ├── Camera/             # M1 · Captura de video y audio (WebRTC)
│       │   ├── Dashboard/          # M5 · Resultados y puntuación
│       │   ├── Feedback/           # M5 · Recomendaciones de la IA
│       │   └── History/            # M6 · Historial de sesiones
│       ├── pages/                  # Vistas principales de la app
│       ├── hooks/                  # Custom hooks (useCamera, useMediaPipe)
│       ├── services/               # Llamadas a la API del backend
│       └── assets/                 # Imágenes, íconos, fuentes
│
├── 📁 backend/                     # Python 3.11 · FastAPI · Motor de IA
│   └── app/
│       ├── api/routes/             # Endpoints REST de la aplicación
│       ├── core/                   # Configuración, settings, conexión DB
│       ├── models/                 # Modelos de base de datos (SQLAlchemy)
│       ├── schemas/                # Esquemas Pydantic (validación de datos)
│       ├── services/               # M2 · Whisper  M3 · MediaPipe  M4 · Gemini
│       └── tests/                  # Tests unitarios e integración
│
├── 📁 docs/                        # Documentación técnica del proyecto
│   ├── assets/                     # Imágenes para la documentación
│   └── wireframes/                 # Bocetos de la interfaz
│
├── 📁 .github/
│   ├── workflows/                  # CI/CD con GitHub Actions
│   └── ISSUE_TEMPLATE/             # Plantillas para bugs y features
│
├── 🐳 docker-compose.yml           # Levanta frontend + backend + DB
├── 📄 .gitignore                   # Archivos ignorados por Git
└── 📖 README.md                    # Este archivo
```

---

## 🤖 Stack tecnológico

### Frontend
| Tecnología | Uso |
|------------|-----|
| **React 18** | Interfaz de usuario y gestión de estado |
| **WebRTC** | Acceso a cámara y micrófono en tiempo real |
| **MediaPipe Pose** | Análisis de postura directamente en el navegador |
| **Chart.js** | Gráficas de puntuación y progreso |

### Backend
| Tecnología | Uso |
|------------|-----|
| **Python 3.11** | Lenguaje principal del servidor |
| **FastAPI** | Framework REST de alto rendimiento |
| **Whisper API (OpenAI)** | Transcripción de audio y detección de muletillas |
| **Gemini 1.5 Flash** | Análisis multimodal e IA de feedback |
| **SQLAlchemy** | ORM para la base de datos |
| **PostgreSQL** | Almacenamiento del historial de sesiones |

### DevOps
| Tecnología | Uso |
|------------|-----|
| **Docker** | Contenedorización del backend |
| **GitHub Actions** | CI/CD automatizado |
| **Railway** | Despliegue del backend en la nube |
| **Vercel** | Despliegue del frontend |

---

## 👥 Equipo de desarrollo

| Rol | Responsabilidad | Módulos |
|-----|----------------|---------|
| 🖥️ **Frontend Dev 1** | Captura de medios y análisis corporal | M1 · M3 |
| 🎨 **Frontend Dev 2** | Dashboard, feedback e historial | M5 · M6 (vista) |
| 🐍 **Backend Dev 1** | Análisis de voz y transcripción | M2 |
| 🤖 **Backend Dev 2** | Fusión IA e historial | M4 · M6 (API) |
| ⚙️ **DevOps / Líder** | Git, CI/CD, despliegue e integración | Todos |

---

## 🗺️ Roadmap del proyecto

```
Semana 1-6   ██████░░░░░░░░░░░░  APF1 · Repositorio + M1 + M2 base
Semana 7-11  ░░░░░░██████░░░░░░  APF2 · CI/CD + M2 + M3 + M4 inicio
Semana 12-15 ░░░░░░░░░░░░████░░  APF3 · Despliegue + M4 + M5
Semana 16-18 ░░░░░░░░░░░░░░████  FINAL · Sistema completo + M6
```

| Entrega | Semana | Peso | Estado |
|---------|--------|------|--------|
| APF1 | 6 | 20% | 🔄 En progreso |
| APF2 | 11 | 20% | ⏳ Pendiente |
| APF3 | 15 | 20% | ⏳ Pendiente |
| Proyecto Final | 18 | 40% | ⏳ Pendiente |

---

## 🚀 Instalación y uso local

### Prerrequisitos
- Node.js 18+
- Python 3.11+
- Docker Desktop
- Git

### 1. Clonar el repositorio
```bash
git clone [URL-repositorio]
cd habla-bien-ia
code .
```

### 2. Levantar el backend
```bash
PENDIENTE
```

### 3. Levantar el frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Con Docker (recomendado)
```bash
PENDIENTE
```

La app estará disponible en `http://localhost:5173`
La API en `http://localhost:8000/docs`

---

## 📡 Endpoints principales de la API

```
POST   /api/v1/analizar          →  Recibe audio/video y devuelve análisis completo
GET    /api/v1/historial/{id}    →  Historial de sesiones de un estudiante
GET    /api/v1/sesion/{id}       →  Detalle de una sesión específica
DELETE /api/v1/sesion/{id}       →  Elimina una sesión del historial
```

---

## 📊 Métricas que analiza la IA

```
┌──────────────────────┬──────────────────────────────────────────┐
│ DIMENSIÓN            │ QUÉ MIDE                                 │
├──────────────────────┼──────────────────────────────────────────┤
│ 🎤 Voz               │ Muletillas/min · Velocidad · Pausas      │
│ 🧍 Postura           │ Alineación de hombros · Encorvamiento    │
│ 👀 Contacto visual   │ % de tiempo mirando a la cámara          │
│ 🙌 Manos             │ Movimiento excesivo por nerviosismo       │
│ ⚡ Energía / Tono    │ Monotonía vs. dinamismo (análisis Gemini)│
└──────────────────────┴──────────────────────────────────────────┘
```

---

## 🤝 Convenciones del equipo

### Ramas
```
main          →  Código estable y probado
develop       →  Rama de integración del equipo
feature/xxx   →  Nueva funcionalidad (ej: feature/camara-webrtc)
fix/xxx       →  Corrección de bugs (ej: fix/audio-encoding)
```

### Commits (Conventional Commits)
```
feat:     nueva funcionalidad
fix:      corrección de bug
docs:     cambios en documentación
style:    formato, sin cambio de lógica
refactor: refactorización de código
test:     agregar o modificar tests
chore:    tareas de mantenimiento
```

### Ejemplo
```bash
git commit -m "feat(m1): implementar captura de video con WebRTC"
git commit -m "fix(m2): corregir encoding de audio para Whisper"
```

---

## 📄 Licencia

Este proyecto fue desarrollado como parte del curso **Herramientas de Desarrollo** — Universidad Nacional de Piura · 2026.

---

<div align="center">

**Habla Bien · IA** — Porque el talento merece ser escuchado. 🎤

*Ingeniería de Software · UNP · Piura, Perú*

</div>
