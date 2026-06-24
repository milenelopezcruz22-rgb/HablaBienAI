import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Volume2,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  Lightbulb
} from "lucide-react";
import { api } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import ScoreDisplay from "../components/ScoreDisplay";

function Dashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.sesiones.get(id)
        .then(({ sesion }) => {
          const data = sesion.analisis || {};
          setAnalysisResult(data);
        })
        .catch(() => {
          const local = JSON.parse(localStorage.getItem("analysisResult") || "{}");
          setAnalysisResult(Object.keys(local).length ? local : null);
        })
        .finally(() => setLoading(false));
    } else {
      const local = JSON.parse(localStorage.getItem("analysisResult") || "{}");
      setAnalysisResult(Object.keys(local).length ? local : null);
      setLoading(false);
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500">No hay resultados de analisis</p>
        <Button onClick={() => navigate("/camera")} icon={RotateCcw}>
          Nueva Sesion
        </Button>
      </div>
    );
  }

  const voz = analysisResult?.voz || {};
  const corporal = analysisResult?.corporal || {};

  const puntajeGeneral = voz?.score_voz || 0;
  const posturaScore = corporal?.porcentajeBuenaPostura ?? corporal?.posturaScore ?? 0;
  const contactoVisual = corporal?.porcentajeContactoVisual ?? corporal?.contactoVisual ?? 0;
  const movimientoScore = corporal?.movimientoScore ?? 0;
  const frames = corporal?.frames || 0;
  const recomendacionesCorporales = corporal?.recomendacionesCorporales || [];
  const eventosCorporales = corporal?.eventos || [];

  return (
    <div className="flex flex-col gap-8 p-6">

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate("/historial")}>
          Volver
        </Button>
        <h1 className="text-xl font-semibold text-gray-900 text-center w-full md:w-auto">
          Resultados del Analisis
        </h1>
        <Button variant="outline" icon={RotateCcw} onClick={() => navigate("/camera")}>
          Nueva Sesion
        </Button>
      </div>

      <div className="flex flex-col gap-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <Card className="flex flex-col items-center justify-center p-8 gap-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Volume2 size={22} />
              <h2 className="text-sm font-semibold uppercase tracking-wide">
                Calidad de Voz
              </h2>
            </div>
            <ScoreDisplay score={puntajeGeneral} size="lg" />
            <p className="text-sm text-gray-500 text-center">
              Puntaje calculado automaticamente por IA
            </p>
          </Card>

          <Card className="flex flex-col justify-center p-6">
            <p className="text-sm text-gray-500 mb-2">Total de palabras</p>
            <h2 className="text-4xl font-bold text-gray-900">
              {voz?.total_palabras || 0}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Detectadas en la grabacion
            </p>
          </Card>

          <Card className="flex flex-col justify-center p-6">
            <p className="text-sm text-gray-500 mb-2">Muletillas detectadas</p>
            <h2 className="text-4xl font-bold text-red-500">
              {voz?.total_muletillas || 0}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Expresiones repetitivas encontradas
            </p>
          </Card>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col items-center">
            <h2 className="text-sm text-gray-500">Postura</h2>
            <ScoreDisplay score={posturaScore} size="lg" />
          </Card>
          <Card className="p-6 flex flex-col items-center">
            <h2 className="text-sm text-gray-500">Contacto Visual</h2>
            <ScoreDisplay score={contactoVisual} size="lg" />
          </Card>
          <Card className="p-6 flex flex-col items-center">
            <h2 className="text-sm text-gray-500">Estabilidad Corporal</h2>
            <ScoreDisplay score={movimientoScore} size="lg" />
          </Card>
          <Card className="p-6 flex flex-col items-center">
            <h2 className="text-sm text-gray-500">Frames Analizados</h2>
            <h2 className="text-3xl font-bold">{frames}</h2>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Card title="Muletillas Detectadas">
            {voz?.muletillas && Object.keys(voz.muletillas).length > 0 ? (
              <ul className="flex flex-col gap-4">
                {Object.entries(voz.muletillas).map(([muletilla, cantidad], i) => (
                  <li key={i} className="flex gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                    <AlertTriangle className="text-red-500 mt-1" size={16} />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-red-600 uppercase">{muletilla}</span>
                      <p className="text-sm text-gray-900">Repetida {cantidad} veces</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-8">No se detectaron muletillas</p>
            )}
          </Card>

          <Card title="Transcripcion">
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-purple-50 rounded-md border-l-4 border-purple-500">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {voz?.transcripcion || "Sin transcripcion"}
                </p>
              </div>
            </div>
          </Card>

        </div>

        {(voz?.feedback || voz?.recomendaciones?.length > 0) && (
          <Card title="Feedback IA">
            <div className="flex flex-col gap-4">
              {voz?.feedback && (
                <div className="p-4 bg-blue-50 rounded-md border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 leading-relaxed">{voz.feedback}</p>
                  {voz?.fuente_feedback && (
                    <p className="text-xs text-gray-400 mt-3">Fuente: {voz.fuente_feedback}</p>
                  )}
                </div>
              )}
              {voz?.recomendaciones?.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {voz.recomendaciones.map((r, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700">
                      <Lightbulb size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        )}

        <Card title="Analisis Corporal">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ["Buena postura", corporal?.porcentajeBuenaPostura ?? 0],
              ["Brazos abiertos", corporal?.porcentajeBrazosAbiertos ?? 0],
              ["Brazos cruzados", corporal?.porcentajeBrazosCruzados ?? 0],
              ["Actividad gestual", corporal?.actividadGestual ?? 0],
              ["Manos visibles", corporal?.porcentajeManosVisibles ?? 0],
              ["Torso de lado", corporal?.porcentajeTorsoDeLado ?? 0],
              ["Inclinacion lateral", corporal?.porcentajeInclinacionLateral ?? 0],
              ["Rigidez de brazos", corporal?.porcentajeRigidezBrazos ?? 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-xl font-bold text-slate-800">{value}%</p>
              </div>
            ))}
          </div>

          {recomendacionesCorporales.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Recomendaciones corporales</h3>
              <ul className="flex flex-col gap-2">
                {recomendacionesCorporales.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <Lightbulb size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {eventosCorporales.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Eventos relevantes</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {eventosCorporales.slice(-8).map((evento, i) => (
                  <li key={i} className="text-xs text-slate-600 bg-amber-50 border border-amber-100 rounded-md p-3">
                    {evento.tipo.replaceAll("_", " ")}: segundo {evento.segundo}, durante {evento.duracion_segundos}s
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

      </div>

    </div>
  );
}

export default Dashboard;
