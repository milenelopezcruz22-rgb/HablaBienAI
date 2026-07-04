import { useCallback, useEffect, useRef, useState } from "react";

const INIT = {
    posturaScore: 0,
    contactoVisual: 0,
    frames: 0,
    hombrosAlineados: false,
    encorvado: false,
    brazosCruzados: false,
    estadoBrazos: "sin_datos",
    brazosElevados: false,
    brazosAbiertos: false,
    torsoDeLado: false,
    inclinacionLateral: false,
    rigidezBrazos: false,
    actividadGestual: 0,
    pechoAbierto: false,
    manosVisibles: false,
    movimientoScore: 100,
    porcentajeBuenaPostura: 0,
    porcentajeContactoVisual: 0,
    porcentajeBrazosCruzados: 0,
    porcentajeBrazosAbiertos: 0,
    porcentajeTorsoDeLado: 0,
    porcentajeInclinacionLateral: 0,
    porcentajeRigidezBrazos: 0,
    porcentajeManosVisibles: 0,
    eventos: [],
};

const INIT_FRAMING = { todoVisible: false, faltantes: ["cuerpo"] };
const CONTACT_WINDOW_SIZE = 8;
const MIN_VISIBILITY = 0.45;
const ANALYSIS_INTERVAL_MS = 90;
const UI_UPDATE_INTERVAL_MS = 180;
const MOVEMENT_THRESHOLD = 0.035;
const WRIST_ACTIVITY_THRESHOLD = 0.025;
const ARM_RIGIDITY_THRESHOLD = 0.008;
const EVENT_MIN_DURATION_MS = 1200;

const N = {
    NOSE: 0,
    LEFT_EYE: 2,
    RIGHT_EYE: 5,
    LS: 11,
    RS: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LW: 15,
    RW: 16,
    LH: 23,
    RH: 24,
};

function isVisible(point, minVisibility = MIN_VISIBILITY) {
    return Boolean(
        point &&
        point.x >= 0 &&
        point.x <= 1 &&
        point.y >= 0 &&
        point.y <= 1 &&
        (point.visibility ?? 1) >= minVisibility
    );
}

function getFraming(landmarks) {
    const faltantes = [];

    if (!isVisible(landmarks[N.NOSE])) faltantes.push("rostro");
    if (!isVisible(landmarks[N.LS]) || !isVisible(landmarks[N.RS])) {
        faltantes.push("hombros");
    }
    if (!isVisible(landmarks[N.LH]) || !isVisible(landmarks[N.RH])) {
        faltantes.push("torso");
    }

    return {
        todoVisible: faltantes.length === 0,
        faltantes,
    };
}

function detectCrossedArms(landmarks) {
    const leftWrist = landmarks[N.LW];
    const rightWrist = landmarks[N.RW];
    const leftShoulder = landmarks[N.LS];
    const rightShoulder = landmarks[N.RS];

    if (![leftWrist, rightWrist, leftShoulder, rightShoulder].every(isVisible)) {
        return false;
    }

    const shouldersWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    if (shouldersWidth < 0.05) return false;

    const wristsCrossed =
        leftWrist.x > rightWrist.x &&
        Math.abs(leftWrist.x - rightWrist.x) < shouldersWidth * 1.2;
    const wristsAtChest =
        leftWrist.y > Math.min(leftShoulder.y, rightShoulder.y) &&
        rightWrist.y > Math.min(leftShoulder.y, rightShoulder.y) &&
        leftWrist.y < Math.max(landmarks[N.LH].y, landmarks[N.RH].y) &&
        rightWrist.y < Math.max(landmarks[N.LH].y, landmarks[N.RH].y);

    return wristsCrossed && wristsAtChest;
}

