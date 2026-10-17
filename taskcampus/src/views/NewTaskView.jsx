import Card from "../components/Card";
import TaskForm from "../components/TaskForm";
import Button from "../components/Button";

const NewTaskView = ({
    onAgregar,
    guardando,
    total,
    pendientes,
    onIrATareas,
}) => {
    return (
        <div>
            <Card titulo="Agregar Nueva Tarea Académica">
                <p className="view-subtitle">
                    Registra una nueva actividad académica. Se enviará mediante una petición{" "}
                    <code>POST</code> a la API y quedará disponible inmediatamente en tu sesión.
                </p>
                <TaskForm onAgregar={onAgregar} guardando={guardando} />

                <div className="new-task-footer">
                    <span>
                        Actualmente tienes <strong>{total}</strong> tareas registradas (
                        <strong>{pendientes}</strong> pendientes).
                    </span>
                    <Button
                        label="Ir al listado de tareas"
                        icono="📋"
                        variant="secondary"
                        onClick={onIrATareas}
                    />
                </div>
            </Card>
        </div>
    );
};

export default NewTaskView;