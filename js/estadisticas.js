// Charts for the statistics page built with Chart.js.

const GREEN = "seagreen";
const PALETTE = ["seagreen", "darkseagreen", "goldenrod", "steelblue", "firebrick", "sienna"];

// Counts how many times each value of a property appears in a list
function countBy(list, property) {
  const counts = {};
  for (const item of list) {
    const key = item[property];
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function barChart(canvasId, labels, values, horizontal) {
  new Chart(document.getElementById(canvasId), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{ data: values, backgroundColor: GREEN }]
    },
    options: {
      indexAxis: horizontal ? "y" : "x",
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, ticks: { precision: 0 } }, y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
}

// 1. Sightings by type (doughnut)
const byType = countBy(SIGHTINGS, "type");
new Chart(document.getElementById("types-chart"), {
  type: "doughnut",
  data: {
    labels: Object.keys(byType).map(t => BIRD_TYPES[t]),
    datasets: [{ data: Object.values(byType), backgroundColor: PALETTE }]
  }
});

// 2. Sightings by month (line) from oldest to newest
const byMonth = countBy(SIGHTINGS.map(s => ({ month: s.date.slice(0, 7) })), "month");
const months = Object.keys(byMonth).sort();
new Chart(document.getElementById("months-chart"), {
  type: "line",
  data: {
    labels: months,
    datasets: [{ label: "Avistamientos", data: months.map(m => byMonth[m]), borderColor: GREEN, tension: 0.2, fill: false }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  }
});

// 3. Volunteers by region
const byRegion = countBy(VOLUNTEERS, "region");
barChart("regions-chart", Object.keys(byRegion), Object.values(byRegion), true);

// 4. Volunteers with the most sightings
const byVolunteer = countBy(SIGHTINGS, "volunteer");
const ranking = Object.entries(byVolunteer).sort((a, b) => b[1] - a[1]);
barChart("volunteers-chart", ranking.map(r => r[0]), ranking.map(r => r[1]), false);
