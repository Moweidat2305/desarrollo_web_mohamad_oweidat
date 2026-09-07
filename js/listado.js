// Sightings list: filter by type, sort by column and pagination.

const typeFilter = document.getElementById("type-filter");
const perPageSelect = document.getElementById("per-page");
const tableBody = document.getElementById("table-body");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");

// Current state of the list
let sortColumn = "date";
let sortAscending = false; // most recent first
let currentPage = 1;

function getFiltered() {
  const type = typeFilter.value;
  if (type === "") return SIGHTINGS.slice();
  return SIGHTINGS.filter(s => s.type === type);
}

function sortList(list) {
  return list.sort(function (a, b) {
    let valueA = a[sortColumn];
    let valueB = b[sortColumn];
    // for the date i also take the time into account
    if (sortColumn === "date") {
      valueA = a.date + " " + a.time;
      valueB = b.date + " " + b.time;
    }
    const comparison = valueA.localeCompare(valueB, "es");
    return sortAscending ? comparison : -comparison;
  });
}

function formatDate(date, time) {
  const [year, month, day] = date.split("-");
  return day + "/" + month + "/" + year + " " + time;
}

function renderTable() {
  const list = sortList(getFiltered());
  const perPage = Number(perPageSelect.value);
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));

  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * perPage;
  const page = list.slice(start, start + perPage);
  tableBody.innerHTML = "";
  for (const s of page) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" + formatDate(s.date, s.time) + "</td>" +
      "<td>" + BIRD_TYPES[s.type] + "</td>" +
      "<td>" + s.name + "</td>" +
      "<td>" + s.place + "</td>" +
      "<td>" + s.volunteer + "</td>" +
      "<td>" + s.files + "</td>";
    tableBody.appendChild(row);
  }

  if (page.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">No hay avistamientos para este filtro.</td></tr>';
  }

  document.getElementById("list-summary").textContent =
    list.length + " avistamiento" + (list.length === 1 ? "" : "s") +
    ", ordenado por " + columnName(sortColumn) +
    (sortAscending ? " (ascendente)" : " (descendente)");

  document.getElementById("page-indicator").textContent =
    "Página " + currentPage + " de " + totalPages;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

// Label shown to the user for each sortable column
function columnName(column) {
  const names = { date: "fecha", type: "tipo de ave", name: "nombre del ave", place: "lugar" };
  return names[column];
}


typeFilter.addEventListener("change", function () {
  currentPage = 1;
  renderTable();
});

perPageSelect.addEventListener("change", function () {
  currentPage = 1;
  renderTable();
});

document.querySelectorAll("th button").forEach(function (button) {
  button.addEventListener("click", function () {
    const column = button.dataset.column;
    if (column === sortColumn) {
      sortAscending = !sortAscending; // second click reverses the order
    } else {
      sortColumn = column;
      sortAscending = true;
    }
    currentPage = 1;
    renderTable();
  });
});

prevButton.addEventListener("click", function () {
  currentPage--;
  renderTable();
});

nextButton.addEventListener("click", function () {
  currentPage++;
  renderTable();
});

renderTable();
