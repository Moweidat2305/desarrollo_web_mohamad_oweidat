// Volunteer registration form

const form = document.getElementById("registration-form");
const regionSelect = document.getElementById("region");
const communeSelect = document.getElementById("commune");

loadRegions(regionSelect, communeSelect);

function validateRegistration() {
  let allGood = true;

  const name = document.getElementById("name").value;
  if (name.trim() === "") {
    allGood = markField("name", "Ingresa tu nombre completo.") && allGood;
  } else if (!isValidName(name)) {
    allGood = markField("name", "El nombre solo puede contener letras y espacios.") && allGood;
  } else {
    markField("name", "");
  }

  const birthDate = document.getElementById("birth-date").value;
  if (birthDate === "") {
    markField("birth-date", "");
  } else if (ageFrom(birthDate) < 14) {
    allGood = markField("birth-date", "Debes tener al menos 14 años.") && allGood;
  } else if (ageFrom(birthDate) > 120) {
    allGood = markField("birth-date", "Revisa la fecha parece incorrecta.") && allGood;
  } else {
    markField("birth-date", "");
  }

  const email = document.getElementById("email").value;
  if (email.trim() === "") {
    allGood = markField("email", "Ingresa tu correo electrónico.") && allGood;
  } else if (!isValidEmail(email)) {
    allGood = markField("email", "El correo no tiene un formato valido") && allGood;
  } else {
    markField("email", "");
  }

  const phone = document.getElementById("phone").value;
  if (phone.trim() !== "" && !isValidPhone(phone)) {
    allGood = markField("phone", "El celular debe tener 9 digitos.") && allGood;
  } else {
    markField("phone", "");
  }

  if (regionSelect.value === "") {
    allGood = markField("region", "Selecciona tu región.") && allGood;
  } else {
    markField("region", "");
  }

  if (communeSelect.value === "") {
    allGood = markField("commune", "Selecciona tu comuna.") && allGood;
  } else {
    markField("commune", "");
  }

  const street = document.getElementById("street").value;
  if (street.trim().length > 120) {
    allGood = markField("street", "La dirección no puede superar los 120 caracteres.") && allGood;
  } else {
    markField("street", "");
  }
  return allGood;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!validateRegistration()) {
    // Take the user to the first field with a problem
    form.querySelector(".invalid").focus();
    return;
  }
  // There is no server, so we only show the success message
  document.getElementById("registration-success").hidden = false;
  form.hidden = true;
  window.scrollTo(0, 0);
});

form.addEventListener("reset", function () {
  clearErrors(form);
  loadCommunes("", communeSelect);
});
