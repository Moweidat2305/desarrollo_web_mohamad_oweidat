// Regions of Chile with some of their communes.
// Not every commune is included, only the most populated ones per region, enough for the prototype.

const REGIONS = {
  "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica", "Huara"],
  "Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "San Pedro de Atacama", "Taltal"],
  "Atacama": ["Copiapó", "Vallenar", "Caldera", "Chañaral", "Diego de Almagro", "Huasco"],
  "Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña", "Los Vilos", "Salamanca"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Quillota", "Los Andes", "San Felipe", "Concón", "Isla de Pascua"],
  "Metropolitana de Santiago": ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "La Florida", "Puente Alto", "San Bernardo", "Peñalolén", "La Reina", "Macul", "Recoleta", "Independencia", "Estación Central", "Quilicura", "Colina", "Melipilla", "Talagante", "Buin", "Lo Barnechea"],
  "O'Higgins": ["Rancagua", "San Fernando", "Rengo", "Machalí", "Santa Cruz", "Pichilemu", "San Vicente"],
  "Maule": ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes", "Molina", "Parral"],
  "Ñuble": ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes", "Coihueco", "Quirihue"],
  "Biobío": ["Concepción", "Talcahuano", "San Pedro de la Paz", "Hualpén", "Coronel", "Los Ángeles", "Chiguayante", "Lota", "Tomé", "Cañete"],
  "La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Angol", "Pucón", "Nueva Imperial", "Victoria"],
  "Los Ríos": ["Valdivia", "La Unión", "Panguipulli", "Río Bueno", "Los Lagos", "Futrono"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Puerto Varas", "Ancud", "Quellón", "Frutillar", "Chaitén"],
  "Aysén": ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane", "Cisnes"],
  "Magallanes": ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"]
};

// Fills the region select and keeps the commune select in sync with the chosen region.
function loadRegions(regionSelect, communeSelect) {
  for (const name of Object.keys(REGIONS)) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    regionSelect.appendChild(option);
  }
  regionSelect.addEventListener("change", function () {
    loadCommunes(regionSelect.value, communeSelect);
  });
}

function loadCommunes(region, communeSelect) {
  communeSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
  const communes = REGIONS[region] || [];
  for (const commune of communes) {
    const option = document.createElement("option");
    option.value = commune;
    option.textContent = commune;
    communeSelect.appendChild(option);
  }
  communeSelect.disabled = communes.length === 0;
}
