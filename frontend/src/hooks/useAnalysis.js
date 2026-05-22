<<<<<<< HEAD
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useBodyAnalysis } from "./useBodyAnalysis";

function getPosturaLabel(score) {
    if (score >= 80) return "excelente";
    if (score >= 50) return "buena";
    return "mejorar";
}

function getContactoLabel(pct) {
    if (pct >= 70) return "estable";
    if (pct >= 40) return "intermitente";
    return "ausente";
}

export const useAnalysis = (stream, isActive, videoRef) => {
    const [audioLevel, setAudioLevel] = useState(0);
    const [audioEstado, setAudioEstado] = useState(null);
    const [noDetectTimeout, setNoDetectTimeout] = useState(false);

    const ctxRef = useRef(null);
    const analyserRef = useRef(null);
    const tickRef = useRef(null);

    const { metrics, isReady, framing, latestPoseRef, latestFaceRef, faceMeshReadyRef } = useBodyAnalysis(videoRef, stream);

    useEffect(() => {
        if (!isReady || !stream || !isActive) {
            setNoDetectTimeout(false);
            return;
        }
        if (metrics.frames > 0) {
            setNoDetectTimeout(false);
            return;
        }
        const t = setTimeout(() => setNoDetectTimeout(true), 8000);
        return () => clearTimeout(t);
    }, [isReady, stream, isActive, metrics.frames]);

    const postura = useMemo(() => {
        if (!stream || !isActive) return null;
        if (!isReady) return "esperando";
        if (!metrics.frames) {
            if (noDetectTimeout) return "nodetect";
            return "esperando";
        }
        return getPosturaLabel(metrics.posturaScore);
    }, [metrics.posturaScore, metrics.frames, isReady, stream, isActive, noDetectTimeout]);

    const contactoVisual = useMemo(() => {
        if (!stream || !isActive) return null;
        if (!isReady) return "esperando";
        if (!metrics.frames) {
            if (noDetectTimeout) return "nodetect";
            return "esperando";
        }
        return getContactoLabel(metrics.contactoVisual);
    }, [metrics.contactoVisual, metrics.frames, isReady, stream, isActive, noDetectTimeout]);

    const startAudio = useCallback((mediaStream) => {
        try {
            if (!mediaStream || !window.AudioContext) return;
            const hasAudioTrack = mediaStream.getAudioTracks().length > 0;
            if (!hasAudioTrack) return;

=======
// src/hooks/useAnalysis.js
import { useState, useEffect, useRef, useCallback } from "react";

export const useAnalysis = (stream, isActive) => {
    const [postura, setPostura] = useState(null); // null | 'excelente' | 'buena' | 'mejorar'
    const [contactoVisual, setContactoVisual] = useState(null); // null | 'estable' | 'intermitente' | 'ausente'
    const [audioLevel, setAudioLevel] = useState(0); // 0-100
    const [audioEstado, setAudioEstado] = useState(null); // null | 'optimo' | 'bajo' | 'alto'

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animFrameRef = useRef(null);
    const posturaIntervalRef = useRef(null);
    const contactoIntervalRef = useRef(null);

    // --- Audio Analysis (real) ---
    const startAudio = useCallback((mediaStream) => {
        try {
            if (!mediaStream || !window.AudioContext) {
                console.warn("AudioContext no disponible o stream inválido");
                return;
            }
            const hasAudioTrack = mediaStream.getAudioTracks().length > 0;
            if (!hasAudioTrack) {
                console.warn("El stream no tiene track de audio");
                return;
            }
>>>>>>> origin/main
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            const source = ctx.createMediaStreamSource(mediaStream);
            source.connect(analyser);
<<<<<<< HEAD
            ctxRef.current = ctx;
=======
            audioContextRef.current = ctx;
>>>>>>> origin/main
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const tick = () => {
                try {
                    analyser.getByteFrequencyData(dataArray);
                    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
                    const level = Math.min(100, Math.round((avg / 128) * 100));
                    setAudioLevel(level);
                    if (level < 10) setAudioEstado("bajo");
                    else if (level > 75) setAudioEstado("alto");
                    else setAudioEstado("optimo");
<<<<<<< HEAD
                    tickRef.current = requestAnimationFrame(tick);
                } catch (e) {
                    console.warn("Audio error:", e);
=======
                    animFrameRef.current = requestAnimationFrame(tick);
                } catch (innerErr) {
                    console.warn("Error en análisis de audio:", innerErr);
>>>>>>> origin/main
                }
            };
            tick();
        } catch (e) {
            console.warn("Audio analysis not available:", e);
        }
    }, []);

    const stopAudio = useCallback(() => {
<<<<<<< HEAD
        if (tickRef.current) cancelAnimationFrame(tickRef.current);
        if (ctxRef.current) {
            ctxRef.current.close();
            ctxRef.current = null;
        }
        tickRef.current = null;
=======
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setAudioLevel(0);
        setAudioEstado(null);
    }, []);

    // --- Simulated postura & contacto visual ---
    const startSimulation = useCallback(() => {
        const posturas = ["excelente", "buena", "mejorar"];
        const contactos = ["estable", "intermitente", "ausente"];

        // Initialize
        setPostura("buena");
        setContactoVisual("estable");

        posturaIntervalRef.current = setInterval(() => {
            const weights = [0.6, 0.3, 0.1];
            const r = Math.random();
            if (r < weights[0]) setPostura("excelente");
            else if (r < weights[0] + weights[1]) setPostura("buena");
            else setPostura("mejorar");
        }, 3000);

        contactoIntervalRef.current = setInterval(() => {
            const r = Math.random();
            if (r < 0.65) setContactoVisual("estable");
            else if (r < 0.9) setContactoVisual("intermitente");
            else setContactoVisual("ausente");
        }, 2500);
    }, []);

    const stopSimulation = useCallback(() => {
        clearInterval(posturaIntervalRef.current);
        clearInterval(contactoIntervalRef.current);
        setPostura(null);
        setContactoVisual(null);
>>>>>>> origin/main
    }, []);

    useEffect(() => {
        if (stream && isActive) {
            startAudio(stream);
<<<<<<< HEAD
        }
        return () => {
            stopAudio();
            setAudioLevel(0);
            setAudioEstado(null);
        };
    }, [stream, isActive, startAudio, stopAudio]);

    return { postura, contactoVisual, audioLevel, audioEstado, framing, bodyMetrics: metrics, latestPoseRef, latestFaceRef, faceMeshReadyRef };
};
=======
            startSimulation();
        } else {
            stopAudio();
            stopSimulation();
        }
        return () => {
            stopAudio();
            stopSimulation();
        };
    }, [stream, isActive]);

    return { postura, contactoVisual, audioLevel, audioEstado };
};
>>>>>>> origin/main
