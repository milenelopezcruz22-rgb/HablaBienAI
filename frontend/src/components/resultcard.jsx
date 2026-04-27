function ResultCard({ title, value, description, icon: Icon, trend }) {

    const trendColor =
        trend > 0
            ? "text-green-600"
            : trend < 0
                ? "text-red-500"
                : "text-gray-500"

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">

            {/* HEADER */}
            <div className="flex items-start gap-3">

                {Icon && (
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                        <Icon size={22} />
                    </div>
                )}

                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                        {title}
                    </span>

                    {description && (
                        <span className="text-xs text-gray-500 mt-1">
                            {description}
                        </span>
                    )}
                </div>
            </div>

            {/* VALUE */}
            <div className="mt-4 flex items-end justify-between">

                <span className="text-2xl font-bold text-gray-900">
                    {value}
                </span>

                {typeof trend === "number" && (
                    <span className={`text-sm font-medium ${trendColor}`}>
                        {trend > 0 ? "+" : ""}{trend}%
                    </span>
                )}

            </div>
        </div>
    )
}

export default ResultCard