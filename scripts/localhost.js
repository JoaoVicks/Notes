export function getLocalStorage() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const ordernotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

  return ordernotes;
}

export function saveLocalStrorage(nota) {
  const notes = getLocalStorage();
  notes.push(nota);
  localStorage.setItem("notes", JSON.stringify(notes));
}

export function getLocalStorageNotasExcluidas() {
  const notesExcluidas =
    JSON.parse(localStorage.getItem("notesExcluidas")) || [];
  return notesExcluidas;
}

export function saveLocalStrorageNotasExcluidas(notaExluida) {
  const notesExcluidas = getLocalStorageNotasExcluidas();
  notesExcluidas.push(notaExluida);
  localStorage.setItem("notesExcluidas", JSON.stringify(notesExcluidas));
}
