import { useState } from "react";
import Button from "./Button";

const TaskForm = ({ onAgregar, guardando = false }) => {
    const [titulo, setTitulo] = useState("");
    const [errorValidacion, setErrorValidacion] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensajeExito("");

        const tituloLimpio = titulo.trim();
        if (tituloLimpio === "") {
            setErrorValidacion("El título de la tarea no puede estar vacío ni contener solo espacios.");
            return;
        }
        if (tituloLimpio.length < 3) {
            setErrorValidacion("El título debe tener al menos 3 caracteres útiles.");
            return;
        }

        setErrorValidacion("");
        const resultado = await onAgregar(tituloLimpio);

        if (resultado && resultado.exito) {
            setTitulo("");
            setMensajeExito(`Tarea "${tituloLimpio}" creada correctamente.`);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="task-form" noValidate>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => {
                        setTitulo(e.target.value);
                        if (errorValidacion) setErrorValidacion("");
                    }}
                    placeholder="Ej: Preparar informe de laboratorio de React..."
                    className="task-input"
                    disabled={guardando}
                    aria-label="Título de la nueva tarea"
                />
                <Button
                    type="submit"
                    label={guardando ? "Guardando..." : "Agregar"}
                    icono="➕"
                    variant="primary"
                    disabled={guardando}
                />
            </form>

            {errorValidacion && <p className="form-error">⚠️ {errorValidacion}</p>}
            {mensajeExito && <p className="form-success">✅ {mensajeExito}</p>}
        </div>
    );
};

export default TaskForm;