# TaskCampus - Gestor de Tareas Académicas (Laboratorio React)

Aplicación web construida con **React + Vite (JavaScript)** para la gestión de tareas académicas, integrando componentes reutilizables, estado elevado (*lifting state up*), formularios controlados, edición en línea, filtros combinados y consumo de API REST (CRUD) mediante hooks personalizados y capa de servicios.

---

## 1. Requisitos de Entorno y Versiones Utilizadas

- **Node.js:** `v22.x` / `v24.x` (compatible con `v18+` / `v20+`)
- **npm:** `v10.x` / `v11.x`
- **Bundler:** Vite + `@vitejs/plugin-react`
- **Dependencias de producción:** `react`, `react-dom` (sin bibliotecas externas adicionales).

---

## 2. Instalación, Ejecución y Compilación

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd taskcampus
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abrir en el navegador [http://localhost:5173/](http://localhost:5173/).

4. **Compilar para producción (verificación de build):**
   ```bash
   npm run build
   ```

---

## 3. Estructura del Proyecto y Vistas

```plaintext
src/
├── components/       # Componentes reutilizables de presentación (Header, Navigation, Button, Badge, Card, Modal, EmptyState, TaskForm, TaskList, TaskItem, TaskSummary)
├── views/            # Vistas principales (SummaryView, TasksView, NewTaskView)
├── hooks/            # Hook personalizado useTareas.js (estado y coordinación CRUD)
├── services/         # Capa de comunicación HTTP (tareasService.js)
├── App.jsx           # Coordinador raíz (estado elevado de filtros, búsqueda y navegación)
├── App.css           # Estilos globales en escala de blancos y azules
└── main.jsx          # Punto de entrada de React
```

### Vistas implementadas:
- **Resumen (`SummaryView.jsx`):** Presenta el total de tareas, pendientes, completadas, cantidad mostrada según el filtro activo y barra de progreso porcentual.
- **Tareas (`TasksView.jsx`):** Presenta el resumen sincronizado, botones de filtro por estado, buscador por texto, listado dinámico con edición en línea (doble clic), cambio de estado y eliminación con modal de confirmación.
- **Nueva tarea (`NewTaskView.jsx`):** Presenta el formulario controlado con validación para crear tareas mediante `POST`.

---

## 4. Comparación entre el Proyecto Base (Tutorial 06) y el Desarrollo Final

| Elemento | Proyecto Base Recibido (Tutorial 06) | Desarrollo Realizado por el Equipo (Tutorial 12 + Laboratorio) |
| :--- | :--- | :--- |
| **`App.jsx`** | Entregaba un total fijo (`total={3}`) y ejecutaba un `alert()` de prueba. | Coordina el hook `useTareas`, eleva el estado de filtros, búsqueda y vista activa (`vistaActiva`), calcula contadores derivados y gestiona el `Modal`. |
| **`TaskList.jsx`** | Mostraba 3 tareas escritas manualmente en JSX (`tasks[0]`, `tasks[1]`, `tasks[2]`) con botones que disparaban `alert()`. | Renderiza dinámicamente con `.map()` y key estable, integra filtros por estado, búsqueda por texto e invoca a `TaskItem` y `EmptyState`. |
| **`TaskSummary.jsx`** | Mostraba un texto fijo con una sola prop `total`. | Muestra 4 indicadores calculados en tiempo real: Total, Completadas, Pendientes y Mostrando (según filtro y búsqueda). |
| **`ActionButton.jsx`** | Botón de prueba con `alert()`. | Sustituido por el componente genérico y reutilizable `Button.jsx` con soporte para variantes (`primary`, `secondary`, `success`, `danger`), íconos y estado `disabled`. |
| **Persistencia y Datos** | Arreglo estático de 3 strings en código. | Consumo real de JSONPlaceholder (GET, POST, PATCH, DELETE) separado en `tareasService.js` y `useTareas.js`. |

---

## 5. Limitaciones de la API Simulada (Alcance de Persistencia)

La aplicación consume [JSONPlaceholder Todos](https://jsonplaceholder.typicode.com/todos). Dado que JSONPlaceholder es una API de práctica:
1. Las peticiones `POST`, `PATCH` y `DELETE` responden con códigos HTTP reales (`200`/`201`) pero no persisten los cambios de manera permanente en el servidor remoto.
2. Durante la sesión activa, todas las creaciones, ediciones, cambios de estado y eliminaciones se mantienen íntegras en el estado de React, incluso al navegar entre las vistas Resumen, Tareas y Nueva tarea.
3. Al recargar el navegador (`F5`), la aplicación vuelve a consultar las 10 tareas iniciales mediante `GET`.

---

## 6. Investigación Aplicada al Proyecto

### 6.1. Navegación entre vistas sin recarga
- **Explicación:** Se representó la vista activa mediante `const [vistaActiva, setVistaActiva] = useState("tareas")` en `App.jsx`. El componente `Navigation.jsx` recibe `vistaActiva` y el callback `onCambiarVista`. Mediante renderizado condicional (`vistaActiva === "resumen" && <SummaryView ... />`) se monta la vista seleccionada sin recargar el documento HTML ni perder el estado alojado en `App`.
- **Archivos donde se aplicó:** `src/App.jsx`, `src/components/Navigation.jsx`, `src/views/SummaryView.jsx`, `src/views/TasksView.jsx`, `src/views/NewTaskView.jsx`.
- **Procedimiento de verificación:** Filtrar por "Pendientes" en la vista Tareas, crear una tarea en la vista Nueva tarea y pasar a la vista Resumen; se comprueba que tanto la nueva tarea como el filtro seleccionado se conservan.
- **Fuentes consultadas:** Documentación oficial de React (*Sharing State Between Components* y *Conditional Rendering*, [react.dev](https://react.dev)).

### 6.2. Estado derivado
- **Explicación:** Evita almacenar en `useState` valores que pueden calcularse directamente a partir del estado existente en cada renderizado, previniendo desincronizaciones. Los contadores (`totalTareas`, `totalCompletadas`, `totalPendientes`) y el arreglo `tareasFiltradas` se calculan al vuelo a partir de `tareas`, `filtro` y `busqueda`.
- **Archivos donde se aplicó:** `src/App.jsx` y `src/components/TaskSummary.jsx`.
- **Procedimiento de verificación:** Marcar una tarea como completada o escribir en el buscador; el contador "Mostrando" y los contadores de pendientes/completadas se actualizan en el mismo ciclo de renderizado.
- **Fuentes consultadas:** Documentación oficial de React (*Choosing the State Structure - Avoid redundant state*, [react.dev](https://react.dev)).

### 6.3. Actualización funcional del estado
- **Explicación:** Cuando el nuevo estado depende del estado anterior (especialmente tras operaciones asíncronas `await fetch`), usar `setTareas((previas) => ...)` garantiza trabajar sobre la referencia más reciente del arreglo, evitando condiciones de carrera (*stale closures*) y mutaciones directas.
- **Archivos donde se aplicó:** `src/hooks/useTareas.js` (funciones `crearTarea`, `alternarEstadoTarea`, `editarTituloTarea` y `eliminarTarea`).
- **Procedimiento de verificación:** Ejecutar cambios de estado o creaciones sucesivas rápidamente y verificar que ninguna tarea previa se sobrescribe ni desaparece.
- **Fuentes consultadas:** Documentación oficial de React (*Queueing a Series of State Updates*, [react.dev](https://react.dev)).

### 6.4. Identificadores y API simulada
- **Explicación:** JSONPlaceholder devuelve siempre `{ id: 201 }` al crear recursos con `POST`. Si se usara ese `id` directamente como `key` en React, al crear dos tareas seguidas habría claves duplicadas y al editar o eliminar una se afectaría a ambas. Para resolverlo, cada tarea separa su identificador de interfaz (`id: "local-<timestamp>-<random>"`) de su identificador remoto (`remoteId: 201`).
- **Archivos donde se aplicó:** `src/hooks/useTareas.js`, `src/components/TaskItem.jsx`, `src/components/TaskList.jsx`.
- **Procedimiento de verificación:** Crear dos tareas nuevas consecutivas en Nueva tarea, ir a Tareas, editar o eliminar solo una de ellas y verificar en consola que no existen advertencias de *duplicate key* y que solo se modifica la tarea seleccionada.
- **Fuentes consultadas:** Documentación de JSONPlaceholder ([jsonplaceholder.typicode.com/guide](https://jsonplaceholder.typicode.com/guide)) y React (*Rendering Lists - Rules of keys*, [react.dev](https://react.dev)).

---

## 7. Tabla de Pruebas y Evidencias Verificables

| Código / Caso Probado | Pasos Ejecutados | Resultado Esperado | Resultado Obtenido | Evidencia Asociada |
| :--- | :--- | :--- | :--- | :--- |
| **RF01 - Carga inicial GET** | Iniciar la app con `npm run dev`. | Muestra indicador de carga y luego renderiza 10 tareas desde JSONPlaceholder. | Se cargan las 10 tareas iniciales y los contadores marcan Total: 10. | `src/services/tareasService.js` (`getTareas`) y `src/hooks/useTareas.js`. |
| **RF03 / RF04 - Creación y Validación** | Ir a Nueva tarea, intentar enviar vacío o con 2 letras; luego enviar "Estudiar Hooks en React". | Rechaza entradas inválidas con mensaje en rojo; con título válido ejecuta POST y agrega la tarea. | Muestra advertencia al fallar validación y crea la tarea al inicio de la lista cuando es válido. | `src/components/TaskForm.jsx` y `src/views/NewTaskView.jsx`. |
| **RF05 - Alternar estado** | Hacer clic en el botón "Completar" o "Desmarcar" de una tarea. | Envía petición PATCH, actualiza el Badge, tacha/destacha el texto y actualiza contadores. | Estado actualizado en la lista y en `TaskSummary` sin mutar el estado previo. | `src/hooks/useTareas.js` (`alternarEstadoTarea`) y `src/components/TaskItem.jsx`. |
| **RF06 - Edición en línea** | Hacer doble clic en el título de una tarea, modificar el texto y presionar Enter (o perder foco). | Si es válido (>= 3 caracteres), envía PATCH y actualiza el título; si es vacío, muestra error. | El título se actualiza en línea y rechaza textos vacíos o de solo espacios. | `src/components/TaskItem.jsx` (`guardarEdicion`). |
| **RF07 - Eliminar con confirmación** | Hacer clic en "Eliminar", probar "Cancelar" y luego "Confirmar". | "Cancelar" cierra el modal conservando la tarea; "Confirmar" ejecuta DELETE y la quita. | Modal controla la acción destructiva y actualiza el listado y el resumen. | `src/components/Modal.jsx` y `src/App.jsx`. |
| **RF08 / RF09 / RF10 - Filtros, Búsqueda y Resumen** | Seleccionar filtro "Pendientes" y escribir "qui" en el buscador. | Combina filtro de estado + texto (case-insensitive) y actualiza el contador "Mostrando". | Lista muestra únicamente las coincidencias y el resumen distingue Total vs Mostrando. | `src/App.jsx` (`tareasFiltradas`) y `src/components/TaskList.jsx`. |
| **RF11 / RF12 - Carga, Errores y Operaciones en curso** | Buscar un texto inexistente ("xyz123") o ejecutar una acción observando los botones. | Muestra EmptyState cuando no hay coincidencias y deshabilita controles mientras dura la petición. | Los botones cambian a "Procesando..." (disabled) y se muestra EmptyState si la lista queda vacía. | `src/components/EmptyState.jsx` y `src/components/TaskItem.jsx`. |
| **RF13 - Navegación coherente** | Aplicar un filtro en Tareas, ir a Resumen, luego a Nueva tarea y volver a Tareas. | Cambia de vista sin recargar el navegador y conserva las tareas creadas y el filtro activo. | Navegación fluida manteniendo el estado en `App.jsx`. | `src/components/Navigation.jsx` y `src/App.jsx`. |
---