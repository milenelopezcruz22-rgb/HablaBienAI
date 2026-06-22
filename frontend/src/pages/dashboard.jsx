import { useNavigate } from 'react-router-dom'
import {
  Volume2,
  AlertTriangle,
  ArrowLeft,
  RotateCcw
} from 'lucide-react'

import Card from '../components/Card'
import Button from '../components/Button'
import ScoreDisplay from '../components/ScoreDisplay'

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

      <div className="flex flex-wrap items-center justify-between gap-4">
        
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={() => navigate('/')}
        >
          Volver
        </Button>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 text-center shadow-md">
          <h1 className="text-2xl font-bold mb-2">
            Resultados del Análisis
          </h1>

          <p className="text-blue-100 text-sm">
            Aquí tienes el resumen de tu desempeño en comunicación
          </p>
        </div>

        <Button
          variant="outline"
          icon={RotateCcw}
          onClick={() => navigate('/camera')}
        >
          Nueva Sesión
        </Button>

      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-6">
        Indicadores principales
      </h2>

      <div className="flex flex-col gap-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="flex flex-col items-center justify-center p-8 gap-3 bg-white shadow-sm border border-gray-100">
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

          <Card className="flex flex-col items-center justify-center p-8 gap-3 bg-white shadow-sm border border-gray-100">
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

          <Card className="flex flex-col items-center justify-center p-8 gap-3 bg-white shadow-sm border border-gray-100">
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

        </div>

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-10">
          Insights de la IA
        </h2>

        <Card className="p-6 bg-white border border-gray-100 shadow-sm">
          <div className="flex flex-col gap-3">
            
            {puntajeGeneral >= 75 && (
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-md text-sm">
                Tu comunicación general es sólida y clara.
              </div>
            )}

            {voz?.total_muletillas > 5 && (
              <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-md text-sm">
                Usas muletillas con frecuencia, intenta reducirlas.
              </div>
            )}

            {contactoVisual !== 'estable' && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md text-sm">
                El contacto visual puede mejorar para generar más conexión.
              </div>
            )}

          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Card title="Muletillas Detectadas">

            {voz?.muletillas &&
            Object.keys(voz.muletillas).length > 0 ? (

              <ul className="grid gap-3">

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

          <Card title="Transcripción">

            <div className="flex flex-col gap-4">

              <div className="p-3 bg-gray-50 rounded-md border border-gray-100">

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

      </div>

    </div>
  )
}

export default Dashboard