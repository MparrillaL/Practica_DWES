// src/data/datos.js

export const talleres = [
  {
    id: 1,
    titulo: 'Introducción a Docker',
    categoria: 'sistemas',
    plazas: 20,
    nivel: 'inicial'
  },
  {
    id: 2,
    titulo: 'Desarrollo Web con Express',
    categoria: 'web',
    plazas: 2,
    nivel: 'intermedio'
  },
  {
    id: 3,
    titulo: 'Arquitecturas Cloud Avanzadas',
    categoria: 'sistemas',
    plazas: 1,
    nivel: 'avanzado'
  }
];

export const inscripciones = [
  {
    id: 1,
    tallerId: 1,
    nombre: 'Curro Ximénez',
    email: 'currox@example.com',
    emailNormalizado: 'currox@example.com'
  },
  {
    id: 2,
    tallerId: 2,
    nombre: 'Ana López',
    email: 'ana@example.com',
    emailNormalizado: 'ana@example.com'
  },
  {
    id: 3,
    tallerId: 3,
    nombre: 'Carlos Gómez',
    email: 'carlos@example.com',
    emailNormalizado: 'carlos@example.com'
  }
];