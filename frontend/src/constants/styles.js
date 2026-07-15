// Colores de estado para badges y pills
export const statusColors = {
  excelente: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    label: "Excelente"
  },
  bueno: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    label: "Bueno"
  },
  regular: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    label: "Regular"
  },
  necesitaMejorar: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    label: "Necesita mejorar"
  }
}

// Transiciones consistentes
export const transitions = {
  fast: "transition-all duration-150",
  normal: "transition-all duration-300",
  slow: "transition-all duration-500"
}

// Efectos de hover
export const hoverEffects = {
  lift: "hover:shadow-lg hover:-translate-y-1",
  shadow: "hover:shadow-md",
  scale: "hover:scale-105",
  all: "hover:shadow-lg hover:-translate-y-1 hover:scale-102"
}

// Tipografía
export const typography = {
  heading1: "text-4xl font-bold leading-tight text-gray-900",
  heading2: "text-2xl font-bold leading-tight text-gray-900",
  heading3: "text-xl font-semibold text-gray-900",
  body: "text-base text-gray-700",
  small: "text-sm text-gray-600",
  caption: "text-xs text-gray-500",
  label: "text-xs font-semibold uppercase tracking-wide text-gray-600",
  stat: "text-2xl font-bold text-gray-900"
}

// Config de estados para postura y contacto visual
export const posturaConfig = {
  excelente: { label: "Excelente", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  buena: { label: "Buena", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  mejorar: { label: "Mejorar", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  esperando: { label: "Detectando...", color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
  nodetect: { label: "Sin detección", color: "#f97316", bg: "rgba(249,115,22,0.15)" },
}

export const contactoConfig = {
  estable: { label: "Estable", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  intermitente: { label: "Intermitente", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  ausente: { label: "Ausente", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  esperando: { label: "Detectando...", color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
  nodetect: { label: "Sin detección", color: "#f97316", bg: "rgba(249,115,22,0.15)" },
}
