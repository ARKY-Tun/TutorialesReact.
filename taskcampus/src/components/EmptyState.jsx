const EmptyState = ({ icono = "📭", mensaje = "No hay tareas para mostrar." }) => {
    return (
        <div className="empty-state">
            <span className="empty-state-icon">{icono}</span>
            <p className="empty-state-text">{mensaje}</p>
        </div>
    );
};

export default EmptyState;