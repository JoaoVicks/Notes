import { animação, pesquisar, addNote, downloadCSV, exibirNotasExcluidas, loadTarefas, atualizacaoDateAside } from "./functions.js";

const btnCreate = document.querySelector("#btn-create-note");
const textAreaCreate = document.querySelector("#inota");
const inputsRadios = document.querySelectorAll("input[type=radio]");
const rowColor = document.querySelector(".row-color");
const inputSearch = document.querySelector("#input-search");
const btnCSV = document.querySelector("#donwlad-csv");

export const btnNotasExcluidas = document.querySelector("#notas-excluidas");

let colorRow = "#5AE22A";

animação();

inputsRadios.forEach((btnRadio) => {
  btnRadio.addEventListener("click", (e) => {
    const btn = e.target;
    switch (btn.value) {
      case "green":
        colorRow = "#5AE22A";
        rowColor.style.backgroundColor = "#5AE22A";
        break;
      case "orange":
        colorRow = "#E26D2A";
        rowColor.style.backgroundColor = "#E26D2A";
        break;
      case "pink":
        colorRow = "#E22A8E";
        rowColor.style.backgroundColor = "#E22A8E";
        break;
    }
  });
});

btnCreate.addEventListener("click", () => {
  const texto = textAreaCreate.value;
  const color = colorRow;
  if (!texto || texto == "") {
    console.log("vazio"); 
    return;
  }

  addNote(color, texto);
  textAreaCreate.value = "";
  textAreaCreate.focus();
});
inputSearch.addEventListener("keyup", () => {
  const texto = inputSearch.value;
  pesquisar(texto);
});
btnCSV.addEventListener("click", () => {
  downloadCSV();
});
btnNotasExcluidas.addEventListener("click", () => {
  exibirNotasExcluidas();
});

loadTarefas();
atualizacaoDateAside(); 
