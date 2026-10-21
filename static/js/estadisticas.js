// Charts of the statistics page, built with Chart.js.
// The page arrives without data: fetch asks Flask for it then Chart.js draws it.

const GREEN = "seagreen";

// One different color for each slice of the pie
function colors(amount) {
  const list = [];
  for (let i = 0; i < amount; i++) {
    list.push("hsl(" + Math.round((i * 360) / amount) + ", 55%, 50%)");
  }
  return list;
}

// this function replaces the canvas with a text (when there is no data or there was an error)
function showMessage(canvasId, message) {
  const p = document.createElement("p");
  p.textContent = message;
  document.getElementById(canvasId).replaceWith(p);
}

// Asks Flask for the data of a chart and, when it arrives, draws it
async function loadChart(url, canvasId, draw) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    const rows = await response.json(); // list like [{"dia": "2026-01-01", "total": 1}, ...]
    if (rows.length === 0) {
      showMessage(canvasId, "Todavía no hay datos para este gráfico.");
    } else {
      draw(document.getElementById(canvasId), rows);
    }
  } catch (error) {
    showMessage(canvasId, "No se pudieron cargar los datos del gráfico.");
  }
}

// 1. Line chart: sightings per day
loadChart("/estadisticas/avistamientos-por-dia", "days-chart", (canvas, rows) => {
  new Chart(canvas, {
    type: "line",
    data: {
      labels: rows.map(r => r.dia),
      datasets: [{ label: "Avistamientos", data: rows.map(r => r.total), borderColor: GREEN, backgroundColor: GREEN, tension: 0.2 }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: "Día" } },
        y: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: "Avistamientos" } }
      }
    }
  });
});

// 2. Pie chart: sightings per bird
loadChart("/estadisticas/avistamientos-por-ave", "birds-chart", (canvas, rows) => {
  new Chart(canvas, {
    type: "pie",
    data: {
      labels: rows.map(r => r.ave),
      datasets: [{ data: rows.map(r => r.total), backgroundColor: colors(rows.length) }]
    }
  });
});

// 3. Bar chart: volunteers per commune
loadChart("/estadisticas/voluntarios-por-comuna", "communes-chart", (canvas, rows) => {
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: rows.map(r => r.comuna),
      datasets: [{ label: "Voluntarios", data: rows.map(r => r.total), backgroundColor: GREEN }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: "Comuna" } },
        y: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: "Voluntarios" } }
      }
    }
  });
});
