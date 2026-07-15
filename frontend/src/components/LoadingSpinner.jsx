import { motion } from "framer-motion";

function LoadingSpinner({ message = "Cargando...", size = "md" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const containerSize = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4"
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center ${containerSize[size]}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {message && (
        <motion.p
          className="text-sm text-gray-600 font-medium"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}

export default LoadingSpinner;
