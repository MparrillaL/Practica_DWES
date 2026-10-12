
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
 * 3. Normaliza y valida una solicitud de inscripción en el servidor.
 * Devuelve un objeto con los errores detectados (si está vacío {}, los datos son válidos).
 */
export function validarInscripcion(datos, taller, inscripciones) {
  const errores = {};

  // a. Verificar si el taller existe (protección contra IDs manipulados)
  if (!taller) {
    errores.taller = 'El taller seleccionado no existe.';
    return errores;
  }

  // b. Normalización estricta de textos recibidos
  const nombreNormalizado = String(datos.nombre || '').trim();
  const emailNormalizado = String(datos.email || '').trim().toLowerCase();

  // c. Validar Nombre (obligatorio)
  if (!nombreNormalizado) {
    errores.nombre = 'El nombre es obligatorio.';
  } else if (nombreNormalizado.length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres.';
  }

  // d. Validar Email (formato)
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailNormalizado) {
    errores.email = 'El email es obligatorio.';
  } else if (!regexEmail.test(emailNormalizado)) {
    errores.email = 'El email no es válido.';
  } else if (estaInscrito(taller.id, emailNormalizado, inscripciones)) {
    // e. Validar correo duplicado en el mismo taller
    errores.email = 'Este correo ya se encuentra inscrito en este taller.';
  }

  // f. Validar disponibilidad de plazas libres
  const plazasRestantes = obtenerPlazasRestantes(taller, inscripciones);
  if (plazasRestantes <= 0) {
    errores.plazas = 'Lo sentimos, este taller no dispone de plazas libres.';
  }

  return errores;
}

/**
 * Función auxiliar: Genera el siguiente ID secuencial para inscripciones.
 * Métodos utilizados: map(), Math.max()
 */
export function siguienteId(inscripciones) {
  if (inscripciones.length === 0) return 1;
  return Math.max(...inscripciones.map((i) => i.id)) + 1;
}