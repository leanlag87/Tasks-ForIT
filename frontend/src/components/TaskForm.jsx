import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const TaskForm = ({ onTaskCreated }) => {
  // Aquí irán los estados y funciones para manejar el formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error ${response.status}: No se pudo crear la tarea`
        );
      }

      // const newTask = await response.json(); // La nueva tarea creada

      // Opcional: llamar a una función callback para actualizar la lista en el componente padre
      if (onTaskCreated) {
        // onTaskCreated(newTask); // Esto requeriría levantar el estado o un refetch en TaskList
      }

      // Limpiar formulario
      setTitle("");
      setDescription("");
      // Redirigir a la lista de tareas
      navigate("/");
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Crear Nueva Tarea</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Título
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Descripción
          </label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Creando...
            </>
          ) : (
            "Crear Tarea"
          )}
        </button>
      </form>
    </div>
  );
};

TaskForm.propTypes = {
  onTaskCreated: PropTypes.func, // Opcional por ahora
};
