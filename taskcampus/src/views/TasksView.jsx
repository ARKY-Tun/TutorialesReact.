import Card from "../components/Card";
import TaskList from "../components/TaskList";
import TaskSummary from "../components/TaskSummary";

const TasksView = ({
    tareasFiltradas,
    total,
    completadas,
    pendientes,
    filtro,
    onCambiarFiltro,
    busqueda,
    onCambiarBusqueda,
    onToggle,
    onEditarTitulo,
    onEliminar,
    operacionId,
}) => {
    return (
        <div>
            <Card titulo="Estado Actual">
                <TaskSummary
                    total={total}
                    completadas={completadas}
                    pendientes={pendientes}
                    mostrando={tareasFiltradas.length}
                    filtroActual={filtro}
                    busquedaActual={busqueda}
                />
            </Card>

            <Card titulo="Mis Tareas">
                <TaskList
                    tareas={tareasFiltradas}
                    filtro={filtro}
                    onCambiarFiltro={onCambiarFiltro}
                    busqueda={busqueda}
                    onCambiarBusqueda={onCambiarBusqueda}
                    onToggle={onToggle}
                    onEditarTitulo={onEditarTitulo}
                    onEliminar={onEliminar}
                    operacionId={operacionId}
                />
            </Card>
        </div>
    );
};

export default TasksView;