import { motion } from "framer-motion";

function AnimatedButton({
    children,
    className = '',
    onClick,
    disabled = false,
    type = 'button',
    ...props
}) {
    return (
        <motion.button
            type={type}
            className={`${className} transition-shadow duration-200`}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.03, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.12)" } : {}}
            whileTap={!disabled ? { scale: 0.97 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            {...props}
        >
            {children}
        </motion.button>
    );
}

export default AnimatedButton;
