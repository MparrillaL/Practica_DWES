// src/app.js
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { talleres, inscripciones } from './data/datos.js';
import {
    obtenerPlazasRestantes,
    estaInscrito,
    validarInscripcion,
    siguienteId,
    buscarTallerPorId,
} from './utils/utilidades.js';
import { middlewareRegistro } from './middlewares/registro.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de registro (debe estar PRIMERO para capturar todas las peticiones)
app.use(middlewareRegistro);

// 1. Middlewares: urlencoded rellena req.body con los datos de los formularios HTML
app.use(express.urlencoded({ extended: false }));

// 2. Motor de plantillas EJS (ruta absoluta para que funcione desde cualquier directorio)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// La raíz redirige al listado
app.get('/', (req, res) => res.redirect('/talleres'));

// RUTA 1: listado de talleres con filtros opcionales (categoria, nivel, disponibles)
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
// RUTA 2: ficha de un taller con su estado de plazas
app.get('/talleres/:id', (req, res) => {
    const taller = buscarTallerPorId(req.params.id, talleres);

    if (!taller) {
        return res.status(404).render('error', {
            url: req.originalUrl
        });
    }

    // Cálculo de plazas restantes para evaluar el estado en la vista
    const plazasRestantes = obtenerPlazasRestantes(taller, inscripciones);

    return res.status(200).render('detalle', {
        taller: { ...taller, plazasRestantes },
        error: null
    });
});
// RUTA 3: muestra el formulario de inscripción (solo si el taller existe y tiene plazas)
app.get('/talleres/:id/inscripcion', (req, res) => {
  const taller = buscarTallerPorId(req.params.id, talleres);

  if (!taller) {
    return res.status(404).render('error', {
      url: req.originalUrl
    });
  }

  // Comprobar si quedan plazas libres antes de mostrar el formulario
  const plazasRestantes = obtenerPlazasRestantes(taller, inscripciones);

  if (plazasRestantes <= 0) {
    return res.status(400).render('detalle', {
      taller: { ...taller, plazasRestantes },
      error: 'No es posible inscribirse: este taller no dispone de plazas libres.'
    });
  }

  // Renderizar el formulario pasando objetos vacíos para valores y errores
  return res.render('inscripcion', {
    taller,
    valores: {},
    errores: {}
  });
});

// ==========================================
// RUTA 4: Procesar Formulario de Inscripción (POST /talleres/:id/inscripcion)
// ==========================================
app.post('/talleres/:id/inscripcion', (req, res) => {
  const taller = buscarTallerPorId(req.params.id, talleres);

  if (!taller) {
    return res.status(404).render('error', {
      url: req.originalUrl
    });
  }

  // 1. Validar formato de los datos recibidos (limpia y valida solo estructura)
  const datos = req.body ?? {};
  const { valores, errores } = validarInscripcion(datos);
  const { nombre, email } = valores;

  // 2. Si no hay errores de formato, validar reglas de negocio
  if (Object.keys(errores).length === 0) {
    if (estaInscrito(taller.id, email, inscripciones)) {
      errores.email = 'Este correo ya se encuentra inscrito en este taller.';
    }

    const plazasRestantes = obtenerPlazasRestantes(taller, inscripciones);
    if (plazasRestantes <= 0) {
      errores.plazas = 'Lo sentimos, este taller no dispone de plazas libres.';
    }
  }

  // 3. Si hay errores (formato o negocio), mostrar formulario con solo campos correctos
  if (Object.keys(errores).length > 0) {
    return res.status(400).render('inscripcion', {
      taller,
      valores: {
        nombre: errores.nombre ? '' : nombre,
        email: errores.email ? '' : email
      },
      errores
    });
  }

  // 4. SI TODO ES VÁLIDO: guardar la inscripción con los datos ya normalizados
  const nuevaInscripcion = {
    id: siguienteId(inscripciones),
    tallerId: taller.id,
    nombre,
    email
  };

  inscripciones.push(nuevaInscripcion);

  // 5. PRG (Post/Redirect/Get): redirección 303 para que F5 no reenvíe el formulario
  return res.redirect(303, `/talleres/${taller.id}`);
});

// ==========================================
// Manejador global de rutas inexistentes (404)
// Debe estar al final, después de todas las rutas definidas
// ==========================================
app.use((req, res) => {
  res.status(404).render('error', {
    url: req.originalUrl
  });
});

// Escucha del servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});