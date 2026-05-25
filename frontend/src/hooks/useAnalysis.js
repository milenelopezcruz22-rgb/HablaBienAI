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

            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            const source = ctx.createMediaStreamSource(mediaStream);
            source.connect(analyser);
            ctxRef.current = ctx;
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
                    tickRef.current = requestAnimationFrame(tick);
                } catch (e) {
                    console.warn("Audio error:", e);
                }
            };
            tick();
        } catch (e) {
            console.warn("Audio analysis not available:", e);
        }
    }, []);

    const stopAudio = useCallback(() => {
        if (tickRef.current) cancelAnimationFrame(tickRef.current);
        if (ctxRef.current) {
            ctxRef.current.close();
            ctxRef.current = null;
        }
        tickRef.current = null;
    }, []);

    useEffect(() => {
        if (stream && isActive) {
            startAudio(stream);
        }
        return () => {
            stopAudio();
            setAudioLevel(0);
            setAudioEstado(null);
        };
    }, [stream, isActive, startAudio, stopAudio]);

    return { postura, contactoVisual, audioLevel, audioEstado, framing, bodyMetrics: metrics, latestPoseRef, latestFaceRef, faceMeshReadyRef };
};
