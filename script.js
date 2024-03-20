// Elementos --------------------------------------
const rosa = document.querySelector('input#ipink')
const btnCreate = document.querySelector('#btn-create-note')
const textAreaCreate = document.querySelector('#inota')
const containerCards = document.querySelector('.container-cards')
const inputsRadios = document.querySelectorAll('input[type=radio]')
const containerCardsfixados = document.querySelector('#container-cards-fixados')
const rowColor = document.querySelector('.row-color')
const noFixedContainer = document.querySelector('#container-cards-nofixed')
const fixedContainer = document.querySelector('#container-cards-fixados')
//-----------------variaveis Globais-----------------------
let colorRow = '#5AE22A'
//-------------------funções----------------------
function fixeNote(){

}
const date = new Date()
console.log(`${date.getHours()}:${date.getMinutes()}`)
inputsRadios.forEach((btnRadio) => {
    btnRadio.addEventListener('click', (e) => {
        const btn = e.target
        switch (btn.value) {
            case 'green':
                colorRow = '#5AE22A'
                rowColor.style.backgroundColor = '#5AE22A'
                break;
            case 'orange':
                colorRow = '#E26D2A'
                rowColor.style.backgroundColor = '#E26D2A'
                break;
            case 'pink':
                colorRow = '#E22A8E'
                rowColor.style.backgroundColor = '#E22A8E'
                break;

        }

    })
})

const createNote = (text, save = false, estate = false, color) => {

    const elementoStr = ` <div class="card">
<div class="time-user-day">
    <p>16:30</p>
    <img src="Rectangle 22.png" alt="">
    <p>22/09/2007</p>

</div>
<textarea name="note-card" id="" cols="30" rows="10">${text}</textarea>
<div class="container-btns-card-main">
    <div class="btn-card">
        <img src="lixeira.svg" alt="imagem de lixeira">
    </div>
    <div class="btn-card">
        <img src="pin.svg" alt="imagem de pin">
    </div>

</div>
<div class="line-color"></div>
</div>`
    const parse = new DOMParser()
    const elementoHTML = parse.parseFromString(elementoStr, 'text/html')

    const card = elementoHTML.querySelector('.card')
    const lineColor = card.querySelector('.line-color')

    lineColor.style.backgroundColor = colorRow

        if (save == false) {
            const nota = {
                texto: text,
                cor: colorRow,
                estate
            }

            saveLocalStrorage(nota)
        }
        else{
            lineColor.style.backgroundColor= color
        }


// continuar a logica do color

        if (estate === false) {
        noFixedContainer.appendChild(card)
        
        
        }
        else{
        containerCardsfixados.appendChild(card)
        card.classList.add('fixado')
        }

    }
    function loadTarefas(){
        const notes = getLocalStorage()
        notes.forEach((nota)=>{
            createNote(nota.texto,save= true,nota.estate,nota.cor)
            
        })
    }

    //------------------------localhost--------------------
    function getLocalStorage() {
        const notes = JSON.parse(localStorage.getItem('notes')) || []
        return notes
    }
    function saveLocalStrorage(nota) {
        const notes = getLocalStorage();
        notes.push(nota)
        localStorage.setItem('notes', JSON.stringify(notes))
    }

    // Eventos ----------------------------------------
    document.addEventListener('click',(e)=>{
        const elementoAtivador = e.target
        // continuar código--------------------------
        if(elementoAtivador.classList.contains('')){

        }
    })

    btnCreate.addEventListener('click', () => {
        const texto = textAreaCreate.value

        if (!texto|| texto == '') {
            console.log('vazio')
            return
        }


        createNote(texto)
    })
    loadTarefas()