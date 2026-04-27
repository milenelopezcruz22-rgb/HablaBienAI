const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function analizarAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'grabacion.webm');

    const response = await fetch(`${API_URL}/api/v1/analizar`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error al analizar el audio' }));
        throw new Error(error.detail || 'Error al analizar el audio');
    }

    return response.json();
}
