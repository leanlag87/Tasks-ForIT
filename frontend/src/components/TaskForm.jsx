import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const TaskForm = () => {
  // Aquí irán los estados y funciones para manejar el formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false); // Para mantener el estado 'completed' si se edita
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Para la carga inicial de datos en modo edición
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { taskId } = useParams(); // Obtiene 'taskId' de la URL si existe
  const isEditMode = Boolean(taskId);

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      const fetchTaskData = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message ||
                `Error ${response.status}: No se pudo cargar la tarea para editar`
            );
          }
          const taskToEdit = await response.json();
          setTitle(taskToEdit.title);
          setDescription(taskToEdit.description || "");
          setCompleted(taskToEdit.completed); // Guardamos el estado 'completed'
        } catch (err) {
          console.error("Error fetching task for edit:", err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTaskData();
    } else {
      // Modo creación, reseteamos por si se navegó desde un modo edición
      setTitle("");
      setDescription("");
      setCompleted(false);
      setError(null);
    }
  }, [taskId, isEditMode, navigate]); // Dependencias del efecto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    setIsSubmitting(true);

    const taskPayload = { title, description, completed }; // Incluimos 'completed' para PUT

    try {
      let response;
      if (isEditMode) {
        // Modo Edición: Petición PUT
        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskPayload), // Enviamos el payload completo
          }
        );
      } else {
        // Modo Creación: Petición POST
        // En POST, el backend asigna 'completed: false' por defecto
        // así que no es estrictamente necesario enviarlo, pero no hace daño.
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error ${response.status}: No se pudo ${
              isEditMode ? "actualizar" : "crear"
            } la tarea`
        );
      }

      navigate("/"); // Redirigir a la lista de tareas
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} task:`, err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando datos de la tarea...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>{isEditMode ? "Editar Tarea" : "Crear Nueva Tarea"}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Título
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese el título de la tarea"
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
            placeholder="Describa las tareas que quiere realizar"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-primary me-2"
          disabled={isSubmitting || (isLoading && isEditMode)}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm"></span>{" "}
              Guardando...
            </>
          ) : isEditMode ? (
            "Guardar Cambios"
          ) : (
            "Crear Tarea"
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/")}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};
