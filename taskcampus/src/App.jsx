import { useState, useEffect } from "react";
import useTareas from "./hooks/useTareas";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Modal from "./components/Modal";
import Button from "./components/Button";
import SummaryView from "./views/SummaryView";
import TasksView from "./views/TasksView";
import NewTaskView from "./views/NewTaskView";
import "./App.css";

const App = () => {
  const {
    tareas,
    cargando,
    error,
    guardando,
    operacionId,
    cargarInicial,
    crearTarea,
    alternarEstadoTarea,
    editarTituloTarea,
    eliminarTarea,
    limpiarError,
  } = useTareas();

  // Navegación entre vistas ('resumen' | 'tareas' | 'nueva') - RF13
  const [vistaActiva, setVistaActiva] = useState("tareas");

  // Estados levantados (Lifting State Up) para conservar filtros entre vistas - RF08, RF09
  const [filtro, setFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");

  // Estado para controlar el Modal de eliminación - RF07
  const [tareaAEliminar, setTareaAEliminar] = useState(null);

  // ESTADOS DERIVADOS (sin duplicar useState) - RF08, RF09, RF10
  const totalTareas = tareas.length;
  const totalCompletadas = tareas.filter((t) => t.completada).length;
  const totalPendientes = tareas.filter((t) => !t.completada).length;

  const tareasFiltradas = tareas.filter((t) => {
    const coincideEstado =
      filtro === "completadas"
        ? t.completada
        : filtro === "pendientes"
          ? !t.completada
          : true;

    const textoBusqueda = busqueda.trim().toLowerCase();
    const coincideTexto =
      textoBusqueda === "" || t.titulo.toLowerCase().includes(textoBusqueda);

    return coincideEstado && coincideTexto;
  });

  // Efecto secundario: actualizar el título de la pestaña del navegador
  useEffect(() => {
    document.title = `TaskCampus (${totalPendientes} pendientes)`;
  }, [totalPendientes]);

  const handleConfirmarEliminacion = async () => {
    if (tareaAEliminar === null) return;
    const res = await eliminarTarea(tareaAEliminar);
    if (res && res.exito) {
      setTareaAEliminar(null);
    }
  };

  return (
    <main className="app-container">
      <Header
        title="TaskCampus"
        description="Gestor de tareas académicas"
      />

      <Navigation
        vistaActiva={vistaActiva}
        onCambiarVista={setVistaActiva}
        totalPendientes={totalPendientes}
      />

      {/* Mensaje de error HTTP o de operación - RF11 */}
      {error && (
        <div className="estado-error" role="alert">
          <span>⚠️ {error}</span>
          <div className="estado-error-actions">
            <Button
              label="Reintentar carga inicial"
              variant="secondary"
              onClick={cargarInicial}
              disabled={cargando || guardando}
            />
            <Button
              label="Cerrar aviso"
              variant="danger"
              onClick={limpiarError}
            />
          </div>
        </div>
      )}

      {/* Indicador de operación global en curso - RF12 */}
      {guardando && !cargando && (
        <div className="estado-operacion">
          ⏳ Sincronizando operación con el servidor...
        </div>
      )}

      {/* Carga inicial vs Renderizado de la vista activa - RF11, RF13 */}
      {cargando ? (
        <div className="estado-carga">
          ⏳ Cargando las primeras 10 tareas desde JSONPlaceholder...
        </div>
      ) : (
        <>
          {vistaActiva === "resumen" && (
            <SummaryView
              total={totalTareas}
              completadas={totalCompletadas}
              pendientes={totalPendientes}
              mostrando={tareasFiltradas.length}
              filtroActual={filtro}
              busquedaActual={busqueda}
              onIrATareas={() => setVistaActiva("tareas")}
              onIrANueva={() => setVistaActiva("nueva")}
            />
          )}

          {vistaActiva === "tareas" && (
            <TasksView
              tareasFiltradas={tareasFiltradas}
              total={totalTareas}
              completadas={totalCompletadas}
              pendientes={totalPendientes}
              filtro={filtro}
              onCambiarFiltro={setFiltro}
              busqueda={busqueda}
              onCambiarBusqueda={setBusqueda}
              onToggle={alternarEstadoTarea}
              onEditarTitulo={editarTituloTarea}
              onEliminar={setTareaAEliminar}
              operacionId={operacionId}
            />
          )}

          {vistaActiva === "nueva" && (
            <NewTaskView
              onAgregar={crearTarea}
              guardando={guardando}
              total={totalTareas}
              pendientes={totalPendientes}
              onIrATareas={() => setVistaActiva("tareas")}
            />
          )}
        </>
      )}

      <Modal
        visible={tareaAEliminar !== null}
        mensaje="¿Seguro que deseas eliminar esta tarea académica? Esta acción enviará una petición DELETE y quitará la tarea de la sesión."
        onConfirmar={handleConfirmarEliminacion}
        onCancelar={() => setTareaAEliminar(null)}
        procesando={guardando}
      />
    </main>
  );
};

export default App;
