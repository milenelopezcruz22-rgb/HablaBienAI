import { useRef } from "react";

const INIT_FACE_METRICS = {
    enabled: false,
    isReady: false,
    contactoVisualPreciso: null,
    orientacionRostro: "sin_datos",
};

export const useFaceAnalysis = ({ enabled = false } = {}) => {
    const latestFaceRef = useRef(null);
    const faceMeshReadyRef = useRef(false);

    // Preparado para integrar FaceMesh sin cargar un segundo modelo por defecto.
    return {
        metrics: { ...INIT_FACE_METRICS, enabled },
        latestFaceRef,
        faceMeshReadyRef,
    };
};
