function ScoreDisplay({ score, size = "lg" }) {

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600 border-green-500"
        if (score >= 60) return "text-blue-600 border-blue-500"
        if (score >= 40) return "text-yellow-500 border-yellow-400"
        return "text-red-500 border-red-500"
    }

    const getScoreLabel = (score) => {
        if (score >= 80) return "Excelente"
        if (score >= 60) return "Bueno"
        if (score >= 40) return "Regular"
        return "Necesita mejorar"
    }

    const sizeMap = {
        sm: "w-20 h-20 text-lg",
        md: "w-28 h-28 text-2xl",
        lg: "w-36 h-36 text-4xl"
    }

    const labelSizeMap = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base"
    }

    const color = getScoreColor(score)

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                className={`
            flex flex-col items-center justify-center
            rounded-full border-4 bg-white
            font-bold transition
            ${sizeMap[size]}
            ${color}
        `}
            >
                <span className="leading-none">{score}</span>
                <span className="text-xs text-gray-500 font-normal">/100</span>
            </div>
            <span className={`font-semibold ${labelSizeMap[size]} ${color}`}>
                {getScoreLabel(score)}
            </span>

        </div>
    )
}

export default ScoreDisplay