function getArmState(landmarks) {
    const leftShoulder = landmarks[N.LS];
    const rightShoulder = landmarks[N.RS];
    const leftElbow = landmarks[N.LEFT_ELBOW];
    const rightElbow = landmarks[N.RIGHT_ELBOW];
    const leftWrist = landmarks[N.LW];
    const rightWrist = landmarks[N.RW];

    if (![leftShoulder, rightShoulder, leftElbow, rightElbow].every(isVisible)) {
        return {
            estadoBrazos: "sin_datos",
            brazosCruzados: false,
            brazosElevados: false,
            brazosAbiertos: false,
        };
    }

    const shouldersWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    const brazosCruzados = detectCrossedArms(landmarks);
    const brazosElevados =
        leftElbow.y < leftShoulder.y - 0.04 ||
        rightElbow.y < rightShoulder.y - 0.04;
    const brazosAbiertos =
        shouldersWidth > 0.05 &&
        Math.abs(leftElbow.x - rightElbow.x) > shouldersWidth * 1.45 &&
        !brazosCruzados;

    let estadoBrazos = "neutros";
    if (brazosCruzados) estadoBrazos = "cruzados";
    else if (brazosElevados) estadoBrazos = "elevados";
    else if (brazosAbiertos) estadoBrazos = "abiertos";
    else if (!isVisible(leftWrist) || !isVisible(rightWrist)) estadoBrazos = "parcialmente_visibles";

    return { estadoBrazos, brazosCruzados, brazosElevados, brazosAbiertos };
}

function getTorsoState(landmarks) {
    const leftShoulder = landmarks[N.LS];
    const rightShoulder = landmarks[N.RS];
    const leftHip = landmarks[N.LH];
    const rightHip = landmarks[N.RH];

    if (![leftShoulder, rightShoulder, leftHip, rightHip].every(isVisible)) {
        return { torsoDeLado: false, inclinacionLateral: false };
    }

    const shouldersWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    const hipsWidth = Math.abs(leftHip.x - rightHip.x);
    const inclinacionLateral =
        Math.abs(leftShoulder.y - rightShoulder.y) > 0.055 ||
        Math.abs(leftHip.y - rightHip.y) > 0.06;
    const torsoDeLado = shouldersWidth < 0.12 || hipsWidth < 0.1;

    return { torsoDeLado, inclinacionLateral };
}

function createSessionStats() {
    return {
        total: 0,
        buenaPostura: 0,
        contactoVisual: 0,
        brazosCruzados: 0,
        brazosAbiertos: 0,
        torsoDeLado: 0,
        inclinacionLateral: 0,
        rigidezBrazos: 0,
        actividadGestual: 0,
        manosVisibles: 0,
        movimientoExcesivo: 0,
        torsoAnterior: null,
        wristsAnterior: null,
        activeEvents: {},
        eventos: [],
    };
}

function buildBodyRecommendations(metrics) {
    const recomendaciones = [];

    if (metrics.porcentajeBuenaPostura < 70) {
        recomendaciones.push("Mantén la espalda erguida y nivela los hombros durante la exposición.");
    }
    if (metrics.porcentajeContactoVisual < 60) {
        recomendaciones.push("Dirige la mirada hacia la cámara con mayor frecuencia.");
    }
    if (metrics.porcentajeBrazosCruzados > 20) {
        recomendaciones.push("Evita mantener los brazos cruzados; utiliza una postura más abierta.");
    }
    if (metrics.porcentajeTorsoDeLado > 25) {
        recomendaciones.push("Procura mantener el torso orientado hacia el público.");
    }
    if (metrics.porcentajeInclinacionLateral > 25) {
        recomendaciones.push("Distribuye el peso de forma equilibrada y evita inclinarte hacia un lado.");
    }
    if (metrics.porcentajeRigidezBrazos > 65) {
        recomendaciones.push("Acompaña tus ideas con movimientos naturales de brazos y manos.");
    }
    if (metrics.movimientoScore < 65) {
        recomendaciones.push("Reduce los desplazamientos repetitivos para proyectar mayor seguridad.");
    }

    if (!recomendaciones.length) {
        recomendaciones.push("Mantén la postura abierta y acompaña tus ideas con gestos naturales.");
    }

    return recomendaciones.slice(0, 4);
}

