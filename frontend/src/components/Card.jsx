function Card({
  children,
  title,
  subtitle,
  padding = 'md',
  className = '',
  onClick
}) {

  const baseStyles =
    "bg-white border border-gray-200 rounded-lg shadow-sm transition-all"

  const clickable = onClick
    ? "cursor-pointer hover:shadow-md hover:border-blue-300"
    : ""

  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    none: "p-0"
  }

  return (
    <div
      className={`${baseStyles} ${clickable} ${paddingStyles[padding]} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="text-gray-900">
        {children}
      </div>
    </div>
  )
}

export default Card