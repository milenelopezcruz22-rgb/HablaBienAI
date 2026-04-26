import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

import { Radar } from 'react-chartjs-2'
import { ANALYSIS_CATEGORIES } from '../constants'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

function RadarChart({ data }) {

  const chartData = {
    labels: ANALYSIS_CATEGORIES.map(cat => cat.label),
    datasets: [
      {
        label: 'Puntaje',
        data: ANALYSIS_CATEGORIES.map(cat => data[cat.key] || 0),

        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,

        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,

    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,

        ticks: {
          stepSize: 20,
          color: '#64748b',
          font: { size: 11 }
        },

        pointLabels: {
          color: '#0f172a',
          font: { size: 13, weight: '500' }
        },

        grid: {
          color: 'rgba(0,0,0,0.08)'
        },

        angleLines: {
          color: 'rgba(0,0,0,0.08)'
        }
      }
    },

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 8,

        titleFont: { size: 13 },
        bodyFont: { size: 12 },

        callbacks: {
          label: (context) => `Puntaje: ${context.raw}/100`
        }
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-2">
      <Radar data={chartData} options={options} />
    </div>
  )
}

export default RadarChart