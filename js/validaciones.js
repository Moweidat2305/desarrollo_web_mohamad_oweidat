// Validation helpers shared by both forms
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const REGEX_NAME = /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ ]+$/;
const REGEX_PHONE = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/; // Accepts 912345678, +56912345678 or with spaces: +56 9 1234 5678

function isValidEmail(email) {
  return REGEX_EMAIL.test(email.trim());
}

function isValidPhone(phone) {
  return REGEX_PHONE.test(phone.trim());
}

function isValidName(name) {
  const clean = name.trim();
  return REGEX_NAME.test(clean);
}

// Difference in years between a date and today
function ageFrom(dateText) {
  const birth = new Date(dateText);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hadBirthdayThisYear = today.getMonth() > birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hadBirthdayThisYear) age--;
  return age;
}

// Shows or hides the error message of a field.
// Returns true when there was no error so the result can be accumulated.
function markField(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById("error-" + fieldId);
  if (message) {
    field.classList.add("invalid");
    error.textContent = message;
    return false;
  }
  field.classList.remove("invalid");
  error.textContent = "";
  return true;
}

function clearErrors(form) {
  form.querySelectorAll(".invalid").forEach(f => f.classList.remove("invalid"));
  form.querySelectorAll(".error-message").forEach(e => (e.textContent = ""));
}
