// src/hooks/useAnalysis.js
import { useState, useEffect, useRef, useCallback } from "react";

export const useAnalysis = (stream, isActive) => {
    const [postura, setPostura] = useState(null);
    const [contactoVisual, setContactoVisual] = useState(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const [audioEstado, setAudioEstado] = useState(null);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animFrameRef = useRef(null);
    const posturaIntervalRef = useRef(null);
    const contactoIntervalRef = useRef(null);
    const isActiveRef = useRef(isActive);

    // Mantener ref actualizado para usar en callbacks
    useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    // --- Audio Analysis ---
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
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            const source = ctx.createMediaStreamSource(mediaStream);
            source.connect(analyser);
            audioContextRef.current = ctx;
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
                    animFrameRef.current = requestAnimationFrame(tick);
                } catch (innerErr) {
                    console.warn("Error en análisis de audio:", innerErr);
                }
            };
            tick();
        } catch (e) {
            console.warn("Audio analysis not available:", e);
        }
    }, []);

    const stopAudio = useCallback(() => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setAudioLevel(0);
        setAudioEstado(null);
    }, []);

    // Cleanup en desmontaje
    useEffect(() => {
        return () => {
            stopAudio();
            clearInterval(posturaIntervalRef.current);
            clearInterval(contactoIntervalRef.current);
        };
    }, [stopAudio]);

    // Control de simulación basado en isActive
    useEffect(() => {
        if (!isActive) {
            setPostura(null);
            setContactoVisual(null);
            clearInterval(posturaIntervalRef.current);
            clearInterval(contactoIntervalRef.current);
            return;
        }

        // Iniciar simulación
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

        return () => {
            clearInterval(posturaIntervalRef.current);
            clearInterval(contactoIntervalRef.current);
        };
    }, [isActive]);

    // Control de audio basado en stream
    useEffect(() => {
        if (stream && isActive) {
            startAudio(stream);
        } else {
            stopAudio();
        }
    }, [stream, isActive, startAudio, stopAudio]);

    return { postura, contactoVisual, audioLevel, audioEstado };
};
