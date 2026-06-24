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

  console.log('DATA DASHBOARD:', analysisResult)

  const puntajeGeneral = voz?.score_voz || 0
  const posturaScore = corporal?.posturaScore || 0
  const contactoVisual = corporal?.contactoVisual || 0
  const frames = corporal?.frames || 0

  return (
    <div className="flex flex-col gap-8 p-6">

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

        </div>

        {/* BLOQUE CORPORAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="p-6 flex flex-col items-center">
            <h2 className="text-sm text-gray-500">
              Postura
            </h2>

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

              </div>

            </div>

          </Card>

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

    </div>
  )
}

export default Dashboard
