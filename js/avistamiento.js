// Form to report a sighting

const form = document.getElementById("sighting-form");
const regionSelect = document.getElementById("sighting-region");
const communeSelect = document.getElementById("sighting-commune");

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "webm"];
const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_FILES = 5;

loadRegions(regionSelect, communeSelect);

// Returns today's date as "YYYY-MM-DD" which is what the date input gives
function todayISO() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return today.getFullYear() + "-" + month + "-" + day;
}

function currentTime() {
  const now = new Date();
  return String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
}

function validateDate(date) {
  if (date === "") return "Ingresa la fecha del avistamiento.";
  if (date > todayISO()) return "La fecha no puede estar en el futuro.";
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  if (new Date(date) < oneYearAgo) return "El avistamiento no puede tener más de un año de antigüedad.";

  return "";
}

function validateFiles(fileList) {
  if (fileList.length === 0) return "Debes adjuntar al menos una foto o video.";
  if (fileList.length > MAX_FILES) return "Máximo " + MAX_FILES + " archivos por avistamiento.";

  for (const file of fileList) {
    const extension = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return "El archivo " + file.name + " no es una imagen ni un video permitido.";
    }
    if (file.size > MAX_SIZE) {
      return "El archivo " + file.name + " supera los 50 MB.";
    }
  }
  return "";
}

function validateSighting() {
  let allGood = true;

  const email = document.getElementById("volunteer-email").value;
  if (email.trim() === "") {
    allGood = markField("volunteer-email", "Ingresa el correo con el que te registraste.") && allGood;
  } else if (!isValidEmail(email)) {
    allGood = markField("volunteer-email", "El correo no tiene un formato valido.") && allGood;
  } else {
    markField("volunteer-email", "");
  }

  if (document.getElementById("bird-type").value === "") {
    allGood = markField("bird-type", "Selecciona el tipo de ave.") && allGood;
  } else {
    markField("bird-type", "");
  }

  const birdName = document.getElementById("bird-name").value.trim();
  if (birdName.length < 2 || birdName.length > 60) {
    allGood = markField("bird-name", "El nombre del ave debe tener entre 2 y 60 caracteres.") && allGood;
  } else {
    markField("bird-name", "");
  }

  const quantity = document.getElementById("quantity").value;
  if (quantity !== "" && (!Number.isInteger(Number(quantity)) || quantity < 1 || quantity > 10000)) {
    allGood = markField("quantity", "La cantidad debe ser un número entero entre 1 y 10.000.") && allGood;
  } else {
    markField("quantity", "");
  }

  if (regionSelect.value === "") {
    allGood = markField("sighting-region", "Selecciona la region.") && allGood;
  } else {
    markField("sighting-region", "");
  }

  if (communeSelect.value === "") {
    allGood = markField("sighting-commune", "Selecciona la comuna.") && allGood;
  } else {
    markField("sighting-commune", "");
  }

  const place = document.getElementById("place").value.trim();
  if (place.length < 3 || place.length > 100) {
    allGood = markField("place", "Describe el lugar en entre 3 y 100 caracteres.") && allGood;
  } else {
    markField("place", "");
  }

  const date = document.getElementById("date").value;
  const dateError = validateDate(date);
  allGood = markField("date", dateError) && allGood;

  const time = document.getElementById("time").value;
  if (time === "") {
    allGood = markField("time", "Ingresa la hora del avistamiento.") && allGood;
  } else if (date === todayISO() && time > currentTime()) {
    allGood = markField("time", "La hora no puede ser posterior a la actual.") && allGood;
  } else {
    markField("time", "");
  }

  const files = document.getElementById("files").files;
  allGood = markField("files", validateFiles(files)) && allGood;

  const comment = document.getElementById("comment").value;
  if (comment.length > 500) {
    allGood = markField("comment", "El comentario no puede superar los 500 caracteres (llevas " + comment.length + ").") && allGood;
  } else {
    markField("comment", "");
  }

  return allGood;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!validateSighting()) {
    form.querySelector(".invalid").focus();
    return;
  }
  // There is no server, so we only show the success message
  document.getElementById("sighting-success").hidden = false;
  form.hidden = true;
  window.scrollTo(0, 0);
});

form.addEventListener("reset", function () {
  clearErrors(form);
  loadCommunes("", communeSelect);
});
