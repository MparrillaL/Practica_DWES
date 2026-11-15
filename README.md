# Sistema de inscripción a talleres y actividades

Práctica de Desarrollo Web en Entorno Servidor (DWES). Aplicación hecha con Node.js, Express y EJS para gestionar los talleres de unas jornadas tecnológicas. Los datos se guardan en memoria (se pierden al reiniciar el servidor).

- Repositorio: https://github.com/MparrillaL/Practica_DWES
- Chat usado como apoyo: **(https://gemini.google.com/share/d/1zY4cVk52PGe9yds6OS69ZQu5ID7M1lMU?usp=sharing)**

## Cómo ejecutarla

```bash
npm install
npm start
```

El servidor arranca en http://localhost:3000 (se puede cambiar con la variable `PORT`).

## Estructura del proyecto

```
├── package.json
├── src
│   ├── app.js                    # servidor Express y rutas
│   ├── data/datos.js             # colecciones talleres e inscripciones (3 elementos cada una)
│   ├── utils/utilidades.js       # funciones que no dependen de req/res
│   └── middlewares/registro.js   # middleware de logging de peticiones
└── views
    ├── talleres.ejs        # listado con filtros
    ├── detalle.ejs         # ficha del taller
    ├── inscripcion.ejs     # formulario de inscripción
    ├── error.ejs           # página de error 404
    └── partials            # cabecera y pie comunes
```

## Funcionalidades Adicionales (Addendum)

### Middleware de Logging

La aplicación incluye un middleware propio (`src/middlewares/registro.js`) que se ejecuta para **todas las peticiones** recibidas por el servidor. Este middleware registra en consola:

- **Fecha y hora** de la petición (formato `DD/MM/YYYY HH:MM:SS`)
- **Método HTTP** utilizado (GET, POST, etc.)
- **URL solicitada** (incluyendo parámetros de consulta)

**Ejemplo de salida en consola:**
```
[15/11/2026 17:14:00] GET /talleres
[15/11/2026 17:14:25] GET /talleres/1
[15/11/2026 17:14:40] POST /talleres/2/inscripcion
[15/11/2026 17:14:44] GET /ruta-inexistente
```

El middleware está **correctamente posicionado** al inicio de la cadena de middlewares de Express para capturar todas las peticiones sin perder ninguna. Usa `req.originalUrl` para preservar la URL completa con los parámetros de consulta.

### Tratamiento Global de Rutas Inexistentes (404)

Se ha agregado un manejador global para cualquier ruta que no esté definida en la aplicación. Este manejador:

1. **Devuelve el código HTTP 404** (Not Found)
2. **Renderiza la vista `error.ejs`** integrada con el diseño de la aplicación (incluye header, footer y botones de navegación)
3. **Muestra la URL solicitada** para que el usuario vea exactamente qué página pidió

El manejador se encuentra **al final de todas las rutas definidas** en `app.js`, asegurando que solo se activa cuando ninguna otra ruta coincide. No utiliza `next()` porque es el último middleware de la cadena.

**Ejemplo de petición a ruta inexistente:**
```bash
curl -i http://localhost:3000/ruta-inexistente
```

**Respuesta esperada:**
```
HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8
...
<h2>Error 404 - Página no encontrada</h2>
<p>Lo sentimos, el recurso que solicitaste no existe.</p>
<p>URL solicitada: <code>/ruta-inexistente</code></p>
```

### 1. Listado de talleres y filtros (`GET /talleres`)

Se leen `categoria`, `nivel` y `disponibles` de `req.query`, se convierten a texto con `String()`, y se limpian con `trim()` y `toLowerCase()`. Primero se usa `map()` para añadir a cada taller su `plazasRestantes` (sin modificar el array original) y después se aplican los filtros con `filter()` solo si el parámetro viene informado, así se pueden combinar. `disponibles` solo se activa si vale exactamente `true`.

En la vista, el formulario de filtros usa `method="get"`, que es el equivalente en HTML de las llamadas con curl.

### 2. Cálculo de plazas restantes

La función `obtenerPlazasRestantes(taller, inscripciones)` filtra las inscripciones del taller con `filter()` y devuelve `plazas - número de inscripciones`.

### 3. Ficha del taller (`GET /talleres/:id`)

El `id` se convierte con `Number()` y se comprueba que sea un entero positivo; si no, se devuelve 404 con un mensaje, así un identificador manipulado (por ejemplo `abc`) no provoca errores. El taller se busca con `find()`. La vista `detalle.ejs` muestra un estado según las plazas restantes:

- Más de una plaza: "N plazas disponibles"
- Una plaza: "Última plaza disponible"
- Ninguna: "Completo" (y se oculta el enlace de inscripción)

### 4. Formulario de inscripción (`GET /talleres/:id/inscripcion`)

Se valida el `id`, se comprueba que el taller existe y que quedan plazas, y se muestra el formulario. Si el taller no existe o está completo se muestra un error en lugar del formulario.

### 5. Alta de inscripción (`POST /talleres/:id/inscripcion`)

El middleware `express.urlencoded` rellena `req.body` con los datos del formulario. Como los datos del navegador no son fiables, se convierten a texto y se limpian antes de usarlos. Después se llama a `validarInscripcion`, que comprueba:

- que el nombre existe y tiene entre 2 y 100 caracteres,
- que el correo tiene formato válido,
- que el correo no está ya inscrito en ese taller (`estaInscrito`, que usa `some()`),
- que quedan plazas.

Si hay errores se responde con 400 y se vuelve a mostrar el formulario con los mensajes, conservando solo los campos que estaban bien. Si todo es correcto se guarda la inscripción (con `siguienteId`) y se aplica **PRG**: se responde con una redirección 303 a `/talleres/:id` para que al recargar la página no se reenvíe el formulario.

### Funciones de `src/utils/utilidades.js`

| Función | Qué hace |
|---|---|
| `obtenerPlazasRestantes(taller, inscripciones)` | Plazas totales menos inscripciones del taller |
| `estaInscrito(tallerId, email, inscripciones)` | Devuelve `true` si el correo ya está inscrito en ese taller |
| `validarInscripcion(datos, taller, inscripciones)` | Devuelve un objeto con los errores (vacío si todo es válido) |
| `siguienteId(inscripciones)` | Calcula el siguiente id de inscripción |

Estas funciones no usan `req` ni `res`, por eso están en un fichero aparte y `app.js` las importa.

## Ejemplos con curl

Y su equivalente en HTML entre paréntesis. Con el servidor en marcha en el puerto 3000. En Windows PowerShell hay que usar `curl.exe` en lugar de `curl`, y comillas en las URLs con `&`.

### Listado de talleres
```bash
curl -i http://localhost:3000/talleres
```
(HTML: enlace "Ver Talleres" de la cabecera.)

### Filtro por categoría
```bash
curl -i "http://localhost:3000/talleres?categoria=web"
```

### Filtro por nivel
```bash
curl -i "http://localhost:3000/talleres?nivel=avanzado"
```

### Filtro por disponibilidad
```bash
curl -i "http://localhost:3000/talleres?disponibles=true"
```

### Filtros combinados
```bash
curl -i "http://localhost:3000/talleres?categoria=web&disponibles=true"
curl -i "http://localhost:3000/talleres?categoria=web&nivel=avanzado&disponibles=true"
```
(HTML para todos los filtros: el formulario de filtros de `/talleres`.)

### Ficha de un taller
```bash
curl -i http://localhost:3000/talleres/1
```
(HTML: enlace con el título de cada taller en el listado.)

### Ficha con identificador no válido o inexistente (devuelve 404)
```bash
curl -i http://localhost:3000/talleres/abc
curl -i http://localhost:3000/talleres/99
```

### Formulario de inscripción
```bash
curl -i http://localhost:3000/talleres/2/inscripcion
```
(HTML: botón "Inscribirse en este taller" de la ficha.)

### Alta de inscripción correcta (responde 303 y redirige a la ficha)
```bash
curl -i -X POST http://localhost:3000/talleres/2/inscripcion -d "nombre=Luis Pérez" -d "email=luis@example.com"
```
(HTML: formulario de `/talleres/2/inscripcion`.)

### Alta con datos no válidos (responde 400 y muestra los errores)
```bash
curl -i -X POST http://localhost:3000/talleres/1/inscripcion -d "nombre=" -d "email=correo-malo"
```

### Correo ya inscrito en el taller (responde 400)
```bash
curl -i -X POST http://localhost:3000/talleres/1/inscripcion -d "nombre=Curro" -d "email=currox@example.com"
```

### Taller completo (responde 400)
```bash
curl -i -X POST http://localhost:3000/talleres/3/inscripcion -d "nombre=Pepe" -d "email=pepe@example.com"
```

## Ejemplos de Funcionalidades Adicionales (Addendum)

### Prueba del Middleware de Logging

Al ejecutar cualquiera de las peticiones anteriores, observarás en la **consola del servidor** salidas como:

```bash
Servidor escuchando en http://localhost:3000
[15/11/2026 17:14:00] GET /talleres
[15/11/2026 17:14:25] GET /talleres/1
[15/11/2026 17:14:40] POST /talleres/2/inscripcion
[15/11/2026 17:14:44] GET /ruta-inexistente
```

El middleware registra **automáticamente** toda petición HTTP, independientemente de si la ruta existe o no.

### Prueba del Tratamiento de Rutas 404

#### Ruta completamente inexistente
```bash
curl -i http://localhost:3000/ruta-inexistente
```

**Respuesta esperada:**
```
HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8
...
```

Junto con la página HTML renderizada mostrando "Error 404 - Página no encontrada" y la URL solicitada.

#### Otras rutas que devuelven 404
```bash
curl -i http://localhost:3000/admin
curl -i http://localhost:3000/talleres/1/borrar
curl -i http://localhost:3000/api/usuarios
```

Todas estas peticiones devuelven **HTTP 404** y renderizarán la misma vista de error integrada en el diseño de la aplicación.
