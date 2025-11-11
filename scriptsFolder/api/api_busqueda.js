import { BASE_URL } from './apiClient.js';

export async function buscarProductos(termino) {
    try {
        const res = await fetch(`${BASE_URL}/productos/buscar?termino=${encodeURIComponent(termino)}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error('❌ Error en buscarProductos:', error);
        throw error;
    }
}
