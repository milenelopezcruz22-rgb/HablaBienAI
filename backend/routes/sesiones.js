import { Router } from "express";
import { pool } from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Helper para parseador seguro de JSON
const parseAnalisis = (data) => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      console.error("Error parseando JSON de análisis");
      return {};
    }
  }
  return data || {};
};

// Helper para validar ID numérico
const isValidId = (id) => /^\d+$/.test(id);

router.get("/", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, titulo, duracion_seg, fecha, puntaje_general, analisis FROM sesiones WHERE usuario_id = $1 ORDER BY fecha DESC",
      [req.userId]
    );
    const sesiones = result.rows.map(s => ({
      ...s,
      analisis: parseAnalisis(s.analisis)
    }));
    res.json({ sesiones });
  } catch (err) {
    console.error("GET /sesiones error:", err.message);
    res.status(500).json({ error: "Error al obtener sesiones" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    // Validar ID
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "ID de sesión inválido" });
    }

    const result = await pool.query(
      "SELECT id, titulo, duracion_seg, fecha, puntaje_general, analisis FROM sesiones WHERE id = $1 AND usuario_id = $2",
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sesion no encontrada" });
    }
    const sesion = result.rows[0];
    sesion.analisis = parseAnalisis(sesion.analisis);
    res.json({ sesion });
  } catch (err) {
    console.error("GET /sesiones/:id error:", err.message);
    res.status(500).json({ error: "Error al obtener sesión" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { titulo, duracion_seg, puntaje_general, analisis } = req.body;

    // Validar entrada
    if (!titulo || typeof titulo !== "string" || titulo.trim().length === 0) {
      return res.status(400).json({ error: "El título es requerido" });
    }

    if (typeof duracion_seg !== "number" || duracion_seg < 0) {
      return res.status(400).json({ error: "La duración debe ser un número válido" });
    }

    if (typeof puntaje_general !== "number" || puntaje_general < 0 || puntaje_general > 100) {
      return res.status(400).json({ error: "El puntaje debe estar entre 0 y 100" });
    }

    // Validar que analisis sea objeto
    if (analisis && typeof analisis !== "object") {
      return res.status(400).json({ error: "El análisis debe ser un objeto JSON válido" });
    }

    const result = await pool.query(
      "INSERT INTO sesiones (usuario_id, titulo, duracion_seg, puntaje_general, analisis) VALUES ($1, $2, $3, $4, $5) RETURNING id, titulo, duracion_seg, fecha, puntaje_general, analisis",
      [req.userId, titulo.trim(), duracion_seg, puntaje_general, JSON.stringify(analisis || {})]
    );
    res.status(201).json({ sesion: result.rows[0] });
  } catch (err) {
    console.error("POST /sesiones error:", err.message);
    res.status(500).json({ error: "Error al crear sesión" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    // Validar ID
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "ID de sesión inválido" });
    }

    const result = await pool.query(
      "DELETE FROM sesiones WHERE id = $1 AND usuario_id = $2 RETURNING id",
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sesion no encontrada" });
    }
    res.json({ mensaje: "Sesion eliminada" });
  } catch (err) {
    console.error("DELETE /sesiones/:id error:", err.message);
    res.status(500).json({ error: "Error al eliminar sesión" });
  }
});

export default router;
