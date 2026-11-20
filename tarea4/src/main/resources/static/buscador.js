// Buscador de avistamientos: busca mientras se escribe y permite evaluar cada uno

const input = document.getElementById("texto");
const mensaje = document.getElementById("mensaje");
const resultados = document.getElementById("resultados");
const filas = document.getElementById("filas");

// Enter no debe recargar la pagina
document.getElementById("search-form").addEventListener("submit", e => e.preventDefault());

input.addEventListener("input", buscar);

async function buscar() {
  const texto = input.value.trim();
  if (texto === "") {
    resultados.hidden = true;
    mensaje.textContent = "";
    return;
  }

  try {
    const respuesta = await fetch("/api/buscar?texto=" + encodeURIComponent(texto));
    if (!respuesta.ok) {
      throw new Error("HTTP " + respuesta.status);
    }
    const lista = await respuesta.json();

    // si el usuario siguio escribiendo, esta respuesta ya no sirve
    if (texto !== input.value.trim()) {
      return;
    }
    mostrar(lista, texto);
  } catch (error) {
    mensaje.textContent = "No se pudo hacer la búsqueda.";
  }
}

function mostrar(lista, texto) {
  filas.replaceChildren();

  if (lista.length === 0) {
    resultados.hidden = true;
    mensaje.textContent = "No se encontraron avistamientos para \"" + texto + "\".";
    return;
  }

  mensaje.textContent = "Resultados: " + lista.length;
  resultados.hidden = false;

  for (const a of lista) {
    const celdaNota = celda(textoNota(a.nota));
    const celdaEvaluar = celda(botonEvaluar(a.id, celdaNota));

    const fila = document.createElement("tr");
    fila.append(
      celda(resaltar(a.voluntario, texto)),
      celda(a.dia),
      celda(resaltar(a.ave, texto)),
      celda(resaltar(a.comuna, texto)),
      celdaNota,
      celdaEvaluar
    );
    filas.append(fila);
  }
}

function celda(contenido) {
  const td = document.createElement("td");
  td.append(contenido);
  return td;
}

function textoNota(nota) {
  if (nota === null) {
    return "-";
  }
  return nota.toFixed(1);
}

// pone dentro de <mark> las partes del nombre que calzan con lo buscado
function resaltar(nombre, buscado) {
  const span = document.createElement("span");
  const nombreSimple = simplificar(nombre);
  const buscadoSimple = simplificar(buscado);

  let desde = 0;
  let pos = nombreSimple.indexOf(buscadoSimple);
  while (pos !== -1) {
    span.append(nombre.slice(desde, pos));
    const mark = document.createElement("mark");
    mark.textContent = nombre.slice(pos, pos + buscadoSimple.length);
    span.append(mark);
    desde = pos + buscadoSimple.length;
    pos = nombreSimple.indexOf(buscadoSimple, desde);
  }
  span.append(nombre.slice(desde));
  return span;
}

// minusculas y sin tildes, como compara la base de datos ("Galápagos" -> "galapagos")
function simplificar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function botonEvaluar(id, celdaNota) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = "Evaluar";
  boton.addEventListener("click", () => pedirNota(id, celdaNota, boton.parentElement));
  return boton;
}

// cambia el boton por una lista con las notas de 1 a 7
function pedirNota(id, celdaNota, celdaEvaluar) {
  const select = document.createElement("select");
  select.setAttribute("aria-label", "Nota");
  select.add(new Option("Elige", ""));
  for (let n = 1; n <= 7; n++) {
    select.add(new Option(n, n));
  }
  select.addEventListener("change", () => guardarNota(id, select.value, celdaNota, celdaEvaluar));
  celdaEvaluar.replaceChildren(select);
  select.focus();
}

async function guardarNota(id, nota, celdaNota, celdaEvaluar) {
  if (nota === "") {
    return;
  }

  try {
    const respuesta = await fetch("/api/avistamientos/" + id + "/notas", {
      method: "POST",
      body: new URLSearchParams({ nota: nota })
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
      alert(datos.error);
      return;
    }

    // el servidor devuelve el nuevo promedio
    celdaNota.textContent = textoNota(datos.nota);
    celdaEvaluar.replaceChildren(botonEvaluar(id, celdaNota));
  } catch (error) {
    alert("No se pudo guardar la nota.");
  }
}
