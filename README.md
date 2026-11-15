# Sistema de inscripción a talleres y actividades

Práctica de Desarrollo Web en Entorno Servidor (DWES). Aplicación hecha con Node.js, Express y EJS para gestionar los talleres de unas jornadas tecnológicas. Los datos se guardan en memoria (se pierden al reiniciar el servidor).

- Repositorio: https://github.com/MparrillaL/Practica_DWES
- **Nota:** Este README incluye tanto la entrega original como la recuperación (Addendum).
- **Chat de apoyo (Entrega original):** https://gemini.google.com/share/d/1zY4cVk52PGe9yds6OS69ZQu5ID7M1lMU?usp=sharing
- **Chat de apoyo (Recuperación):** https://claude.ai/share/a0302447-259b-41f1-9158-a5646b6ae193

## Tabla de contenidos

- [Cómo ejecutarla](#cómo-ejecutarla)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Funcionalidades principales](#funcionalidades-principales)
- [Addendum (Recuperación)](#addendum-recuperación)
- [Ejemplos con curl](#ejemplos-con-curl)

## Cómo ejecutarla

```bash
npm install
npm start
```

El servidor arranca en http://localhost:3000 (se puede cambiar con la variable `PORT`).

## Estructura del proyecto

```
Practica_DWES/
├── package.json
├── README.md
├── src
│   ├── app.js                      # servidor Express y rutas
│   ├── data
│   │   └── datos.js                # colecciones talleres e inscripciones (3 elementos cada una)
│   ├── utils
│   │   └── utilidades.js           # funciones que no dependen de req/res
│   └── middlewares
│       └── registro.js             # middleware de logging de peticiones
└── views
    ├── talleres.ejs                # listado con filtros
    ├── detalle.ejs                 # ficha del taller
    ├── inscripcion.ejs             # formulario de inscripción
    ├── error.ejs                   # página de error 404
    └── partials
        ├── header.ejs              # cabecera común
        └── footer.ejs              # pie común
```

## Funcionalidades principales

### 1. Listado de talleres y filtros (`GET /talleres`)

Se leen `categoria`, `nivel` y `disponibles` de `req.query`, se convierten a texto con `String()`, y se limpian con `trim()` y `toLowerCase()`. Primero se usa `map()` para añadir a cada taller su `plazasRestantes` (sin modificar el array original) y después se aplican los filtros con `filter()` solo si el parámetro viene informado, así se pueden combinar. `disponibles` solo se activa si vale exactamente `true`.

En la vista, el formulario de filtros usa `method="get"`, que es el equivalente en HTML de las llamadas con curl.

### 2. Cálculo de plazas restantes

La función `obtenerPlazasRestantes(taller, inscripciones)` filtra las inscripciones del taller con `filter()` y devuelve `plazas - número de inscripciones`.

### 3. Ficha del taller (`GET /talleres/:id`)

El `id` se valida con una **expresión regular de lista blanca** (`^[1-9]\d*$`) que rechaza valores no válidos como `0x1` (hexadecimal), `01` (cero a la izquierda), `abc` (texto), `0` (cero) o `12abc` (sufijo no numérico, rechazado gracias al `$` final). Si la validación falla o el taller no existe, se devuelve 404. La vista `detalle.ejs` muestra un estado según las plazas restantes:

- Más de una plaza: "N plazas disponibles"
- Una plaza: "Última plaza disponible"
- Ninguna: "Completo" (y se oculta el enlace de inscripción)

### 4. Formulario de inscripción (`GET /talleres/:id/inscripcion`)

Se valida el `id`, se comprueba que el taller existe y que quedan plazas, y se muestra el formulario. Si el taller no existe o está completo se muestra un error en lugar del formulario.

### 5. Alta de inscripción (`POST /talleres/:id/inscripcion`)

El middleware `express.urlencoded` rellena `req.body` con los datos del formulario. Como los datos del navegador no son fiables, se convierten a texto y se limpian antes de usarlos.

**Validación en dos capas:**

1. **Formato (función `validarInscripcion`):** comprueba que el nombre existe y tiene entre 2 y 100 caracteres, y que el correo tiene formato válido. Devuelve un objeto con estructura `{ valores, errores }` donde `valores` contiene los datos ya limpios.

2. **Reglas de negocio (ruta POST):** si no hay errores de formato, se comprueba que el correo no está ya inscrito en ese taller (`estaInscrito`) y que quedan plazas (`obtenerPlazasRestantes`). Los errores se acumulan en el mismo objeto `errores`.

Si hay errores se responde con 400 y se vuelve a mostrar el formulario con los mensajes, conservando solo los campos que estaban bien. Si todo es correcto se guarda la inscripción (con `siguienteId`) y se aplica **PRG**: se responde con una redirección 303 a `/talleres/:id` para que al recargar la página no se reenvíe el formulario.

### Funciones de `src/utils/utilidades.js`

| Función                                            | Qué hace                                              | Devuelve               |
| -------------------------------------------------- | ----------------------------------------------------- | ---------------------- |
| `obtenerPlazasRestantes(taller, inscripciones)`    | Plazas totales menos inscripciones del taller         | Número (puede ser negativo si `plazas` < inscritos) |
| `estaInscrito(tallerId, email, inscripciones)`     | Comprueba si un correo ya está inscrito en ese taller | `true` o `false`       |
| `validarInscripcion(datos)`                        | Valida solo el formato (nombre y email)               | `{ valores, errores }` |
| `siguienteId(inscripciones)`                       | Calcula el siguiente id de inscripción                | Número                 |
| `buscarTallerPorId(idTexto, talleres)`             | Valida y busca un taller por id con regex whitelist   | Objeto taller o `null` |

Estas funciones no usan `req` ni `res`, por eso están en un fichero aparte y `app.js` las importa.

## Addendum (Recuperación)

Este apartado documenta las funcionalidades adicionales implementadas como recuperación de la UD1, siguiendo las instrucciones del profesor.

### Middleware de Logging (`src/middlewares/registro.js`)

Se ha implementado un middleware propio que registra todas las peticiones HTTP recibidas. Este middleware:

- **Qué muestra:** El método HTTP (GET, POST, etc.), la URL completa con parámetros de consulta y la fecha/hora de la petición.
- **Dónde está:** `src/middlewares/registro.js` (exportado como módulo ES6).
- **Posición en la cadena:** Se registra **al inicio** de `app.js` (antes de `express.urlencoded()` y de todas las rutas). Esto es crítico porque garantiza que captura **todas** las peticiones entrantes, incluso las que no coinciden con ninguna ruta.
- **Por qué `originalUrl`:** Se usa `req.originalUrl` (no `req.url`) porque ambas incluyen la query string, pero difieren si hay routers montados: dentro de un subrouter `req.url` cambia (se recorta el prefijo de montaje), mientras que `originalUrl` conserva siempre la URL completa tal como llegó al servidor.
- **Formato:** `[DD/MM/YYYY HH:MM:SS] MÉTODO /url` (ejemplo: `[15/11/2026 17:14:40] POST /talleres/2/inscripcion`). Un ejemplo completo de salida en consola está en [Prueba del Middleware de Logging](#prueba-del-middleware-de-logging).

### Manejador Global de Rutas Inexistentes (`app.js`)

Se ha implementado un manejador global para devolver **HTTP 404** cuando el usuario solicita una ruta que no existe.

- **Dónde está:** Al final de `app.js`, después de todas las rutas definidas.
- **Por qué al final:** Express ejecuta los middlewares en orden. Si el manejador 404 estuviese antes, nunca llegaría a ninguna ruta definida. Colocándolo al final se asegura que solo se activa cuando ninguna otra ruta ha coincidido.
- **Por qué `app.use()` y no `app.get()`:** `app.use()` es un middleware sin ruta asociada (se llama sin primer argumento de tipo texto), por lo que coincide con **cualquier método HTTP** (GET, POST, DELETE, etc.) y con cualquier ruta no registrada. `app.get()` solo coincidiría con peticiones GET a un patrón específico, y en Express 5 ni siquiera `app.get('*')` arrancaría (el comodín `*` ya no es válido como patrón de ruta suelto). El manejador recibe los dos parámetros habituales, `app.use((req, res) => ...)`.
- **No necesita `next()`:** Es el último middleware de la cadena, por eso es terminal.
- **También captura talleres inexistentes:** Cuando se accede a `/talleres/99` o `/talleres/abc`, la función `buscarTallerPorId()` devuelve `null`, y la ruta responde con la misma vista de error.

Un ejemplo de petición y la respuesta esperada están en [Prueba del Tratamiento de Rutas 404](#prueba-del-tratamiento-de-rutas-404).

## Ejemplos con curl

Y su equivalente en HTML entre paréntesis. Con el servidor en marcha en el puerto 3000. En Windows PowerShell hay que usar `curl.exe` en lugar de `curl`, y comillas en las URLs con `&`. Todos los comandos se muestran en una sola línea a propósito: el carácter de continuación en PowerShell es la tilde invertida (`` ` ``), no la barra invertida (`\`) de bash, así que si necesitas dividir un comando en varias líneas en PowerShell usa `` ` `` al final de cada línea.

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

### Validación de id con regex: rechaza hexadecimal, cero a la izquierda, texto (devuelve 404)

```bash
curl -i http://localhost:3000/talleres/0x1
curl -i http://localhost:3000/talleres/01
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
curl -i -X POST http://localhost:3000/talleres/2/inscripcion --data-urlencode "nombre=Luis Pérez" --data-urlencode "email=luis@example.com"
```

(HTML: formulario de `/talleres/2/inscripcion`.)

### Alta con datos no válidos (responde 400 y muestra los errores)

```bash
curl -i -X POST http://localhost:3000/talleres/1/inscripcion --data-urlencode "nombre=" --data-urlencode "email=correo-malo"
```

### Correo ya inscrito en el taller (responde 400)

```bash
curl -i -X POST http://localhost:3000/talleres/1/inscripcion --data-urlencode "nombre=Curro" --data-urlencode "email=currox@example.com"
```

### Taller completo (responde 400)

```bash
curl -i -X POST http://localhost:3000/talleres/3/inscripcion --data-urlencode "nombre=Pepe" --data-urlencode "email=pepe@example.com"
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
