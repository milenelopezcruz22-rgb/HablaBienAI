import { useNavigate } from 'react-router-dom'
import {
  Volume2,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  Lightbulb,
  CameraOff
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

  const puntajeGeneral = voz?.score_voz || 0
  const posturaScore = corporal?.porcentajeBuenaPostura ?? corporal?.posturaScore ?? 0
  const contactoVisual = corporal?.porcentajeContactoVisual ?? corporal?.contactoVisual ?? 0
  const movimientoScore = corporal?.movimientoScore ?? 0
  const frames = corporal?.frames || 0
  const hayCorporal = frames > 0
  const recomendacionesCorporales = corporal?.recomendacionesCorporales || []
  const eventosCorporales = corporal?.eventos || []

  const wpm = Math.round(voz?.palabras_por_minuto || 0)
  const duracionSeg = Math.round(voz?.duracion_segundos || 0)
  const ritmoConfig = {
    adecuado: { label: 'Adecuado', color: 'text-green-600', bg: 'bg-green-50', hint: 'Ritmo ideal para tu audiencia' },
    lento: { label: 'Lento', color: 'text-amber-600', bg: 'bg-amber-50', hint: 'Puedes acelerar un poco' },
    rapido: { label: 'Rápido', color: 'text-red-500', bg: 'bg-red-50', hint: 'Baja el ritmo y marca pausas' },
    sin_datos: { label: 'Sin datos', color: 'text-gray-400', bg: 'bg-gray-50', hint: 'No se pudo medir el ritmo' },
  }
  const rc = ritmoConfig[voz?.ritmo_habla] || ritmoConfig.sin_datos

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

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

          {/* VELOCIDAD */}
          <Card className="flex flex-col justify-center p-6">
            <p className="text-sm text-gray-500 mb-2">
              Velocidad de habla
            </p>

            <div className="flex items-baseline gap-1">
              <h2 className="text-4xl font-bold text-gray-900">{wpm}</h2>
              <span className="text-sm text-gray-400">pal/min</span>
            </div>

            <p className="text-xs text-gray-400 mt-1">
              {voz?.total_palabras || 0} palabras en {duracionSeg}s
            </p>

            <span className={`inline-flex w-fit items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${rc.bg} ${rc.color}`}>
              {rc.label}
            </span>

            <p className="text-sm text-gray-400 mt-2">
              {rc.hint}
            </p>
          </Card>

        </div>

        {/* BLOQUE CORPORAL */}
        {hayCorporal ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

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
                Estabilidad Corporal
              </h2>

              <ScoreDisplay score={movimientoScore} size="lg" />
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
        ) : (
          <Card className="p-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                <CameraOff size={26} />
              </div>
              <h3 className="text-base font-semibold text-slate-800">
                Sin análisis corporal en esta sesión
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                No se detectó tu cuerpo durante la grabación. Para medir postura,
                contacto visual y gestos, asegúrate de que tu torso y hombros
                estén visibles frente a la cámara.
              </p>
            </div>
          </Card>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* MULETILLAS */}
          <Card title="Muletillas Detectadas">

            {voz?.muletillas &&
            Object.keys(voz.muletillas).length > 0 ? (

              <ul className="flex flex-col gap-4">

                {(() => {
                  const maxConteo = Math.max(...Object.values(voz.muletillas))
                  return Object.entries(voz.muletillas)
                    .sort((a, b) => b[1] - a[1])
                    .map(([muletilla, cantidad], i) => (
                      <li key={i} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                            {muletilla}
                          </span>
                          <span className="text-sm font-semibold text-gray-700">
                            {cantidad} {cantidad === 1 ? 'vez' : 'veces'}
                          </span>
                        </div>
                        <div className="h-2.5 bg-red-50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full transition-all duration-700"
                            style={{ width: `${(cantidad / maxConteo) * 100}%` }}
                          />
                        </div>
                      </li>
                    ))
                })()}

              </ul>

            ) : (

              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                  <AlertTriangle size={22} />
                </div>
                <p className="text-gray-600 font-medium">¡Sin muletillas detectadas!</p>
                <p className="text-sm text-gray-400">Excelente control del lenguaje.</p>
              </div>

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

        {hayCorporal && (
        <Card title="Análisis Corporal">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['Buena postura', corporal?.porcentajeBuenaPostura ?? 0, 'bueno'],
              ['Brazos abiertos', corporal?.porcentajeBrazosAbiertos ?? 0, 'bueno'],
              ['Brazos cruzados', corporal?.porcentajeBrazosCruzados ?? 0, 'malo'],
              ['Actividad gestual', corporal?.actividadGestual ?? 0, 'bueno'],
              ['Manos visibles', corporal?.porcentajeManosVisibles ?? 0, 'bueno'],
              ['Torso de lado', corporal?.porcentajeTorsoDeLado ?? 0, 'malo'],
              ['Inclinación lateral', corporal?.porcentajeInclinacionLateral ?? 0, 'malo'],
              ['Rigidez de brazos', corporal?.porcentajeRigidezBrazos ?? 0, 'malo'],
            ].map(([label, value, tipo]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-xl font-bold text-slate-800">{value}%</p>
                <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${tipo === 'malo' ? 'bg-amber-400' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {recomendacionesCorporales.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Recomendaciones corporales</h3>
              <ul className="flex flex-col gap-2">
                {recomendacionesCorporales.map((recomendacion, index) => (
                  <li key={index} className="flex gap-2 text-sm text-slate-600">
                    <Lightbulb size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{recomendacion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {eventosCorporales.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Eventos relevantes</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {eventosCorporales.slice(-8).map((evento, index) => (
                  <li key={`${evento.tipo}-${index}`} className="text-xs text-slate-600 bg-amber-50 border border-amber-100 rounded-md p-3">
                    {evento.tipo.replaceAll('_', ' ')}: segundo {evento.segundo}, durante {evento.duracion_segundos}s
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
        )}

      </div>

    </div>
  )
}

export default Dashboard
