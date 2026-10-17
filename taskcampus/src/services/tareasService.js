const API_URL = "https://jsonplaceholder.typicode.com/todos";

export const getTareas = async (limite = 10) => {
    const res = await fetch(`${API_URL}?_limit=${limite}`);
    if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}: No se pudieron cargar las tareas desde el servidor.`);
    }
    return await res.json();
};

export const postTarea = async (titulo) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: titulo,
            completed: false,
            userId: 1,
        }),
    });
    if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}: No se pudo crear la tarea en el servidor.`);
    }
    return await res.json();
};

export const patchTarea = async (remoteId, cambios) => {
    const res = await fetch(`${API_URL}/${remoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios),
    });
    if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}: No se pudo actualizar la tarea remota #${remoteId}.`);
    }
    return await res.json();
};

export const deleteTarea = async (remoteId) => {
    const res = await fetch(`${API_URL}/${remoteId}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}: No se pudo eliminar la tarea remota #${remoteId}.`);
    }
    return true;
};