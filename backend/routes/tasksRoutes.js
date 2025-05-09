const express = require("express");
const router = express.Router(); // Creamos una instancia del Router de Express

// Importamos los métodos del controlador de tareas
const taskController = require("../controllers/tasksControllers");

// Definimos las rutas para las tareas

// Obtener todas las tareas
router.get("/", taskController.getAllTasks);

// Crear una nueva tarea
router.post("/", taskController.createTask);

// Actualizar una tarea existente
router.put("/:id", taskController.updateTask);

// Eliminar una tarea
router.delete("/:id", taskController.deleteTask);

module.exports = router;
