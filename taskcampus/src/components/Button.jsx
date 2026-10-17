const Button = ({
    label,
    onClick,
    variant = "primary",
    disabled = false,
    type = "button",
    icono = null,
}) => {
    return (
        <button
            type={type}
            className={`btn btn-${variant}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icono && <span className="btn-icon">{icono}</span>}
            <span>{label}</span>
        </button>
    );
};

export default Button;