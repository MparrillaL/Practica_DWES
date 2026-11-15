# 📦 ENTREGA - PRÁCTICA UD1 DWES RECUPERACIÓN

**Alumno:** MparrillaL  
**Fecha de Entrega:** 15 de Noviembre de 2026  
**Repositorio:** https://github.com/MparrillaL/Practica_DWES  

---

## ✅ RESUMEN DE IMPLEMENTACIÓN

Esta práctica recuperación de UD1 incluye **todas las funcionalidades solicitadas** más los **requisitos del Addendum**.

### Funcionalidades del Enunciado Original
- ✅ Listado de talleres con filtros (categoría, nivel, disponibles)
- ✅ Ficha del taller con estados de plazas
- ✅ Validación de inscripciones
- ✅ PRG (Post/Redirect/Get)
- ✅ Métodos requeridos: `find()`, `filter()`, `map()`, `some()`
- ✅ Funciones auxiliares independientes de `req/res`
- ✅ Middleware `urlencoded`

### Funcionalidades del Addendum ⭐
- ✅ **Middleware propio de logging** (`src/middlewares/registro.js`)
  - Registra todas las peticiones
  - Formato: `[DD/MM/YYYY HH:MM:SS] METHOD URL`
  - Posicionado correctamente al inicio de la cadena

- ✅ **Tratamiento global de rutas 404**
  - Manejador al final de todas las rutas
  - Devuelve HTTP 404
  - Vista EJS integrada (`views/error.ejs`)
  - URL solicitada visible para el usuario

---

## 📁 ESTRUCTURA DEL PROYECTO

```
Practica_DWES/
├── src/
│   ├── app.js                    ← Servidor y rutas (middleware + 404 agregados)
│   ├── data/datos.js             ← Datos iniciales
│   ├── utils/utilidades.js       ← Funciones puras
│   └── middlewares/
│       └── registro.js           ← ⭐ NUEVO: Middleware de logging
├── views/
│   ├── talleres.ejs             ← Listado con filtros
│   ├── detalle.ejs              ← Ficha del taller
│   ├── inscripcion.ejs          ← Formulario de inscripción
│   ├── error.ejs                ← ⭐ NUEVO: Página de error 404
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
├── README.md                     ← Documentación actualizada
├── RESUMEN_ENTREGA.md            ← Resumen de fases completadas
├── GUIA_PRUEBA.md               ← Guía para probar la aplicación
└── package.json

```

---

## 🧪 PRUEBAS REALIZADAS

### Todos los Endpoints Funcionan Correctamente

```
✅ GET /talleres                                    → HTTP 200
✅ GET /talleres?categoria=web                      → HTTP 200
✅ GET /talleres?nivel=avanzado                     → HTTP 200
✅ GET /talleres?disponibles=true                   → HTTP 200
✅ GET /talleres/1                                  → HTTP 200 (ficha válida)
✅ GET /talleres/abc                                → HTTP 404 (ID inválido)
✅ GET /talleres/99                                 → HTTP 404 (ID no existe)
✅ GET /talleres/2/inscripcion                      → HTTP 200 (formulario)
✅ POST /talleres/2/inscripcion (válida)            → HTTP 303 (PRG)
✅ POST /talleres/1/inscripcion (email duplicado)   → HTTP 400
✅ POST /talleres/1/inscripcion (nombre vacío)      → HTTP 400
✅ GET /ruta-inexistente                            → HTTP 404 (middleware global)
✅ GET /admin                                       → HTTP 404 (middleware global)
✅ GET /talleres/1/borrar                           → HTTP 404 (middleware global)
```

### Middleware de Logging Verificado

```
[15/11/2026 17:14:00] GET /talleres
[15/11/2026 17:14:25] GET /talleres/1
[15/11/2026 17:14:40] POST /talleres/2/inscripcion
[15/11/2026 17:14:44] GET /ruta-inexistente
```

