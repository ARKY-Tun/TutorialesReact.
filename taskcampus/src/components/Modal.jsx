import Button from "./Button";

const Modal = ({
    visible,
    mensaje,
    onConfirmar,
    onCancelar,
    procesando = false,
}) => {
    if (!visible) return null;

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-box">
                <h3 className="modal-title">Confirmar acción</h3>
                <p className="modal-message">{mensaje}</p>
                <div className="modal-acciones">
                    <Button
                        label={procesando ? "Eliminando..." : "Confirmar"}
                        variant="danger"
                        onClick={onConfirmar}
                        disabled={procesando}
                    />
                    <Button
                        label="Cancelar"
                        variant="secondary"
                        onClick={onCancelar}
                        disabled={procesando}
                    />
                </div>
            </div>
        </div>
    );
};

export default Modal;