import { useCallback, useEffect, useRef, useState } from "react";

const FACE_ANALYSIS_INTERVAL = 120;
const CONTACT_WINDOW_SIZE = 10;
const GAZE_THRESHOLD = 0.12;

const LEFT_EYE_CONTOUR = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
const RIGHT_EYE_CONTOUR = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
const LEFT_IRIS = 468;
const RIGHT_IRIS = 473;

function isValid(p) {
    return p && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1;
}

function eyeCenter(landmarks, contour) {
    let cx = 0, cy = 0, n = 0;
    for (const idx of contour) {
        const p = landmarks[idx];
        if (isValid(p)) { cx += p.x; cy += p.y; n++; }
    }
    return n ? { x: cx / n, y: cy / n } : null;
}

function eyeWidth(landmarks, contour) {
    let minX = Infinity, maxX = -Infinity;
    for (const idx of contour) {
        const p = landmarks[idx];
        if (isValid(p)) {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
        }
    }
    return maxX - minX;
}

export const useFaceAnalysis = (videoRef, stream, { enabled = true } = {}) => {
    const [metrics, setMetrics] = useState({
        enabled, isReady: false,
        contactoVisualPreciso: null,
        orientacionRostro: "sin_datos",
        porcentajeContactoVisual: 0,
        miradaIzquierda: 0,
        miradaDerecha: 0,
        miradaArriba: 0,
        miradaAbajo: 0,
    });

    const faceMeshRef = useRef(null);
    const faceMeshReadyRef = useRef(false);
    const latestFaceRef = useRef(null);
    const contactWindowRef = useRef([]);
    const statsRef = useRef({ total: 0, mirando: 0, izq: 0, der: 0, arriba: 0, abajo: 0 });

    useEffect(() => {
        if (!window.FaceMesh) {
            console.warn("FaceMesh CDN no cargado");
            return;
        }

        let mounted = true;
        const faceMesh = new window.FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`,
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results) => {
            latestFaceRef.current = results.multiFaceLandmarks?.[0] || null;
        });

        faceMeshRef.current = faceMesh;
        if (mounted) {
            faceMeshReadyRef.current = true;
            setMetrics(prev => ({ ...prev, isReady: true }));
        }

        return () => {
            mounted = false;
            faceMeshRef.current = null;
            faceMeshReadyRef.current = false;
            Promise.resolve(faceMesh.close()).catch(() => {});
        };
    }, []);

    useEffect(() => {
        if (!stream || !videoRef.current || !faceMeshRef.current || !enabled) return;

        let running = true;
        let timeoutId;

        const tick = async () => {
            if (!running) return;

            try {
                const video = videoRef.current;
                if (video?.readyState >= 2) {
                    await faceMeshRef.current?.send({ image: video });
                    const lm = latestFaceRef.current;

                    if (lm && lm.length >= 478) {
                        const lCenter = eyeCenter(lm, LEFT_EYE_CONTOUR);
                        const rCenter = eyeCenter(lm, RIGHT_EYE_CONTOUR);
                        const lIris = lm[LEFT_IRIS];
                        const rIris = lm[RIGHT_IRIS];
                        const lWidth = eyeWidth(lm, LEFT_EYE_CONTOUR);
                        const rWidth = eyeWidth(lm, RIGHT_EYE_CONTOUR);

                        let mirando = false, orientacion = "sin_datos";
                        let dIzq = 0, dDer = 0, dArr = 0, dAbj = 0;

                        if (lCenter && rCenter && isValid(lIris) && isValid(rIris) && lWidth > 0 && rWidth > 0) {
                            const lOx = (lIris.x - lCenter.x) / lWidth;
                            const lOy = (lIris.y - lCenter.y) / lWidth;
                            const rOx = (rIris.x - rCenter.x) / rWidth;
                            const rOy = (rIris.y - rCenter.y) / rWidth;
                            const avgX = (lOx + rOx) / 2;
                            const avgY = (lOy + rOy) / 2;
                            const dist = Math.hypot(avgX, avgY);

                            mirando = dist < GAZE_THRESHOLD;

                            if (!mirando) {
                                orientacion = Math.abs(avgX) > Math.abs(avgY)
                                    ? (avgX < 0 ? "izquierda" : "derecha")
                                    : (avgY < 0 ? "arriba" : "abajo");
                            } else {
                                orientacion = "centro";
                            }

                            if (avgX < -0.05) dIzq = 1;
                            if (avgX > 0.05) dDer = 1;
                            if (avgY < -0.05) dArr = 1;
                            if (avgY > 0.05) dAbj = 1;
                        }

                        const window = [...contactWindowRef.current, mirando ? 100 : 0].slice(-CONTACT_WINDOW_SIZE);
                        contactWindowRef.current = window;
                        const pct = Math.round(window.reduce((a, b) => a + b, 0) / window.length);

                        const s = statsRef.current;
                        s.total += 1;
                        if (mirando) s.mirando += 1;
                        if (dIzq) s.izq += 1;
                        if (dDer) s.der += 1;
                        if (dArr) s.arriba += 1;
                        if (dAbj) s.abajo += 1;

                        setMetrics({
                            enabled: true, isReady: true,
                            contactoVisualPreciso: pct,
                            orientacionRostro: orientacion,
                            porcentajeContactoVisual: s.total ? Math.round((s.mirando / s.total) * 100) : 0,
                            miradaIzquierda: s.total ? Math.round((s.izq / s.total) * 100) : 0,
                            miradaDerecha: s.total ? Math.round((s.der / s.total) * 100) : 0,
                            miradaArriba: s.total ? Math.round((s.arriba / s.total) * 100) : 0,
                            miradaAbajo: s.total ? Math.round((s.abajo / s.total) * 100) : 0,
                        });
                    }
                }
            } catch (error) {
                console.warn("FaceMesh error:", error);
            }

            if (running) timeoutId = setTimeout(tick, FACE_ANALYSIS_INTERVAL);
        };

        tick();

        return () => { running = false; clearTimeout(timeoutId); };
    }, [stream, videoRef, enabled]);

    const resetFaceMetrics = useCallback(() => {
        contactWindowRef.current = [];
        statsRef.current = { total: 0, mirando: 0, izq: 0, der: 0, arriba: 0, abajo: 0 };
        setMetrics({
            enabled: true, isReady: faceMeshReadyRef.current,
            contactoVisualPreciso: null, orientacionRostro: "sin_datos",
            porcentajeContactoVisual: 0, miradaIzquierda: 0, miradaDerecha: 0, miradaArriba: 0, miradaAbajo: 0,
        });
    }, []);

    const getFaceSnapshot = useCallback(() => ({
        contacto_visual_preciso: metrics.contactoVisualPreciso,
        orientacion_rostro: metrics.orientacionRostro,
        porcentaje_contacto_visual_face: metrics.porcentajeContactoVisual,
        mirada_izquierda_pct: metrics.miradaIzquierda,
        mirada_derecha_pct: metrics.miradaDerecha,
        mirada_arriba_pct: metrics.miradaArriba,
        mirada_abajo_pct: metrics.miradaAbajo,
    }), [metrics]);

    return { metrics, latestFaceRef, faceMeshReadyRef, resetFaceMetrics, getFaceSnapshot };
};
