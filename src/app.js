// src/app.js
import express from 'express';
import { talleres, inscripciones } from './data/datos.js';
import {
  obtenerPlazasRestantes,
  estaInscrito,
  validarInscripcion,
} from './utils/utilidades.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Configuración de middlewares (procesamiento de formularios y recursos estáticos)
app.use(express.urlencoded({ extended: false })); // Permite leer req.body de formularios
app.use(express.json()); // Parsea cuerpos JSON
app.use(express.static('public')); // Servidor de archivos estáticos (/css/estilos.css)

// 2. Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// --- RUTAS (SE AÑADIRÁN EN LA FASE 2 Y FASE 3) ---

// Escucha del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});