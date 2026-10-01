// Fills the home page counters with the total number of sightings, volunteers and distinct species.

const species = new Set(SIGHTINGS.map(s => s.name)); // récupère les espèces distinctes à partir des observations
// Met à jour les compteurs sur la page d'accueil avec textcontent
document.getElementById("total-sightings").textContent = SIGHTINGS.length;
document.getElementById("total-volunteers").textContent = VOLUNTEERS.length;
document.getElementById("total-species").textContent = species.size;
