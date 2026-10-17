import { useState } from "react";
import Button from "./Button";

const TAREAS_SUGERIDAS = [
    "Preparar informe de laboratorio de React",
    "Estudiar para el certamen de Base de Datos",
    "Revisar apuntes de Algoritmos y Estructuras de Datos",
    "Subir avance del proyecto a GitHub",
    "Resolver guía de ejercicios de Cálculo II",
    "Diseñar wireframes en Figma para interfaz de usuario",
    "Practicar Hooks y Lifting State Up",
    "Leer capítulo sobre concurrencia en Sistemas Operativos",
    "Coordinar reunión con el escuadrón de desarrollo",
    "Implementar validaciones en formularios controlados",
    "Configurar variables de entorno y despliegue",
    "Redactar bibliografía según formato IEEE",
];

const TaskForm = ({ onAgregar, guardando = false }) => {
    const [titulo, setTitulo] = useState("");
    const [errorValidacion, setErrorValidacion] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");
    const [placeholderActual] = useState(() => {
        const idx = Math.floor(Math.random() * TAREAS_SUGERIDAS.length);
        return `Ej: ${TAREAS_SUGERIDAS[idx]}...`;
    });

    const handleGenerarAleatoria = () => {
        const idx = Math.floor(Math.random() * TAREAS_SUGERIDAS.length);
        setTitulo(TAREAS_SUGERIDAS[idx]);
        if (errorValidacion) setErrorValidacion("");
    };

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
                    placeholder={placeholderActual}
                    className="task-input"
                    disabled={guardando}
                    aria-label="Título de la nueva tarea"
                />
                <Button
                    type="button"
                    label="🎲 Aleatoria"
                    variant="secondary"
                    onClick={handleGenerarAleatoria}
                    disabled={guardando}
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