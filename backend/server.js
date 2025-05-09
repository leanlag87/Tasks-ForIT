// Importar los módulos necesarios
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importamos el router de tareas
const taskRoutes = require("./routes/tasksRoutes");

// Instanciamos Express
const app = express();

// Configurar el puerto
const PORT = process.env.PORT || 3977;

// Middlewares
app.use(cors());
app.use(express.json());

// Todas las rutas definidas en taskRoutes
app.use("/api/tasks", taskRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server ejecutando en el puerto ${PORT}`);
});
