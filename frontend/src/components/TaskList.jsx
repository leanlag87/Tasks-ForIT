import React, { useEffect, useState } from "react";
import { TaskItem } from "./TaskItem";

export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        // Usamos la variable de entorno para la URL base de la API
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tasks`
        );

        if (!response.ok) {
          // Si la respuesta no es ok (ej. 404, 500), lanzamos un error
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Error ${response.status}: No se pudieron obtener las tareas`
          );
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); // El array vacío [] significa que este efecto se ejecuta solo una vez (al montar el componente)

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar las tareas: {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <p className="text-center text-muted">
        No hay tareas para mostrar. ¡Crea una nueva!
      </p>
    );
  }

  return (
    <div>
      <h2 className="mb-3">Mis Tareas</h2>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};
