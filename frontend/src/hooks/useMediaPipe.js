export const useMediaPipe = () => {
    const analizar = () => {
        return {
            postura: 0,
            manos: 0,
            estabilidad: 0,
            mirada: 0
        };
    };

    return { analizar };
};