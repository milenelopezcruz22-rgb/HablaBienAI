import { motion } from "framer-motion"

export function SkeletonCard({ className = "" }) {
    return (
        <motion.div
            className={`bg-gray-200 rounded-lg ${className}`}
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
    )
}

export function SkeletonScoreCircle() {
    return (
        <motion.div
            className="w-36 h-36 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
    )
}

export function SkeletonText({ lines = 1, className = "" }) {
    return (
        <div className="space-y-2">
            {Array(lines).fill(0).map((_, i) => (
                <SkeletonCard key={i} className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"} ${className}`} />
            ))}
        </div>
    )
}

export function SkeletonChart() {
    return (
        <motion.div
            className="w-full h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
    )
}
