# Habla Bien IA

Entrenador personal de oratoria con inteligencia artificial.

Habla Bien IA permite grabar una exposición desde el navegador, analizar la voz y evaluar aspectos básicos del lenguaje corporal en tiempo real. Al finalizar, muestra un dashboard con métricas y recomendaciones para mejorar la presentación.

## Estado actual

El proyecto se encuentra en desarrollo. Actualmente están implementados:

- Captura de cámara y micrófono desde el navegador.
- Grabación de sesiones en formato `.webm`.
- Transcripción local con `faster-whisper`.
- Detección de muletillas, velocidad de habla y pausas largas.
- Puntaje ponderado de voz.
- Feedback con Groq API o recomendaciones locales como respaldo.
- Análisis corporal en tiempo real con MediaPipe Pose.
- Dashboard con resultados de voz y métricas corporales.
- Historial visual con datos de demostración.

> Importante: el historial todavía no está conectado a una base de datos. La integración con Supabase o PostgreSQL no se encuentra implementada en el código actual.

## ¿Cómo funciona?

1. El estudiante activa la cámara y el micrófono.
2. MediaPipe Pose analiza el cuerpo en tiempo real desde el navegador.
3. El estudiante inicia y detiene la grabación de su exposición.
4. El frontend envía el archivo `.webm` al backend.
5. El backend transcribe el audio y calcula las métricas de voz.
6. El dashboard combina los resultados de voz con las métricas corporales acumuladas durante la sesión.

## Arquitectura

```text
HablaBienAI/
├── frontend/                         # React 19 + Vite
│   └── src/
│       ├── components/               # Componentes visuales reutilizables
│       ├── pages/                    # Inicio, grabación, dashboard e historial
│       ├── hooks/
│       │   ├── useCamera.js          # Cámara, micrófono y grabación WebRTC
│       │   ├── useAnalysis.js        # Integración de audio, cuerpo, rostro y manos
│       │   ├── useBodyAnalysis.js    # Análisis corporal con MediaPipe Pose
│       │   ├── useFaceAnalysis.js    # Base opcional para FaceMesh
│       │   └── useHandAnalysis.js    # Base opcional para MediaPipe Hands
│       └── services/
│           └── api.js                # Cliente para el endpoint de análisis
├── backend/
│   ├── app/
│   │   ├── api/routes/               # Endpoint REST
│   │   ├── schemas/                  # Esquemas Pydantic
│   │   └── services/
│   │       ├── transcription_service.py
│   │       ├── speech_metrics_service.py
│   │       └── groq_service.py
│   └── tests/                        # Pruebas de métricas de voz y feedback
└── README.md
```

## Stack tecnológico

### Frontend

| Tecnología | Uso |
|---|---|
| React 19 | Interfaz de usuario y gestión de estado |
| Vite | Entorno de desarrollo y build |
| Tailwind CSS | Estilos de la interfaz |
| WebRTC y MediaRecorder | Acceso a cámara, micrófono y grabación |
| MediaPipe Pose vía CDN | Detección de 33 landmarks corporales |
| Chart.js | Soporte para visualizaciones |

### Backend

| Tecnología | Uso |
|---|---|
| Python 3.11+ | Lenguaje principal del backend |
| FastAPI | API REST |
| faster-whisper | Transcripción local de audio |
| Groq API | Feedback de oratoria cuando existe una API key |
| pytest | Pruebas automatizadas |

## Módulo de análisis corporal

El análisis corporal se ejecuta en el navegador con MediaPipe Pose. No requiere enviar video a un servicio externo para detectar la postura.

### Métricas implementadas

- Encuadre de rostro, hombros y torso.
- Alineación de hombros.
- Posible encorvamiento.
- Pecho abierto aproximado.
- Contacto visual aproximado usando la posición de nariz y ojos.
- Estabilidad corporal y movimiento excesivo del torso.
- Orientación frontal o lateral del torso.
- Inclinación lateral.
- Visibilidad de manos.
- Actividad gestual aproximada mediante movimiento de muñecas.
- Rigidez prolongada de brazos.
- Estados de brazos: neutros, abiertos, elevados, cruzados o parcialmente visibles.
- Porcentajes acumulados durante toda la sesión.
- Eventos sostenidos con segundo de inicio y duración.
- Recomendaciones corporales generadas mediante reglas.

