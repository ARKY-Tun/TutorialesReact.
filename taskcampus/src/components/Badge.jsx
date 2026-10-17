const Badge = ({ completada, onClick, disabled = false }) => {
    const texto = completada ? "completada" : "pendiente";
    const claseEstado = completada ? "badge-completada" : "badge-pendiente";

    return (
        <span
            className={`badge ${claseEstado} ${onClick && !disabled ? "badge-clickable" : ""}`}
            onClick={!disabled && onClick ? onClick : undefined}
            title={onClick ? "Haz clic para cambiar el estado" : undefined}
        >
            {texto}
        </span>
    );
};

export default Badge;