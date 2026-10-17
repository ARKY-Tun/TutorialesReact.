import { useState, useEffect } from "react";
import {
    getTareas,
    postTarea,
    patchTarea,
    deleteTarea,
} from "../services/tareasService";

const useTareas = () => {
    const [tareas, setTareas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [operacionId, setOperacionId] = useState(null);

    const cargarInicial = async () => {
        setCargando(true);
        setError(null);
        try {
            const datos = await getTareas(10);
            const tareasFormateadas = datos.map((t) => ({
                id: t.id,          // Identificador único de interfaz (React key)
                remoteId: t.id,    // Identificador del recurso en JSONPlaceholder (1..10)
                esLocal: false,    // Recurso existente en la API
                titulo: t.title,
                completada: t.completed,
            }));
            setTareas(tareasFormateadas);
        } catch (err) {
            setError(err.message || "Error inesperado al cargar las tareas.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarInicial();
    }, []);

    // Crear tarea (POST) - RF03, RF04, RF12
    const crearTarea = async (titulo) => {
        setGuardando(true);
        setError(null);
        try {
            const respuestaAPI = await postTarea(titulo);
            // JSONPlaceholder devuelve siempre id: 201 en POST.
            // Generamos un id local único y estable para evitar colisiones de keys.
            const idLocalUnico = `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            const nuevaTarea = {
                id: idLocalUnico,
                remoteId: respuestaAPI.id || 201,
                esLocal: true,
                titulo: respuestaAPI.title || titulo,
                completada: Boolean(respuestaAPI.completed),
            };

            setTareas((previas) => [nuevaTarea, ...previas]);
            return { exito: true, tarea: nuevaTarea };
        } catch (err) {
            setError(err.message);
            return { exito: false, error: err.message };
        } finally {
            setGuardando(false);
        }
    };

    // Alternar estado completada/pendiente (PATCH) - RF05, RF12
    const alternarEstadoTarea = async (id) => {
        const tareaObjetivo = tareas.find((t) => t.id === id);
        if (!tareaObjetivo) return { exito: false };

        const nuevoEstado = !tareaObjetivo.completada;
        setOperacionId(id);
        setGuardando(true);
        setError(null);

        try {
            await patchTarea(tareaObjetivo.remoteId, { completed: nuevoEstado });
            setTareas((previas) =>
                previas.map((t) =>
                    t.id === id ? { ...t, completada: nuevoEstado } : t
                )
            );
            return { exito: true };
        } catch (err) {
            setError(err.message);
            return { exito: false, error: err.message };
        } finally {
            setOperacionId(null);
            setGuardando(false);
        }
    };

    // Editar título en línea (PATCH) - RF04, RF06, RF12
    const editarTituloTarea = async (id, nuevoTitulo) => {
        const tituloLimpio = nuevoTitulo.trim();
        if (tituloLimpio.length < 3) {
            const msg = "El título debe contener al menos 3 caracteres válidos.";
            setError(msg);
            return { exito: false, error: msg };
        }

        const tareaObjetivo = tareas.find((t) => t.id === id);
        if (!tareaObjetivo) return { exito: false };

        setOperacionId(id);
        setGuardando(true);
        setError(null);

        try {
            await patchTarea(tareaObjetivo.remoteId, { title: tituloLimpio });
            setTareas((previas) =>
                previas.map((t) =>
                    t.id === id ? { ...t, titulo: tituloLimpio } : t
                )
            );
            return { exito: true };
        } catch (err) {
            setError(err.message);
            return { exito: false, error: err.message };
        } finally {
            setOperacionId(null);
            setGuardando(false);
        }
    };

    // Eliminar tarea (DELETE) - RF07, RF12
    const eliminarTarea = async (id) => {
        const tareaObjetivo = tareas.find((t) => t.id === id);
        if (!tareaObjetivo) return { exito: false };

        setOperacionId(id);
        setGuardando(true);
        setError(null);

        try {
            await deleteTarea(tareaObjetivo.remoteId);
            setTareas((previas) => previas.filter((t) => t.id !== id));
            return { exito: true };
        } catch (err) {
            setError(err.message);
            return { exito: false, error: err.message };
        } finally {
            setOperacionId(null);
            setGuardando(false);
        }
    };

    const limpiarError = () => setError(null);

    return {
        tareas,
        cargando,
        error,
        guardando,
        operacionId,
        cargarInicial,
        crearTarea,
        alternarEstadoTarea,
        editarTituloTarea,
        eliminarTarea,
        limpiarError,
    };
};

export default useTareas;