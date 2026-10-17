import Card from "../components/Card";
import TaskSummary from "../components/TaskSummary";
import Button from "../components/Button";

const SummaryView = ({
    total,
    completadas,
    pendientes,
    mostrando,
    filtroActual,
    busquedaActual,
    onIrATareas,
    onIrANueva,
}) => {
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;

    return (
        <div>
            <Card titulo="Resumen de Tareas Académicas">
                <TaskSummary
                    total={total}
                    completadas={completadas}
                    pendientes={pendientes}
                    mostrando={mostrando}
                    filtroActual={filtroActual}
                    busquedaActual={busquedaActual}
                />

                <div className="progress-section">
                    <div className="progress-label">
                        <span>Progreso general de la sesión</span>
                        <strong>{porcentaje}% completado</strong>
                    </div>
                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${porcentaje}%` }}
                        />
                    </div>
                </div>

                <div className="summary-actions">
                    <Button
                        label="Ver listado de tareas"
                        icono="📋"
                        variant="primary"
                        onClick={onIrATareas}
                    />
                    <Button
                        label="Crear nueva tarea"
                        icono="➕"
                        variant="secondary"
                        onClick={onIrANueva}
                    />
                </div>
            </Card>
        </div>
    );
};

export default SummaryView;