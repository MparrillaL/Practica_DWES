
/**
 * 1. Calcula las plazas restantes de un taller.
 * Método de array utilizado: filter()
 */
export function obtenerPlazasRestantes(taller, inscripciones) {
  if (!taller) return 0;
  
  const inscripcionesTaller = inscripciones.filter((i) => i.tallerId === taller.id);
  return taller.plazas - inscripcionesTaller.length;
}

/**
 * 2. Comprueba si un correo ya está inscrito en un taller.
 * Firma exigida: (tallerId, email, inscripciones)
 * Métodos utilizados: some(), trim(), toLowerCase()
 */
export function estaInscrito(tallerId, email, inscripciones) {
  const emailNormalizado = String(email || '').trim().toLowerCase();
  
  return inscripciones.some(
    (i) => i.tallerId === tallerId && String(i.email || '').trim().toLowerCase() === emailNormalizado
  );
}

/**
 * 3. Valida el formato de una solicitud de inscripción.
 * Limpia los datos y valida solo formato (no reglas de negocio).
 * Devuelve { valores: { nombre, email }, errores: {} }.
 * Las reglas de negocio (plazas, duplicado) se validan después en la ruta POST.
 */
export function validarInscripcion(datos = {}) {
  const errores = {};

  // 1. Normalizar: limpiar y estandarizar entrada
  const nombreNormalizado = String(datos.nombre ?? '').trim();
  const emailNormalizado = String(datos.email ?? '').trim().toLowerCase();

  // 2. Validar nombre (formato)
  if (!nombreNormalizado) {
    errores.nombre = 'El nombre es obligatorio.';
  } else if (nombreNormalizado.length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres.';
  } else if (nombreNormalizado.length > 100) {
    errores.nombre = 'El nombre no puede superar los 100 caracteres.';
  }

  // 3. Validar email (formato)
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailNormalizado) {
    errores.email = 'El email es obligatorio.';
  } else if (emailNormalizado.length > 254 || !regexEmail.test(emailNormalizado)) {
    errores.email = 'El email no es válido.';
  }

  // Devolver siempre estructura { valores, errores }
  return {
    valores: { nombre: nombreNormalizado, email: emailNormalizado },
    errores
  };
}

/**
 * Función auxiliar: Genera el siguiente ID secuencial para inscripciones.
 * Métodos utilizados: map(), Math.max()
 */
export function siguienteId(inscripciones) {
  if (inscripciones.length === 0) return 1;
  return Math.max(...inscripciones.map((i) => i.id)) + 1;
}

/**
 * 4. Busca un taller por ID con validación estricta de entrada.
 * Valida que el texto sea un entero positivo sin ceros a la izquierda.
 * Regex: primer dígito 1-9, resto cualesquiera (0-9).
 * Métodos utilizados: regex test(), Number(), find()
 */
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