const INIT_HAND_METRICS = {
    enabled: false,
    isReady: false,
    gestoMano: null,
    manosDetectadas: 0,
};

export const useHandAnalysis = ({ enabled = false } = {}) => {
    // Preparado para integrar MediaPipe Hands sin penalizar equipos modestos.
    return {
        metrics: { ...INIT_HAND_METRICS, enabled },
    };
};
