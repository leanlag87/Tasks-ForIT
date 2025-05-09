const { v4: uuidv4 } = require("uuid"); // Importamos la librería uuid para generar IDs únicos

let tasks = []; // Array vacio para almacenar las tareas en memoria

//Obtener y devolver todas las tareas
const getAll = () => {
  return tasks;
};

//Buscar una tarea por id y devolverla
const findById = (id) => {
  return tasks.find((task) => task.id === id);
};

//Buscar el índice de una tarea por id y devolverlo
const findIndexById = (id) => {
  return tasks.findIndex((task) => task.id === id);
};

//Agregar una nueva tarea y devolverla
const add = (taskData) => {
  const newTask = {
    id: uuidv4(),
    title: taskData.title,
    description: taskData.description || "",
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask); // Agregamos la nueva tarea al array de tareas
  return newTask; // Devolvemos la nueva tarea
};

//Actualizar una tarea existente y devolverla
const update = (id, taskUpdates) => {
  const taskIndex = findIndexById(id);
  if (taskIndex === -1) {
    return null; // Si no se encuentra la tarea, devolvemos null
  }

  const originalTask = tasks[taskIndex];
  const updatedTask = {
    ...originalTask,
    title:
      taskUpdates.title !== undefined ? taskUpdates.title : originalTask.title,
    description:
      taskUpdates.description !== undefined
        ? taskUpdates.description
        : originalTask.description,
    completed:
      taskUpdates.completed !== undefined
        ? taskUpdates.completed
        : originalTask.completed,
  };
  tasks[taskIndex] = updatedTask;
  return updatedTask;
};

//Eliminar una tarea por id y devolver true si se eliminó, false si no se encontró
const remove = (id) => {
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  return tasks.length < initialLength; // Devuelve true si se eliminó, false si no se encontró
};

module.exports = {
  getAll,
  findById,
  findIndexById,
  add,
  update,
  remove,
};
