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
app.get('/talleres', (req, res) => {
    // 1. Extraemos y normalizamos los parámetros de consulta de req.query
    const categoria = String(req.query.categoria || '').trim().toLowerCase();
    const nivel = String(req.query.nivel || '').trim().toLowerCase();
    const soloDisponibles = String(req.query.disponibles || '').trim().toLowerCase() === 'true';

    // 2. Calculamos las plazas restantes sin mutar el array original usando map()
    let listaProcesada = talleres.map((taller) => {
        const plazasRestantes = obtenerPlazasRestantes(taller, inscripciones);
        return { ...taller, plazasRestantes };
    });

    // 3. Filtros acumulativos con filter()
    if (categoria) {
        listaProcesada = listaProcesada.filter((t) => t.categoria.toLowerCase() === categoria);
    }
    if (nivel) {
        listaProcesada = listaProcesada.filter((t) => t.nivel.toLowerCase() === nivel);
    }
    if (soloDisponibles) {
        listaProcesada = listaProcesada.filter((t) => t.plazasRestantes > 0);
    }

    // 4. Renderizamos la plantilla talleres.ejs con los datos procesados
    return res.render('talleres', {
        talleres: listaProcesada,
        filtros: { categoria, nivel, disponibles: soloDisponibles }
    });
});
app.get('/talleres/:id', (req, res) => {
    // Conversión explícita y validación estricta de req.params.id
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).render('detalle', {
            taller: null,
            error: 'El identificador de taller no es válido.'
        });
    }

    // Uso del método find() requerido para localizar el elemento
    const tallerEncontrado = talleres.find((t) => t.id === id);

    if (!tallerEncontrado) {
        return res.status(404).render('detalle', {
            taller: null,
            error: 'El taller solicitado no existe.'
        });
    }

    // Cálculo de plazas restantes para evaluar el estado en la vista
    const plazasRestantes = obtenerPlazasRestantes(tallerEncontrado, inscripciones);

    return res.status(200).render('detalle', {
        taller: { ...tallerEncontrado, plazasRestantes },
        error: null
    });
});
// Escucha del servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});