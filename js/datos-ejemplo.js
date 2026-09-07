// Made-up data (AI generated) to be able to test the list and the charts

const BIRD_TYPES = {
  raptor: "Rapaz",
  aquatic: "Acuática",
  seabird: "Marina",
  passerine: "Paseriforme",
  other: "Otro"
};

const SIGHTINGS = [
  { date: "2026-08-30", time: "07:15", type: "raptor", name: "Cóndor andino", place: "Cajón del Maipo, San José de Maipo", region: "Metropolitana de Santiago", volunteer: "Camila Rojas", files: 2 },
  { date: "2026-08-28", time: "16:40", type: "seabird", name: "Pelícano peruano", place: "Caleta Portales, Valparaíso", region: "Valparaíso", volunteer: "Diego Fuentes", files: 1 },
  { date: "2026-08-27", time: "09:00", type: "passerine", name: "Chincol", place: "Parque Bustamante, Providencia", region: "Metropolitana de Santiago", volunteer: "Camila Rojas", files: 1 },
  { date: "2026-08-25", time: "18:20", type: "aquatic", name: "Cisne de cuello negro", place: "Humedal Río Cruces, Valdivia", region: "Los Ríos", volunteer: "Ignacio Paredes", files: 3 },
  { date: "2026-08-24", time: "12:10", type: "raptor", name: "Tiuque", place: "Campus Beauchef, Santiago", region: "Metropolitana de Santiago", volunteer: "Valentina Muñoz", files: 1 },
  { date: "2026-08-22", time: "06:50", type: "passerine", name: "Zorzal", place: "Cerro San Cristóbal, Recoleta", region: "Metropolitana de Santiago", volunteer: "Diego Fuentes", files: 1 },
  { date: "2026-08-20", time: "15:30", type: "seabird", name: "Pingüino de Humboldt", place: "Isla Damas, La Higuera", region: "Coquimbo", volunteer: "Francisca Soto", files: 4 },
  { date: "2026-08-19", time: "10:05", type: "aquatic", name: "Tagua común", place: "Laguna de Aculeo, Paine", region: "Metropolitana de Santiago", volunteer: "Ignacio Paredes", files: 1 },
  { date: "2026-08-17", time: "17:45", type: "other", name: "Picaflor chico", place: "Jardín Botánico, Viña del Mar", region: "Valparaíso", volunteer: "Valentina Muñoz", files: 2 },
  { date: "2026-08-15", time: "08:30", type: "raptor", name: "Águila mora", place: "Reserva Nacional Río Clarillo, Pirque", region: "Metropolitana de Santiago", volunteer: "Matías Herrera", files: 1 },
  { date: "2026-08-12", time: "14:00", type: "passerine", name: "Tenca", place: "Quebrada de Macul, Peñalolén", region: "Metropolitana de Santiago", volunteer: "Camila Rojas", files: 1 },
  { date: "2026-08-10", time: "11:20", type: "seabird", name: "Gaviota dominicana", place: "Playa Grande, Tongoy", region: "Coquimbo", volunteer: "Francisca Soto", files: 2 },
  { date: "2026-08-08", time: "19:00", type: "other", name: "Lechuza blanca", place: "Fundo El Peral, Melipilla", region: "Metropolitana de Santiago", volunteer: "Matías Herrera", files: 1 },
  { date: "2026-08-05", time: "07:40", type: "aquatic", name: "Garza grande", place: "Humedal Batuco, Lampa", region: "Metropolitana de Santiago", volunteer: "Diego Fuentes", files: 2 },
  { date: "2026-08-02", time: "16:15", type: "passerine", name: "Loica", place: "Reserva Nacional Nonguén, Concepción", region: "Biobío", volunteer: "Ignacio Paredes", files: 1 },
  { date: "2026-07-30", time: "13:00", type: "seabird", name: "Cormorán yeco", place: "Río Valdivia, Valdivia", region: "Los Ríos", volunteer: "Valentina Muñoz", files: 1 },
  { date: "2026-07-26", time: "09:45", type: "raptor", name: "Halcón peregrino", place: "Cerro Santa Lucía, Santiago", region: "Metropolitana de Santiago", volunteer: "Camila Rojas", files: 2 },
  { date: "2026-07-21", time: "18:00", type: "aquatic", name: "Flamenco chileno", place: "Salar de Atacama, San Pedro de Atacama", region: "Antofagasta", volunteer: "Matías Herrera", files: 5 },
  { date: "2026-07-14", time: "08:10", type: "passerine", name: "Diuca", place: "Parque O'Higgins, Santiago", region: "Metropolitana de Santiago", volunteer: "Francisca Soto", files: 1 },
  { date: "2026-07-09", time: "15:50", type: "other", name: "Carpintero negro", place: "Parque Nacional Conguillío, Curacautín", region: "La Araucanía", volunteer: "Ignacio Paredes", files: 3 },
  { date: "2026-07-03", time: "10:30", type: "seabird", name: "Albatros de ceja negra", place: "Estrecho de Magallanes, Punta Arenas", region: "Magallanes", volunteer: "Diego Fuentes", files: 2 },
  { date: "2026-06-28", time: "12:40", type: "raptor", name: "Peuco", place: "Cerro La Campana, Olmué", region: "Valparaíso", volunteer: "Valentina Muñoz", files: 1 },
  { date: "2026-06-20", time: "07:00", type: "passerine", name: "Rara", place: "Altos de Lircay, San Clemente", region: "Maule", volunteer: "Matías Herrera", files: 1 }
];

const VOLUNTEERS = [
  { name: "Camila Rojas", region: "Metropolitana de Santiago" },
  { name: "Diego Fuentes", region: "Valparaíso" },
  { name: "Ignacio Paredes", region: "Los Ríos" },
  { name: "Valentina Muñoz", region: "Metropolitana de Santiago" },
  { name: "Francisca Soto", region: "Coquimbo" },
  { name: "Matías Herrera", region: "Metropolitana de Santiago" },
  { name: "Antonia Vergara", region: "Biobío" },
  { name: "Sebastián Núñez", region: "Metropolitana de Santiago" },
  { name: "Josefa Riquelme", region: "La Araucanía" },
  { name: "Tomás Salinas", region: "Antofagasta" },
  { name: "Martina Carvajal", region: "Valparaíso" },
  { name: "Benjamín Ortiz", region: "Los Lagos" }
];
