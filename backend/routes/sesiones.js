import { Router } from "express";
import { pool } from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, titulo, duracion_seg, fecha, puntaje_general, analisis FROM sesiones WHERE usuario_id = $1 ORDER BY fecha DESC",
      [req.userId]
    );
    const sesiones = result.rows.map(s => ({
      ...s,
      analisis: typeof s.analisis === "string" ? JSON.parse(s.analisis) : s.analisis
    }));
    res.json({ sesiones });
  } catch (err) {
    console.error("GET /sesiones error:", err.message);
    res.status(500).json({ error: err.message || "Error del servidor" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, titulo, duracion_seg, fecha, puntaje_general, analisis FROM sesiones WHERE id = $1 AND usuario_id = $2",
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sesion no encontrada" });
    }
    const sesion = result.rows[0];
    sesion.analisis = typeof sesion.analisis === "string" ? JSON.parse(sesion.analisis) : sesion.analisis;
    res.json({ sesion });
  } catch (err) {
    console.error("GET /sesiones/:id error:", err.message);
    res.status(500).json({ error: err.message || "Error del servidor" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { titulo, duracion_seg, puntaje_general, analisis } = req.body;
    const result = await pool.query(
      "INSERT INTO sesiones (usuario_id, titulo, duracion_seg, puntaje_general, analisis) VALUES ($1, $2, $3, $4, $5) RETURNING id, titulo, duracion_seg, fecha, puntaje_general, analisis",
      [req.userId, titulo || "Sesion sin titulo", duracion_seg || 0, puntaje_general || 0, JSON.stringify(analisis || {})]
    );
    res.status(201).json({ sesion: result.rows[0] });
  } catch (err) {
    console.error("POST /sesiones error:", err.message, "| code:", err.code, "| detail:", err.detail);
    res.status(500).json({ error: err.message || "Error del servidor" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
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
    res.status(500).json({ error: err.message || "Error del servidor" });
  }
});

export default router;