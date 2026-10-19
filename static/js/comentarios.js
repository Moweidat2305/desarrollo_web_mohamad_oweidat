// Comments of a sighting: the list and the form both use fetch, the page is never reloaded.
// markField and clearErrors come from validaciones.js

const commentForm = document.getElementById("comment-form");
const commentList = document.getElementById("comment-list");
const listMessage = document.getElementById("comment-list-message");
const resultMessage = document.getElementById("comment-result");
const commentsUrl = commentForm.getAttribute("action"); // GET lists the comments, POST adds one

// One <li> per comment. textContent shows the text as it is: a <script> is shown, never executed
function showComments(comments) {
  commentList.replaceChildren();
  if (comments.length === 0) {
    listMessage.textContent = "Todavía no hay comentarios.";
    return;
  }
  listMessage.textContent = "";

  for (const comment of comments) {
    const name = document.createElement("strong");
    name.textContent = comment.nombre;

    const date = document.createElement("span");
    date.className = "comment-date";
    date.textContent = comment.fecha;

    const text = document.createElement("p");
    text.textContent = comment.texto;

    const item = document.createElement("li");
    item.append(name, " ", date, text);
    commentList.append(item);
  }
}

async function loadComments() {
  try {
    const response = await fetch(commentsUrl);
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    showComments(await response.json());
  } catch (error) {
    listMessage.textContent = "No se pudieron cargar los comentarios.";
  }
}

// Same rules as the server (validar_comentario in validaciones.py)
function validateComment() {
  let allGood = true;

  const name = document.getElementById("commenter-name").value.trim();
  if (name.length < 3 || name.length > 50) {
    allGood = markField("commenter-name", "El nombre debe tener entre 3 y 50 caracteres.") && allGood;
  } else {
    markField("commenter-name", "");
  }

  const text = document.getElementById("comment-text").value.trim();
  if (text.length < 5) {
    allGood = markField("comment-text", "El comentario debe tener al menos 5 caracteres.") && allGood;
  } else if (text.length > 300) {
    allGood = markField("comment-text", "El comentario no puede superar los 300 caracteres.") && allGood;
  } else {
    markField("comment-text", "");
  }

  return allGood;
}

commentForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // the form is sent with fetch, not by the browser
  resultMessage.textContent = "";

  if (!validateComment()) {
    commentForm.querySelector(".invalid").focus();
    return;
  }

  try {
    const response = await fetch(commentsUrl, { method: "POST", body: new FormData(commentForm) });

    if (response.status === 400) {
      // The server found errors: each message goes under its field, the form stays filled
      const data = await response.json();
      for (const field in data.errores) {
        markField(field, data.errores[field]);
      }
      return;
    }
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    commentForm.reset();
    clearErrors(commentForm);
    resultMessage.textContent = "¡Gracias! Tu comentario fue agregado.";
    loadComments();
  } catch (error) {
    resultMessage.textContent = "No se pudo enviar el comentario. Inténtalo de nuevo.";
  }
});

loadComments();
