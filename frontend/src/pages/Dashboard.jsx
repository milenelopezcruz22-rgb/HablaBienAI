import { useNavigate } from 'react-router-dom'
import {
  Volume2,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  Lightbulb
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

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={() => navigate('/')}
        >
          Volver
        </Button>

        <h1 className="text-xl font-semibold text-gray-900 text-center w-full md:w-auto">
          Resultados del Análisis
        </h1>

        <Button
          variant="outline"
          icon={RotateCcw}
          onClick={() => navigate('/camera')}
        >
          Nueva Sesión
        </Button>

      </div>

      <div className="flex flex-col gap-8">

        {/* TARJETAS SUPERIORES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* SCORE */}
          <Card className="flex flex-col items-center justify-center p-8 gap-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Volume2 size={22} />

              <h2 className="text-sm font-semibold uppercase tracking-wide">
                Calidad de Voz
              </h2>
            </div>

            <ScoreDisplay score={puntajeGeneral} size="lg" />

            <p className="text-sm text-gray-500 text-center">
              Puntaje calculado automáticamente por IA
            </p>
          </Card>

          {/* PALABRAS */}
          <Card className="flex flex-col justify-center p-6">
            <p className="text-sm text-gray-500 mb-2">
              Total de palabras
            </p>

            <h2 className="text-4xl font-bold text-gray-900">
              {voz?.total_palabras || 0}
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Detectadas en la grabación
            </p>
          </Card>

          {/* MULETILLAS */}
          <Card className="flex flex-col justify-center p-6">
            <p className="text-sm text-gray-500 mb-2">
              Muletillas detectadas
            </p>

            <h2 className="text-4xl font-bold text-red-500">
              {voz?.total_muletillas || 0}
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Expresiones repetitivas encontradas
            </p>
          </Card>

          <Button variant="outline" icon={RotateCcw} onClick={() => navigate('/camera')}>
            Nueva sesión
          </Button>
        </div>

        {/* BLOQUE CORPORAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <h1 className="text-3xl font-bold mb-2">
            Resultado de tu presentación
          </h1>

            <ScoreDisplay score={posturaScore} size="lg" />
          </Card>

          <Card className="p-6 flex flex-col items-center">
            <h2 className="text-sm text-gray-500">
              Contacto Visual
            </h2>

            <ScoreDisplay score={contactoVisual} size="lg" />
          </Card>

          <Card className="p-6 flex flex-col items-center">
            <h2 className="text-sm text-gray-500">
              Frames Analizados
            </h2>

            <h2 className="text-3xl font-bold">
              {frames}
            </h2>
          </Card>

        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* MULETILLAS */}
          <Card title="Muletillas Detectadas">

            {voz?.muletillas &&
            Object.keys(voz.muletillas).length > 0 ? (

              <ul className="flex flex-col gap-4">

                {Object.entries(voz.muletillas).map(
                  ([muletilla, cantidad], i) => (

                    <li
                      key={i}
                      className="flex gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-md"
                    >

                      <AlertTriangle
                        className="text-red-500 mt-1"
                        size={16}
                      />

                      <div className="flex flex-col gap-1">

                        <span className="text-xs font-bold text-red-600 uppercase">
                          {muletilla}
                        </span>

                        <p className="text-sm text-gray-900">
                          Repetida {cantidad} veces
                        </p>

                      </div>

                    </li>
                  )
                )}

              </ul>

            ) : (

              <p className="text-center text-gray-500 py-8">
                No se detectaron muletillas
              </p>

            )}

          </Card>

          {/* TRANSCRIPCIÓN */}
          <Card title="Transcripción">

            <div className="flex flex-col gap-4">

              <div className="p-3 bg-purple-50 rounded-md border-l-4 border-purple-500">

                <p className="text-sm text-gray-900">
                  <strong>Transcripción:</strong>
                </p>

                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  {voz?.transcripcion || 'Sin transcripción'}
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

        {(voz?.feedback || voz?.recomendaciones?.length > 0) && (
          <Card title="Feedback IA">
            <div className="flex flex-col gap-4">
              {voz?.feedback && (
                <div className="p-4 bg-blue-50 rounded-md border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {voz.feedback}
                  </p>
                  {voz?.fuente_feedback && (
                    <p className="text-xs text-gray-400 mt-3">
                      Fuente: {voz.fuente_feedback}
                    </p>
                  )}
                </div>
              )}

              {voz?.recomendaciones?.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {voz.recomendaciones.map((recomendacion, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm text-gray-700"
                    >
                      <Lightbulb
                        size={16}
                        className="text-yellow-500 mt-0.5 flex-shrink-0"
                      />
                      <span>{recomendacion}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        )}

      </div>

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
