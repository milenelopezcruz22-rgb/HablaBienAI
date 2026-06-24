import { useEffect, useRef, useState } from "react";

const INIT = {
    enabled: false,
    isReady: false,
    gestoMano: null,
    manosDetectadas: 0,
};

const HAND_INTERVAL_MS = 150;

// Un dedo está extendido si su punta (tip) queda por encima (y menor) de su
// articulación media (pip). Índices de MediaPipe Hands.
function dedoExtendido(lm, tip, pip) {
    return lm[tip].y < lm[pip].y;
}

function clasificarGesto(lm) {
    const indice = dedoExtendido(lm, 8, 6);
    const medio = dedoExtendido(lm, 12, 10);
    const anular = dedoExtendido(lm, 16, 14);
    const menique = dedoExtendido(lm, 20, 18);
    const extendidos = [indice, medio, anular, menique].filter(Boolean).length;

    if (extendidos >= 4) return "abierta";
    if (extendidos === 0) return "punio";
    if (indice && !medio && !anular && !menique) return "senyalando";
    return "neutra";
}

export const useHandAnalysis = ({ videoRef, stream, enabled = false } = {}) => {
    const [metrics, setMetrics] = useState({ ...INIT, enabled });
    const handsRef = useRef(null);
    const resultRef = useRef(null);

    // Carga del modelo Hands
    useEffect(() => {
        if (!enabled) return;
        if (!window.Hands) {
            console.warn("Hands CDN no cargado");
            return;
        }
        let mounted = true;
        const hands = new window.Hands({
            locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
        });
        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 0,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        hands.onResults((r) => {
            resultRef.current = r.multiHandLandmarks || null;
        });
        handsRef.current = hands;
        if (mounted) setMetrics((m) => ({ ...m, isReady: true, enabled: true }));

        return () => {
            mounted = false;
            handsRef.current = null;
            Promise.resolve(hands.close()).catch(() => {});
        };
    }, [enabled]);

    // Bucle de análisis
    useEffect(() => {
        if (!enabled || !stream || !videoRef?.current || !handsRef.current) return;
        let running = true;
        let timeoutId;

        const processFrame = async () => {
            if (!running) return;
            try {
                const video = videoRef.current;
                if (video?.readyState >= 2) {
                    await handsRef.current?.send({ image: video });
                    const manos = resultRef.current;
                    if (manos && manos.length > 0) {
                        setMetrics({
                            enabled: true,
                            isReady: true,
                            gestoMano: clasificarGesto(manos[0]),
                            manosDetectadas: manos.length,
                        });
                    } else {
                        setMetrics((m) => ({ ...m, gestoMano: null, manosDetectadas: 0 }));
                    }
                }
            } catch {
                /* silencioso */
            }
            if (running) timeoutId = setTimeout(processFrame, HAND_INTERVAL_MS);
        };

        processFrame();
        return () => {
            running = false;
            clearTimeout(timeoutId);
        };
    }, [enabled, stream, videoRef]);

    return { metrics };
};
