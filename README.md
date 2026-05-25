<div align="center">

<br/>

<pre>
██╗  ██╗ █████╗ ██████╗ ██╗      █████╗     ██████╗ ██╗███████╗███╗   ██╗
██║  ██║██╔══██╗██╔══██╗██║     ██╔══██╗    ██╔══██╗██║██╔════╝████╗  ██║
███████║███████║██████╔╝██║     ███████║    ██████╔╝██║█████╗  ██╔██╗ ██║
██╔══██║██╔══██║██╔══██╗██║     ██╔══██║    ██╔══██╗██║██╔══╝  ██║╚██╗██║
██║  ██║██║  ██║██████╔╝███████╗██║  ██║    ██████╔╝██║███████╗██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚═════╝ ╚═╝╚══════╝╚═╝  ╚═══╝
</pre>

# 🎤 Habla Bien · IA

### Entrenador Personal de Oratoria con Inteligencia Artificial

<br/>

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Python](https://img.shields.io/badge/Backend-Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/DB-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<br/>

> 💡 **TL;DR para correr el proyecto:** `cd frontend && npm install && npm run dev`

> *¿Tienes el conocimiento pero te traiciona el nerviosismo al hablar?*
> **Habla Bien IA** analiza tu voz, postura y lenguaje corporal en tiempo real
> y te da feedback personalizado para que domines cada sustentación.

<br/>

[Ver Demo](#) · [Reportar Bug](../../issues) · [Solicitar Feature](../../issues)

<br/>

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

| 🎤 Voz | 🧍 Cuerpo | 🧠 Fusión IA |
|--------|-----------|-------------|
| Muletillas | Postura | Groq (Llama 3) |
| Velocidad de habla | Contacto visual | Análisis integrado |
| Pausas largas | Brazos cruzados | Puntuación 0 – 100 |

| 📊 Dashboard de resultados | 📈 Historial de progreso |
|---------------------------|-------------------------|
| Radar chart con 5 dimensiones | Evolución sesión por sesión |
| Línea de tiempo de errores | Comparativa mes a mes |

---

## 🏗️ Arquitectura del proyecto

```
habla-bien-ia/
│
├── 📁 frontend/                    # React 19 · Interfaz de usuario
│   └── src/
│       ├── components/             # Componentes UI (BodyMetrics, RadarChart, etc.)
│       ├── pages/                  # Vistas: Inicio, Dashboard, GrabarSesion, Historial
│       ├── hooks/                  # useCamera · useBodyAnalysis · useAnalysis
│       ├── constants/              # Configuración y datos mock
│       └── icons/                  # Íconos SVG personalizados
│
├── 📁 backend/                     # Python 3.11 · FastAPI · Motor de IA
│   └── app/
│       ├── api/routes/             # Endpoints REST de la aplicación
│       ├── core/                   # Configuración, settings, conexión DB
│       ├── models/                 # Modelos de base de datos (SQLAlchemy)
│       ├── schemas/                # Esquemas Pydantic (validación de datos)
│       ├── services/               # M2 · Whisper  M3 · MediaPipe  M4 · Groq
│       └── tests/                  # Tests unitarios e integración
│
└── 📖 README.md                    # Este archivo
```

---

## 🗄️ Base de Datos — Supabase (M6 · Historial)

El módulo de historial usa **Supabase** (PostgreSQL) como base de datos en la nube para almacenar y consultar todas las sesiones de práctica.

### Configuración

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Crear el archivo `frontend/.env` con las credenciales:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

3. Ejecutar el siguiente SQL en el **Editor SQL** de Supabase para crear la tabla:

```sql
alter table sesiones
add column if not exists titulo text,
add column if not exists puntaje integer,
add column if not exists mes text,
add column if not exists dia integer,
add column if not exists hora text,
add column if not exists duracion text,
add column if not exists nivel text,
add column if not exists destacado boolean default false;
```

4. Desactivar RLS para desarrollo:

```sql
alter table sesiones disable row level security;
```

### Estructura de la tabla `sesiones`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid | Identificador único (auto) |
| `titulo` | text | Nombre de la sesión |
| `puntaje` | integer | Puntuación del 0 al 100 |
| `mes` | text | Mes en mayúsculas (ej: `OCT`) |
| `dia` | integer | Día del mes |
| `hora` | text | Hora de inicio (ej: `14:30 PM`) |
| `duracion` | text | Duración (ej: `5 min 12 seg`) |
| `nivel` | text | `SOBRESALIENTE`, `BUENO`, o `EN PROGRESO` |
| `destacado` | boolean | Si la sesión es destacada |
| `created_at` | timestamp | Fecha de creación (auto) |

### Integración desde otros módulos

Para que una sesión aparezca en el historial, los módulos de grabación/análisis deben llamar a `guardarSesion()` al finalizar:

```js
import { guardarSesion } from "../services/supabase";

const ahora = new Date();

await guardarSesion({
  titulo: "Nombre de la sesión",
  puntaje: 88,
  mes: ahora.toLocaleString("es", { month: "short" }).toUpperCase(), // "OCT"
  dia: ahora.getDate(),                                               // 24
  hora: ahora.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
  duracion: "5 min 12 seg",
  nivel: "SOBRESALIENTE", // SOBRESALIENTE | BUENO | EN PROGRESO
  destacado: false
});
```

### Funciones disponibles en `supabase.js`

```js
// Guardar una nueva sesión
guardarSesion(sesion) → inserta en la tabla sesiones

// Obtener todas las sesiones ordenadas por fecha
obtenerSesiones() → retorna array de sesiones ([] si no hay datos)
```

---

## 🤖 Stack tecnológico

### Frontend
| Tecnología | Uso |
|------------|-----|
| **React 19** | Interfaz de usuario y gestión de estado |
| **WebRTC** | Acceso a cámara y micrófono en tiempo real |
| **MediaPipe Pose** (vía CDN) | Análisis de postura, contacto visual y gestos en el navegador |
| **Chart.js** | Gráficas de puntuación y progreso |
| **Supabase JS** | Cliente para base de datos en la nube |

### Backend
| Tecnología | Uso |
|------------|-----|
| **Python 3.11** | Lenguaje principal del servidor |
| **FastAPI** | Framework REST de alto rendimiento |
| **faster-whisper** | Transcripción de audio local (sin costos de API) |
| **Groq API (Llama 3)** | Análisis avanzado del discurso y feedback |
| **SQLAlchemy** | ORM para la base de datos |
| **PostgreSQL / Supabase** | Almacenamiento del historial de sesiones |

### DevOps
| Tecnología | Uso |
|------------|-----|
| **Railway** | Despliegue del backend en la nube |
| **Vercel** | Despliegue del frontend |

---

## 👥 Equipo de desarrollo

| Módulo | Encargado |
|--------|-----------|
| **M1** · Captura de medios | Jhon Peña Campos |
| **M2** · Análisis de voz | Raul Seminario |
| **M3** · Análisis de lenguaje corporal | Jeix Lopez Castillo |
| **M4** · Módulo de fusión IA | Raul Seminario |
| **M5** · Evaluación y feedback | Milene Lopez Cruz |
| **M6** · Historial de progreso | Israel Ramos Silva |

---

## 🗺️ Roadmap del proyecto

```
Semana 1-6   ██████░░░░░░░░░░░░  APF1 · Repositorio + M1 + M2 base
Semana 7-11  ░░░░░░██████░░░░░░  APF2 · CI/CD + M2 completo + M3 + M4 inicio
Semana 12-15 ░░░░░░░░░░░░████░░  APF3 · Despliegue + M4 completo + M5
Semana 16-18 ░░░░░░░░░░░░░░████  FINAL · Sistema completo + M6
```

| Entrega | Semana | Peso | Estado |
|---------|--------|------|--------|
| APF1 | 6 | 20% | ✅ **Completado** |
| APF2 | 11 | 20% | 🔄 En progreso |
| APF3 | 15 | 20% | ⏳ Pendiente |
| Proyecto Final | 18 | 40% | ⏳ Pendiente |

---

## 📦 Estado de los módulos

| Módulo | Nombre | Tecnología | Estado |
|--------|--------|------------|--------|
| **M1** | Captura de medios | React · WebRTC | ✅ **Completado** |
| **M2** | Análisis de voz | Python · FastAPI · faster-whisper · Groq | 🔄 **En desarrollo** |
| **M3** | Análisis de lenguaje corporal | MediaPipe Pose (CDN) | ✅ **Completado** |
| **M4** | Módulo de fusión | Groq API (Llama 3) | ⏳ Pendiente — APF2/3 |
| **M5** | Evaluación y feedback | React · Chart.js | ⏳ Pendiente — APF3 |
| **M6** | Historial de progreso | React · Supabase · PostgreSQL | ✅ **Completado** |

> **M1:** Captura de video y audio desde el navegador con WebRTC. El estudiante puede grabar en vivo con su cámara. Maneja permisos, inicio/parada de la cámara y grabación en formato webm.
>
> **M2:** Endpoint en FastAPI que recibe audio/video y lo procesa con **faster-whisper** para obtener transcripción, duración y marcas de tiempo. Calcula muletillas normalizadas y contextuales ("mmm", "ummm", "ehhh", "este,", "bueno,", "como diría"), velocidad de habla en palabras por minuto, ritmo (`lento`, `adecuado`, `rápido`), pausas largas, score de voz ponderado y feedback/recomendaciones con Groq o fallback local.
>
> **M3:** Análisis de lenguaje corporal en tiempo real usando **MediaPipe Pose** vía CDN (33 landmarks). Detecta postura (hombros alineados, encorvamiento, pecho abierto), contacto visual (posición de nariz y ojos), brazos cruzados. Las métricas se calculan por frame con una ventana móvil de ~1s para contacto visual. Sin dependencias npm — el modelo se carga directamente desde jsdelivr. Todo corre 100% en el navegador del cliente.
>
> **M6:** Historial de sesiones conectado a **Supabase** (PostgreSQL). Muestra todas las sesiones guardadas con puntaje, nivel, duración y fecha. Incluye búsqueda en tiempo real y estilos por nivel (SOBRESALIENTE / BUENO / EN PROGRESO). Las sesiones se guardan desde cualquier módulo llamando a `guardarSesion()`.
>
> **M4 y M5:** Se implementarán progresivamente en las unidades 2 y 3 del curso.

---

## 🚀 Instalación y uso local

### Prerrequisitos
- Node.js 18+
- Python 3.11+
- Git
- Cuenta en [Supabase](https://supabase.com) (para el historial)

### 1. Clonar el repositorio
```bash
git clone [URL-repositorio]
cd habla-bien-ia
code .
```

### 2. Configurar variables de entorno
```bash
# Crear frontend/.env con:
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Levantar el backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 4. Instalar dependencias del frontend
```bash
cd frontend
npm install
```

### 5. Levantar el frontend
```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`
La API en `http://localhost:8000/docs`

---

## 📡 Endpoints principales de la API

```
POST   /api/v1/analizar          →  Recibe audio/video y devuelve transcripción, métricas de voz, score y feedback
GET    /api/v1/historial/{id}    →  Historial de sesiones de un estudiante
GET    /api/v1/sesion/{id}       →  Detalle de una sesión específica
DELETE /api/v1/sesion/{id}       →  Elimina una sesión del historial
```

---

## 📊 Métricas que analiza la IA

| Dimensión | Qué mide |
|-----------|----------|
| 🎤 Voz | Muletillas normalizadas · Palabras/min · Ritmo · Pausas largas · Score ponderado · Feedback |
| 🧍 Postura | Hombros alineados · Encorvamiento · Pecho abierto · Brazos cruzados |
| 👀 Contacto visual | % de tiempo mirando a la cámara (ventana móvil ~1s) |
| ⚡ Energía / Tono | Monotonía vs. dinamismo (análisis Groq Llama 3) |

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

Este proyecto fue desarrollado como parte del curso **Herramientas de Desarrollo** — UTP · 2026.

---

<div align="center">

**Habla Bien · IA** — Porque el talento merece ser escuchado. 🎤

*Ingeniería de Sistemas e Informatica · UTP · Piura, Perú*

</div>
