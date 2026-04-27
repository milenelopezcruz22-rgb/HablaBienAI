import { useState, useEffect, useCallback } from "react";
import { useCamera } from "../hooks/useCamera";
import { useAnalysis } from "../hooks/useAnalysis";
import { analizarAudio } from "../services/api";
import {
    Mic, Video, Play, CameraOff,
    CheckCircle, AlertCircle, Eye, Activity, Lightbulb, Loader2
} from 'lucide-react';

const posturaConfig = {
    excelente: { label: 'Excelente', color: '#22c55e', bg: 'rgba(34,197,94,0.15)', icon: <CheckCircle size={13} /> },
    buena: { label: 'Buena', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: <CheckCircle size={13} /> },
    mejorar: { label: 'Mejorar', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: <AlertCircle size={13} /> },
};

const contactoConfig = {
    estable: { label: 'Estable', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    intermitente: { label: 'Intermitente', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    ausente: { label: 'Ausente', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
};

const audioConfig = {
    optimo: { label: 'Óptimo', barColor: '#22c55e' },
    bajo: { label: 'Bajo', barColor: '#f59e0b' },
    alto: { label: 'Alto', barColor: '#ef4444' },
};

const tips = [
    'Mantén tus manos visibles para transmitir confianza y transparencia a tu audiencia.',
    'Haz pausas breves para dar énfasis a tus ideas clave.',
    'Varía el tono de voz para mantener la atención del público.',
    'Mira directamente al lente de la cámara para generar conexión.',
    'Respira profundo antes de comenzar para reducir los nervios.',
];
const todayTip = tips[Math.floor(Math.random() * tips.length)];

export default function GrabarSesion() {
    const { videoRef, stream, error, startCamera, stopCamera, isRecording, startRecording, stopRecording, videoBlob } = useCamera();
    const { postura, contactoVisual, audioLevel, audioEstado } = useAnalysis(stream, !!stream);

    const [analisis, setAnalisis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorAnalisis, setErrorAnalisis] = useState(null);

    const analizarAudioBlob = useCallback(async (blob) => {
        setLoading(true);
        setErrorAnalisis(null);
        try {
            const resultado = await analizarAudio(blob);
            setAnalisis(resultado);
        } catch (err) {
            setErrorAnalisis(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Analizar audio cuando hay un video grabado
    useEffect(() => {
        if (videoBlob && !isRecording) {
            analizarAudioBlob(videoBlob);
        }
    }, [videoBlob, isRecording, analizarAudioBlob]);

    const pc = postura ? posturaConfig[postura] : null;
    const cc = contactoVisual ? contactoConfig[contactoVisual] : null;
    const ac = audioEstado ? audioConfig[audioEstado] : null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <main className="max-w-[1600px] mx-auto px-6 py-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Grabar Sesión</h1>
                    <p className="text-slate-500">Activa tu cámara y graba una presentación para analizar tu oratoria</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-8 items-start">

                    {/* COLUMNA 1: INSTRUCCIONES */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <h3 className="font-semibold text-slate-900 text-sm mb-4">Instrucciones</h3>
                        <div className="flex flex-col gap-4">
                            {[
                                'Activa la cámara y posiciónate frente a ella',
                                "Presiona 'Iniciar Grabación' cuando estés listo",
                                'Realiza tu presentación de práctica',
                                'Detén la grabación y analiza los resultados',
                            ].map((text, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 shadow-sm shadow-blue-200">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm text-slate-600 leading-relaxed pt-0.5">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLUMNA 2: VIDEO Y CONTROLES */}
                    <div className="flex flex-col items-center">
                        {error && (
                            <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center relative mb-6 shadow-xl">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className={`w-full h-full object-cover ${stream ? 'block' : 'hidden'}`}
                            />

                            {!stream && (
                                <div className="text-center flex flex-col items-center gap-3">
                                    <CameraOff size={48} className="text-slate-600 opacity-60" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-slate-200 font-semibold text-lg mb-1">La cámara no está activa</p>
                                        <p className="text-slate-400 text-sm">Haz clic en "Activar Cámara" para comenzar</p>
                                    </div>
                                </div>
                            )}

                            {isRecording && (
                                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                                    <span className="text-white text-xs font-bold tracking-wider">REC</span>
                                </div>
                            )}

                            {stream && (
                                <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                                    {pc && (
                                        <div
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
                                            style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.color}40` }}
                                        >
                                            {pc.icon}
                                            <span>Postura: <strong>{pc.label}</strong></span>
                                        </div>
                                    )}
                                    {cc && (
                                        <div
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
                                            style={{ background: cc.bg, color: cc.color, border: `1px solid ${cc.color}40` }}
                                        >
                                            <Eye size={13} />
                                            <span>Contacto Visual: <strong>{cc.label}</strong></span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {!stream ? (
                            <button
                                onClick={startCamera}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all"
                            >
                                <Video size={20} /> Activar Cámara
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                {!isRecording ? (
                                    <button
                                        onClick={startRecording}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-red-600/30 transition-all"
                                    >
                                        <Play size={20} /> Iniciar Grabación
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopRecording}
                                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold animate-pulse transition-all"
                                    >
                                        <div className="w-3.5 h-3.5 bg-red-500 rounded-full" /> Detener Grabación
                                    </button>
                                )}
                                <button
                                    onClick={stopCamera}
                                    disabled={isRecording}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${isRecording
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                    }`}
                                >
                                    Apagar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA 3: ANÁLISIS Y TIPS */}
                    <div className="flex flex-col gap-5">
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold text-sm">
                                <Lightbulb size={16} className="text-amber-400" />
                                Tip de hoy
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">{todayTip}</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="font-semibold text-slate-900 text-sm mb-5 flex items-center gap-2">
                                <Activity size={15} className="text-blue-500" />
                                Análisis en Tiempo Real
                            </h3>
                            <div className="flex flex-col gap-6">

                                {/* Postura */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Postura</span>
                                        {pc ? (
                                            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: pc.color, background: pc.bg }}>
                                                {pc.icon} {pc.label}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-300 italic">Sin datos</span>
                                        )}
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700" style={{
                                            width: postura === 'excelente' ? '95%' : postura === 'buena' ? '65%' : postura === 'mejorar' ? '25%' : '0%',
                                            background: pc?.color ?? '#e2e8f0',
                                        }} />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                        {postura === 'excelente' && 'Espalda recta y hombros relajados. ¡Perfecto!'}
                                        {postura === 'buena' && 'Postura aceptable, pequeños ajustes pueden mejorarla.'}
                                        {postura === 'mejorar' && 'Intenta erguir la espalda y elevar la cabeza.'}
                                        {!postura && 'Activa la cámara para detectar tu postura.'}
                                    </p>
                                </div>

                                {/* Audio */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                                            <Mic size={12} /> Nivel de Audio
                                        </span>
                                        {ac ? (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: ac.barColor, background: `${ac.barColor}18` }}>
                                                {ac.label}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-300 italic">Sin datos</span>
                                        )}
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-100" style={{ width: `${audioLevel}%`, background: ac?.barColor ?? '#e2e8f0' }} />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                        {audioEstado === 'optimo' && `Volumen ideal (${audioLevel}%). Sigue así.`}
                                        {audioEstado === 'bajo' && 'Habla un poco más fuerte para que tu audiencia te escuche bien.'}
                                        {audioEstado === 'alto' && 'Volumen muy alto, considera alejarte un poco del micrófono.'}
                                        {!audioEstado && 'Activa la cámara para analizar el audio.'}
                                    </p>
                                </div>

                                {/* Contacto Visual */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                                            <Eye size={12} /> Contacto Visual
                                        </span>
                                        {cc ? (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: cc.color, background: cc.bg }}>
                                                {cc.label}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-300 italic">Sin datos</span>
                                        )}
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700" style={{
                                            width: contactoVisual === 'estable' ? '90%' : contactoVisual === 'intermitente' ? '50%' : contactoVisual === 'ausente' ? '10%' : '0%',
                                            background: cc?.color ?? '#e2e8f0',
                                        }} />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                        {contactoVisual === 'estable' && 'Excelente. Mantienes la mirada hacia la cámara.'}
                                        {contactoVisual === 'intermitente' && 'Intenta no desviar la mirada con tanta frecuencia.'}
                                        {contactoVisual === 'ausente' && 'Mira directamente al lente de la cámara.'}
                                        {!contactoVisual && 'Activa la cámara para detectar el contacto visual.'}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* RESULTADOS DEL ANÁLISIS DE VOZ */}
                        {loading && (
                            <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm">
                                <div className="flex items-center gap-3 text-blue-600">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span className="font-semibold text-sm">Analizando tu voz...</span>
                                </div>
                                <p className="text-slate-500 text-sm mt-2">Procesando transcripción y detectando muletillas</p>
                            </div>
                        )}

                        {errorAnalisis && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertCircle size={18} />
                                    <span className="font-semibold text-sm">Error en el análisis</span>
                                </div>
                                <p className="text-red-500 text-sm mt-1">{errorAnalisis}</p>
                            </div>
                        )}

                        {analisis && !loading && (
                            <div className="bg-white rounded-2xl border border-green-200 p-5 shadow-sm">
                                <h3 className="font-semibold text-slate-900 text-sm mb-4 flex items-center gap-2">
                                    <CheckCircle size={15} className="text-green-500" />
                                    Resultados del Análisis
                                </h3>

                                {/* Puntuación de voz */}
                                <div className="mb-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Calidad de Voz</span>
                                        <span
                                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                                            style={{
                                                color: analisis.score_voz >= 70 ? '#22c55e' : analisis.score_voz >= 40 ? '#f59e0b' : '#ef4444',
                                                background: analisis.score_voz >= 70 ? 'rgba(34,197,94,0.15)' : analisis.score_voz >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'
                                            }}
                                        >
                                            {analisis.score_voz}/100
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${analisis.score_voz}%`,
                                                background: analisis.score_voz >= 70 ? '#22c55e' : analisis.score_voz >= 40 ? '#f59e0b' : '#ef4444'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Estadísticas */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-slate-50 rounded-xl p-3">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Palabras</p>
                                        <p className="text-2xl font-bold text-slate-800">{analisis.total_palabras}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-3">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Muletillas</p>
                                        <p className={`text-2xl font-bold ${analisis.total_muletillas > 5 ? 'text-red-500' : 'text-green-500'}`}>
                                            {analisis.total_muletillas}
                                        </p>
                                    </div>
                                </div>

                                {/* Transcripción */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                                        <Mic size={12} /> Transcripción
                                    </h4>
                                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg leading-relaxed max-h-32 overflow-y-auto">
                                        {analisis.transcripcion}
                                    </p>
                                </div>

                                {/* Muletillas detectadas */}
                                {Object.keys(analisis.muletillas).length > 0 ? (
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                                            <AlertCircle size={12} className="text-amber-500" /> Muletillas detectadas
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(analisis.muletillas).map(([muletilla, count]) => (
                                                <span
                                                    key={muletilla}
                                                    className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md border border-amber-200"
                                                >
                                                    "{muletilla}" ×{count}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <p className="text-xs text-green-700 flex items-center gap-1">
                                            <CheckCircle size={12} />
                                            ¡Excelente! No se detectaron muletillas.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}