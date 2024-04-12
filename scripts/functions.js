import { getLocalStorage, saveLocalStrorage, saveLocalStrorageNotasExcluidas, getLocalStorageNotasExcluidas } from "./localhost.js";
import { createNote } from "./createNote.js"
import { btnNotasExcluidas } from "./index.js";

const alerta = document.querySelector("#container-alerts");
const containerCards = document.querySelector(".container-cards");
export const containerCardsEmpty = document.querySelector("#container-cards-empty");
const HoraCardAside = document.querySelector(".hours");
const dataCardAside = document.querySelector(".date");

export function animação() {
  alerta.style.right = "50px";
  setTimeout(() => {
    alerta.style.right = "-550px";
  }, "4000");
}

export function addNote(
  color,
  text,
  horario = generateHours(),
  fixed = false,
  notaExcluida = false
) {
  const nota = {
    id: generateId(),
    texto: text,
    cor: color,
    horario: horario,
    data: gerarData(),
    fixed,
  };

  saveLocalStrorage(nota);

  if (notaExcluida == false) {
    const card = createNote(
      nota.texto,
      nota.fixed,
      nota.cor,
      nota.id,
      nota.horario,
      nota.data
    );
    containerCards.appendChild(card);
  }
}

export function createNoteExluida(text, color, id, horario, data) {
  const elementoStr = `
        <div class="card">
            <div class="time-user-day">
                <p id="hora">${horario}</p>
                <img src="./assets/Rectangle 22.png" alt="">
                <p id="data">${data}</p>

            </div>
            <textarea name="note-card" id="" cols="30" rows="10">${text}</textarea>
            <div class="container-btns-card-main">
                <div class="btn-card recicle" >
                    <i class="fa-solid fa-recycle"></i>
                </div>
            </div>
            <div class="line-color"></div>
        </div>
`;
  const parse = new DOMParser();
  const elementoHTML = parse.parseFromString(elementoStr, "text/html");
  const card = elementoHTML.querySelector(".card");
  const lineColor = card.querySelector(".line-color");
  const btnReciclar = card.querySelector(".recicle");
  lineColor.style.backgroundColor = color;

  btnReciclar.addEventListener("click", (e) => {
    reciclarNota(id, e.target, text, color, horario);
  });

  containerCards.appendChild(card);
}

export function loadTarefas() {
  cleanNotes();
  const notes = getLocalStorage();
  if (!Array.isArray(notes) || notes.length < 1) {
    console.log(containerCardsEmpty);
    containerCardsEmpty.style.display = "flex";
  } else {
    containerCardsEmpty.style.display = "none";
    notes.forEach((nota) => {
      const card = createNote(
        nota.texto,
        nota.fixed,
        nota.cor,
        nota.id,
        nota.horario,
        nota.data
      );
      containerCards.appendChild(card);
    });
  }
}

function reciclarNota(id, elemento, text, color, horario, data) {
  elemento.closest("div.card").remove();

  addNote(color, text, horario, false, true);
  const notesExcluidasUpdate = getLocalStorageNotasExcluidas().filter(
    (nota) => nota.id !== id
  );
  localStorage.setItem("notesExcluidas", JSON.stringify(notesExcluidasUpdate));
}

export function editar(id, texto, horario, data) {
  const notas = getLocalStorage();
  notas.map((nota) => {
    if (nota.id === id) {
      nota.texto = texto;
      nota.horario = horario;
      nota.data = data;
    }

    localStorage.setItem("notes", JSON.stringify(notas));
  });
}

export function duplicar(texto, color, fixed) {
  const nota = {
    id: generateId(),
    texto: texto,
    cor: color,
    horario: generateHours(),
    data: gerarData(),
    fixed,
  };
  saveLocalStrorage(nota);
  createNote(
    nota.texto,
    nota.fixed,
    nota.cor,
    nota.id,
    nota.horario,
    nota.data
  );

  loadTarefas();
}

export function removerNota(id, elemento, text, color, horario, data) {
  const card = elemento.closest("div.card");

  card.remove();

  const notas = getLocalStorage();
  const arrayAtualizado = notas.filter((nota) => id !== nota.id);
  localStorage.setItem("notes", JSON.stringify(arrayAtualizado));
  loadTarefas();

  const notaExcluida = {
    id,
    texto: text,
    color,
    horario,
    data,
  };

  saveLocalStrorageNotasExcluidas(notaExcluida);
}

export function fixeNota(id) {
  const notes = getLocalStorage();
  notes.map((note) => {
    if (note.id === id) {
      note.fixed = !note.fixed;
    }
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  loadTarefas();
}

function generateId() {
  let id = 1;
  const notes = getLocalStorage();
  if (!notes || notes.length === 0) {
    return id;
  } else {
    const ids = notes.map((note) => note.id);
    id = Math.max(...ids) + 1;
    return id;
  }
}

export function generateHours() {
  const date = new Date();
  const horario = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return horario;
}

function gerarData() {
  const date = new Date();

  const data = `${date.getDate()}/${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
  return data;
}

export function atualizacaoDateAside() {
  HoraCardAside.textContent = generateHours();
  dataCardAside.textContent = gerarData();
  setInterval(() => {
    HoraCardAside.textContent = generateHours();
    dataCardAside.textContent = gerarData();
  }, 60000);
}


function cleanNotes() {
  containerCards.replaceChildren([]);
}

export function pesquisar(texto) {
  const notes = getLocalStorage();

  const notesPesquisados = notes.filter((note) => {
    return note.texto.includes(texto);
  });

  if (texto !== "") {
    cleanNotes();
    notesPesquisados.forEach((note) => {
      console.log(note);
      createNote(
        note.texto,
        note.fixed,
        note.cor,
        note.id,
        note.horario,
        note.data
      );
    });
  } else {
    loadTarefas();
  }
}

export function downloadCSV() {
  const notes = getLocalStorage();
  const csv = [
    ["texto da nota", "fixada ?", "horario", "data", "id"],
    ...notes.map((note) => [
      note.texto,
      note.fixed,
      note.horario,
      note.data,
      note.id,
    ]),
  ]
    .map((e) => e.join(","))
    .join("\n");

  const element = document.createElement("a");

  element.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  console.log(encodeURI(csv));
  element.target = "_blank";
  element.download = "notes.csv";
  element.click();
}

export function exibirNotasExcluidas() {
  btnNotasExcluidas.classList.toggle("active");
  if (btnNotasExcluidas.classList.contains("active")) {
    cleanNotes();
    const notasExcluidas = getLocalStorageNotasExcluidas();
    notasExcluidas.forEach((nota) => {
      createNoteExluida(
        nota.texto,
        nota.color,
        nota.id,
        nota.horario,
        nota.data
      );
    });
  } else {
    loadTarefas();
  }
}