import Button from "./Button";
import EmptyState from "./EmptyState";
import TaskItem from "./TaskItem";

const TaskList = ({
  tareas,
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
      <div className="filters-toolbar">
        <div className="filters-buttons">
          <Button
            label="Todas"
            icono="📋"
            onClick={() => onCambiarFiltro("todas")}
            variant={filtro === "todas" ? "primary" : "secondary"}
          />
          <Button
            label="Pendientes"
            icono="⏳"
            onClick={() => onCambiarFiltro("pendientes")}
            variant={filtro === "pendientes" ? "primary" : "secondary"}
          />
          <Button
            label="Completadas"
            icono="✅"
            onClick={() => onCambiarFiltro("completadas")}
            variant={filtro === "completadas" ? "primary" : "secondary"}
          />
        </div>

        <div className="search-box">
          <input
            type="search"
            value={busqueda}
            onChange={(e) => onCambiarBusqueda(e.target.value)}
            placeholder="🔍 Buscar tarea por título..."
            className="task-input search-input"
            aria-label="Buscar tarea por título"
          />
          {busqueda && (
            <Button
              label="Limpiar"
              variant="secondary"
              onClick={() => onCambiarBusqueda("")}
            />
          )}
        </div>
      </div>

      <p className="edit-tip">
        💡 <em>Tip: Haz doble clic sobre cualquier título (o presiona &quot;Editar&quot;) para modificarlo en línea.</em>
      </p>

      {tareas.length === 0 ? (
        <EmptyState
          icono="🎉"
          mensaje="No se encontraron tareas que coincidan con el filtro y la búsqueda actual."
        />
      ) : (
        <ul className="task-list">
          {tareas.map((tarea) => (
            <TaskItem
              key={tarea.id}
              tarea={tarea}
              onToggle={onToggle}
              onEditarTitulo={onEditarTitulo}
              onSolicitarEliminar={onEliminar}
              enOperacion={operacionId === tarea.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;