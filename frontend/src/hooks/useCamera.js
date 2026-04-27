// src/hooks/useCamera.js
import { useState, useRef, useCallback } from "react";

export const useCamera = () => {
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true,
            });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
            setError(null);
            setVideoBlob(null);
        } catch (err) {
            setError(
                "No se pudo acceder a la cámara o micrófono. Verifica los permisos.",
            );
            console.error(err);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
            setStream(null);
            if (videoRef.current) videoRef.current.srcObject = null;
        }
    }, [stream]);

    const startRecording = useCallback(() => {
        if (!stream) return;
        try {
            setIsRecording(true);
            chunksRef.current = [];
            const supportedMimeTypes = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
                ? ["video/webm;codecs=vp9"]
                : MediaRecorder.isTypeSupported("video/webm")
                    ? ["video/webm"]
                    : [];
            if (supportedMimeTypes.length === 0) {
                console.warn("Ningún mimeType de MediaRecorder es soportado");
            }
            const mr = new MediaRecorder(stream, { mimeType: supportedMimeTypes[0] || "video/webm" });
            mediaRecorderRef.current = mr;
            mr.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };
            mr.onstop = () =>
                setVideoBlob(new Blob(chunksRef.current, { type: "video/webm" }));
            mr.start();
        } catch (err) {
            console.error("Error al iniciar grabación:", err);
            setError("No se pudo iniciar la grabación. Verifica el formato de video.");
            setIsRecording(false);
        }
    }, [stream]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    return {
        videoRef,
        stream,
        error,
        startCamera,
        stopCamera,
        isRecording,
        videoBlob,
        startRecording,
        stopRecording,
    };
};