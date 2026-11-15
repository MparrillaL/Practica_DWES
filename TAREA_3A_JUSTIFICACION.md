# Tarea 3A: Refactorización y Decisión sobre Vista de Error

## 📋 Resumen

Se refactorizó el código para eliminar la repetición de validación de IDs en tres rutas:
1. `GET /talleres/:id` - Detalle del taller
2. `GET /talleres/:id/inscripcion` - Formulario de inscripción
3. `POST /talleres/:id/inscripcion` - Procesar inscripción

## 🔧 Implementación

### Función en `utilidades.js`

```javascript
export function buscarTallerPorId(idTexto, talleres) {
  // Validar con lista blanca: enteros positivos sin ceros a la izquierda
  const regexIdValido = /^[1-9]\d*$/;
  
  if (!regexIdValido.test(String(idTexto || ''))) {
    return null;
  }

  // Solo si pasa validación, convertir y buscar
  const id = Number(idTexto);
  return talleres.find((t) => t.id === id) || null;
}
```

### Regex explicada: `^[1-9]\d*$`

| Parte | Significado |
|-------|------------|
| `^` | Inicio de string |
| `[1-9]` | Primer dígito: 1-9 (rechaza 0) |
| `\d*` | Cero o más dígitos (0-9) |
| `$` | Fin de string |

### Validación de casos

| Entrada | Válida | Razón |
|---------|--------|-------|
| `1` | ✅ | Cumple: `[1-9]` |
| `0x1` | ❌ | No cumple: contiene `x` |
| `01` | ❌ | No cumple: comienza con 0 |
| `abc` | ❌ | No cumple: no son dígitos |
| `99` | ✅ | Cumple: `[1-9]\d*` |
| `0` | ❌ | No cumple: no es `[1-9]` |
| `00` | ❌ | No cumple: comienza con 0 |

## 🎯 Decisión: Qué vista mostrar cuando el taller no existe

### Opción A: Usar `error.ejs` (Elegida) ✅

**Ventajas:**
1. **HTTP semántico**: El status es 404 (Not Found), no es error de formulario
2. **Consistencia**: Mismo error (recurso no existe) → misma presentación visual
3. **Simplicidad**: Una vista para todos los 404
4. **Escalabilidad**: Si luego hay más recursos (categorías, eventos), reutilizamos error.ejs
5. **Experiencia**: El usuario ve "URL no encontrada" en la misma interfaz

**Desventajas:**
- Pierde contexto de que estaba buscando un taller (pero la URL sigue siendo visible)

### Opción B: Usar `detalle.ejs` con error

**Ventajas:**
- Mantiene el contexto visual "estaba en talleres"
- Puede mostrar mensaje específico "El taller solicitado no existe"

**Desventajas:**
1. **HTTP inconsistente**: Status 404 pero vista "detalle" (confunde semantics)
2. **Repetición**: Necesita mostrar null en el taller y mensaje de error
3. **Acoplamiento**: La vista detalle.ejs debe saber manejar talleres nulos
4. **Ambigüedad**: `error` en detalle.ejs vs vista error.ejs separada

### ✨ Conclusión

Se usa **`error.ejs`** porque:

- Es conceptualmente más claro: No existe el recurso → 404 → vista de error genérica
- Coincide con la vista global 404 que ya existe
- El middleware de logging captura la ruta exacta que pidió el usuario
- Si necesita detalles, la URL está en la página de error (visible en el navegador)

## 📊 Pruebas Realizadas

```
PRUEBA 1: /talleres/1 (válido)
✓ Código 200 OK

PRUEBA 2: /talleres/0x1 (hexadecimal)
✓ Código 404 - Rechazado por regex

PRUEBA 3: /talleres/01 (cero a la izquierda)
✓ Código 404 - Rechazado por regex

PRUEBA 4: /talleres/abc (texto)
✓ Código 404 - Rechazado por regex

PRUEBA 5: /talleres/99 (no existe en BD)
✓ Código 404 - Taller no encontrado
```

## 📁 Refactorización de Código

### Antes: 3 bloques repetidos

```javascript
// Bloque 1 en GET /talleres/:id
const id = Number(req.params.id);
if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).render('detalle', { taller: null, error: 'No válido' });
}
const taller = talleres.find((t) => t.id === id);
if (!taller) {
    return res.status(404).render('detalle', { taller: null, error: 'No existe' });
}

// Bloque 2 en GET /talleres/:id/inscripcion (IDÉNTICO)
// Bloque 3 en POST /talleres/:id/inscripcion (IDÉNTICO)
```

### Después: Una sola llamada

```javascript
const taller = buscarTallerPorId(req.params.id, talleres);
if (!taller) {
    return res.status(404).render('error', { url: req.originalUrl });
}
```

## 📈 Beneficios

✅ **DRY (Don't Repeat Yourself)**: Validación centralizada  
✅ **Mantenibilidad**: Cambios en un solo lugar  
✅ **Testing**: Función pura y testeable  
✅ **Claridad**: Intención clara en las rutas  
✅ **Seguridad**: Lista blanca explícita contra inyecciones  

## 🔗 Commits

- `379a4e2` - Tarea 3A: Refactorizar búsqueda de talleres con validación regex
