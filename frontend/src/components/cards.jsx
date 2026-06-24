import { MicrophoneIcon } from "../icons";
import { ChartHistogramIcon } from "../icons";
import { BulbIcon } from "../icons";
import { TrendingUpIcon } from "../icons";

function Cards() {
    const cards = [
        {
            icon: MicrophoneIcon,
            title: "Análisis de Voz",
            desc: "Evaluamos la claridad, volumen y modulación de tu voz durante la presentación.",
            color: "from-sky-400 to-blue-500",
            iconBg: "bg-sky-100",
            iconColor: "text-sky-600",
        },
        {
            icon: ChartHistogramIcon,
            title: "Métricas Detalladas",
            desc: "Obtén gráficas y puntajes sobre postura, contacto visual y lenguaje corporal.",
            color: "from-teal-400 to-cyan-500",
            iconBg: "bg-teal-100",
            iconColor: "text-teal-600",
        },
        {
            icon: BulbIcon,
            title: "Recomendaciones",
            desc: "Recibe consejos personalizados para mejorar tus habilidades de oratoria.",
            color: "from-sky-300 to-blue-400",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            icon: TrendingUpIcon,
            title: "Seguimiento",
            desc: "Visualiza tu progreso a lo largo del tiempo con el historial de sesiones.",
            color: "from-indigo-300 to-purple-400",
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => {
                const Icon = card.icon;
                return (
                    <div key={i}
                        className="group bg-white rounded-xl p-6 text-center border border-sky-100/50 shadow-sm hover:shadow-lg hover:border-sky-200 transition-all duration-300 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`} />
                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl mx-auto mb-4 ${card.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                            <Icon size={24} className={card.iconColor} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{card.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {card.desc}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default Cards;
