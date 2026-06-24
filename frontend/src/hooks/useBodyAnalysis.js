import { useEffect, useRef, useState, useCallback } from "react";

const INIT = { posturaScore: 0, contactoVisual: 0, frames: 0 };

const N = { NOSE: 0, LE: 2, RE: 5, LS: 11, RS: 12, LW: 15, RW: 16, LH: 23, RH: 24 };

export const useBodyAnalysis = (videoRef, stream) => {
    const [metrics, setMetrics] = useState(INIT);
    const [isReady, setIsReady] = useState(false);
    const [framing, setFraming] = useState({ todoVisible: false, faltantes: ["todo"] });

    const poseRef = useRef(null);
    const lRef = useRef(null);
    const mRef = useRef(INIT);
    const wRef = useRef([]);
    const latestPoseRef = useRef(null);
    const latestFaceRef = useRef(null);
    const faceMeshReadyRef = useRef(false);

    useEffect(() => {
        if (!window.Pose) { console.error("Pose CDN no cargado"); return; }
        let mounted = true;
        try {
            const pose = new window.Pose({
                locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`,
            });
            pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });
            pose.onResults((r) => {
                const ll = r.poseLandmarks;
                lRef.current = ll || null;
                if (ll) latestPoseRef.current = ll;
            });
            poseRef.current = pose;
            if (mounted) { setIsReady(true); console.log("Pose CDN listo"); }
        } catch (e) { console.error("Error al crear Pose:", e); }
        return () => { mounted = false; if (poseRef.current) try { poseRef.current.close(); } catch (_) {} };
    }, []);

    useEffect(() => {
    if (!stream) return;
    if (!videoRef.current) return;
    if (!poseRef.current) return;

    let running = true;

    const processFrame = async () => {
        if (!running) return;

        try {
            const video = videoRef.current;

            if (video && video.readyState >= 2) {
                await poseRef.current.send({ image: video });

                const l = lRef.current;

                if (l && l.length >= 25) {

                    const enc = (l[N.LS].y + l[N.RS].y) / 2;
                    const cad = (l[N.LH].y + l[N.RH].y) / 2;

                    const tl = cad - enc;
                    const nh = enc - l[N.NOSE].y;

                    const encorvado = nh / tl < 0.3 || tl < 0.2;
                    const hBien = Math.abs(l[N.LS].y - l[N.RS].y) < 0.05;

                    const de = Math.abs(l[N.LE].x - l[N.RE].x);
                    const ce = (l[N.LE].x + l[N.RE].x) / 2;

                    const mirando =
                        de >= 0.01 &&
                        Math.abs(l[N.NOSE].x - ce) / de < 0.2;

                    let score = 100;

                    if (!hBien) score -= 25;
                    if (encorvado) score -= 40;

                    score = Math.max(0, score);

                    const upd = {
                        posturaScore: score,
                        contactoVisual: mirando ? 100 : 0,
                        frames: mRef.current.frames + 1,
                    };

                    mRef.current = upd;

                    setMetrics(upd);
                }
            }
        } catch (err) {
            console.log(err);
        }

        if (running) {
            setTimeout(processFrame, 120);
        }
    };

    processFrame();

    return () => {
        running = false;
    };
}, [stream]);



    const resetMetrics = useCallback(() => {
        mRef.current = { ...INIT };
        setMetrics({ ...INIT });
    }, []);

    const getSnapshot = useCallback(() => {
        const m = mRef.current;
        const p = latestPoseRef.current;
        return {
            postura_score: m.posturaScore,
            contacto_visual_pct: m.contactoVisual,
            hombros_alineados: p ? Math.abs(p[N.LS].y - p[N.RS].y) < 0.05 : false,
            encorvado: m.posturaScore < 60,
            brazos_cruzados: p ? p[N.LW].x > p[N.NOSE].x && p[N.RW].x < p[N.NOSE].x : false,
            pecho_abierto: true,
            manos_visibles: false,
            manos_gestos: null,
            frames_analizados: m.frames,
        };
    }, []);

    return { metrics, isReady, resetMetrics, getSnapshot, framing, latestPoseRef, latestFaceRef, faceMeshReadyRef };
};
