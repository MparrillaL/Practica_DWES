# 🚀 GUÍA RÁPIDA DE PRUEBA

## Iniciar el servidor

```bash
cd C:\Users\MParrillaL\Practica_DWES
'C:\Program Files\nodejs\node.exe' src/app.js
```

O si Node está en el PATH:
```bash
npm start
```

## Pruebas Rápidas con curl

### 1. Middleware de Logging (Ver en consola del servidor)
```bash
curl.exe -i http://localhost:3000/talleres
```
**Esperado en consola:** `[DD/MM/YYYY HH:MM:SS] GET /talleres`

### 2. Listado de Talleres
```bash
curl.exe -i http://localhost:3000/talleres
```
**Código esperado:** HTTP 200

### 3. Ficha de Taller
```bash
curl.exe -i http://localhost:3000/talleres/1
```
**Código esperado:** HTTP 200

### 4. Ruta Inexistente (404)
```bash
curl.exe -i http://localhost:3000/ruta-inexistente
```
**Código esperado:** HTTP 404
**Verás:** Página de error integrada

### 5. Inscripción Válida (PRG)
```bash
curl.exe -i -X POST http://localhost:3000/talleres/2/inscripcion -d "nombre=TestUser&email=test@example.com"
```
**Código esperado:** HTTP 303 (redirección)

### 6. Inscripción Inválida
```bash
curl.exe -i -X POST http://localhost:3000/talleres/1/inscripcion -d "nombre=&email=invalid"
```
**Código esperado:** HTTP 400

## Pruebas en Navegador

1. **Acceder a la app:** `http://localhost:3000`
   - Te redirige a `/talleres`

2. **Ver catálogo:** `http://localhost:3000/talleres`
   - Listado completo de talleres

3. **Filtrar por categoría:** `http://localhost:3000/talleres?categoria=web`
   - Solo talleres de web

4. **Ver ficha:** `http://localhost:3000/talleres/1`
   - Detalles y opciones de inscripción

5. **Inscribirse:** Click en botón "Inscribirse en este taller"
   - Rellenar formulario
   - Submit

6. **Probar 404:** `http://localhost:3000/ruta-inexistente`
   - Página de error con diseño integrado

## Verificar Middleware en Consola

Cuando ejecutes cualquier petición, verás en la consola del servidor:
```
Servidor escuchando en http://localhost:3000
[15/11/2026 17:14:00] GET /talleres
[15/11/2026 17:14:25] GET /talleres/1
[15/11/2026 17:14:40] POST /talleres/2/inscripcion
[15/11/2026 17:14:44] GET /ruta-inexistente
```

## Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `src/app.js` | Servidor Express y todas las rutas |
| `src/middlewares/registro.js` | **NUEVO** Middleware de logging |
| `src/utils/utilidades.js` | Funciones de lógica (sin req/res) |
| `src/data/datos.js` | Datos iniciales |
| `views/error.ejs` | **NUEVO** Página de error 404 |
| `README.md` | Documentación completa |

## Troubleshooting

**Error: "node: El término no se reconoce"**
- Usar la ruta completa: `'C:\Program Files\nodejs\node.exe' src/app.js`

**Puerto ya en uso**
- Cambiar con variable de entorno: `$env:PORT=3001; node src/app.js`

**Ver código fuente de respuesta 404**
- Usar: `curl.exe http://localhost:3000/ruta-inexistente | Select-String "<h2"`

---

¡Lista para evaluación! ✨
