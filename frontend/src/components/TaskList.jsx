import React, { useCallback, useEffect, useState } from "react";
import { TaskItem } from "./TaskItem";
import { Link } from "react-router-dom";

export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usamos useCallback para memoizar fetchTasks si alguna vez la pasamos como dependencia
  // o si se vuelve más compleja. Por ahora, es una optimización menor.
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`
      );
      if (!response.ok) {
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
      // Limpiar tareas si hay un error para no mostrar datos viejos
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []); // Dependencia vacía, solo se crea una vez

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Ejecuta fetchTasks cuando el componente se monta o si fetchTasks cambia

  const handleDeleteTask = async (taskId) => {
    // Optimistic UI update (opcional):
    // const originalTasks = [...tasks];
    // setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        // Si la respuesta no es OK (ej. 404, o un 200 con error que el backend no debería enviar con DELETE 204)
        // Intentamos leer un mensaje de error si lo hay (poco probable con 204)
        let errorMessage = `Error ${response.status}: No se pudo eliminar la tarea.`;
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const errorData = await response.json().catch(() => null); // Evitar error si el body no es JSON
          errorMessage = errorData?.message || errorMessage;
        }
        throw new Error(errorMessage);
      }
      // Si es exitoso (204 No Content), actualizamos la lista filtrando la tarea eliminada
      // setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId)); // Ya no es necesario si no hacemos UI optimista
      // Mejor, volvemos a cargar las tareas para asegurar consistencia, o filtramos si estamos seguros.
      // Para este caso, filtrar es seguro y más eficiente si el DELETE fue 204
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(`Error al eliminar: ${err.message}`);
      // Si hubo un error, podríamos revertir la UI optimista si la implementamos
      // setTasks(originalTasks);
      // O simplemente mostrar el error y el usuario puede reintentar/refrescar
    }
  };

  const handleToggleCompleteTask = async (taskId, newCompletedState) => {
    // Optimistic UI update (opcional):
    // const originalTasks = [...tasks];
    // setTasks(prevTasks =>
    //   prevTasks.map(task =>
    //     task.id === taskId ? { ...task, completed: newCompletedState } : task
    //   )
    // );

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: newCompletedState }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error ${response.status}: No se pudo actualizar la tarea`
        );
      }

      const updatedTask = await response.json();
      // Actualizar la tarea específica en el estado local
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      console.error("Error toggling task complete:", err);
      setError(`Error al actualizar: ${err.message}`);
      // Si hubo un error, podríamos revertir la UI optimista si la implementamos
      // setTasks(originalTasks);
    }
  };

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

  // Mostrar error general de carga si existe y no hay tareas para mostrar
  if (error && tasks.length === 0) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar las tareas: {error}
      </div>
    );
  }
  // Mostrar error de operación si existe, incluso si hay tareas (el error podría ser de una acción)
  if (error && tasks.length > 0) {
    // Podríamos mostrar este error de forma más sutil, como un toast
    console.warn("Operación fallida, mostrando error sobre la lista:", error);
  }

  if (tasks.length === 0 && !error) {
    // Añadido !error para que no se muestre si el error es de "no se pudo cargar"
    return (
      <div className="text-center">
        <p className="text-muted">No hay tareas para mostrar.</p>
        <Link to="/new" className="btn btn-primary">
          Crear Nueva Tarea
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Mostrar error de operación de forma visible si lo hay */}
      {error && (
        <div className="alert alert-warning my-2">
          Error en la última operación: {error}. La lista puede no estar
          actualizada.
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Mis Tareas</h2>
        <Link to="/new" className="btn btn-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-plus-lg me-1"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
            />
          </svg>
          Nueva Tarea
        </Link>
      </div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleCompleteTask}
        />
      ))}
    </div>
  );
};
