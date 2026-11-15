/**
 * Middleware de registro de peticiones
 * Registra en consola: fecha, hora, método HTTP y URL de cada petición
 * Formato: [DD/MM/YYYY HH:MM:SS] METHOD /url
 */

function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  const segundos = String(fecha.getSeconds()).padStart(2, "0");

  return `[${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}]`;
}

export function middlewareRegistro(req, res, next) {
  const timestamp = formatearFecha(new Date());
  const metodo = req.method;
  const url = req.originalUrl;

  console.log(`${timestamp} ${metodo} ${url}`);

  next();
}
