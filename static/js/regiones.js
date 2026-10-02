// Region and commune selects.
// COMUNAS comes from the database: Flask writes it in the page as a list of {id, nombre, region_id}.

// Fills the commune select with the communes of the chosen region
function loadCommunes(regionId, communeSelect, selectedId) {
  communeSelect.innerHTML = "";
  const first = document.createElement("option");
  first.value = "";
  first.textContent = regionId === "" ? "Seleccione primero una región" : "Seleccione una comuna";
  communeSelect.appendChild(first);

  for (const commune of COMUNAS) {
    if (String(commune.region_id) === regionId) {
      const option = document.createElement("option");
      option.value = commune.id;
      option.textContent = commune.nombre;
      option.selected = String(commune.id) === selectedId;
      communeSelect.appendChild(option);
    }
  }
  communeSelect.disabled = regionId === "";
}

// Keeps the commune select in sync with the region select
function linkRegionAndCommune(regionSelect, communeSelect) {
  regionSelect.addEventListener("change", function () {
    loadCommunes(regionSelect.value, communeSelect, "");
  });
  // If Flask sent the form back with errors, a region and a commune may already be chosen
  loadCommunes(regionSelect.value, communeSelect, communeSelect.dataset.selected);
}
