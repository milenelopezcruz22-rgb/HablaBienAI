// src/components/Camera/GrabarSesion.jsx
import { useState } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { Mic, Video, BarChart2, History, Home, Play, CameraOff } from 'lucide-react';

export default function GrabarSesion() {
  const { videoRef, stream, error, startCamera, stopCamera, isRecording, startRecording, stopRecording } = useCamera();
  const [activeNav, setActiveNav] = useState("grabar");

  const navItems = [
    { key: "inicio", label: "Inicio", icon: <Home size={18} /> },
    { key: "grabar", label: "Grabar", icon: <Video size={18} /> },
    { key: "dashboard", label: "Dashboard", icon: <BarChart2 size={18} /> },
    { key: "historial", label: "Historial", icon: <History size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Navbar Superior */}
      <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
          <Mic size={22} />
          <span>Habla Bien IA</span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                activeNav === key 
                  ? "bg-blue-50 text-blue-600 font-semibold" 
                  : "text-slate-500 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Grabar Sesión</h1>
          <p className="text-slate-500">Activa tu cámara y graba una presentación para analizar tu oratoria</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          
          {/* Columna Izquierda: Video y Controles */}
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

              {/* Indicador de Grabación */}
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-xs font-bold tracking-wider">REC</span>
                </div>
              )}
            </div>

            {/* Botones */}
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
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    isRecording 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  Apagar
                </button>
              </div>
            )}
          </div>

          {/* Columna Derecha: Tarjetas de Información */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 mb-5">Instrucciones</h3>
              <div className="flex flex-col gap-4">
                {["Activa la cámara y posiciónate frente a ella", "Presiona 'Iniciar Grabación' cuando estés listo", "Realiza tu presentación de práctica", "Detén la grabación y analiza los resultados"].map((text, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-600 leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Consejos</h3>
              <div className="flex flex-col gap-3">
                {["Asegúrate de tener buena iluminación", "Mira directamente a la cámara", "Habla con claridad y volumen moderado", "Mantén una postura erguida"].map((tip, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-slate-600 leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}