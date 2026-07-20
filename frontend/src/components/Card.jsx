import { motion } from "framer-motion";
import { animations } from "../hooks/useAnimations";

function Card({
    children,
    title,
    subtitle,
    padding = 'md',
    className = '',
    onClick,
    animated = true
}) {

    const baseStyles =
        "bg-white/90 backdrop-blur-sm border border-sky-100 rounded-2xl shadow-md transition-all duration-300"

    const clickable = onClick
        ? "cursor-pointer hover:shadow-xl hover:border-sky-300 hover:bg-white"
        : ""

    const paddingStyles = {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        none: "p-0"
    }

    const cardVariants = animated ? animations.slideUp : { initial: {}, animate: {} };

    return (
        <motion.div
            className={`${baseStyles} ${clickable} ${paddingStyles[padding]} ${className}`}
            onClick={onClick}
            {...cardVariants}
            whileHover={onClick ? { y: -4, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" } : {}}
            transition={{ duration: 0.3 }}
        >
            {(title || subtitle) && (
                <div className="mb-5">
                    {title && (
                        <h3 className="text-lg font-bold text-gray-900">
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className="text-gray-900">
                {children}
            </div>
        </motion.div>
    )
}

export default Card
