import React from "react";

import PropTypes from "prop-types";

export const TaskItem = ({ task }) => {
  // La estructura de 'task' que esperamos del backend es:
  // { id: string, title: string, description: string, completed: boolean, createdAt: Date }

  return (
    <div className={`card mb-3 ${task.completed ? "border-success" : ""}`}>
      <div className="card-body">
        <h5
          className={`card-title ${
            task.completed ? "text-decoration-line-through text-muted" : ""
          }`}
        >
          {task.title}
        </h5>
        <p
          className={`card-text ${
            task.completed ? "text-decoration-line-through text-muted" : ""
          }`}
        >
          {task.description || (
            <span className="text-muted fst-italic">Sin descripción</span>
          )}
        </p>
        <p className="card-text">
          <small className="text-muted">
            Creada: {new Date(task.createdAt).toLocaleDateString()} - Estado:{" "}
            {task.completed ? "Completada" : "Pendiente"}
          </small>
        </p>
        {/* Aquí irán los botones de acción más adelante */}
        <div className="mt-2">
          <button className="btn btn-sm btn-outline-primary me-2" disabled>
            Editar (Próx.)
          </button>
          <button className="btn btn-sm btn-outline-danger me-2" disabled>
            Eliminar (Próx.)
          </button>
          <button className="btn btn-sm btn-outline-success" disabled>
            {task.completed
              ? "Marcar Pendiente (Próx.)"
              : "Marcar Completada (Próx.)"}
          </button>
        </div>
      </div>
    </div>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired, // Viene como string ISO del backend, Date lo parsea
  }).isRequired,
};
