import { useState } from "react";
import Badge from "./Badge";
import Button from "./Button";

const TaskItem = ({
    tarea,
    onToggle,
    onEditarTitulo,
    onSolicitarEliminar,
    enOperacion = false,
}) => {
    const [editando, setEditando] = useState(false);
    const [borradorTitulo, setBorradorTitulo] = useState(tarea.titulo);
    const [errorEdicion, setErrorEdicion] = useState("");

    const iniciarEdicion = () => {
        if (enOperacion) return;
        setBorradorTitulo(tarea.titulo);
        setErrorEdicion("");
        setEditando(true);
    };

    const cancelarEdicion = () => {
        setBorradorTitulo(tarea.titulo);
        setErrorEdicion("");
        setEditando(false);
    };

    const guardarEdicion = async () => {
        const limpio = borradorTitulo.trim();

        if (limpio === "" || limpio.length < 3) {
            setErrorEdicion("El título no puede estar vacío (mínimo 3 caracteres).");
            return;
        }

        if (limpio === tarea.titulo) {
            setEditando(false);
            setErrorEdicion("");
            return;
        }

        const res = await onEditarTitulo(tarea.id, limpio);
        if (res && res.exito) {
            setEditando(false);
            setErrorEdicion("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            guardarEdicion();
        } else if (e.key === "Escape") {
            cancelarEdicion();
        }
    };

    return (
        <li className={`task-item ${enOperacion ? "task-item-loading" : ""}`}>
            <div className="task-item-main">
                <div className="task-item-left">
                    <Badge
                        completada={tarea.completada}
                        onClick={() => onToggle(tarea.id)}
                        disabled={enOperacion}
                    />

                    {editando ? (
                        <div className="task-edit-container">
                            <input
                                type="text"
                                className="task-edit-input"
                                value={borradorTitulo}
                                onChange={(e) => {
                                    setBorradorTitulo(e.target.value);
                                    if (errorEdicion) setErrorEdicion("");
                                }}
                                onBlur={guardarEdicion}
                                onKeyDown={handleKeyDown}
                                disabled={enOperacion}
                                autoFocus
                            />
                            <span className="task-edit-hint">
                                Enter o clic fuera para guardar · Esc para cancelar
                            </span>
                        </div>
                    ) : (
                        <span
                            className={`task-title ${tarea.completada ? "task-title-completed" : ""}`}
                            onDoubleClick={iniciarEdicion}
                            title="Doble clic para editar el título"
                        >
                            {tarea.titulo}
                            {tarea.esLocal && (
                                <small className="task-local-tag" title="Creada en esta sesión (ID local único)">
                                    {" "}(sesión)
                                </small>
                            )}
                        </span>
                    )}
                </div>

                <div className="task-item-actions">
                    {!editando && (
                        <Button
                            label="Editar"
                            variant="secondary"
                            onClick={iniciarEdicion}
                            disabled={enOperacion}
                        />
                    )}
                    <Button
                        label={
                            enOperacion
                                ? "Procesando..."
                                : tarea.completada
                                    ? "Desmarcar"
                                    : "Completar"
                        }
                        variant={tarea.completada ? "success" : "primary"}
                        onClick={() => onToggle(tarea.id)}
                        disabled={enOperacion}
                    />
                    <Button
                        label="Eliminar"
                        variant="danger"
                        onClick={() => onSolicitarEliminar(tarea.id)}
                        disabled={enOperacion}
                    />
                </div>
            </div>

            {errorEdicion && <p className="form-error task-item-error">⚠️ {errorEdicion}</p>}
        </li>
    );
};

export default TaskItem;