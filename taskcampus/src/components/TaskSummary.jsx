const TaskSummary = ({
  total,
  completadas,
  pendientes,
  mostrando,
  filtroActual,
  busquedaActual,
}) => {
  const etiquetaFiltro =
    busquedaActual.trim() !== ""
      ? `${filtroActual} + "${busquedaActual.trim()}"`
      : filtroActual;

  return (
    <div className="summary-grid">
      <div className="summary-item">
        <p className="summary-numero summary-total">{total}</p>
        <p className="summary-label">Total de tareas</p>
      </div>

      <div className="summary-item">
        <p className="summary-numero summary-completadas">{completadas}</p>
        <p className="summary-label">Completadas</p>
      </div>

      <div className="summary-item">
        <p className="summary-numero summary-pendientes">{pendientes}</p>
        <p className="summary-label">Pendientes</p>
      </div>

      <div className="summary-item">
        <p className="summary-numero summary-mostrando">{mostrando}</p>
        <p className="summary-label">Mostrando ({etiquetaFiltro})</p>
      </div>
    </div>
  );
};

export default TaskSummary;