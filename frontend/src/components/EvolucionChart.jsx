import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
)

// Recibe las sesiones del backend (ordenadas de más reciente a más antigua)
// y dibuja la evolución del puntaje de voz en orden cronológico.
function EvolucionChart({ sesiones = [] }) {
    const ordenadas = [...sesiones].reverse()

    const chartData = {
        labels: ordenadas.map((s) =>
            s.fecha
                ? new Date(s.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
                : '—'
        ),
        datasets: [
            {
                label: 'Puntaje de voz',
                data: ordenadas.map((s) => Math.round(s.score_voz || 0)),
                borderColor: 'rgba(37, 99, 235, 1)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: 'rgba(37, 99, 235, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: { stepSize: 20, color: '#64748b', font: { size: 11 } },
                grid: { color: 'rgba(0,0,0,0.06)' },
            },
            x: {
                ticks: { color: '#64748b', font: { size: 11 } },
                grid: { display: false },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                padding: 12,
                cornerRadius: 8,
                callbacks: { label: (ctx) => `Puntaje: ${ctx.raw}/100` },
            },
        },
    }

    return (
        <div className="h-64 w-full">
            <Line data={chartData} options={options} />
        </div>
    )
}

export default EvolucionChart