---

## 🚀 CÓMO EJECUTAR

```bash
# 1. Clonar el repositorio
git clone https://github.com/MparrillaL/Practica_DWES.git
cd Practica_DWES

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor
npm start
# o con ruta completa en Windows:
# 'C:\Program Files\nodejs\node.exe' src/app.js

# El servidor estará disponible en: http://localhost:3000
```

---

## 📝 DOCUMENTACIÓN

### README.md
Incluye:
- Explicación detallada de cada funcionalidad
- Estructura del proyecto
- Ejemplos con curl para TODOS los endpoints
- Nueva sección "Funcionalidades Adicionales (Addendum)"
- Documentación del middleware de logging
- Documentación del tratamiento de 404

### RESUMEN_ENTREGA.md
Documento completo con:
- Todas las fases completadas
- Pruebas realizadas
- Archivos modificados y creados
- Notas importantes para la evaluación

### GUIA_PRUEBA.md
Guía práctica para:
- Iniciar el servidor
- Realizar pruebas rápidas
- Verificar middleware en consola
- Troubleshooting

---

## 🔍 DETALLES TÉCNICOS IMPORTANTES

### Middleware de Logging
- **Archivo:** `src/middlewares/registro.js`
- **Posición en `app.js`:** Línea 15 (después de crear `app`, antes de otros middlewares)
- **Llamada:** `app.use(middlewareRegistro)` en línea 18
- **Formato:** Fecha manual con `padStart()` para compatibilidad
- **URL:** Usa `req.originalUrl` para incluir parámetros

### Manejador 404
- **Archivo:** `src/app.js` líneas 185-192
- **Posición:** Al final de todas las rutas
- **Método:** `app.use()` sin ruta (captura todo)
- **Seguridad:** URL escapada con `<%= %>` en EJS contra XSS
- **Sin `next()`:** No es necesario en el último middleware

---

## 📊 COMMITS REALIZADOS

```
63f8dfa Agregar guía rápida de prueba
d330869 Agregar resumen de entrega
8626884 Implementar middleware de logging y manejo global de 404
```

Todos anteriores al plazo de entrega: **14/10/2026 23:59**

---

## 🎯 PREGUNTAS PARA EVALUACIÓN

Estoy preparado para responder sobre:

1. ¿Por qué el middleware de logging debe estar al inicio?
2. ¿Qué diferencia hay entre `req.url` y `req.originalUrl`?
3. ¿Por qué el manejador 404 no usa `next()`?
4. ¿Cómo se protege contra XSS en la URL del error?
5. ¿Cuál es el patrón PRG y por qué se usa?
6. ¿Cómo se validan los datos del usuario?
7. ¿Por qué las funciones están separadas de `app.js`?

---

## 📋 CHECKLIST DE ENTREGA

- ✅ Repositorio público en GitHub
- ✅ Último commit anterior al plazo
- ✅ README.md con documentación completa
- ✅ Ejemplos curl para TODOS los endpoints
- ✅ Equivalentes HTML para los ejemplos
- ✅ Middleware de logging implementado
- ✅ Tratamiento de 404 implementado
- ✅ Vistas EJS integradas
- ✅ No hay archivos secretos en el repositorio
- ✅ El servidor inicia sin errores
- ✅ Todas las pruebas pasan

---

**¡PROYECTO COMPLETADO Y LISTO PARA EVALUACIÓN!** 🎉

Para cualquier pregunta o aclaración durante la defensa, estoy preparado para:
- Ejecutar el servidor en vivo
- Realizar pruebas con curl
- Modificar código según lo solicitado
- Explicar decisiones de diseño

---

Profesor Manuel Granados  
Enriquez de Salamanca  
manuel.granados@eusa.es

---

*Práctica realizada con apoyo de IA (Copilot) como herramienta de optimización, manteniendo los requisitos de que la IA actúe como consultor, no realizador de la práctica.*
