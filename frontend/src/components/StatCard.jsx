import { motion } from "framer-motion";

function StatCard({ 
  label, 
  value, 
  max = 100, 
  unit = "", 
  trend = null, 
  subtitle = "",
  icon: Icon = null,
  className = ""
}) {
  // Determinar color basado en valor
  const getColor = () => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (percentage >= 60) return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    return { text: "text-red-500", bg: "bg-red-50", border: "border-red-200" };
  };

  const color = getColor();
  const percentage = (value / max) * 100;

  // Calcular circunferencia para SVG
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      className={`${color.bg} border ${color.border} rounded-xl p-5 sm:p-6 flex flex-col items-center justify-center gap-3 transition-all hover:shadow-md ${className}`}
      whileHover={{ y: -2 }}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 100, damping: 12 }
        }
      }}
    >
      {/* Header: Icon + Label */}
      <div className="flex items-center gap-2 w-full">
        {Icon && <Icon size={14} className={color.text} />}
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex-1">
          {label}
        </span>
      </div>

      {/* Circular Progress */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg width="100" height="100" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={color.text}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute flex flex-col items-center">
          <span className={`text-2xl font-bold ${color.text}`}>{Math.round(value)}</span>
          {unit && <span className="text-xs text-gray-400">{unit}</span>}
        </div>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-gray-500 text-center max-w-xs">
          {subtitle}
        </p>
      )}

      {/* Trend */}
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${
          trend.value > 0 ? "text-emerald-600" : trend.value < 0 ? "text-red-500" : "text-gray-400"
        }`}>
          <span>{trend.value > 0 ? "↑" : trend.value < 0 ? "↓" : "→"}</span>
          <span>{Math.abs(trend.value)} {trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}

export default StatCard;
