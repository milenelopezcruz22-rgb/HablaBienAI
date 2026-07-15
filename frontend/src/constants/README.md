# Constantes de Estilos - Guía de uso

## Importación

```javascript
import { 
  statusColors, 
  transitions, 
  hoverEffects, 
  typography,
  posturaConfig,
  contactoConfig 
} from "../constants/styles"
```

---

## Ejemplos de uso

### 1. Colores de estado para badges

```jsx
// Uso con un badge
const statusColor = statusColors.excelente;
<div className={`${statusColor.bg} ${statusColor.text} px-3 py-1 rounded-full border ${statusColor.border}`}>
  {statusColor.label}
</div>
```

### 2. Transiciones consistentes

```jsx
// Aplicar a cualquier elemento
<div className={`${transitions.normal} hover:bg-blue-100`}>
  Contenido
</div>

// Opciones: transitions.fast, transitions.normal, transitions.slow
```

### 3. Efectos de hover

```jsx
// Lift effect (sombra + traslación hacia arriba)
<div className={`${hoverEffects.lift}`}>
  Card con efecto lift
</div>

// Opciones:
// - hoverEffects.lift: sombra + -translateY
// - hoverEffects.shadow: solo sombra
// - hoverEffects.scale: scale 105%
// - hoverEffects.all: todos combinados
```

### 4. Tipografía estandarizada

```jsx
// Headings
<h1 className={typography.heading1}>Título principal</h1>
<h2 className={typography.heading2}>Subtítulo</h2>

// Body text
<p className={typography.body}>Párrafo normal</p>
<p className={typography.small}>Texto pequeño</p>

// Labels y stats
<label className={typography.label}>Etiqueta</label>
<span className={typography.stat}>42</span>
```

### 5. Config de postura y contacto visual

```jsx
import { posturaConfig, contactoConfig } from "../constants/styles"

// Uso en badges
const postura = posturaConfig.excelente;
<div style={{ background: postura.bg, color: postura.color }}>
  {postura.label}
</div>

// En GrabarSesion
const pc = posturaConfig[posturaState];
<div style={{ background: pc.bg, color: pc.color }}>
  Postura: {pc.label}
</div>
```

---

## Mapa de colores

### Status colors
- **excelente**: Verde (Emerald)
- **bueno**: Azul (Sky)  
- **regular**: Ámbar (Amber)
- **necesitaMejorar**: Rojo (Red)

### Postura estados
- excelente: Verde ✓
- buena: Ámbar ⚠️
- mejorar: Rojo ❌
- esperando: Gris 🔄
- nodetect: Naranja ⚠️

---

## Best Practices

1. **Siempre usar constantes** en lugar de hardcodear clases
2. **Importar solo lo que uses** para evitar bundle bloat
3. **Mantener la escala de tipografía**: No crear nuevas clases de tamaño fuera de `typography`
4. **Usar transitions.normal** por defecto (300ms)
5. **Combinar efectos hover** usando `hoverEffects.all` cuando sea apropiado

---

## Cómo extender

### Agregar nuevo status color

```javascript
// En constants/styles.js
export const statusColors = {
  // ... existentes
  warning: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    label: "Advertencia"
  }
}
```

### Agregar nueva tipografía

```javascript
export const typography = {
  // ... existentes
  subtitle: "text-lg font-medium text-gray-700"
}
```

---

**Última actualización**: 2026-07-14
