import { useEffect, useRef, useState } from "react";

const INIT = {
    enabled: false,
    isReady: false,
    mirandoCamara: false,
    contactoVisualPreciso: 0,
    orientacionRostro: "sin_datos",
};

const FACE_INTERVAL_MS = 150;

// Índices de FaceMesh (refineLandmarks añade iris en 468-477)
const NOSE_TIP = 1;
const LEFT_EYE_OUT = 33;
const RIGHT_EYE_OUT = 263;
const LEFT_IRIS = 468;
const RIGHT_IRIS = 473;

export const useFaceAnalysis = ({ videoRef, stream, enabled = false } = {}) => {
    const [metrics, setMetrics] = useState({ ...INIT, enabled });
    const latestFaceRef = useRef(null);
    const faceMeshReadyRef = useRef(false);
    const faceRef = useRef(null);
    const landmarksRef = useRef(null);

    // Carga del modelo FaceMesh
    useEffect(() => {
        if (!enabled) return;
        if (!window.FaceMesh) {
            console.warn("FaceMesh CDN no cargado");
            return;
        }
        let mounted = true;
        const fm = new window.FaceMesh({
            locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
        });
        fm.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true, // habilita iris
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        fm.onResults((r) => {
            const faces = r.multiFaceLandmarks;
            const lm = faces && faces[0] ? faces[0] : null;
            landmarksRef.current = lm;
            if (lm) {
                latestFaceRef.current = lm;
                faceMeshReadyRef.current = true;
            }
        });
        faceRef.current = fm;
        if (mounted) setMetrics((m) => ({ ...m, isReady: true, enabled: true }));

        return () => {
            mounted = false;
            faceMeshReadyRef.current = false;
            faceRef.current = null;
            Promise.resolve(fm.close()).catch(() => {});
        };
    }, [enabled]);

    // Bucle de análisis
    useEffect(() => {
        if (!enabled || !stream || !videoRef?.current || !faceRef.current) return;
        let running = true;
        let timeoutId;

        const processFrame = async () => {
            if (!running) return;
            try {
                const video = videoRef.current;
                if (video?.readyState >= 2) {
                    await faceRef.current?.send({ image: video });
                    const lm = landmarksRef.current;

                    if (lm) {
                        // Orientación: distancia nariz→ojo izq vs der
                        const dxL = Math.abs(lm[NOSE_TIP].x - lm[LEFT_EYE_OUT].x);
                        const dxR = Math.abs(lm[RIGHT_EYE_OUT].x - lm[NOSE_TIP].x);
                        const ratio = dxL / (dxR || 0.0001);
                        let orientacion = "frente";
                        if (ratio > 1.5) orientacion = "lado";
                        else if (ratio < 0.66) orientacion = "lado";

                        // Iris centrado entre comisuras → mirando a la cámara
                        const eyeCenter = (lm[LEFT_EYE_OUT].x + lm[RIGHT_EYE_OUT].x) / 2;
                        const irisCenter = (lm[LEFT_IRIS].x + lm[RIGHT_IRIS].x) / 2;
                        const eyeWidth = Math.abs(lm[LEFT_EYE_OUT].x - lm[RIGHT_EYE_OUT].x) || 0.0001;
                        const desviacion = Math.abs(irisCenter - eyeCenter) / eyeWidth;
                        const mirando = orientacion === "frente" && desviacion < 0.1;

                        setMetrics({
                            enabled: true,
                            isReady: true,
                            mirandoCamara: mirando,
                            contactoVisualPreciso: mirando ? 100 : 0,
                            orientacionRostro: orientacion,
                        });
                    }
                }
            } catch {
                /* silencioso: un frame fallido no rompe el bucle */
            }
            if (running) timeoutId = setTimeout(processFrame, FACE_INTERVAL_MS);
        };

        processFrame();
        return () => {
            running = false;
            clearTimeout(timeoutId);
        };
    }, [enabled, stream, videoRef]);

    return { metrics, latestFaceRef, faceMeshReadyRef };
};
