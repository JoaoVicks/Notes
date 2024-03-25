// Elementos --------------------------------------
const rosa = document.querySelector('input#ipink')
const btnCreate = document.querySelector('#btn-create-note')
const textAreaCreate = document.querySelector('#inota')
const inputsRadios = document.querySelectorAll('input[type=radio]')
const containerCardsfixados = document.querySelector('#container-cards-fixados')
const rowColor = document.querySelector('.row-color')
const noFixedContainer = document.querySelector('#container-cards-nofixed')
const fixedContainer = document.querySelector('#container-cards-fixados')
const containerCardsEmpty= document.querySelector('#container-cards-empty')
const HoraCardAside = document.querySelector('.hours')
const dataCardAside = document.querySelector('.date')
//-----------------variaveis Globais-----------------------
let colorRow = '#5AE22A'
//-------------------funções----------------------


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

function addNote(text, fixed = false) {
    const nota = {
        id: generateId(),
        texto: text,
        cor: colorRow,
        horario: generateHours(),
        data: gerarData(),
        fixed
    }

    saveLocalStrorage(nota)
    createNote(nota.texto, nota.fixed, nota.cor, nota.id, nota.horario, nota.data)
}


const createNote = (text, fixed, color, id, horario, data) => {


    const elementoStr = `<div class="card">
<div class="time-user-day">
    <p>${horario}</p>
    <img src="Rectangle 22.png" alt="">
    <p>${data}</p>

</div>
<textarea name="note-card" id="" cols="30" rows="10">${text}</textarea>
<div class="container-btns-card-main">
 <div class="btn-card fixe" >
        <img src="pin.svg" alt="imagem de pin">
    </div>
    <div class="btn-card remove">
        <img src="lixeira.svg" alt="imagem de lixeira">
    </div>
   

</div>
<div class="line-color"></div>
</div>`
    const parse = new DOMParser()
    const elementoHTML = parse.parseFromString(elementoStr, 'text/html')

    const card = elementoHTML.querySelector('.card')
    const lineColor = card.querySelector('.line-color')
    lineColor.style.backgroundColor = color
    const btnRemov = card.querySelector('.remove')
    const btnFixed = card.querySelector('.fixe')

    btnRemov.addEventListener('click', (e) => {
        removerNota(id, e.target)
    })

    btnFixed.addEventListener('click', (e) => {
        fixeNota(id, e.target)
    })




    if (fixed === false) {
        noFixedContainer.appendChild(card)


    }
    else {
        containerCardsfixados.appendChild(card)
        card.classList.add('fixed')
    }
    containerCardsfixados.style.display = 'flex'
    noFixedContainer.style.display = 'flex'
    
    containerCardsEmpty.style.display = 'none'
}

function loadTarefas() {
    const notes = getLocalStorage()
    if (notes ===''|| !notes) {
        
    containerCardsfixados.style.display = 'none'
    noFixedContainer.style.display = 'none'
    
    containerCardsEmpty.style.display = 'flex'
    }
    else {
        containerCardsfixados.style.display = 'flex'
        noFixedContainer.style.display = 'flex'
        
        containerCardsEmpty.style.display = 'none'
        notes.forEach((nota) => {
            createNote(nota.texto, nota.fixed, nota.cor, nota.id, nota.horario)

        })
    }

}
function removerNota(id, elemento) {
    const card = elemento.closest('div.card')
    card.remove()

    const notas = getLocalStorage()
    const arrayAtualizado = notas.filter((nota) => id !== nota.id)
    localStorage.setItem('notes', JSON.stringify(arrayAtualizado))
}

function fixeNota(id, elemento) {
    const card = elemento.closest('div.card')
    card.classList.toggle('fixed')
    const notes = getLocalStorage()
    notes.map((note) => {
        if (note.id === id) {
            note.fixed = !note.fixed
            if (note.fixed === true) {
                containerCardsfixados.appendChild(card)
            }
            if (note.fixed === false) {
                noFixedContainer.appendChild(card)
            }
        }

    })
    localStorage.setItem('notes', JSON.stringify(notes))

}
function generateId() {
    let id = 1;
    const notes = getLocalStorage();
    if (!notes || notes.length === 0) {
        return id;
    } else {
        const ids = notes.map(note => note.id);
        id = Math.max(...ids) + 1;
        return id;
    }
}
function generateHours() {
    const date = new Date()
    const horario = `${(date.getHours()).toString().padStart(2, '0')}:${(date.getMinutes()).toString().padStart(2, '0')}`
    return horario
}
function gerarData() {
    const date = new Date()


    const data = `${date.getDate()}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    return data
}
function atualizacaoDateAside() {
    HoraCardAside.textContent = generateHours()
    dataCardAside.textContent = gerarData()
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


btnCreate.addEventListener('click', () => {
    const texto = textAreaCreate.value

    if (!texto || texto == '') {
        console.log('vazio') //fazer alerta visual, quando o texto for vazio
        return
    }

    addNote(texto)
    textAreaCreate.value = ""
    textAreaCreate.focus()
})
// inicialização ---------------------------
loadTarefas()
atualizacaoDateAside()// fazer relógio que se atualiza automaticamente 
