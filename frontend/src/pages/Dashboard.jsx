import { useNavigate } from 'react-router-dom'
import {
  Volume2, User, Eye, Hand, Zap,
  AlertTriangle, Lightbulb, ArrowLeft, RotateCcw
} from 'lucide-react'

import Card from '../components/Card'
import Button from '../components/Button'
import RadarChart from '../components/RadarChart'
import ScoreDisplay from '../components/ScoreDisplay'
import ResultCard from '../components/ResultCard'

import { MOCK_SESSION_DATA, ANALYSIS_CATEGORIES } from '../constants'

const categoryIcons = {
  voz: Volume2,
  postura: User,
  contactoVisual: Eye,
  movimientoManos: Hand,
  energia: Zap
}

function Dashboard() {
  const navigate = useNavigate()
  const { puntajeGeneral, categorias, errores, recomendaciones } = MOCK_SESSION_DATA

  return (
    <div className="flex flex-col gap-8 p-6">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/')}>
          Volver
        </Button>

        <h1 className="text-xl font-semibold text-gray-900 text-center w-full md:w-auto">
          Resultados del Análisis
        </h1>

        <Button variant="outline" icon={RotateCcw} onClick={() => navigate('/camera')}>
          Nueva Sesión
        </Button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-8">

        {/* OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <Card className="flex flex-col items-center justify-center p-6 gap-4">
            <h2 className="text-sm text-gray-500 font-medium">
              Puntaje General
            </h2>
            <ScoreDisplay score={puntajeGeneral} size="lg" />
          </Card>

          <Card className="lg:col-span-2 flex items-center justify-center p-4">
            <RadarChart data={categorias} />
          </Card>

        </div>

        {/* CATEGORIES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ANALYSIS_CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.key]
            const value = categorias[cat.key]

            return (
              <ResultCard
                key={cat.key}
                title={cat.label}
                description={cat.description}
                value={value}
                icon={Icon}
              />
            )
          })}
        </div>

        {/* FEEDBACK */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ERRORES */}
          <Card title="Errores Detectados">
            {errores.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {errores.map((error) => (
                  <li
                    key={error.id}
                    className="flex gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-md"
                  >
                    <AlertTriangle className="text-red-500 mt-1" size={16} />

                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-red-600 uppercase">
                        {error.tipo}
                      </span>

                      <p className="text-sm text-gray-900">
                        {error.mensaje}
                      </p>

                      <span className="text-xs text-gray-500">
                        Minuto {error.tiempo}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No se detectaron errores significativos
              </p>
            )}
          </Card>

          {/* RECOMENDACIONES */}
          <Card title="Recomendaciones">
            <ul className="flex flex-col gap-4">
              {recomendaciones.map((rec, i) => (
                <li
                  key={i}
                  className="flex gap-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-md"
                >
                  <Lightbulb className="text-green-600 mt-1" size={16} />

                  <p className="text-sm text-gray-900 leading-relaxed">
                    {rec}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

        </div>

      </div>
    </div>
  )
}

export default Dashboard