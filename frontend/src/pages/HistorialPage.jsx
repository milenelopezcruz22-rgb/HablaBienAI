import { useState, useEffect, useCallback } from "react";
import { Search, History, SlidersHorizontal, TrendingUp, TrendingDown, Minus, AlertCircle, RefreshCw } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Historial from "../components/historial";
import { api } from "../services/api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
}

function calcularTendencia(sesiones) {
  if (sesiones.length < 2) return null;
  const sorted = [...sesiones].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const first = sorted[0].puntaje_general ?? 0;
  const last  = sorted[sorted.length - 1].puntaje_general ?? 0;
  return last - first;
}

function ProgresoChart({ sesiones }) {
  if (!sesiones || sesiones.length < 2) return null;

  const sorted = [...sesiones]
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(-12); // últimas 12 sesiones

  const labels = sorted.map((s) => formatFecha(s.fecha));
  const scores = sorted.map((s) => s.puntaje_general ?? 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Puntaje general",
        data: scores,
        borderColor: "rgba(37,99,235,1)",
        backgroundColor: "rgba(37,99,235,0.08)",
        borderWidth: 2.5,
        pointBackgroundColor: scores.map((s) =>
          s >= 80 ? "#22c55e" : s >= 60 ? "#3b82f6" : s >= 40 ? "#f59e0b" : "#ef4444"
        ),
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 100,
        ticks: { stepSize: 20, color: "#94a3b8", font: { size: 11 } },
        grid: { color: "rgba(0,0,0,0.05)" },
        border: { display: false },
      },
      x: {
        ticks: { color: "#94a3b8", font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `Puntaje: ${ctx.raw}/100`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

// ---------------------------------------------------------------------------
// Estadísticas de resumen
// ---------------------------------------------------------------------------
function ResumenStats({ sesiones }) {
  if (!sesiones.length) return null;

  const scores = sesiones.map((s) => s.puntaje_general ?? 0).filter(Boolean);
  const promedio = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const mejor   = scores.length ? Math.max(...scores) : 0;
  const tendencia = calcularTendencia(sesiones);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Promedio</p>
        <p className="text-3xl font-bold text-slate-900">{promedio}</p>
        <p className="text-xs text-slate-400">sobre 100</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Mejor sesión</p>
        <p className="text-3xl font-bold text-emerald-600">{mejor}</p>
        <p className="text-xs text-slate-400">puntos</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tendencia</p>
        {tendencia === null ? (
          <p className="text-3xl font-bold text-slate-400">—</p>
        ) : tendencia > 0 ? (
          <>
            <div className="flex items-center gap-1">
              <TrendingUp size={22} className="text-emerald-500" />
              <p className="text-3xl font-bold text-emerald-600">+{tendencia}</p>
            </div>
            <p className="text-xs text-emerald-500">mejorando</p>
          </>
        ) : tendencia < 0 ? (
          <>
            <div className="flex items-center gap-1">
              <TrendingDown size={22} className="text-red-400" />
              <p className="text-3xl font-bold text-red-500">{tendencia}</p>
            </div>
            <p className="text-xs text-red-400">a reforzar</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <Minus size={22} className="text-slate-400" />
              <p className="text-3xl font-bold text-slate-600">0</p>
            </div>
            <p className="text-xs text-slate-400">estable</p>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------
export default function HistorialPage() {
  const [busqueda, setBusqueda]   = useState("");
  const [sesiones, setSesiones]   = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const cargarSesiones = useCallback(() => {
    setCargando(true);
    setErrorCarga(null);
    api.sesiones
      .list()
      .then(({ sesiones }) => setSesiones(sesiones || []))
      .catch((err) => setErrorCarga(err.message || "No se pudo conectar con el servidor"))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => { cargarSesiones(); }, [cargarSesiones]);

  const sesionesConScore = sesiones.filter((s) => s.puntaje_general != null);
  const tendencia = calcularTendencia(sesionesConScore);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <main className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
              <History size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Historial de Sesiones</h1>
              {!cargando && (
                <p className="text-xs text-slate-400">
                  {sesiones.length} sesión{sesiones.length !== 1 ? "es" : ""} registrada{sesiones.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Buscar sesión..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-slate-700 w-48 placeholder-slate-400"
              />
            </div>
            <button className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Banner de error de carga */}
        {errorCarga && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
            <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-700">No se pudieron cargar las sesiones</p>
              <p className="text-xs text-red-500 font-mono mt-1 break-all">{errorCarga}</p>
            </div>
            <button
              onClick={cargarSesiones}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 transition-all flex-shrink-0"
            >
              <RefreshCw size={13} /> Reintentar
            </button>
          </div>
        )}

        {/* Estadísticas + Gráfico de progreso */}
        {!cargando && sesiones.length > 0 && (
          <>
            <ResumenStats sesiones={sesionesConScore} />

            {sesionesConScore.length >= 2 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-slate-900">Evolución del Puntaje</h2>
                  {tendencia !== null && (
                    <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${
                      tendencia > 0 ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : tendencia < 0 ? "bg-red-50 text-red-500 border-red-200"
                      : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}>
                      {tendencia > 0 ? <TrendingUp size={13} /> : tendencia < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
                      {tendencia > 0 ? `+${tendencia}` : tendencia} pts
                    </span>
                  )}
                </div>
                <ProgresoChart sesiones={sesionesConScore} />
              </div>
            )}
          </>
        )}

        {/* Lista de sesiones — pasa sesiones ya cargadas para evitar doble fetch */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4">Todas las sesiones</h2>
          <Historial busqueda={busqueda} sesionesExternas={sesiones} cargandoExterno={cargando} />
        </div>

      </main>
    </div>
  );
}
