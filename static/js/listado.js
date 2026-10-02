// Clicking anywhere on a row opens the detail of that sighting.
// The date cell also has a normal link, so the page works without JavaScript.
document.querySelectorAll("tr[data-url]").forEach(function (row) {
  row.addEventListener("click", function () {
    window.location.href = row.dataset.url;
  });
});
