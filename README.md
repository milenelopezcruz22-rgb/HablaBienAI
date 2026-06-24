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

[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Python](https://img.shields.io/badge/Backend-Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MediaPipe](https://img.shields.io/badge/IA-MediaPipe_Pose-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/edge/mediapipe)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)

<br/>

> 💡 **Inicio rápido:** `cd frontend && npm install && npm run dev`

> *¿Tienes el conocimiento pero te traiciona el nerviosismo al hablar?*
> **Habla Bien IA** analiza tu voz y lenguaje corporal para ofrecerte
> retroalimentación útil en cada sesión de práctica.

<br/>

[Reportar Bug](../../issues) · [Solicitar Feature](../../issues)

<br/>

</div>

---

## 📌 El problema que resolvemos

| Problema | Impacto |
|---|---|
| 🎯 **Brecha de empleabilidad** | Egresados talentosos pierden oportunidades por no comunicar sus ideas con claridad |
| 😰 **Pánico escénico** | El miedo a hablar en público afecta exposiciones y sustentaciones |
| 📋 **Falta de feedback individual** | Un docente no siempre puede corregir detalladamente a cada estudiante |

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
El estudiante activa la cámara y realiza una exposición. La aplicación combina el análisis de voz con métricas corporales acumuladas durante toda la sesión.

| 🎤 Voz | 🧍 Cuerpo | 📊 Resultados |
|---|---|---|
| Transcripción local | Postura y hombros | Puntaje de voz |
| Muletillas | Torso y estabilidad | Métricas corporales |
| Velocidad de habla | Brazos y manos visibles | Recomendaciones |
| Pausas largas | Contacto visual aproximado | Eventos relevantes |

```text
Cámara y micrófono
        ↓
Grabación .webm
        ↓
┌────────────────────┬────────────────────────┐
│ Backend            │ Navegador              │
│ Voz + Whisper      │ Cuerpo + MediaPipe     │
└────────────────────┴────────────────────────┘
        ↓
Dashboard de resultados
```

---

## 🏗️ Arquitectura del proyecto

```text
HablaBienAI/
│
├── 📁 frontend/                         # React 19 · Vite · Tailwind CSS
│   └── src/
│       ├── components/                  # Componentes visuales reutilizables
│       ├── pages/                       # Inicio · Grabación · Dashboard · Historial
│       ├── hooks/
│       │   ├── useCamera.js             # Cámara, micrófono y grabación
│       │   ├── useAnalysis.js           # Integración de módulos
│       │   ├── useBodyAnalysis.js       # Análisis corporal con MediaPipe Pose
│       │   ├── useFaceAnalysis.js       # Base opcional para FaceMesh
│       │   └── useHandAnalysis.js       # Base opcional para MediaPipe Hands
│       └── services/
│           └── api.js                   # Cliente HTTP del backend
│
├── 📁 backend/                          # Python 3.11 · FastAPI
│   ├── app/
│   │   ├── api/routes/                  # Endpoint REST
│   │   ├── schemas/                     # Esquemas Pydantic
│   │   └── services/
│   │       ├── transcription_service.py # faster-whisper
│   │       ├── speech_metrics_service.py
│   │       └── groq_service.py          # Feedback IA o fallback local
│   └── tests/                           # Pruebas automatizadas
│
└── 📖 README.md
```

---

## 🤖 Stack tecnológico

### Frontend

| Tecnología | Uso |
|---|---|
| **React 19** | Interfaz de usuario y gestión de estado |
| **WebRTC** | Acceso a cámara y micrófono en tiempo real |
| **MediaPipe Pose** (vía CDN) | Análisis de postura, contacto visual y gestos en el navegador |
| **Chart.js** | Gráficas de puntuación y progreso |
| **Vite** | Desarrollo local y build de producción |
| **Tailwind CSS** | Estilos de la interfaz |
| **WebRTC · MediaRecorder** | Cámara, micrófono y grabación `.webm` |
| **MediaPipe Pose** vía CDN | Detección de 33 landmarks corporales |
| **Chart.js** | Soporte para visualizaciones |

### Backend

| Tecnología | Uso |
|------------|-----|
| **Python 3.11** | Lenguaje principal del servidor |
| **FastAPI** | Framework REST de alto rendimiento |
| **faster-whisper** | Transcripción de audio local (sin costos de API) |
| **Groq API (Llama 3)** | Análisis avanzado del discurso y feedback |
| **SQLAlchemy** | ORM para la base de datos |
| **PostgreSQL** | Almacenamiento del historial de sesiones |

### DevOps
| Tecnología | Uso |
|------------|-----|
| **Railway** | Despliegue del backend en la nube |
| **Vercel** | Despliegue del frontend |
|---|---|
| **Python 3.11+** | Lenguaje principal del servidor |
| **FastAPI** | API REST |
| **faster-whisper** | Transcripción local de audio |
| **Groq API** | Feedback de oratoria cuando existe una API key |
| **pytest** | Pruebas automatizadas |

---

## 🧍 M3 · Análisis de lenguaje corporal

El análisis corporal se ejecuta directamente en el navegador con **MediaPipe Pose**. No requiere enviar el video a un servicio externo para evaluar la postura.

### Métricas implementadas

| Dimensión | ¿Qué mide? |
|---|---|
| **Encuadre** | Visibilidad del rostro, hombros y torso |
| **Postura** | Alineación de hombros, posible encorvamiento y pecho abierto aproximado |
| **Torso** | Orientación frontal o lateral, inclinación y estabilidad |
| **Brazos** | Estados neutros, abiertos, elevados, cruzados o parcialmente visibles |
| **Manos** | Visibilidad y actividad gestual aproximada mediante movimiento de muñecas |
| **Contacto visual** | Aproximación basada en la posición de nariz y ojos |
| **Sesión completa** | Porcentajes acumulados, eventos sostenidos y recomendaciones |

### Rendimiento visual

La visualización del esqueleto utiliza interpolación y una predicción breve de movimiento. El dibujo del canvas y el procesamiento de MediaPipe trabajan con ritmos separados para mantener una respuesta fluida.

### Arquitectura modular

| Hook | Estado | Propósito |
|---|---|---|
| `useBodyAnalysis.js` | ✅ Activo | Postura, torso, brazos, estabilidad y métricas acumuladas |
| `useFaceAnalysis.js` | 🧩 Preparado | Base para integrar FaceMesh posteriormente |
| `useHandAnalysis.js` | 🧩 Preparado | Base para integrar MediaPipe Hands posteriormente |
| `useAnalysis.js` | ✅ Activo | Une audio y módulos corporales para la interfaz |

> FaceMesh y MediaPipe Hands están preparados como módulos opcionales, pero todavía no cargan modelos adicionales. Se mantienen desactivados para evitar una carga innecesaria en equipos modestos.

---

## 🎤 M2 · Análisis de voz

El backend recibe audio o video y devuelve:

- Transcripción local con `faster-whisper`.
- Total de palabras y duración.
- Muletillas normalizadas y contextuales.
- Palabras por minuto.
- Ritmo: `lento`, `adecuado` o `rapido`.
- Pausas largas y duración acumulada.
- Puntaje ponderado de voz.
- Feedback con Groq API o recomendaciones locales como respaldo.

---

## 📈 Historial de progreso

La vista de historial existe, pero actualmente utiliza datos de demostración definidos en:

```text
frontend/src/constants.js
```

> ⚠️ **Pendiente:** el historial todavía no está conectado a una base de datos. Supabase o PostgreSQL no forman parte de la implementación actual.

---

## 📦 Estado de los módulos

| Módulo | Nombre | Tecnología | Estado |
|--------|--------|------------|--------|
| **M1** | Captura de medios | React · WebRTC | ✅ **Completado** |
| **M2** | Análisis de voz | Python · FastAPI · faster-whisper · Groq | 🔄 **En desarrollo** |
| **M3** | Análisis de lenguaje corporal | MediaPipe Pose (CDN) | ✅ **Completado** |
| M4 | Módulo de fusión | Groq API (Llama 3) | ⏳ Pendiente — APF2/3 |
| M5 | Evaluación y feedback | React · Chart.js | ⏳ Pendiente — APF3 |
| M6 | Historial de progreso | PostgreSQL · SQLAlchemy | ⏳ Pendiente — Final |

> **M1:** Captura de video y audio desde el navegador con WebRTC. El estudiante puede grabar en vivo con su cámara. Maneja permisos, inicio/parada de la cámara y grabación en formato webm.
>
> **M2:** Endpoint en FastAPI que recibe audio/video y lo procesa con **faster-whisper** para obtener transcripción, duración y marcas de tiempo. Calcula muletillas normalizadas y contextuales ("mmm", "ummm", "ehhh", "este,", "bueno,", "como diría"), velocidad de habla en palabras por minuto, ritmo (`lento`, `adecuado`, `rápido`), pausas largas, score de voz ponderado y feedback/recomendaciones con Groq o fallback local.
>
> **M3:** Análisis de lenguaje corporal en tiempo real usando **MediaPipe Pose** vía CDN (33 landmarks). Detecta postura (hombros alineados, encorvamiento, pecho abierto), contacto visual (posición de nariz y ojos), brazos cruzados. Las métricas se calculan por frame con una ventana móvil de ~1s para contacto visual. Sin dependencias npm — el modelo se carga directamente desde jsdelivr. Todo corre 100% en el navegador del cliente.
>
> **M4 al M6:** Se implementarán progresivamente en las unidades 2 y 3 del curso.
| Módulo | Nombre | Estado |
|---|---|---|
| **M1** | Captura de medios | ✅ Implementado |
| **M2** | Análisis de voz | ✅ Implementado · sujeto a pruebas con audios reales |
| **M3** | Análisis de lenguaje corporal | ✅ Implementado con MediaPipe Pose |
| **M4** | Fusión de resultados | 🔄 Parcial · dashboard con voz y cuerpo |
| **M5** | Evaluación y feedback | 🔄 Parcial · dashboard y recomendaciones |
| **M6** | Historial persistente | ⏳ Pendiente · datos de demostración |

---

## 👥 Equipo de desarrollo

| Módulo | Encargado |
|---|---|
| **M1** · Captura de medios | Jhon Peña Campos |
| **M2** · Análisis de voz | Raul Seminario |
| **M3** · Análisis de lenguaje corporal | Jeix Lopez Castillo |
| **M4** · Módulo de fusión IA | Raul Seminario |
| **M5** · Evaluación y feedback | Milene Lopez Cruz |
| **M6** · Historial de progreso | Israel Ramos Silva |

---

## 🚀 Instalación y uso local

### Prerrequisitos

- Node.js 18+
- Python 3.11+
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/milenelopezcruz22-rgb/HablaBienAI.git
cd HablaBienAI
```

### 2. Configurar variables de entorno

Copia `.env.example` como `.env` en la raíz y completa las variables necesarias:

```env
GROQ_API_KEY=tu_clave_de_groq
BACKEND_PORT=8000
VITE_API_URL=http://localhost:8000
```

`GROQ_API_KEY` es opcional. Si no existe, el backend utiliza recomendaciones locales.

### 3. Levantar el backend

```bash
cd backend
python -m venv venv
```

En Windows:

```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

En Linux o macOS:

```bash
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

En Linux o macOS:
### 3. Instalar dependencias del frontend
### 4. Levantar el frontend

Desde otra terminal:

```bash
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 4. Levantar el frontend

Desde otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`
La API en `http://localhost:8000/docs`
| Servicio | URL |
|---|---|
| Aplicación web | `http://localhost:5173` |
| Documentación API | `http://localhost:8000/docs` |
| Estado del backend | `http://localhost:8000/health` |

---

## 📡 Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/analizar` | Recibe audio o video y devuelve métricas de voz, puntaje y feedback |
| `GET` | `/health` | Comprueba si la API está activa |

---

## 🧪 Pruebas y build

Backend:

```bash
cd backend
pytest
```
POST   /api/v1/analizar          →  Recibe audio/video y devuelve transcripción, métricas de voz, score y feedback
GET    /api/v1/historial/{id}    →  Historial de sesiones de un estudiante
GET    /api/v1/sesion/{id}       →  Detalle de una sesión específica
DELETE /api/v1/sesion/{id}       →  Elimina una sesión del historial

Frontend:

```bash
cd frontend
npm run build
```

---

## 🗺️ Roadmap técnico

| Dimensión | Qué mide |
|-----------|----------|
| 🎤 Voz | Muletillas normalizadas · Palabras/min · Ritmo · Pausas largas · Score ponderado · Feedback |
| 🧍 Postura | Hombros alineados · Encorvamiento · Pecho abierto · Brazos cruzados |
| 👀 Contacto visual | % de tiempo mirando a la cámara (ventana móvil ~1s) |
| ⚡ Energía / Tono | Monotonía vs. dinamismo (análisis Groq Llama 3) |
| Prioridad | Pendiente |
|---|---|
| Alta | Conectar el historial a una base de datos |
| Alta | Configurar CORS para producción |
| Media | Utilizar `VITE_API_URL` en la pantalla de grabación |
| Media | Probar y calibrar umbrales corporales con distintas personas y cámaras |
| Media | Añadir autenticación si se almacenan sesiones por estudiante |
| Opcional | Integrar FaceMesh y MediaPipe Hands si el rendimiento lo permite |

---

## 🤝 Convenciones del equipo

### Ramas

```text
main          → Código estable
develop       → Rama de integración
feature/xxx   → Nueva funcionalidad
fix/xxx       → Corrección de errores
```

### Commits

```text
feat:      nueva funcionalidad
fix:       corrección de errores
docs:      documentación
style:     formato sin cambios de lógica
refactor:  refactorización
test:      pruebas
chore:     mantenimiento
```

---

## 📄 Licencia

Proyecto desarrollado como parte del curso **Herramientas de Desarrollo** · UTP · 2026.

---

<div align="center">

**Habla Bien · IA** · Porque el talento merece ser escuchado. 🎤

*Ingeniería de Sistemas e Informática · UTP · Piura, Perú*

</div>
