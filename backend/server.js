//importamos los modulos
const express = require("express");
const cors = require("cors");
require("dotenv").config();

//Instanciamos express
const app = express();

//Configuramos el puerto
const PORT = process.env.PORT || 3977;

//Middlewares
app.use(cors()); //Permitir peticiones de otros dominios
app.use(express.json()); //Parsear el body de las peticiones a json

//Ruta de prueba
app.get("/", (req, res) => {
  res.send("Estoy en la API");
});

//Inicializamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
