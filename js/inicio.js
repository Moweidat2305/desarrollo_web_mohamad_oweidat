// Fills the home page counters with the total number of sightings, volunteers and distinct species.

const species = new Set(SIGHTINGS.map(s => s.name));
document.getElementById("total-sightings").textContent = SIGHTINGS.length;
document.getElementById("total-volunteers").textContent = VOLUNTEERS.length;
document.getElementById("total-species").textContent = species.size;
