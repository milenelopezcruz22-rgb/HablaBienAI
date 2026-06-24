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

# Habla Bien · IA

**Entrenador Personal de Oratoria con Inteligencia Artificial**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Pose_+_FaceMesh-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/edge/mediapipe)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)]()

</div>

---

## Tabla de Contenidos

- [Descripción General](#-descripcion-general)
- [El Problema](#-el-problema)
- [Solución](#-solucion)
- [Stack Tecnológico](#-stack-tecnologico)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Módulos del Sistema](#-modulos-del-sistema)
  - [M1 — Captura de Medios](#m1--captura-de-medios)
  - [M2 — Análisis de Voz](#m2--analisis-de-voz)
  - [M3 — Análisis de Lenguaje Corporal](#m3--analisis-de-lenguaje-corporal)
  - [M3.1 — FaceMesh: Contacto Visual Preciso](#m31--facemesh-contacto-visual-preciso)
  - [M4 — Fusión de Resultados](#m4--fusion-de-resultados)
  - [M5 — Evaluación y Feedback](#m5--evaluacion-y-feedback)
  - [M6 — Historial de Progreso](#m6--historial-de-progreso)
- [Autenticación y Seguridad](#-autenticacion-y-seguridad)
- [API REST](#-api-rest)
- [Instalación y Uso Local](#-instalacion-y-uso-local)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Roadmap](#-roadmap)
- [Equipo](#-equipo)
- [Convenciones](#-convenciones)
- [Licencia](#-licencia)

---

## 📖 Descripción General

**Habla Bien IA** es una plataforma web de entrenamiento de oratoria que utiliza inteligencia artificial para analizar presentaciones en video en tiempo real. Combina visión computacional (MediaPipe) para evaluar lenguaje corporal y contacto visual, con análisis de voz para medir muletillas, ritmo y claridad.

La aplicación está diseñada para estudiantes, profesionales y cualquier persona que desee mejorar sus habilidades de comunicación frente a una audiencia. Todo el procesamiento corporal ocurre en el navegador del cliente — ningún video sale del dispositivo sin el consentimiento del usuario.

---

## 🎯 El Problema

| Problema | Impacto |
|---|---|
| **Brecha de empleabilidad** | Profesionales talentosos pierden oportunidades laborales por no comunicar sus ideas con claridad y seguridad |
| **Pánico escénico** | El miedo a hablar en público afecta exposiciones académicas, sustentaciones de tesis y presentaciones ejecutivas |
| **Falta de retroalimentación individual** | Un docente o entrenador no puede corregir detalladamente a cada estudiante en tiempo real |
| **Subjetividad en la evaluación** | Sin métricas objetivas, la mejora depende de percepciones personales y no de datos concretos |

---

## 💡 Solución

**Habla Bien IA** proporciona retroalimentación objetiva y detallada mediante:

1. **Análisis en vivo** — métricas de postura, brazos, torso y contacto visual mientras el usuario habla
2. **Detección facial precisa** — seguimiento del iris con FaceMesh para determinar con exactitud hacia dónde mira el usuario
3. **Evaluación de voz** — muletillas, velocidad de habla, pausas y ritmo
4. **Dashboard interactivo** — puntuaciones, radar chart multidimensional y línea de tiempo de eventos
5. **Historial persistente** — evolución sesión por sesión almacenada en PostgreSQL
6. **Recomendaciones personalizadas** — sugerencias accionables basadas en el desempeño de cada sesión

---

## 🛠 Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|---|---|---|
| **React** | 19 | Biblioteca de UI con componentes modulares y hooks personalizados |
| **Vite** | 8 | Bundler de desarrollo y producción con HMR ultrarrápido |
| **Tailwind CSS** | 4 | Framework de estilos utilitarios con paleta personalizada celeste pastel |
| **react-router-dom** | 7 | Enrutamiento SPA con rutas públicas y protegidas por autenticación |
| **lucide-react** | 1.11 | Sistema de iconos vectoriales consistente |
| **Chart.js + react-chartjs-2** | 4.5 / 5.3 | Visualización de datos: radar chart, barras de puntuación |
| **MediaPipe Pose** | CDN | 33 landmarks corporales para análisis de postura y movimiento |
| **MediaPipe FaceMesh** | CDN | 478 landmarks faciales con refineLandmarks para tracking de iris |
| **WebRTC API** | Nativo | Acceso a cámara, micrófono y grabación de video en formato webm |

### Backend

| Tecnología | Versión | Propósito |
|---|---|---|
| **Node.js** | 18+ | Entorno de ejecución del servidor |
| **Express** | 4.21 | Framework HTTP con enrutamiento modular y middleware |
| **PostgreSQL** | 16 | Base de datos relacional con columna JSONB para análisis flexible |
| **jsonwebtoken** | 9 | Autenticación stateless con tokens JWT de 7 días de expiración |
| **bcrypt** | 5 | Hash y comparación segura de contraseñas |
| **pg** | 8 | Cliente PostgreSQL nativo con Pool de conexiones |
| **cors** | 2 | Middleware de seguridad para peticiones cross-origin |
| **dotenv** | 16 | Gestión de variables de entorno |

---

## 🏗 Arquitectura del Proyecto

### Diagrama de flujo de datos

```
                    ┌──────────────────────────────────┐
                    │         Navegador (React)         │
                    │                                  │
  ┌─────────────┐   │  ┌──────────┐  ┌─────────────┐  │
  │   Cámara    │──▶│  │ Pose     │  │ FaceMesh     │  │
  │ Micrófono   │   │  │ (33 lmk) │  │ (478 lmk)    │  │
  └─────────────┘   │  └────┬─────┘  └──────┬───────┘  │
                    │       │                │          │
                    │  ┌────▼────────────────▼──────┐   │
                    │  │     useAnalysis.js          │   │
                    │  │   (fusión cuerpo + rostro)  │   │
                    │  └───────────────┬──────────────┘   │
                    │                  │                  │
                    │  ┌───────────────▼──────────────┐   │
                    │  │   Grabación .webm            │   │
                    │  └───────────────┬──────────────┘   │
                    └─────────────────┼────────────────────┘
                                      │
                    ┌─────────────────▼────────────────────┐
                    │     Backend (Express)                │
                    │                                     │
                    │  POST /api/analizar (voz)           │
                    │  POST /api/sesiones (guardar)       │
                    │  GET  /api/sesiones (historial)     │
                    │  POST /api/register (auth)          │
                    │  POST /api/login (JWT)              │
                    │                                     │
                    │  ┌─────────────────────────────┐    │
                    │  │  PostgreSQL                 │    │
                    │  │  - usuarios                 │    │
                    │  │  - sesiones (JSONB)         │    │
                    │  └─────────────────────────────┘    │
                    └─────────────────────────────────────┘
```

### Principios de diseño

- **Privacidad por diseño**: el video nunca abandona el navegador. Solo se envía el blob de audio al backend para análisis de voz. Las métricas corporales se calculan 100% en el cliente.
- **Arquitectura modular**: cada hook de análisis (cuerpo, rostro, manos) es independiente y puede activarse/desactivarse sin afectar al resto del sistema.
- **Autenticación stateless**: JWT sin sesiones en servidor. El token se almacena en localStorage y se envía automáticamente en cada petición mediante un interceptor centralizado.
- **Persistencia flexible**: la columna `analisis` en la tabla `sesiones` usa tipo JSONB, permitiendo almacenar resultados con estructura variable sin migraciones de esquema.

---

## 🧩 Módulos del Sistema

### M1 — Captura de Medios

**Ubicación:** `src/hooks/useCamera.js`

El módulo de captura gestiona el acceso a la cámara y micrófono mediante la API WebRTC. Proporciona un ciclo de vida completo: activación, grabación en formato webm y liberación de recursos.

**Características:**
- Detección automática del codec de video compatible (VP9 > VP8)
- Indicador visual de grabación activa (punto rojo animado + label REC)
- Bloqueo de botones durante la grabación para evitar estados inconsistentes
- Manejo de errores con mensajes descriptivos en español

```
Estados: inactivo → activo → grabando → detenido → inactivo
```

---

### M2 — Análisis de Voz

El análisis de voz se realiza mediante un servicio externo (FastAPI + faster-whisper + Groq API). El frontend envía el blob de audio grabado y recibe:

| Métrica | Descripción | Rango |
|---|---|---|
| Transcripción | Texto completo con marcas de tiempo | — |
| Muletillas | Palabras de relleno normalizadas y contextuales | Conteo |
| Velocidad de habla | Palabras por minuto | 0–200+ |
| Ritmo | Clasificación del tempo | lento / adecuado / rápido |
| Pausas largas | Silencios > 2s con duración acumulada | segundos |
| Puntaje de voz | Score ponderado compuesto | 0–100 |
| Feedback | Recomendaciones generadas por IA | texto |

---

### M3 — Análisis de Lenguaje Corporal

**Ubicación:** `src/hooks/useBodyAnalysis.js`

Utiliza **MediaPipe Pose** con `modelComplexity: 1` (precisión completa) para detectar 33 landmarks corporales en cada frame. El análisis se ejecuta a ~11 FPS (intervalo de 90ms) con actualización de UI a ~5.5 FPS para mantener fluidez visual.

#### Métricas por dimensión

| Dimensión | Indicadores | Umbrales |
|---|---|---|
| **Encuadre** | Visibilidad de rostro, hombros y torso | visibility ≥ 0.45 |
| **Postura** | Alineación de hombros, encorvamiento, pecho abierto | diff y < 0.05, head/torso ratio |
| **Torso** | Orientación lateral, inclinación (ejes X/Y) | shoulder width < 0.12, y diff > 0.055 |
| **Brazos** | Estado: neutros, cruzados, elevados, abiertos | reglas geométricas con puntos clave |
| **Manos** | Visibilidad de muñecas | visibility ≥ 0.45 |
| **Actividad gestual** | Movimiento medio de muñecas entre frames | threshold 0.025 |
| **Rigidez** | Brazos visibles sin movimiento y no cruzados | threshold 0.008 |
| **Movimiento** | Desplazamiento del centro del torso | threshold 0.035 |
| **Contacto visual (fallback)** | Relación nariz/centro de ojos | ratio < 0.2 |

#### Acumulación y eventos

- **Ventana deslizante** de 8 frames para contacto visual
- **Porcentajes acumulados** sobre el total de frames analizados
- **Eventos sostenidos**: se registran cuando una condición negativa persiste ≥ 1.2 segundos
- **Recomendaciones dinámicas**: se generan al finalizar la sesión basadas en los porcentajes finales

#### Algoritmo de postura

```
Por frame:
  1. Verificar visibilidad de landmarks clave (nariz, hombros, cadera)
  2. Calcular alineación de hombros (diferencia Y entre hombro izq/der)
  3. Detectar encorvamiento (relación cabeza/torso)
  4. Evaluar estado de brazos (cruzados, elevados, abiertos, neutros)
  5. Calcular orientación del torso (frontal vs lateral)
  6. Actualizar ventana de contacto visual
  7. Acumular estadísticas de sesión

Score de postura = 100
  -25 si hombros no alineados
  -40 si encorvado
  -15 si brazos cruzados
```

---

### M3.1 — FaceMesh: Contacto Visual Preciso

**Ubicación:** `src/hooks/useFaceAnalysis.js`

Se implementó **MediaPipe FaceMesh** con `refineLandmarks: true` para obtener los landmarks del iris (índices 468 y 473). Esto permite un tracking de la dirección de la mirada real, en contraste con la heurística aproximada basada solo en landmarks de Pose.

#### Algoritmo de gaze tracking

```
Por frame:
  1. Obtener 16 landmarks del contorno de cada ojo
  2. Calcular centro geométrico de la cavidad ocular
  3. Obtener posición del iris (landmark 468 izquierdo, 473 derecho)
  4. Calcular offset normalizado: (iris - centro_ojo) / ancho_ojo
  5. Promediar offset de ambos ojos
  6. Si distancia < 0.12 → mirando a cámara
     Sino → determinar dirección (izquierda/derecha/arriba/abajo)
```

#### Métricas exportadas

| Métrica | Descripción |
|---|---|
| `contactoVisualPreciso` | Score instantáneo (ventana deslizante de 10 frames) |
| `orientacionRostro` | Dirección de la mirada: centro, izquierda, derecha, arriba, abajo |
| `porcentajeContactoVisual` | % total de frames mirando a cámara |
| `miradaIzquierda/Derecha/Arriba/Abajo` | % de tiempo en cada dirección |

#### Integración con el sistema

FaceMesh se ejecuta en un bucle independiente a 120ms para no competir con Pose. Cuando está disponible, **reemplaza automáticamente** al fallback de Pose para el contacto visual, tanto en la UI en vivo como en los datos guardados. El dashboard indica "(IA)" cuando FaceMesh está activo.

---

### M4 — Fusión de Resultados

**Ubicación:** `src/pages/grabarsesion.jsx`, `src/pages/dashboard.jsx`

Al finalizar la grabación, el sistema ensambla un objeto JSON con tres capas:

```json
{
  "voz": { "score_voz": 85, "transcripcion": "...", "muletillas": 3, ... },
  "corporal": { "porcentajeBuenaPostura": 78, "porcentajeContactoVisual": 65, ... },
  "facial": { "porcentajeContactoVisual": 72, "orientacionRostro": "centro", ... }
}
```

Este objeto se envía al backend (`POST /api/sesiones`) y se almacena en la columna JSONB `analisis`. El dashboard lo recupera y renderiza las visualizaciones correspondientes.

---

### M5 — Evaluación y Feedback

El dashboard de resultados muestra:
- **Puntaje general** (score de voz)
- **Radar chart** con 5 dimensiones (postura, contacto visual, movimiento, actividad gestual, puntaje de voz)
- **Recomendaciones corporales** (hasta 4, basadas en umbrales de porcentaje)
- **Eventos relevantes** (postura incorrecta, sin contacto visual, brazos cruzados, etc.)
- **Métrica de audio** (nivel, estado óptimo/bajo/alto)

---

### M6 — Historial de Progreso

**Ubicación:** `src/components/historial.jsx`, `src/pages/historialpage.jsx`

Conectado a PostgreSQL mediante `GET /api/sesiones`. Cada sesión listada muestra:

- Título y fecha
- Puntaje general
- Duración
- Click para navegar al dashboard detallado

El historial está filtrado por `usuario_id` del token JWT, garantizando que cada usuario vea solo sus propias sesiones.

---

## 🔒 Autenticación y Seguridad

### Flujo de autenticación

```
Registro:     POST /api/register  → bcrypt hash → INSERT en usuarios → JWT
Inicio sesión: POST /api/login     → bcrypt compare → JWT (7 días)
Validación:   GET /api/me         → verify JWT → datos del usuario
```

### Middleware de protección

```javascript
// backend/middleware/auth.js
- Extrae token del header Authorization: Bearer <token>
- Verifica con jsonwebtoken
- Establece req.userId con el ID decodificado
- Retorna 401 si el token es inválido o expiró
```

### Endpoints públicos vs protegidos

| Tipo | Rutas |
|---|---|
| **Públicas** | `/api/register`, `/api/login` |
| **Protegidas (JWT)** | `/api/me`, `/api/sesiones/*` |

### Seguridad en el frontend

- El token se almacena en `localStorage` y se inyecta automáticamente en cada petición mediante el módulo `api.js`
- El estado de autenticación se verifica al montar la aplicación (`GET /api/me`) y se propaga mediante `AuthContext`
- Las rutas protegidas utilizan el componente `ProtectedRoute` que redirige a `/login` si no hay sesión activa
- La landing page muestra contenido diferente para usuarios autenticados vs invitados

---

## 📡 API REST

### Base URL: `http://localhost:3001`

### Autenticación

```
POST /api/register
  Body:    { nombre, email, password }
  Respuesta: { token, user: { id, nombre, email } }

POST /api/login
  Body:    { email, password }
  Respuesta: { token, user: { id, nombre, email } }

GET /api/me
  Headers: Authorization: Bearer <token>
  Respuesta: { user: { id, nombre, email } }
```

### Sesiones

```
GET /api/sesiones
  Headers: Authorization: Bearer <token>
  Respuesta: { sesiones: [...] }

GET /api/sesiones/:id
  Headers: Authorization: Bearer <token>
  Respuesta: { sesion: { id, titulo, duracion_seg, puntaje_general, fecha, analisis } }

POST /api/sesiones
  Headers: Authorization: Bearer <token>
  Body: { titulo, duracion_seg, puntaje_general, analisis }
  Respuesta: { sesion: { id, ... } }

DELETE /api/sesiones/:id
  Headers: Authorization: Bearer <token>
  Respuesta: { mensaje: "Sesión eliminada" }
```

### Esquema de base de datos

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sesiones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    duracion_seg INTEGER DEFAULT 0,
    puntaje_general INTEGER DEFAULT 0,
    fecha TIMESTAMP DEFAULT NOW(),
    analisis JSONB DEFAULT '{}'
);
```

---

## 🚀 Instalación y Uso Local

### Prerrequisitos

- **Node.js** 18 o superior
- **PostgreSQL** 14 o superior
- **Git**

### 1. Clonar el repositorio

```bash
git clone https://github.com/milenelopezcruz22-rgb/HablaBienAI.git
cd HablaBienAI
```

### 2. Configurar la base de datos

Asegúrate de que PostgreSQL esté corriendo y crea la base de datos:

```bash
psql -U postgres
CREATE DATABASE hablabien_db;
\q
```

### 3. Configurar el backend

```bash
cd backend
cp .env.example .env    # o crea el archivo manualmente
npm install
```

Edita `backend/.env`:

```env
DB_NAME=hablabien_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=HablaBienIA_secret_key_cambiar_en_produccion
PORT=3001
```

Las tablas se crean automáticamente al iniciar el servidor.

### 4. Configurar el frontend

```bash
cd frontend
npm install
```

### 5. Iniciar los servidores

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

El servidor Express se inicia en `http://localhost:3001`.

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

La aplicación React se inicia en `http://localhost:5173`.

### 6. Probar el build de producción

```bash
cd frontend
npm run build    # Genera dist/ con JS y CSS optimizados
npm run lint     # Verifica el código con ESLint
```

---

## 📂 Estructura del Proyecto

```
HablaBienAI/
│
├── backend/
│   ├── routes/
│   │   ├── auth.js                    # Registro, login, perfil
│   │   └── sesiones.js                # CRUD de sesiones
│   ├── middleware/
│   │   └── auth.js                    # Verificación JWT
│   ├── db.js                          # Pool de conexión PostgreSQL
│   ├── server.js                      # Configuración y punto de entrada
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html                     # CDN: MediaPipe Pose + FaceMesh
│   ├── src/
│   │   ├── main.jsx                   # Punto de entrada React
│   │   ├── App.jsx                    # Router con rutas protegidas
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Estado global de autenticación
│   │   │
│   │   ├── hooks/
│   │   │   ├── useCamera.js           # WebRTC + MediaRecorder
│   │   │   ├── useAnalysis.js         # Orquestador de análisis
│   │   │   ├── useBodyAnalysis.js     # MediaPipe Pose (postura, brazos, torso)
│   │   │   ├── useFaceAnalysis.js     # MediaPipe FaceMesh (iris tracking)
│   │   │   └── useHandAnalysis.js     # [Base] MediaPipe Hands
│   │   │
│   │   ├── pages/
│   │   │   ├── inicio.jsx             # Landing dual (auth / guest)
│   │   │   ├── AuthPage.jsx           # Login + Register con tabs
│   │   │   ├── grabarsesion.jsx       # Cámara, grabación, análisis en vivo
│   │   │   ├── dashboard.jsx          # Resultados detallados
│   │   │   └── historialpage.jsx      # Lista de sesiones guardadas
│   │   │
│   │   ├── components/
│   │   │   ├── navbar.jsx             # Navegación con nombre de usuario
│   │   │   ├── historial.jsx          # Tabla de sesiones
│   │   │   ├── cards.jsx / card.jsx   # Sección "Cómo funciona"
│   │   │   ├── scoredisplay.jsx       # Display de puntaje
│   │   │   ├── resultcard.jsx         # Tarjeta de métrica
│   │   │   ├── radarchart.jsx         # Gráfico radar 5 dimensiones
│   │   │   ├── button.jsx             # Botón reutilizable
│   │   │   └── Camera/
│   │   │       └── GrabarSesion.jsx   # [Alternativo] Componente de grabación
│   │   │
│   │   └── services/
│   │       └── api.js                 # Cliente HTTP con interceptor JWT
│   │
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 📊 Estado del Proyecto

| Módulo | Componente | Estado | Prioridad |
|---|---|---|---|
| **M1** | Captura de medios (cámara + micrófono) | ✅ Completado | — |
| **M2** | Análisis de voz (servicio externo) | ✅ Completado | — |
| **M3** | Análisis corporal (MediaPipe Pose) | ✅ Completado | — |
| **M3.1** | FaceMesh iris tracking | ✅ Completado | — |
| **M4** | Fusión de resultados (dashboard) | ✅ Completado | — |
| **M5** | Evaluación y feedback | 🔄 Parcial | Media |
| **M6** | Historial persistente (PostgreSQL) | ✅ Completado | — |
| **Auth** | JWT + PostgreSQL | ✅ Completado | — |
| **UI** | Landing page dual (auth/guest) | ✅ Completado | — |
| **UI** | Paleta celeste pastel | ✅ Completado | — |

---

## 🗺 Roadmap

### Corto plazo

| Prioridad | Tarea |
|---|---|
| Alta | Calibrar umbrales de FaceMesh con distintas condiciones de iluminación y tipos de rostro |
| Alta | Configurar variables de entorno y CORS para despliegue en producción |
| Media | Agregar gráfica de evolución temporal en la vista de historial |
| Media | Probar y ajustar `modelComplexity: 2` en equipos con buen rendimiento |

### Mediano plazo

| Prioridad | Tarea |
|---|---|
| Media | Activar MediaPipe Hands para detección y clasificación de gestos manuales |
| Media | Implementar vista comparativa entre dos sesiones seleccionadas |
| Baja | Migrar de MediaPipe CDN deprecado a `@mediapipe/tasks-vision` (API unificada) |
| Baja | Agregar modo oscuro con paleta de colores alternativa |

### Largo plazo

| Prioridad | Tarea |
|---|---|
| Baja | Generar reportes PDF exportables por sesión |
| Baja | Implementar modo multisesión simultánea (práctica grupal) |

---

## 👥 Equipo de Desarrollo

**Curso:** Herramientas de Desarrollo · UTP · 2026

| Integrante | Módulo principal |
|---|---|
| **Jhon Peña Campos** | M1 — Captura de medios |
| **Raul Seminario** | M2 — Análisis de voz / M4 — Fusión IA |
| **Jeix Lopez Castillo** | M3 — Análisis de lenguaje corporal |
| **Milene Lopez Cruz** | M5 — Evaluación y feedback |
| **Israel Ramos Silva** | M6 — Historial de progreso |

---

## 🤝 Convenciones del Equipo

### Flujo de ramas

```
main          → Código estable (producción)
develop       → Integración de características
feature/xxx   → Desarrollo de nueva funcionalidad
fix/xxx       → Corrección de errores
```

### Formato de commits

| Prefijo | Uso |
|---|---|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de errores |
| `docs:` | Documentación |
| `style:` | Formato sin cambios de lógica |
| `refactor:` | Refactorización de código |
| `test:` | Pruebas automatizadas |
| `chore:` | Mantenimiento y herramientas |

---

## 📄 Licencia

Proyecto desarrollado como parte del curso **Herramientas de Desarrollo** de la Universidad Tecnológica del Perú (UTP) — ciclo 2026.

**Ingeniería de Sistemas e Informática · Piura, Perú**

---

<div align="center">

**Habla Bien · IA**

Porque el talento merece ser escuchado.

*Entrenador personal de oratoria con inteligencia artificial*

</div>
