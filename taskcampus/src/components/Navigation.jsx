import Button from "./Button";

const Navigation = ({ vistaActiva, onCambiarVista, totalPendientes }) => {
    const items = [
        { id: "resumen", label: "Resumen", icono: "📊" },
        { id: "tareas", label: `Tareas (${totalPendientes} pend.)`, icono: "📋" },
        { id: "nueva", label: "Nueva tarea", icono: "➕" },
    ];

    return (
        <nav className="navigation" aria-label="Navegación principal">
            {items.map((item) => (
                <Button
                    key={item.id}
                    label={item.label}
                    icono={item.icono}
                    variant={vistaActiva === item.id ? "primary" : "secondary"}
                    onClick={() => onCambiarVista(item.id)}
                />
            ))}
        </nav>
    );
};

export default Navigation;