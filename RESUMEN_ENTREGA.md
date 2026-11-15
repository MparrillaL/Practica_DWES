# 📋 RESUMEN DE ENTREGA - UD1 DWES RECUPERACIÓN

## Estado: ✅ COMPLETADO

Fecha de finalización: 15 de Noviembre de 2026
Commit final: `8626884`

---

## 🎯 Trabajo Realizado

### FASE 1: Revisar Estado Actual ✅
- Proyecto base con estructura funcional verificada
- Datos iniciales listos
- Rutas principales implementadas

### FASE 2: Completar Vistas EJS ✅
- ✅ `views/talleres.ejs` - Listado con filtros
- ✅ `views/detalle.ejs` - Ficha del taller
- ✅ `views/inscripcion.ejs` - Formulario de inscripción
- ✅ `views/partials/header.ejs` - Cabecera común
- ✅ `views/partials/footer.ejs` - Pie común
- ✅ `views/error.ejs` - Página de error 404

### FASE 3: Implementar Middleware Logging ✅
- 📁 Crear: `src/middlewares/registro.js`
- Formato: `[DD/MM/YYYY HH:MM:SS] METHOD URL`
- Posición: Al inicio de la cadena de middlewares
- Funcionamiento: Registra TODAS las peticiones en consola

**Ejemplo de salida:**
```
[15/11/2026 17:14:00] GET /talleres
[15/11/2026 17:14:25] GET /talleres/1
[15/11/2026 17:14:40] POST /talleres/2/inscripcion
[15/11/2026 17:14:44] GET /ruta-inexistente
```

### FASE 4: Manejar Rutas Inexistentes (404) ✅
- Manejador global al final de todas las rutas
- HTTP 404 status code
- Vista `error.ejs` integrada con el diseño
- URL solicitada visible en la página de error
- Protección contra XSS con `<%= url %>` escapado

### FASE 5: Probar Todas las Rutas ✅
**Pruebas ejecutadas y verificadas:**

✅ `GET /talleres` → HTTP 200
✅ `GET /talleres?categoria=web` → HTTP 200
✅ `GET /talleres?nivel=avanzado` → HTTP 200
✅ `GET /talleres?disponibles=true` → HTTP 200
✅ `GET /talleres/1` → HTTP 200
✅ `GET /talleres/abc` → HTTP 404 (ID inválido)
✅ `GET /talleres/99` → HTTP 404 (ID inexistente)
✅ `GET /talleres/2/inscripcion` → HTTP 200
✅ `POST /talleres/2/inscripcion` (válida) → HTTP 303
✅ `POST /talleres/1/inscripcion` (email duplicado) → HTTP 400
✅ `POST /talleres/1/inscripcion` (nombre vacío) → HTTP 400
✅ `GET /ruta-inexistente` → HTTP 404
✅ `GET /admin` → HTTP 404
✅ `GET /talleres/1/borrar` → HTTP 404

### FASE 6: Actualizar README.md ✅
- Estructura del proyecto actualizada
- Nueva sección "Funcionalidades Adicionales (Addendum)"
  - Explicación del middleware de logging
  - Ejemplos de salida en consola
  - Explicación del tratamiento de 404
  - Ejemplos con curl
  - Respuesta esperada con HTTP 404

### FASE 7: Preparar Entrega ✅
- ✅ Servidor verifica y funciona correctamente
- ✅ Último commit: `8626884` (15/11/2026)
- ✅ Commit anterior al plazo (14/10/2026 23:59)
- ✅ No hay archivos secretos (`.env` en `.gitignore`)
- ✅ README.md completo con ejemplos
- ✅ Repositorio público en GitHub: https://github.com/MparrillaL/Practica_DWES

---

## 📁 Archivos Modificados

```
✨ CREADOS:
  - src/middlewares/registro.js       (Nuevo middleware de logging)
  - views/error.ejs                   (Vista de error 404)

📝 MODIFICADOS:
  - src/app.js                        (Importar middleware, agregar manejador 404)
  - README.md                         (Actualizar documentación)
```

---

## 🚀 Cómo Ejecutar

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor
npm start

# 3. El servidor estará disponible en:
# http://localhost:3000
```

---

## 📚 Funcionalidades Implementadas

### Requisitos del Enunciado Original
✅ Listado de talleres con filtros (categoría, nivel, disponibles)
✅ Ficha de taller con estado de plazas
✅ Formulario de inscripción
✅ Validación de datos
✅ PRG (Post/Redirect/Get)
✅ Uso de métodos array: `find()`, `filter()`, `map()`, `some()`
✅ Funciones auxiliares sin dependencia de `req/res`
✅ Middleware `urlencoded`

### Requisitos del Addendum
✅ Middleware propio de registro de peticiones
✅ Tratamiento global de rutas inexistentes (404)
✅ Vista EJS integrada para 404
✅ Documentación de nuevas funcionalidades
✅ Ejemplos con curl

---

## 📧 Entrega

**Repositorio:** https://github.com/MparrillaL/Practica_DWES

**Email de entrega:** manuel.granados@eusa.es

**Último commit:** 8626884 (15/11/2026)

---

## ✨ Notas Importantes

1. **Middleware de Logging**: Se ejecuta PRIMERO, captura TODAS las peticiones
2. **Manejador 404**: Se ejecuta ÚLTIMO, solo si ninguna otra ruta coincide
3. **Protección XSS**: La URL en error.ejs usa `<%= %>` (escapado) contra ataques
4. **Variables de Entorno**: Puerto configurable con `PORT` (default: 3000)
5. **Datos en Memoria**: Se pierden al reiniciar el servidor

---

## 🎓 Aprendizajes Clave

- Arquitectura de middlewares en Express
- Posicionamiento crítico de middlewares en la cadena
- Manejo de errores HTTP
- Validación y sanitización de datos
- Uso de funciones puras separadas de `req/res`
- Métodos de array de JavaScript
- Template engines (EJS) con datos seguros

---

**¡PROYECTO COMPLETADO Y LISTO PARA ENTREGA!** 🎉
