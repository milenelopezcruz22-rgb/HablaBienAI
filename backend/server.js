import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import sesionesRoutes from "./routes/sesiones.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configurado
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: "10mb" }));

// Headers de seguridad
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: "Demasiadas solicitudes desde esta IP, intenta más tarde",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting estricto para análisis
const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // máximo 5 análisis por IP cada 15 minutos
  message: "Demasiados análisis, intenta más tarde",
  skipSuccessfulRequests: true,
});

app.use(globalLimiter);

// Rutas
app.use("/api", authRoutes);
app.use("/api/sesiones", sesionesRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Error no manejado:", err.message);
  res.status(err.status || 500).json({
    error: "Error del servidor",
    ...(process.env.NODE_ENV === "development" && { details: err.message })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
