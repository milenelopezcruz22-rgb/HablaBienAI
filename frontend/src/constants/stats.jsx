export const ANALYSIS_CATEGORIES = [
    { key: 'voz', label: 'Voz', description: 'Claridad y modulación de la voz' },
    { key: 'postura', label: 'Postura', description: 'Posición corporal y lenguaje no verbal' },
    { key: 'contactoVisual', label: 'Contacto Visual', description: 'Conexión visual con la audiencia' },
    { key: 'movimientoManos', label: 'Movimiento de Manos', description: 'Gesticulación y expresividad' },
    { key: 'energia', label: 'Energía', description: 'Nivel de entusiasmo y dinamismo' }
]

export const MOCK_SESSION_DATA = {
    puntajeGeneral: 78,
    categorias: {
        voz: 82,
        postura: 75,
        contactoVisual: 70,
        movimientoManos: 85,
        energia: 78
    },
    errores: [
        { id: 1, tipo: 'Postura', mensaje: 'Se detectó inclinación hacia adelante frecuente', tiempo: '0:45' },
        { id: 2, tipo: 'Contacto Visual', mensaje: 'Mirada fija hacia abajo por más de 5 segundos', tiempo: '1:23' },
        { id: 3, tipo: 'Voz', mensaje: 'Volumen bajo detectado en varios momentos', tiempo: '2:10' }
    ],
    recomendaciones: [
        'Mantén los hombros hacia atrás para proyectar más confianza',
        'Intenta variar el tono de voz para mantener la atención',
        'Practica mantener el contacto visual con diferentes puntos del espacio',
        'Utiliza pausas estratégicas para enfatizar puntos importantes'
    ]
}

export const MOCK_HISTORIAL = [
    {
        id: 1,
        fecha: '2024-01-15',
        puntaje: 78,
        duracion: '3:45',
        categorias: { voz: 82, postura: 75, contactoVisual: 70, movimientoManos: 85, energia: 78 }
    },
    {
        id: 2,
        fecha: '2024-01-12',
        puntaje: 72,
        duracion: '4:20',
        categorias: { voz: 70, postura: 68, contactoVisual: 75, movimientoManos: 80, energia: 67 }
    },
    {
        id: 3,
        fecha: '2024-01-08',
        puntaje: 65,
        duracion: '2:55',
        categorias: { voz: 60, postura: 65, contactoVisual: 68, movimientoManos: 70, energia: 62 }
    },
    {
        id: 4,
        fecha: '2024-01-05',
        puntaje: 58,
        duracion: '3:10',
        categorias: { voz: 55, postura: 60, contactoVisual: 55, movimientoManos: 65, energia: 55 }
    }
]

export const ROUTES = {
    HOME: '/',
    CAMERA: '/camera',
    DASHBOARD: '/dashboard',
    HISTORIAL: '/historial'
}