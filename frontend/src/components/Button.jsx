function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    disabled = false,
    fullWidth = false,
    onClick,
    type = 'button',
    className = ''
}) {

    const baseStyles =
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-md active:scale-95"

    const variants = {
        primary: "bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600",
        secondary: "bg-slate-700 text-white hover:bg-slate-800",
        outline: "bg-transparent border-2 border-sky-300 text-sky-600 hover:bg-sky-50 hover:border-sky-400",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        danger: "bg-red-500 text-white hover:bg-red-600",
        success: "bg-emerald-500 text-white hover:bg-emerald-600",
    }

    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-5 py-3 text-sm",
        lg: "px-6 py-4 text-base",
    }

    const width = fullWidth ? "w-full" : ""

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    )
}

export default Button