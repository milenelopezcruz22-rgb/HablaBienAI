import { MicrophoneIcon } from "../icons";
import { ChartHistogramIcon } from "../icons";
import { BulbIcon } from "../icons";
import { TrendingUpIcon } from "../icons";

function Cards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="bg-white shadow-md hover:shadow-xl transition p-6 rounded-xl">
                <div className="w-12 h-12 flex items-center justify-center bg-sky-100 rounded-xl mx-auto mb-4">
                    <MicrophoneIcon size={24} className="text-blue-400" />
                </div>
                <h3 className="font-bold text-lg">Análisis de Voz</h3>
                <p className="text-gray-500">
                    Evaluamos la claridad, volumen y modulación de tu voz durante la presentación.
                </p>
            </div>

            <div className="bg-white shadow-md hover:shadow-xl transition p-6 rounded-xl">
                <div className="w-12 h-12 flex items-center justify-center bg-sky-100 rounded-xl mx-auto mb-4">
                    <ChartHistogramIcon size={24} className="text-blue-400" />
                </div>
                <h3 className="font-bold text-lg">Métricas Detalladas</h3>
                <p className="text-gray-500">
                    Obtén gráficas y puntajes sobre postura, contacto visual y lenguaje corporal.
                </p>
            </div>
            
            <div className="bg-white shadow-md hover:shadow-xl transition p-6 rounded-xl">
                <div className="w-12 h-12 flex items-center justify-center bg-sky-100 rounded-xl mx-auto mb-4">
                    <BulbIcon size={24} className="text-blue-400" />
                </div>
                <h3 className="font-bold text-lg">Recomendaciones</h3>
                <p className="text-gray-500">
                    Recibe consejos personalizados para mejorar tus habilidades de oratoria.
                </p>
            </div>

            <div className="bg-white shadow-md hover:shadow-xl transition p-6 rounded-xl">
                <div className="w-12 h-12 flex items-center justify-center bg-sky-100 rounded-xl mx-auto mb-4">
                    <TrendingUpIcon size={24} className="text-blue-400" />
                </div>
                <h3 className="font-bold text-lg">Seguimiento</h3>
                <p className="text-gray-500">
                    Visualiza tu progreso a lo largo del tiempo con el historial de sesiones.
                </p>
            </div>

        </div>
    );
}

export default Cards;