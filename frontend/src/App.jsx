import { Routes, Route, Link } from "react-router-dom";
import { TaskList } from "./components/TaskList";
import { TaskForm } from "./components/TaskForm";

// const TaskListPlaceholder = () => {
//   return (
//     <div>
//       <h2>Lista de Tareas</h2>
//       <p>Aquí se mostrarán las tareas.</p>
//     </div>
//   );
// };

// const TaskFormPlaceholder = () => {
//   return (
//     <div>
//       <h2>Formulario de Tarea</h2>
//       <p>Aquí se podrá agregar o editar una tarea.</p>
//     </div>
//   );
// };

const NotFound = () => {
  return (
    <div>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe.</p>
    </div>
  );
};

function App() {
  return (
    <>
      <div className="container mt-4">
        <header className="mb-4">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                Gestor de Tareas
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Inicio (Lista)
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/new">
                      Crear Tarea
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/new" element={<TaskForm />} />
            {/* Podríamos tener una ruta para editar: /edit/:id */}
            {/* <Route path="/edit/:taskId" element={<TaskFormPlaceholder editMode={true} />} /> */}
            <Route path="*" element={<NotFound />} />{" "}
            {/* Ruta catch-all para 404 */}
          </Routes>
        </main>

        <footer className="text-center mt-5 py-3 bg-light">
          <p>© {new Date().getFullYear()} Mi App de Tareas</p>
        </footer>
      </div>
    </>
  );
}

export default App;
