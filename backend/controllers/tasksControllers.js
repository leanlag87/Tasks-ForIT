const taskData = require("../data/data");

const getAllTasks = (req, res) => {
  const tasks = taskData.getAll();
  res.status(200).json(tasks);
};

const getTaskById = (req, res) => {
  const { id } = req.params;
  const task = taskData.findById(id); // Usamos la función findById que ya teníamos en data/tasks.js

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json(task);
};

const createTask = (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "El título es obligatorio" });
  }

  const newTask = taskData.add({ title, description });

  res.status(201).json(newTask);
};

const updateTask = (req, res) => {
  const { id } = req.params;
  const updates = req.body; // { title, description, completed }

  const updatedTask = taskData.update(id, updates);

  if (!updatedTask) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  res.status(200).json(updatedTask);
};

const deleteTask = (req, res) => {
  const { id } = req.params;

  const wasDeleted = taskData.remove(id);

  if (!wasDeleted) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  res.status(200).json({ message: "Tarea eliminada con éxito" });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