function getPercentage(value, total) {
    return total ? Math.round((value / total) * 100) : 0;
}

function updateEvent(stats, type, active, now) {
    const startedAt = stats.activeEvents[type];

    if (active && !startedAt) {
        stats.activeEvents[type] = now;
        return;
    }

    if (!active && startedAt) {
        const durationMs = now - startedAt;
        delete stats.activeEvents[type];

        if (durationMs >= EVENT_MIN_DURATION_MS) {
            stats.eventos.push({
                tipo: type,
                segundo: Math.round(startedAt / 1000),
                duracion_segundos: Math.round(durationMs / 100) / 10,
            });
            stats.eventos = stats.eventos.slice(-20);
        }
    }
}

export const useBodyAnalysis = (videoRef, stream) => {
    const [metrics, setMetrics] = useState(INIT);
    const [isReady, setIsReady] = useState(false);
    const [framing, setFraming] = useState(INIT_FRAMING);

    const poseRef = useRef(null);
    const landmarksRef = useRef(null);
    const metricsRef = useRef(INIT);
    const contactWindowRef = useRef([]);
    const lastUiUpdateRef = useRef(0);
    const sessionStartRef = useRef(0);
    const sessionStatsRef = useRef(createSessionStats());
    const latestPoseRef = useRef(null);

    useEffect(() => {
        if (!window.Pose) {
            console.error("Pose CDN no cargado");
            return;
        }

        let mounted = true;
        const pose = new window.Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`,
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        pose.onResults((results) => {
            const landmarks = results.poseLandmarks || null;
            landmarksRef.current = landmarks;
            latestPoseRef.current = landmarks;
        });

        poseRef.current = pose;
        if (mounted) setIsReady(true);

        return () => {
            mounted = false;
            setIsReady(false);
            poseRef.current = null;
            Promise.resolve(pose.close()).catch(() => {});
        };
    }, []);

    useEffect(() => {
        if (!stream || !videoRef.current || !poseRef.current) return;

        let running = true;
        let timeoutId;
        sessionStartRef.current = performance.now();

        const processFrame = async () => {
            if (!running) return;

            try {
                const video = videoRef.current;

                if (video?.readyState >= 2) {
                    await poseRef.current?.send({ image: video });
                    const landmarks = landmarksRef.current;

                    if (landmarks?.length >= 25) {
                        const nextFraming = getFraming(landmarks);

                        const shouldersCenterY = (landmarks[N.LS].y + landmarks[N.RS].y) / 2;
                        const hipsCenterY = (landmarks[N.LH].y + landmarks[N.RH].y) / 2;
                        const torsoHeight = hipsCenterY - shouldersCenterY;
                        const headHeight = shouldersCenterY - landmarks[N.NOSE].y;

                        const encorvado = torsoHeight <= 0 || headHeight / torsoHeight < 0.3;
                        const hombrosAlineados = Math.abs(landmarks[N.LS].y - landmarks[N.RS].y) < 0.05;
                        const {
                            estadoBrazos,
                            brazosCruzados,
                            brazosElevados,
                            brazosAbiertos,
                        } = getArmState(landmarks);
                        const manosVisibles = isVisible(landmarks[N.LW]) && isVisible(landmarks[N.RW]);
                        const { torsoDeLado, inclinacionLateral } = getTorsoState(landmarks);
                        const torsoCenter = {
                            x: (landmarks[N.LS].x + landmarks[N.RS].x + landmarks[N.LH].x + landmarks[N.RH].x) / 4,
                            y: (landmarks[N.LS].y + landmarks[N.RS].y + landmarks[N.LH].y + landmarks[N.RH].y) / 4,
                        };

                        const eyesDistance = Math.abs(landmarks[N.LEFT_EYE].x - landmarks[N.RIGHT_EYE].x);
                        const eyesCenterX = (landmarks[N.LEFT_EYE].x + landmarks[N.RIGHT_EYE].x) / 2;
                        const mirando =
                            eyesDistance >= 0.01 &&
                            Math.abs(landmarks[N.NOSE].x - eyesCenterX) / eyesDistance < 0.2;

                        const window = [...contactWindowRef.current, mirando ? 100 : 0]
                            .slice(-CONTACT_WINDOW_SIZE);
                        contactWindowRef.current = window;
                        const contactoVisual = Math.round(
                            window.reduce((total, value) => total + value, 0) / window.length
                        );

                        let posturaScore = 100;
                        if (!hombrosAlineados) posturaScore -= 25;
                        if (encorvado) posturaScore -= 40;
                        if (brazosCruzados) posturaScore -= 15;

                        const stats = sessionStatsRef.current;
                        const now = performance.now();
                        const torsoAnterior = stats.torsoAnterior;
                        const desplazamiento = torsoAnterior
                            ? Math.hypot(torsoCenter.x - torsoAnterior.x, torsoCenter.y - torsoAnterior.y)
                            : 0;
                        const movimientoExcesivo = desplazamiento > MOVEMENT_THRESHOLD;
                        const buenaPostura = posturaScore >= 80;
                        const wrists = {
                            lx: landmarks[N.LW].x,
                            ly: landmarks[N.LW].y,
                            rx: landmarks[N.RW].x,
                            ry: landmarks[N.RW].y,
                        };
                        const wristsAnterior = stats.wristsAnterior;
                        const actividadGestual = wristsAnterior
                            ? (
                                Math.hypot(wrists.lx - wristsAnterior.lx, wrists.ly - wristsAnterior.ly) +
                                Math.hypot(wrists.rx - wristsAnterior.rx, wrists.ry - wristsAnterior.ry)
                            ) / 2
                            : 0;
                        const rigidezBrazos =
                            manosVisibles &&
                            actividadGestual < ARM_RIGIDITY_THRESHOLD &&
                            !brazosCruzados;

                        stats.total += 1;
                        if (buenaPostura) stats.buenaPostura += 1;
                        if (mirando) stats.contactoVisual += 1;
                        if (brazosCruzados) stats.brazosCruzados += 1;
                        if (brazosAbiertos) stats.brazosAbiertos += 1;
                        if (torsoDeLado) stats.torsoDeLado += 1;
                        if (inclinacionLateral) stats.inclinacionLateral += 1;
                        if (rigidezBrazos) stats.rigidezBrazos += 1;
                        if (actividadGestual > WRIST_ACTIVITY_THRESHOLD) stats.actividadGestual += 1;
                        if (manosVisibles) stats.manosVisibles += 1;
                        if (movimientoExcesivo) stats.movimientoExcesivo += 1;
                        stats.torsoAnterior = torsoCenter;
                        stats.wristsAnterior = wrists;

                        const elapsed = now - sessionStartRef.current;
                        updateEvent(stats, "postura_incorrecta", !buenaPostura, elapsed);
                        updateEvent(stats, "sin_contacto_visual", !mirando, elapsed);
                        updateEvent(stats, "brazos_cruzados", brazosCruzados, elapsed);
                        updateEvent(stats, "movimiento_excesivo", movimientoExcesivo, elapsed);
                        updateEvent(stats, "torso_de_lado", torsoDeLado, elapsed);
                        updateEvent(stats, "inclinacion_lateral", inclinacionLateral, elapsed);
                        updateEvent(stats, "rigidez_de_brazos", rigidezBrazos, elapsed);

                        const nextMetrics = {
                            posturaScore: Math.max(0, posturaScore),
                            contactoVisual,
                            frames: metricsRef.current.frames + 1,
                            hombrosAlineados,
                            encorvado,
                            brazosCruzados,
                            estadoBrazos,
                            brazosElevados,
                            brazosAbiertos,
                            torsoDeLado,
                            inclinacionLateral,
                            rigidezBrazos,
                            actividadGestual: getPercentage(stats.actividadGestual, stats.total),
                            pechoAbierto: !encorvado && !brazosCruzados,
                            manosVisibles,
                            movimientoScore: 100 - getPercentage(stats.movimientoExcesivo, stats.total),
                            porcentajeBuenaPostura: getPercentage(stats.buenaPostura, stats.total),
                            porcentajeContactoVisual: getPercentage(stats.contactoVisual, stats.total),
                            porcentajeBrazosCruzados: getPercentage(stats.brazosCruzados, stats.total),
                            porcentajeBrazosAbiertos: getPercentage(stats.brazosAbiertos, stats.total),
                            porcentajeTorsoDeLado: getPercentage(stats.torsoDeLado, stats.total),
                            porcentajeInclinacionLateral: getPercentage(stats.inclinacionLateral, stats.total),
                            porcentajeRigidezBrazos: getPercentage(stats.rigidezBrazos, stats.total),
                            porcentajeManosVisibles: getPercentage(stats.manosVisibles, stats.total),
                            eventos: [...stats.eventos],
                        };
                        nextMetrics.recomendacionesCorporales = buildBodyRecommendations(nextMetrics);

                        metricsRef.current = nextMetrics;
                        if (now - lastUiUpdateRef.current >= UI_UPDATE_INTERVAL_MS) {
                            lastUiUpdateRef.current = now;
                            setFraming(nextFraming);
                            setMetrics(nextMetrics);
                        }
                    } else {
                        setFraming(INIT_FRAMING);
                    }
                }
            } catch (error) {
                console.warn("No se pudo analizar el frame:", error);
            }

            if (running) timeoutId = setTimeout(processFrame, ANALYSIS_INTERVAL_MS);
        };

        processFrame();

        return () => {
            running = false;
            clearTimeout(timeoutId);
        };
    }, [stream, videoRef]);

    const resetMetrics = useCallback(() => {
        metricsRef.current = { ...INIT };
        contactWindowRef.current = [];
        lastUiUpdateRef.current = 0;
        sessionStartRef.current = 0;
        sessionStatsRef.current = createSessionStats();
        latestPoseRef.current = null;
        setMetrics({ ...INIT });
        setFraming({ ...INIT_FRAMING });
    }, []);

    const getSnapshot = useCallback(() => {
        const current = metricsRef.current;

        return {
            postura_score: current.posturaScore,
            contacto_visual_pct: current.contactoVisual,
            hombros_alineados: current.hombrosAlineados,
            encorvado: current.encorvado,
            brazos_cruzados: current.brazosCruzados,
            estado_brazos: current.estadoBrazos,
            brazos_elevados: current.brazosElevados,
            brazos_abiertos: current.brazosAbiertos,
            torso_de_lado: current.torsoDeLado,
            inclinacion_lateral: current.inclinacionLateral,
            rigidez_brazos: current.rigidezBrazos,
            actividad_gestual_pct: current.actividadGestual,
            pecho_abierto: current.pechoAbierto,
            manos_visibles: current.manosVisibles,
            movimiento_score: current.movimientoScore,
            porcentaje_buena_postura: current.porcentajeBuenaPostura,
            porcentaje_contacto_visual: current.porcentajeContactoVisual,
            porcentaje_brazos_cruzados: current.porcentajeBrazosCruzados,
            porcentaje_brazos_abiertos: current.porcentajeBrazosAbiertos,
            porcentaje_torso_de_lado: current.porcentajeTorsoDeLado,
            porcentaje_inclinacion_lateral: current.porcentajeInclinacionLateral,
            porcentaje_rigidez_brazos: current.porcentajeRigidezBrazos,
            recomendaciones_corporales: current.recomendacionesCorporales,
            porcentaje_manos_visibles: current.porcentajeManosVisibles,
            eventos: current.eventos,
            frames_analizados: current.frames,
        };
    }, []);

    return {
        metrics,
        isReady,
        resetMetrics,
        getSnapshot,
        framing,
        latestPoseRef,
    };
};
