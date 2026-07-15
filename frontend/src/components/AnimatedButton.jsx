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
            className={className}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            {...props}
        >
            {children}
        </motion.button>
    );
}

export default AnimatedButton;
