import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Volume2, AlertTriangle, ArrowLeft, RotateCcw, Lightbulb,
  Gauge, BookOpen, Mic2, Wind, Timer, BarChart3, Brain, Activity,
  TrendingDown, TrendingUp, Music2, ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { api } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import ScoreDisplay from "../components/ScoreDisplay";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function normalizarToken(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// ---------------------------------------------------------------------------
// TranscripcionResaltada
// ---------------------------------------------------------------------------
function TranscripcionResaltada({ texto, muletillas }) {
  if (!texto) return <p className="text-sm text-gray-500 italic">Sin transcripción</p>;

  const claves = Object.keys(muletillas || {})
    .map((k) => k.replace(/ \(repetición\)$/, "").trim())
    .filter((k) => k.length > 1);

  if (!claves.length) {
    return <p className="text-sm text-gray-700 leading-relaxed">{texto}</p>;
  }

  const simples = new Set(
    claves.filter((k) => !k.includes(" ")).map(normalizarToken)
  );
  const frases = claves
    .filter((k) => k.includes(" "))
    .map((k) => k.split(/\s+/).map(normalizarToken))
    .sort((a, b) => b.length - a.length);

  const tokens = [];
  const re = /\S+/g;
  let last = 0, m;
  while ((m = re.exec(texto)) !== null) {
    if (m.index > last) tokens.push({ type: "sep", text: texto.slice(last, m.index) });
    tokens.push({ type: "word", text: m[0] });
    last = m.index + m[0].length;
  }
  if (last < texto.length) tokens.push({ type: "sep", text: texto.slice(last) });

  const words = tokens.filter((t) => t.type === "word");
  const highlighted = new Set();

  words.forEach((t, i) => {
    if (simples.has(normalizarToken(t.text))) highlighted.add(i);
  });
  for (const frase of frases) {
    for (let i = 0; i <= words.length - frase.length; i++) {
      const ventana = words.slice(i, i + frase.length).map((t) => normalizarToken(t.text));
      if (ventana.every((w, j) => w === frase[j])) {
        for (let j = 0; j < frase.length; j++) highlighted.add(i + j);
      }
    }
  }

  let wi = 0;
  return (
    <p className="text-sm text-gray-700 leading-relaxed">
      {tokens.map((t, i) => {
        if (t.type === "sep") return <span key={i}>{t.text}</span>;
        const idx = wi++;
        return highlighted.has(idx) ? (
          <mark key={i} className="bg-red-100 text-red-700 font-semibold rounded px-0.5 not-italic">
            {t.text}
          </mark>
        ) : (
          <span key={i}>{t.text}</span>
        );
      })}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Radar Chart
// ---------------------------------------------------------------------------
function RadarScore({ radar }) {
  if (!radar) return null;
  const chartData = {
    labels: ["Voz", "Postura", "Contacto Visual", "Gestos", "Energía"],
    datasets: [{
      label: "Tu desempeño",
      data: [
        radar.voz ?? 0,
        radar.postura ?? 0,
        radar.contactoVisual ?? 0,
        radar.movimientoManos ?? 0,
        radar.energia ?? 0,
      ],
      backgroundColor: "rgba(37,99,235,0.18)",
      borderColor: "rgba(37,99,235,1)",
      borderWidth: 2,
      pointBackgroundColor: "rgba(37,99,235,1)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true, max: 100, min: 0,
        ticks: { stepSize: 20, color: "#64748b", font: { size: 10 } },
        pointLabels: { color: "#0f172a", font: { size: 11, weight: "500" } },
        grid: { color: "rgba(0,0,0,0.07)" },
        angleLines: { color: "rgba(0,0,0,0.07)" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a", padding: 10, cornerRadius: 8,
        callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}/100` },
      },
    },
  };
  return (
    <div className="w-full max-w-xs mx-auto">
      <Radar data={chartData} options={options} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini-card de métrica
// ---------------------------------------------------------------------------
function MetricaCard({ icon: Icon, color, label, value, sub }) {
  return (
    <Card className="flex flex-col justify-center p-3 sm:p-5 gap-1">
      <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1 ${color}`}>
        {Icon && <Icon size={13} />}
        <span className="truncate">{label}</span>
      </div>
      <p className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Ritmo por segmento — mini barra horizontal
// ---------------------------------------------------------------------------
function RitmoTimeline({ variacionRitmo }) {
  if (!variacionRitmo?.ritmo_por_segmento?.length) return null;
  const segs = variacionRitmo.ritmo_por_segmento;
  const maxPpm = Math.max(...segs.map((s) => s.ppm), 1);
  const promedio = variacionRitmo.ppm_promedio ?? 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Lento</span>
        <span>Promedio: {promedio} ppm</span>
        <span>Rápido</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {segs.map((s, i) => {
          const pct = Math.round((s.ppm / maxPpm) * 100);
          const color = s.alerta
            ? s.ppm > promedio
              ? "bg-red-400"
              : "bg-amber-400"
            : "bg-sky-400";
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 w-12 text-right flex-shrink-0">{s.inicio}s</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
              </div>
              <span className={`w-14 flex-shrink-0 font-semibold ${s.alerta ? "text-red-500" : "text-gray-600"}`}>
                {s.ppm} ppm
              </span>
            </div>
          );
        })}
      </div>
      {(variacionRitmo.segmento_mas_rapido || variacionRitmo.segmento_mas_lento) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {variacionRitmo.segmento_mas_rapido && (
            <div className="flex items-center gap-1.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-md px-2 py-1">
              <TrendingUp size={12} />
              <span>Más rápido: {variacionRitmo.segmento_mas_rapido.ppm} ppm · {variacionRitmo.segmento_mas_rapido.inicio}s</span>
            </div>
          )}
          {variacionRitmo.segmento_mas_lento && (
            <div className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-600 border border-amber-200 rounded-md px-2 py-1">
              <TrendingDown size={12} />
              <span>Más lento: {variacionRitmo.segmento_mas_lento.ppm} ppm · {variacionRitmo.segmento_mas_lento.inicio}s</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Densidad temporal de muletillas
// ---------------------------------------------------------------------------
function DensidadMuletillas({ densidad }) {
  if (!densidad) return null;
  const total = (densidad.inicio ?? 0) + (densidad.medio ?? 0) + (densidad.final ?? 0);
  if (total === 0) return <p className="text-sm text-gray-400">No se detectaron muletillas en ningún tercio.</p>;

  const tercios = [
    { key: "inicio", label: "Inicio", value: densidad.inicio ?? 0, color: "bg-sky-400" },
    { key: "medio",  label: "Medio",  value: densidad.medio  ?? 0, color: "bg-violet-400" },
    { key: "final",  label: "Final",  value: densidad.final  ?? 0, color: "bg-rose-400" },
  ];
  const CRITICO_LABEL = {
    inicio: "al principio del discurso",
    medio:  "en la parte central",
    final:  "al final del discurso",
  };

  return (
    <div className="flex flex-col gap-3">
      {densidad.tercio_critico && (
        <p className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-md px-3 py-2">
          Las muletillas se concentran <strong>{CRITICO_LABEL[densidad.tercio_critico]}</strong>.
        </p>
      )}
      <div className="flex gap-2">
        {tercios.map(({ key, label, value, color }) => {
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          const esCritico = densidad.tercio_critico === key;
          return (
            <div key={key} className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-lg ${esCritico ? "bg-orange-50 border border-orange-200" : "bg-gray-50"}`}>
              <span className="text-xs font-semibold text-gray-600">{label}</span>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
              </div>
              <span className={`text-xl font-bold ${esCritico ? "text-orange-600" : "text-gray-700"}`}>{value}</span>
              <span className="text-xs text-gray-400">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Prosodia card
// ---------------------------------------------------------------------------
const MONOTONIA_META = {
  muy_monotono:  { label: "Muy monótono",   color: "text-red-500",     bg: "bg-red-50",     border: "border-red-200",    tip: "Tu voz apenas varía de tono. Practica modular la entonación para captar la atención." },
  poco_variado:  { label: "Poco variado",   color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",  tip: "Hay algo de variación pero puede mejorar. Sube el tono en ideas clave." },
  adecuado:      { label: "Adecuado",       color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200",tip: "Buena variación de entonación. Tu voz es expresiva y mantiene el interés." },
  muy_expresivo: { label: "Muy expresivo",  color: "text-sky-600",     bg: "bg-sky-50",     border: "border-sky-200",    tip: "Excelente rango tonal. Asegúrate de que la variación sea natural, no exagerada." },
  sin_datos:     { label: "Sin datos",      color: "text-gray-400",    bg: "bg-gray-50",    border: "border-gray-200",   tip: "" },
};

const TENDENCIA_META = {
  ascendente:  { label: "Ascendente",  icon: ArrowUpRight,   color: "text-emerald-600", tip: "Tu energía aumenta hacia el final — buen cierre." },
  descendente: { label: "Descendente", icon: ArrowDownRight, color: "text-amber-600",   tip: "Tu voz se apaga al final. Refuerza el cierre con más energía." },
  estable:     { label: "Estable",     icon: Minus,          color: "text-sky-600",     tip: "Tono estable a lo largo del discurso." },
  sin_datos:   { label: "Sin datos",   icon: Minus,          color: "text-gray-400",    tip: "" },
};

function ProsodiCard({ prosodia }) {
  if (!prosodia) return null;

  if (!prosodia.disponible) {
    return (
      <Card title="Prosodia / Entonación">
        <p className="text-sm text-gray-400 italic">
          {prosodia.error?.includes("corta")
            ? "Grabación demasiado corta para analizar entonación."
            : "No se pudo analizar la prosodia en esta sesión."}
        </p>
      </Card>
    );
  }

  if (prosodia.nivel_monotonia === "sin_datos") {
    return (
      <Card title="Prosodia / Entonación">
        <p className="text-sm text-gray-400 italic">No se detectó suficiente voz activa para analizar el tono.</p>
      </Card>
    );
  }

  const mono  = MONOTONIA_META[prosodia.nivel_monotonia] ?? MONOTONIA_META.sin_datos;
  const tend  = TENDENCIA_META[prosodia.tendencia_tonal]   ?? TENDENCIA_META.sin_datos;
  const TendIcon = tend.icon;
  const score = prosodia.score_prosodia ?? 0;

  // Mini arco SVG de score
  const RADIO = 36, CIRCUNF = 2 * Math.PI * RADIO;
  const scoreColor = score >= 80 ? "#22c55e" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <Card title="Prosodia / Entonación">
      <div className="flex flex-col gap-5">

        {/* Score + stats principales */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Arco de score */}
          <div className="relative flex-shrink-0">
            <svg width="88" height="88" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r={RADIO} fill="none" stroke="#e5e7eb" strokeWidth="7" />
              <circle
                cx="44" cy="44" r={RADIO} fill="none"
                stroke={scoreColor} strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * CIRCUNF} ${CIRCUNF}`}
                transform="rotate(-90 44 44)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-gray-900">{score}</span>
              <span className="text-xs text-gray-400">/100</span>
            </div>
          </div>

          {/* Métricas numéricas */}
          <div className="flex flex-col gap-2 flex-1 w-full">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-gray-500">Tono promedio</span>
              <span className="text-sm font-bold text-gray-800 flex-shrink-0">{prosodia.tono_promedio_hz} Hz</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-gray-500">Variación pitch</span>
              <span className="text-sm font-bold text-gray-800 flex-shrink-0">{prosodia.variacion_semitonos} st</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-gray-500">Voz activa</span>
              <span className="text-sm font-bold text-gray-800 flex-shrink-0">{prosodia.porcentaje_voz_activa}%</span>
            </div>
            {prosodia.energia_variacion != null && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs text-gray-500">Variación energía</span>
                <span className={`text-sm font-bold flex-shrink-0 ${
                  prosodia.energia_variacion >= 50 ? "text-emerald-600"
                  : prosodia.energia_variacion >= 25 ? "text-amber-600"
                  : "text-red-500"
                }`}>{prosodia.energia_variacion}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Nivel de monotonía */}
        <div className={`flex gap-3 p-3 rounded-lg border ${mono.bg} ${mono.border}`}>
          <Music2 size={15} className={`${mono.color} mt-0.5 flex-shrink-0`} />
          <div>
            <p className={`text-xs font-bold uppercase tracking-wide ${mono.color}`}>{mono.label}</p>
            {mono.tip && <p className="text-xs text-gray-600 mt-0.5">{mono.tip}</p>}
          </div>
        </div>

        {/* Tendencia tonal */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <TendIcon size={15} className={tend.color} />
            <span className={`text-xs font-semibold ${tend.color}`}>Tendencia: {tend.label}</span>
          </div>
          {tend.tip && <p className="text-xs text-gray-400 pl-5">{tend.tip}</p>}
        </div>

      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Colores / labels helpers
// ---------------------------------------------------------------------------
const VOC_COLOR = { rico: "text-emerald-600", variado: "text-sky-600", basico: "text-amber-600", repetitivo: "text-red-500", sin_datos: "text-gray-400" };
const VOC_LABEL = { rico: "Rico", variado: "Variado", basico: "Básico", repetitivo: "Repetitivo", sin_datos: "—" };
const RITMO_COLOR = { adecuado: "text-emerald-600", lento: "text-amber-600", rapido: "text-orange-500", sin_datos: "text-gray-400" };
const RITMO_LABEL = { adecuado: "Adecuado", lento: "Lento", rapido: "Rápido", sin_datos: "—" };
const CONFIANZA_COLOR = { seguro: "text-emerald-600", levemente_inseguro: "text-amber-500", inseguro: "text-orange-500", muy_inseguro: "text-red-500", sin_datos: "text-gray-400" };
const CONFIANZA_LABEL = { seguro: "Seguro", levemente_inseguro: "Lev. inseguro", inseguro: "Inseguro", muy_inseguro: "Muy inseguro", sin_datos: "—" };

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
function Dashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSessions, setHasSessions] = useState(false);

  useEffect(() => {

    if (id) {

      setLoading(true);

      api.sesiones
        .get(id)
        .then(({ sesion }) => {

          const analisis = sesion?.analisis;

          if (analisis && Object.keys(analisis).length > 0) {
            setAnalysisResult(analisis);
          } else {
            setAnalysisResult(null);
          }

        })
        .catch((err) => {
          console.error("Error cargando sesión:", err);
          setAnalysisResult(null);
        })
        .finally(() => setLoading(false));


    } else {


      api.sesiones
        .list()
        .then(({ sesiones }) => {


          if (sesiones && sesiones.length > 0) {

            setHasSessions(true);


            const ultimaSesion = sesiones[0];


            if (
              ultimaSesion.analisis &&
              Object.keys(ultimaSesion.analisis).length > 0
            ) {

              setAnalysisResult(ultimaSesion.analisis);

            } else {

              setAnalysisResult(null);

            }


          } else {


            setHasSessions(false);
            setAnalysisResult(null);


          }


        })
        .catch((err)=>{

          console.error(
            "Error obteniendo sesiones:",
            err
          );

          setAnalysisResult(null);

        })
        .finally(()=>{

          setLoading(false);

        });

    }


  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analysisResult) {
  return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-5">


        <div className="bg-blue-100 p-6 rounded-full">
          <Mic2 size={50} className="text-blue-600"/>
        </div>


        <h1 className="text-2xl font-bold text-gray-800">
          ¡Bienvenido a tu Dashboard!
        </h1>


        <p className="text-gray-500 max-w-md">
          Todavía no tienes una sesión evaluada.
          Graba tu primera presentación para obtener
          análisis de voz, postura, contacto visual
          y recomendaciones personalizadas.
        </p>


        <Button
          onClick={() => navigate("/camera")}
          icon={Mic2}
        >
          Grabar mi primera sesión
        </Button>


      </div>
    );
  }

  const voz      = analysisResult?.voz      || {};
  const corporal = analysisResult?.corporal  || {};
  const radar    = analysisResult?.radar     || null;

  // Métricas de voz base
  const scoreVoz        = voz?.score_voz              ?? 0;
  const totalPalabras   = voz?.total_palabras          ?? 0;
  const totalMuletillas = voz?.total_muletillas        ?? 0;
  const ppm             = voz?.palabras_por_minuto     ?? 0;
  const ritmoHabla      = voz?.ritmo_habla             ?? "sin_datos";
  const totalPausas     = voz?.total_pausas_largas     ?? 0;
  const duracionSeg     = voz?.duracion_segundos       ?? 0;

  // Métricas nuevas — medio esfuerzo
  const vocabulario     = voz?.vocabulario             || {};
  const hablaEfectiva   = voz?.habla_efectiva          || {};
  const claridadObj     = voz?.claridad_palabras       || {};
  const totalOraciones  = voz?.total_oraciones_largas  ?? 0;
  const oracionesLargas = voz?.oraciones_largas        ?? [];
  const ttr             = vocabulario?.ttr             ?? null;
  const nivelVoc        = vocabulario?.nivel_vocabulario ?? "sin_datos";
  const pctHabla        = hablaEfectiva?.porcentaje_habla ?? null;
  const pctClaridad     = claridadObj?.porcentaje_claridad ?? null;

  // Prosodia
  const prosodia = voz?.prosodia || null;

  // Métricas nuevas — difícil
  const lenguajeIndeciso  = voz?.lenguaje_indeciso   || {};
  const variacionRitmo    = voz?.variacion_ritmo      || null;
  const densidadMuletillas = voz?.densidad_muletillas || null;

  const nivelConfianza  = lenguajeIndeciso?.nivel_confianza  ?? "sin_datos";
  const totalIndeciso   = lenguajeIndeciso?.total_expresiones ?? 0;
  const frasesInseguras = lenguajeIndeciso?.frases_inseguras  ?? {};
  const variacionScore  = variacionRitmo?.variacion_score     ?? null;

  // Corporal
  const posturaScore     = corporal?.porcentajeBuenaPostura      ?? 0;
  const contactoVisual   = corporal?.porcentajeContactoVisual    ?? 0;
  const movimientoScore  = corporal?.movimientoScore             ?? 0;
  const frames          = corporal?.frames                      ?? 0;
  const recomCorporales = corporal?.recomendacionesCorporales   ?? [];
  const eventosCorp     = corporal?.eventos                     ?? [];

  // Puntaje general (desde radar si existe, sino solo voz)
  const puntajeGeneral = radar
    ? Math.round(
        (radar.voz ?? 0)             * 0.40 +
        (radar.postura ?? 0)         * 0.20 +
        (radar.contactoVisual ?? 0)  * 0.20 +
        (radar.energia ?? 0)         * 0.10 +
        (radar.movimientoManos ?? 0) * 0.10
      )
    : Math.round(scoreVoz);

  const durMin   = Math.floor(duracionSeg / 60);
  const durSec   = Math.round(duracionSeg % 60);
  const durLabel = durMin > 0 ? `${durMin}m ${durSec}s` : `${durSec}s`;

  const claridadColor = pctClaridad === null ? "text-gray-400" : pctClaridad >= 80 ? "text-emerald-600" : pctClaridad >= 60 ? "text-amber-600" : "text-red-500";
  const hablaColor    = pctHabla === null    ? "text-gray-400" : pctHabla >= 70    ? "text-emerald-600" : pctHabla >= 40    ? "text-amber-600" : "text-red-500";

  return (
    <div className="flex flex-col gap-5 sm:gap-8 p-3 sm:p-6">

      {/* ── Encabezado ── */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate("/historial")}>
          <span className="hidden sm:inline">Volver</span>
        </Button>
        <h1 className="text-base sm:text-xl font-semibold text-gray-900 text-center flex-1 truncate px-2">
          Resultados del Análisis
        </h1>
        <Button variant="outline" icon={RotateCcw} onClick={() => navigate("/camera")}>
          <span className="hidden sm:inline">Nueva Sesión</span>
        </Button>
      </div>

      {/* ── Fila 0: Score global + Radar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="flex flex-col items-center justify-center p-5 sm:p-8 gap-3 sm:gap-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Puntaje Global</p>
          <ScoreDisplay score={puntajeGeneral} size="lg" />
          <p className="text-xs text-gray-400 text-center max-w-xs">
            Combina voz (40%), postura (20%), contacto visual (20%), energía (10%) y gestos (10%)
          </p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-3 sm:p-4 gap-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Perfil de Competencias</p>
          <RadarScore radar={radar} />
          {!radar && (
            <p className="text-xs text-gray-400 text-center">
              Graba una nueva sesión para ver el perfil completo.
            </p>
          )}
        </Card>
      </div>

      {/* ── Fila 1: Métricas base de voz ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="flex flex-col items-center justify-center p-3 sm:p-6 gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-blue-600">
            <Volume2 size={16} />
            <h2 className="text-xs font-semibold uppercase tracking-wide">Score Voz</h2>
          </div>
          <ScoreDisplay score={scoreVoz} size="md" />
        </Card>
        <MetricaCard icon={Mic2} color="text-gray-700" label="Palabras" value={totalPalabras} sub="Total detectadas" />
        <MetricaCard icon={AlertTriangle} color="text-red-500" label="Muletillas" value={totalMuletillas} sub="Repetitivas" />
        <MetricaCard icon={Gauge} color={RITMO_COLOR[ritmoHabla] ?? "text-gray-700"} label="Velocidad" value={ppm > 0 ? `${ppm}` : "—"} sub={`ppm · ${RITMO_LABEL[ritmoHabla] ?? "—"}`} />
      </div>

      {/* ── Fila 2: Nuevas métricas de voz ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-5 flex flex-col justify-center gap-1">
          <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1 ${hablaColor}`}>
            <Wind size={13} /> Habla efectiva
          </div>
          <p className={`text-2xl sm:text-3xl font-bold ${hablaColor}`}>{pctHabla !== null ? `${pctHabla}%` : "—"}</p>
          <p className="text-xs text-gray-400 truncate">
            {hablaEfectiva.segundos_habla != null
              ? `${hablaEfectiva.segundos_habla}s habla · ${hablaEfectiva.segundos_silencio}s silencio`
              : "Habla vs. silencio"}
          </p>
        </Card>

        <Card className="p-3 sm:p-5 flex flex-col justify-center gap-1">
          <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1 ${VOC_COLOR[nivelVoc]}`}>
            <BookOpen size={13} /> Vocabulario
          </div>
          <p className={`text-2xl sm:text-3xl font-bold ${VOC_COLOR[nivelVoc]}`}>{ttr !== null ? `${ttr}%` : "—"}</p>
          <p className="text-xs text-gray-400 truncate">TTR · {VOC_LABEL[nivelVoc]}{vocabulario.palabras_unicas != null ? ` · ${vocabulario.palabras_unicas} únicas` : ""}</p>
        </Card>

        <Card className="p-3 sm:p-5 flex flex-col justify-center gap-1">
          <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1 ${claridadColor}`}>
            <BarChart3 size={13} /> Claridad
          </div>
          <p className={`text-2xl sm:text-3xl font-bold ${claridadColor}`}>{pctClaridad !== null ? `${pctClaridad}%` : "—"}</p>
          <p className="text-xs text-gray-400 truncate">
            {claridadObj.palabras_analizadas ? `${claridadObj.palabras_analizadas} palabras` : "Confianza Whisper"}
          </p>
        </Card>

        <Card className="p-3 sm:p-5 flex flex-col justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <Timer size={13} /> Sesión
          </div>
          <div className="flex flex-col gap-1 sm:gap-1.5">
            {[
              ["Duración", durLabel, false],
              ["Pausas largas", totalPausas, totalPausas > 3],
              ["Sin respirar", totalOraciones, totalOraciones > 0],
              ["Frames", frames, false],
            ].map(([label, value, warn]) => (
              <div key={label} className="flex justify-between items-center gap-1">
                <span className="text-xs text-gray-500 truncate">{label}</span>
                <span className={`text-xs sm:text-sm font-bold flex-shrink-0 ${warn ? "text-red-500" : "text-gray-800"}`}>{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Fila 3: Prosodia ── */}
      {prosodia && <ProsodiCard prosodia={prosodia} />}

      {/* ── Fila 4: Lenguaje indeciso + Variación de ritmo ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        {/* Lenguaje de inseguridad */}
        <Card title="Lenguaje de Inseguridad">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain size={16} className={CONFIANZA_COLOR[nivelConfianza] ?? "text-gray-500"} />
                <span className={`text-sm font-bold ${CONFIANZA_COLOR[nivelConfianza] ?? "text-gray-500"}`}>
                  {CONFIANZA_LABEL[nivelConfianza] ?? "—"}
                </span>
              </div>
              {totalIndeciso > 0 && (
                <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">
                  {totalIndeciso} expresión{totalIndeciso > 1 ? "es" : ""}
                </span>
              )}
            </div>

            {nivelConfianza === "seguro" || nivelConfianza === "sin_datos" ? (
              <p className="text-sm text-gray-400 italic">
                {nivelConfianza === "seguro"
                  ? "Excelente: no se detectaron expresiones de duda. Tu discurso suena seguro y directo."
                  : "No hay datos suficientes."}
              </p>
            ) : (
              <>
                <p className="text-xs text-gray-500">
                  Estas expresiones debilitan tu autoridad como orador. Sustitúyelas por afirmaciones directas.
                </p>
                <ul className="flex flex-col gap-2">
                  {Object.entries(frasesInseguras).map(([frase, count]) => (
                    <li key={frase} className="flex justify-between items-center px-3 py-2 bg-orange-50 border border-orange-100 rounded-md">
                      <span className="text-sm font-medium text-orange-800 italic">"{frase}"</span>
                      <span className="text-xs font-bold text-orange-600 bg-orange-100 rounded-full px-2 py-0.5">{count}×</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Card>

        {/* Variación de ritmo */}
        <Card title="Variación del Ritmo">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} className={variacionScore === null ? "text-gray-400" : variacionScore >= 80 ? "text-emerald-500" : variacionScore >= 60 ? "text-amber-500" : "text-red-500"} />
                <span className={`text-sm font-bold ${variacionScore === null ? "text-gray-400" : variacionScore >= 80 ? "text-emerald-600" : variacionScore >= 60 ? "text-amber-600" : "text-red-500"}`}>
                  {variacionScore !== null ? `Score: ${variacionScore}/100` : "Sin datos"}
                </span>
              </div>
              {variacionRitmo?.variacion_ppm > 0 && (
                <span className="text-xs text-gray-400">
                  Variación: ±{variacionRitmo.variacion_ppm} ppm
                </span>
              )}
            </div>

            {variacionRitmo?.variacion_ppm === 0 || !variacionRitmo ? (
              <p className="text-sm text-gray-400 italic">
                Grabación demasiado corta para analizar variación de ritmo.
              </p>
            ) : (
              <RitmoTimeline variacionRitmo={variacionRitmo} />
            )}
          </div>
        </Card>

      </div>

      {/* ── Fila 4: Muletillas + Transcripción ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        <div className="flex flex-col gap-4">
          <Card title="Muletillas Detectadas">
            {voz?.muletillas && Object.keys(voz.muletillas).length > 0 ? (
              <ul className="flex flex-col gap-3">
                {Object.entries(voz.muletillas)
                  .sort(([, a], [, b]) => b - a)
                  .map(([muletilla, cantidad], i) => {
                    const esRep = muletilla.includes("(repetición)");
                    return (
                      <li key={i} className={`flex gap-3 p-3 rounded-md border-l-4 ${esRep ? "bg-orange-50 border-orange-400" : "bg-red-50 border-red-500"}`}>
                        <AlertTriangle className={esRep ? "text-orange-400 mt-0.5" : "text-red-500 mt-0.5"} size={15} />
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-xs font-bold uppercase ${esRep ? "text-orange-600" : "text-red-600"}`}>{muletilla}</span>
                          <p className="text-sm text-gray-700">Repetida <strong>{cantidad}</strong> veces</p>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-8">No se detectaron muletillas</p>
            )}
          </Card>

          {/* Densidad temporal */}
          {densidadMuletillas && (densidadMuletillas.inicio + densidadMuletillas.medio + densidadMuletillas.final) > 0 && (
            <Card title="¿Cuándo aparecen más?">
              <DensidadMuletillas densidad={densidadMuletillas} />
            </Card>
          )}
        </div>

        <Card title="Transcripción">
          <div className="flex flex-col gap-3">
            {Object.keys(voz?.muletillas || {}).length > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <mark className="bg-red-100 text-red-700 rounded px-1 not-italic font-semibold">así</mark>
                se resaltan las muletillas en el texto
              </div>
            )}
            <div className="p-3 bg-purple-50 rounded-md border-l-4 border-purple-500">
              <TranscripcionResaltada texto={voz?.transcripcion} muletillas={voz?.muletillas} />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Oraciones largas ── */}
      {oracionesLargas.length > 0 && (
        <Card title="Oraciones sin respirar">
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-500">
              Fragmentos de más de 12 segundos continuos sin pausa — indican habla precipitada o falta de respiración.
            </p>
            <ul className="flex flex-col gap-2">
              {oracionesLargas.map((o, i) => (
                <li key={i} className="flex gap-3 p-3 bg-orange-50 border-l-4 border-orange-400 rounded-md">
                  <Wind className="text-orange-400 mt-0.5 flex-shrink-0" size={15} />
                  <div>
                    <span className="text-xs font-bold text-orange-600">{o.duracion}s · [{o.inicio}s → {o.fin}s]</span>
                    {o.texto_preview && <p className="text-sm text-gray-700 mt-0.5">«{o.texto_preview}…»</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* ── Feedback IA ── */}
      {(voz?.feedback || voz?.recomendaciones?.length > 0) && (
        <Card title="Feedback IA">
          <div className="flex flex-col gap-4">
            {voz?.feedback && (
              <div className="p-4 bg-blue-50 rounded-md border-l-4 border-blue-500">
                <p className="text-sm text-gray-700 leading-relaxed">{voz.feedback}</p>
                {voz?.fuente_feedback && <p className="text-xs text-gray-400 mt-2">Fuente: {voz.fuente_feedback}</p>}
              </div>
            )}
            {voz?.recomendaciones?.length > 0 && (
              <ul className="flex flex-col gap-2">
                {voz.recomendaciones.map((r, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700">
                    <Lightbulb size={15} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      )}

      {/* ── Análisis Corporal ── */}
      <Card title="Análisis Corporal">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ["Buena postura",       corporal?.porcentajeBuenaPostura      ?? 0],
            ["Brazos abiertos",     corporal?.porcentajeBrazosAbiertos    ?? 0],
            ["Brazos cruzados",     corporal?.porcentajeBrazosCruzados    ?? 0],
            ["Actividad gestual",   corporal?.actividadGestual            ?? 0],
            ["Manos visibles",      corporal?.porcentajeManosVisibles     ?? 0],
            ["Torso de lado",       corporal?.porcentajeTorsoDeLado       ?? 0],
            ["Inclinación lateral", corporal?.porcentajeInclinacionLateral ?? 0],
            ["Rigidez de brazos",   corporal?.porcentajeRigidezBrazos     ?? 0],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-bold text-slate-800">{value}%</p>
            </div>
          ))}
        </div>

        {recomCorporales.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Recomendaciones corporales</h3>
            <ul className="flex flex-col gap-2">
              {recomCorporales.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600">
                  <Lightbulb size={15} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {eventosCorp.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Eventos relevantes</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {eventosCorp.slice(-8).map((evento, i) => (
                <li key={i} className="text-xs text-slate-600 bg-amber-50 border border-amber-100 rounded-md p-3">
                  {evento.tipo?.replaceAll("_", " ")}: segundo {evento.segundo}, durante {evento.duracion_segundos}s
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

    </div>
  );
}

export default Dashboard;
