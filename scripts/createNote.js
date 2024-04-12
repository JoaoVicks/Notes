import { containerCardsEmpty, fixeNota, removerNota, duplicar, generateHours } from "./functions.js";

const containerCards = document.querySelector(".container-cards");

export function createNote(text, fixed, color, id, horario, data) {
  
  const elementoStr = `
          <div class="time-user-day">
              <p id="hora">${horario}</p>
              <img src="./assets/Rectangle 22.png" alt="">
              <p id="data">${data}</p>
          </div>
          <textarea name="note-card" id="" cols="30" rows="10">${text}</textarea>
          <div class="container-btns-card-main">
              <div class="btn-card fixe" >
                  <img src="./svgs/pin.svg" alt="icone de pin">
              </div>
              <div class="btn-card remove">
                  <img src="./svgs/lixeira.svg" alt="icone de lixeira">
              </div>
              <div class="btn-card  duplicate">
                  <img src="./svgs/icn-duplicate.svg" alt="icone de duplicar">
              </div>
          </div>
          <div class="line-color"></div>
`;

  const card = document.createElement("div");
  card.classList.add("card")
  card.innerHTML = elementoStr;
  console.log(card);
  const lineColor = card.querySelector(".line-color");

  lineColor.style.backgroundColor = color;

  const textarea = card.querySelector("textarea");
  const btnRemov = card.querySelector(".remove");
  const btnFixed = card.querySelector(".fixe");
  const btnDuplicate = card.querySelector(".duplicate");
  const horaP = card.querySelector("#hora");
  const dataP = card.querySelector("#data");

  btnRemov.addEventListener("click", (e) => {
    removerNota(id, e.target, text, color, horario, data);
  });

  btnFixed.addEventListener("click", (e) => {
    fixeNota(id, e.target);
  });
  btnDuplicate.addEventListener("click", (e) => {
    duplicar(text, color, fixed);
  });
  textarea.addEventListener("input", () => {
    const texto = textarea.value;
    const UpdateHorario = generateHours();
    const UpdateDate = gerarData();
    horaP.textContent = UpdateHorario;
    dataP.textContent = UpdateDate;
    editar(id, texto, UpdateHorario, UpdateDate);
  });

  if (fixed === true) {
    card.classList.add("fixed");
  }

  containerCards.appendChild(card);
  containerCardsEmpty.style.display = "none";

  return card;
}
