import { useNavigate } from 'react-router-dom'
import {
  Volume2,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Mic,
  Eye
} from 'lucide-react'

import Card from '../components/card'
import Button from '../components/button'
import ScoreDisplay from '../components/scoredisplay'

function Dashboard() {
  const navigate = useNavigate()

  const analysisResult = JSON.parse(
    localStorage.getItem('analysisResult') || '{}'
  )

  const voz = analysisResult?.voz || {}
  const corporal = analysisResult?.corporal || {}
  const contactoVisual = corporal?.contactoVisual || 0
  const posturaScore = corporal?.posturaScore || 0

  const puntajeGeneral = Math.round(
    (voz?.score_voz || 0) * 0.6 +
    posturaScore * 0.2 +
    contactoVisual * 0.2
  )

  const insights = []

  if (puntajeGeneral >= 75) {
    insights.push('Tu comunicación es clara y bien estructurada.')
  } else {
    insights.push('Puedes mejorar la claridad general de tu discurso.')
  }

  if ((voz?.total_muletillas || 0) > 5) {
    insights.push('Estás usando muletillas con frecuencia.')
  }

  if (contactoVisual !== 'estable') {
    insights.push('Tu contacto visual puede mejorar.')
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-800">

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/')}>
            Volver
          </Button>

          <Button variant="outline" icon={RotateCcw} onClick={() => navigate('/camera')}>
            Nueva sesión
          </Button>
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-3xl p-10 shadow-lg mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} />
            <span className="text-sm opacity-90">AI Communication Coach</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Resultado de tu presentación
          </h1>

          <p className="text-blue-100 mb-6">
            Aquí tienes un análisis completo de tu desempeño en comunicación
          </p>

          <div className="flex items-center gap-8">
            <div className="relative">
              <ScoreDisplay score={puntajeGeneral} size="2xl" />
              
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-slate-500">
                Global
              </div>
            </div>

            <div className="text-sm text-blue-100 max-w-xs">
              Evaluación combinada de voz, postura y contacto visual
            </div>
          </div>

        </div>

        <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4">
          Indicadores clave
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <Volume2 size={16} />
              Voz
            </div>
            <div className="text-3xl font-bold">
              {voz?.score_voz || 0}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <Mic size={16} />
              Postura
            </div>
            <div className="text-3xl font-bold">{posturaScore}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <Eye size={16} />
              Contacto visual
            </div>
            <div className="text-3xl font-bold">
              {contactoVisual}%
            </div>
          </div>
        </div>

        <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4">
          Insights de IA
        </h2>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-10">
          <div className="flex flex-col gap-3">
            {insights.map((i, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50"
              >
                <Sparkles size={16} className="text-indigo-500 mt-1" />
                <p className="text-sm text-slate-700">{i}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-sm font-semibold mb-4">Muletillas detectadas</h2>

            {voz?.muletillas ? (
              Object.entries(voz.muletillas).map(([m, c], i) => (
                <div
                  key={i}
                  className="flex justify-between py-2 border-b border-slate-100 text-sm"
                >
                  <span>{m}</span>
                  <span className="text-red-500 font-semibold">{c}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Sin muletillas detectadas</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-sm font-semibold mb-4">Transcripción</h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              {voz?.transcripcion || 'Sin transcripción disponible'}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