### Rendimiento visual

La capa visual del esqueleto utiliza interpolación y una predicción breve de movimiento. El análisis de MediaPipe y el dibujo del canvas trabajan con ritmos separados para conservar una interfaz fluida sin ejecutar el modelo en cada frame.

### Módulos opcionales preparados

El proyecto incluye una base modular para añadir posteriormente:

- `useFaceAnalysis.js`: FaceMesh para mejorar orientación facial y seguimiento aproximado de mirada.
- `useHandAnalysis.js`: MediaPipe Hands para gestos finos como palma abierta, puño o señalar.

Estos módulos permanecen desactivados por defecto y todavía no cargan modelos adicionales.

## Módulo de análisis de voz

El backend expone un endpoint que recibe audio o video y devuelve:

- Transcripción.
- Total de palabras.
- Muletillas normalizadas y contextuales.
- Duración de la grabación.
- Palabras por minuto.
- Clasificación del ritmo: `lento`, `adecuado` o `rapido`.
- Pausas largas y duración acumulada.
- Puntaje ponderado de voz.
- Feedback y recomendaciones.

Si `GROQ_API_KEY` no está configurada, se utiliza feedback local como respaldo.

## Historial de sesiones

La vista de historial existe en el frontend, pero actualmente utiliza datos de demostración definidos en:

```text
frontend/src/constants.js
```

Pendiente:

- Conectar una base de datos.
- Guardar sesiones reales.
- Consultar el historial por usuario.
- Implementar autenticación y políticas de seguridad si se utiliza Supabase.

## Estado de los módulos

| Módulo | Nombre | Estado |
|---|---|---|
| M1 | Captura de medios | Implementado |
| M2 | Análisis de voz | Implementado, sujeto a pruebas con audios reales |
| M3 | Análisis de lenguaje corporal | Implementado con MediaPipe Pose |
| M4 | Fusión de resultados | Parcial: el dashboard combina resultados de voz y cuerpo |
| M5 | Evaluación y feedback | Parcial: existen dashboard y recomendaciones |
| M6 | Historial persistente | Pendiente: solo existen datos de demostración |

## Equipo de desarrollo

| Módulo | Encargado |
|---|---|
| M1 · Captura de medios | Jhon Peña Campos |
| M2 · Análisis de voz | Raul Seminario |
| M3 · Análisis de lenguaje corporal | Jeix Lopez Castillo |
| M4 · Módulo de fusión IA | Raul Seminario |
| M5 · Evaluación y feedback | Milene Lopez Cruz |
| M6 · Historial de progreso | Israel Ramos Silva |

## Instalación y uso local

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

Copia `.env.example` como `.env` en la raíz del proyecto y completa las variables necesarias:

```env
GROQ_API_KEY=tu_clave_de_groq
BACKEND_PORT=8000
VITE_API_URL=http://localhost:8000
```

`GROQ_API_KEY` es opcional: si no existe, el backend utiliza recomendaciones locales.

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

### 4. Levantar el frontend

Desde otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

La documentación interactiva de la API estará disponible en:

```text
http://localhost:8000/docs
```

## Endpoint disponible

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/analizar` | Recibe audio o video y devuelve transcripción, métricas de voz, puntaje y feedback |
| `GET` | `/health` | Comprueba si la API está activa |

## Pruebas y build

Backend:

```bash
cd backend
pytest
```

Frontend:

```bash
cd frontend
npm run build
```

## Convenciones de Git

### Ramas

```text
main          Código estable
develop       Rama de integración
feature/xxx   Nueva funcionalidad
fix/xxx       Corrección de errores
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

## Pendientes principales

- Conectar el historial a una base de datos.
- Añadir autenticación si se almacenan sesiones por estudiante.
- Configurar CORS para producción.
- Mejorar la URL del backend en la pantalla de grabación usando `VITE_API_URL`.
- Probar y calibrar umbrales corporales con distintas personas y cámaras.
- Implementar FaceMesh y MediaPipe Hands solamente si el rendimiento lo permite.
- Corregir textos con codificación incorrecta en algunos componentes del frontend.

## Licencia

Proyecto desarrollado como parte del curso Herramientas de Desarrollo, UTP 2026.
