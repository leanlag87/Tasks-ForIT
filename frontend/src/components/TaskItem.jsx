/**
 * Componente TaskItem
 *
 * Renderiza una tarjeta con la información de una tarea individual, permitiendo marcarla como completada,
 * editarla o eliminarla. Recibe la tarea y funciones de manejo como props.
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const TaskItem = ({ task, onDelete, onToggleComplete }) => {
  // La estructura de 'task' que esperamos del backend es:
  // { id: string, title: string, description: string, completed: boolean, createdAt: Date }

  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task.id); // La función onDelete la proveerá TaskList
  };

  const handleToggleComplete = async () => {
    setIsToggling(true);
    await onToggleComplete(task.id, !task.completed); // Pasa el nuevo estado de 'completed'
    setIsToggling(false);
  };

  return (
    <div
      className={`card mb-3 ${task.completed ? "border-success bg-light" : ""}`}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5
              className={`card-title mb-1 ${
                task.completed ? "text-decoration-line-through text-muted" : ""
              }`}
            >
              {task.title}
            </h5>
            <p
              className={`card-text small ${
                task.completed ? "text-decoration-line-through text-muted" : ""
              }`}
            >
              {task.description || (
                <span className="text-muted fst-italic">Sin descripción</span>
              )}
            </p>
          </div>
          {/* Botón para marcar como completada usando un checkbox */}
          <div className="form-check ms-3">
            <input
              className="form-check-input bg-success border-success"
              type="checkbox"
              id={`complete-${task.id}`}
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={isToggling}
              style={{ cursor: "pointer", transform: "scale(1.3)" }}
            />
            <label
              className="form-check-label visually-hidden"
              htmlFor={`complete-${task.id}`}
            >
              {task.completed
                ? "Marcar como pendiente"
                : "Marcar como completada"}
            </label>
          </div>
        </div>

        <p className="card-text mt-2">
          <small className="text-muted">
            Creada: {new Date(task.createdAt).toLocaleDateString()}
          </small>
        </p>

        <div className="mt-2">
          <Link
            to={`/edit/${task.id}`}
            className="btn btn-sm btn-outline-primary me-2"
          >
            Editar
          </Link>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>{" "}
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes valida que task contenga todos los campos requeridos y que las
// funciones de manejo (onDelete, onToggleComplete) estén definidas correctamente
TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
};
