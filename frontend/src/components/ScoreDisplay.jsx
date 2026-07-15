import { motion } from "framer-motion"
import { useEffect, useState } from "react"

function ScoreDisplay({ score, size = "lg" }) {
    const [displayScore, setDisplayScore] = useState(0)

    useEffect(() => {
        if (score === 0) return
        
        const duration = 1200 // 1.2 segundos (mismo que la línea)
        const startTime = Date.now()
        
        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const newScore = Math.round(score * progress)
            setDisplayScore(newScore)
            
            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }
        
        animate()
    }, [score])

    const getScoreConfig = (score) => {
        if (score >= 80) return {
            gradient: "from-emerald-400 to-green-600",
            glow: "shadow-lg shadow-emerald-500/50",
            text: "text-emerald-600",
            label: "Excelente",
            bgGradient: "from-emerald-50 to-green-50"
        }
        if (score >= 60) return {
            gradient: "from-sky-400 to-blue-600",
            glow: "shadow-lg shadow-sky-500/50",
            text: "text-sky-600",
            label: "Bueno",
            bgGradient: "from-sky-50 to-blue-50"
        }
        if (score >= 40) return {
            gradient: "from-amber-400 to-orange-600",
            glow: "shadow-lg shadow-amber-500/50",
            text: "text-amber-600",
            label: "Regular",
            bgGradient: "from-amber-50 to-orange-50"
        }
        return {
            gradient: "from-red-400 to-red-600",
            glow: "shadow-lg shadow-red-500/50",
            text: "text-red-600",
            label: "Necesita mejorar",
            bgGradient: "from-red-50 to-orange-50"
        }
    }

    const sizeMap = {
        sm: { circle: "w-20 h-20", number: "text-lg", border: "border-4" },
        md: { circle: "w-28 h-28", number: "text-2xl", border: "border-4" },
        lg: { circle: "w-36 h-36", number: "text-4xl", border: "border-8" }
    }

    const labelSizeMap = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base"
    }

    const config = getScoreConfig(score)
    const sizes = sizeMap[size]

    // Radio del círculo en SVG (viewBox de 120)
    const radius = 54
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (displayScore / 100) * circumference

    return (
        <motion.div 
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative flex items-center justify-center">
                {/* Circular progress bar */}
                <svg 
                    className={`absolute ${sizes.circle} -rotate-90 z-20`}
                    viewBox="0 0 120 120"
                    fill="none"
                >
                    {/* Background circle - thin gray line */}
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-gray-200"
                    />
                    
                    {/* Progress circle - thick colored line that fills */}
                    <motion.circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke={
                            score >= 80 ? "#10b981" :
                            score >= 60 ? "#0ea5e9" :
                            score >= 40 ? "#f59e0b" :
                            "#ef4444"
                        }
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ 
                            duration: 1.2,
                            ease: "linear"
                        }}
                    />
                </svg>

                {/* Inner circle with gradient background */}
                <motion.div
                    className={`
                        flex flex-col items-center justify-center
                        rounded-full border-0
                        font-bold relative
                        bg-gradient-to-br ${config.bgGradient}
                        ${sizes.circle}
                    `}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <motion.span 
                        className={`leading-none ${sizes.number} font-bold ${config.text}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {displayScore}
                    </motion.span>
                    <span className="text-xs text-gray-700 font-normal align-middle">/100</span>
                </motion.div>
            </div>

            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <span className={`font-bold ${labelSizeMap[size]} ${config.text} block`}>
                    {config.label}
                </span>
            </motion.div>
        </motion.div>
    )
}

export default ScoreDisplay