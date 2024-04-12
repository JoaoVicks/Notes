// Elementos --------------------------------------
const rosa = document.querySelector('input#ipink')
const btnCreate = document.querySelector('#btn-create-note')
const textAreaCreate = document.querySelector('#inota')
const inputsRadios = document.querySelectorAll('input[type=radio]')
const containerCardsfixados = document.querySelector('#container-cards-fixados')
const rowColor = document.querySelector('.row-color')
const containerCards = document.querySelector('.container-cards')
const inputSearch = document.querySelector('#input-search')
const containerCardsEmpty = document.querySelector('#container-cards-empty')
const HoraCardAside = document.querySelector('.hours')
const dataCardAside = document.querySelector('.date')
const btnCSV = document.querySelector('#donwlad-csv')
const btnNotasExcluidas = document.querySelector('#notas-excluidas')
const alerta = document.querySelector('#container-alerts')
//-----------------variaveis Globais-----------------------
let colorRow = '#5AE22A'
//-------------------funções----------------------
function animação (){
    alerta.style.right = '50px'
    setTimeout(() => {
        alerta.style.right = '-550px'
    }, '4000');
}
animação()

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

function addNote(color, text, horario=generateHours(),fixed = false, notaExcluida=false) {
    const nota = {
        id: generateId(),
        texto: text,
        cor: color,
        horario: horario,
        data: gerarData(),
        fixed
    }

    saveLocalStrorage(nota)

        if(notaExcluida== false){
      const card = createNote(nota.texto, nota.fixed, nota.cor, nota.id, nota.horario, nota.data)      
      containerCards.appendChild(card)
    }

}


const createNote = (text, fixed, color, id, horario, data) => {
    const elementoStr = `<div class="card">
<div class="time-user-day">
    <p id="hora">${horario}</p>
    <img src="Rectangle 22.png" alt="">
    <p id="data">${data}</p>

</div>
<textarea name="note-card" id="" cols="30" rows="10">${text}</textarea>
<div class="container-btns-card-main">
    <div class="btn-card fixe" >
        <img src="pin.svg" alt="icone de pin">
    </div>
    <div class="btn-card remove">
        <img src="lixeira.svg" alt="icone de lixeira">
    </div>
    <div class="btn-card  duplicate">
        <img src="icn-duplicate.svg" alt="icone de duplicar">
    </div>
</div>
<div class="line-color"></div>
</div>`
    const parse = new DOMParser()
    const elementoHTML = parse.parseFromString(elementoStr, 'text/html')

    const card = elementoHTML.querySelector('.card')
    const lineColor = card.querySelector('.line-color')

    lineColor.style.backgroundColor = color

    const textarea = card.querySelector('textarea')
    const btnRemov = card.querySelector('.remove')
    const btnFixed = card.querySelector('.fixe')
    const btnDuplicate = card.querySelector('.duplicate')
    const horaP = card.querySelector('#hora')
    const dataP = card.querySelector('#data')

    btnRemov.addEventListener('click', (e) => {
        removerNota(id, e.target, text, color, horario, data)
    })

    btnFixed.addEventListener('click', (e) => {
        fixeNota(id, e.target)
    })
    btnDuplicate.addEventListener('click', (e) => {
        duplicar(text, color, fixed)
    })
    textarea.addEventListener('input', () => {
        const texto = textarea.value
        const UpdateHorario = generateHours()
        const UpdateDate = gerarData()
        horaP.textContent = UpdateHorario
        dataP.textContent = UpdateDate
        editar(id, texto, UpdateHorario, UpdateDate)
    })

    if (fixed === true) {
        card.classList.add('fixed')
    }

    containerCardsEmpty.style.display = 'none'
    
return card

}

function createNoteExluida(text,color, id, horario, data) {
    const elementoStr = `<div class="card">
<div class="time-user-day">
    <p id="hora">${horario}</p>
    <img src="Rectangle 22.png" alt="">
    <p id="data">${data}</p>

</div>
<textarea name="note-card" id="" cols="30" rows="10">${text}</textarea>
<div class="container-btns-card-main">
    <div class="btn-card recicle" >
        <i class="fa-solid fa-recycle"></i>
    </div>
</div>
<div class="line-color"></div>
</div>`
    const parse = new DOMParser()
    const elementoHTML = parse.parseFromString(elementoStr, 'text/html')
    const card = elementoHTML.querySelector('.card')
    const lineColor = card.querySelector('.line-color')
    const btnReciclar = card.querySelector('.recicle')
    lineColor.style.backgroundColor = color
    
    btnReciclar.addEventListener('click', (e) => {
        reciclarNota(id, e.target, text, color, horario)
    })


    containerCards.appendChild(card)

}

function loadTarefas() {
    cleanNotes()
    const notes = getLocalStorage()

    if (!Array.isArray(notes) || notes.length === 0) {
        containerCardsEmpty.style.display = 'flex'
    }
    else {
        containerCardsEmpty.style.display = 'none'
        notes.forEach((nota) => {
           const card = createNote(nota.texto, nota.fixed, nota.cor, nota.id, nota.horario, nota.data)
           containerCards.appendChild(card)
        })
    }
}

function editar(id, texto, horario, data) {
    const notas = getLocalStorage()
    notas.map((nota) => {
        if (nota.id === id) {
            nota.texto = texto
            nota.horario = horario
            nota.data = data
        }

        localStorage.setItem('notes', JSON.stringify(notas))
    })
}

function reciclarNota(id, elemento, text, color, horario, data) {
    elemento.closest('div.card').remove()

    addNote(color, text,horario,false,true)
    const notesExcluidasUpdate = getLocalStorageNotasExcluidas()
        .filter((nota) => nota.id !== id);
    localStorage.setItem('notesExcluidas', JSON.stringify(notesExcluidasUpdate))

}

function duplicar(texto, color, fixed) {
    const nota = {
        id: generateId(),
        texto: texto,
        cor: color,
        horario: generateHours(),
        data: gerarData(),
        fixed
    }
    saveLocalStrorage(nota)
    createNote(nota.texto, nota.fixed, nota.cor, nota.id, nota.horario, nota.data)

    loadTarefas()
}

function removerNota(id, elemento, text, color, horario, data) {
    const card = elemento.closest('div.card')

    card.remove()

    const notas = getLocalStorage()
    const arrayAtualizado = notas.filter((nota) => id !== nota.id)
    localStorage.setItem('notes', JSON.stringify(arrayAtualizado))
    loadTarefas()

    const notaExcluida = {
        id,
        texto: text,
        color,
        horario,
        data

    }

    saveLocalStrorageNotasExcluidas(notaExcluida)

}
function cleanNotes() {
    containerCards.replaceChildren([])
}

function fixeNota(id) {

    const notes = getLocalStorage()
    notes.map((note) => {
        if (note.id === id) {
            note.fixed = !note.fixed

        }

    })

    localStorage.setItem('notes', JSON.stringify(notes))

    loadTarefas()

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
    setInterval(() => {
        HoraCardAside.textContent = generateHours()
        dataCardAside.textContent = gerarData()
    }, 60000);

}

function pesquisar(texto) {
    const notes = getLocalStorage()

    const notesPesquisados = notes.filter((note) => {
        return note.texto.includes(texto)
    })

    if (texto !== '') {
        cleanNotes()
        notesPesquisados.forEach((note) => {
            createNote(note.texto, note.fixed, note.cor, note.id, note.horario, note.data)
        })
    }
    else {
        loadTarefas()
    }
}

function downloadCSV() {
    const notes = getLocalStorage()
    const csv = [
        ['texto da nota', 'fixada ?', 'horario', 'data', 'id'],
        ...notes.map((note) => [note.texto, note.fixed, note.horario, note.data, note.id])
    ].map((e) => e.join(','))
        .join('\n');

    const element = document.createElement('a');

    element.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
    console.log(encodeURI(csv))
    element.target = '_blank';
    element.download = 'notes.csv'
    element.click()
}

function exibirNotasExcluidas() {
    btnNotasExcluidas.classList.toggle('active')
    if (btnNotasExcluidas.classList.contains('active')) {
        cleanNotes()
        const notasExcluidas = getLocalStorageNotasExcluidas()
        notasExcluidas.forEach((nota) => {
            createNoteExluida(nota.texto, nota.color, nota.id, nota.horario, nota.data)
        })

    }
    else {
        loadTarefas()
    }


}

//------------------------localhost--------------------
function getLocalStorage() {
    const notes = JSON.parse(localStorage.getItem('notes')) || []
    const ordernotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

    return ordernotes
}

function saveLocalStrorage(nota) {
    const notes = getLocalStorage();
    notes.push(nota)
    localStorage.setItem('notes', JSON.stringify(notes))
}

function getLocalStorageNotasExcluidas() {
    const notesExcluidas = JSON.parse(localStorage.getItem('notesExcluidas')) || []
    return notesExcluidas
}

function saveLocalStrorageNotasExcluidas(notaExluida) {
    const notesExcluidas = getLocalStorageNotasExcluidas()
    notesExcluidas.push(notaExluida)
    localStorage.setItem('notesExcluidas', JSON.stringify(notesExcluidas))
}
// Eventos ----------------------------------------

btnCreate.addEventListener('click', () => {
    const texto = textAreaCreate.value
    const color = colorRow;
    if (!texto || texto == '') {
        console.log('vazio') //fazer alerta visual, quando o texto for vazio
        return
    }

    addNote(color, texto)
    textAreaCreate.value = ""
    textAreaCreate.focus()
})
inputSearch.addEventListener('keyup', () => {
    const texto = inputSearch.value
    pesquisar(texto)
})
btnCSV.addEventListener('click', () => {
    downloadCSV()
})
btnNotasExcluidas.addEventListener('click', () => {

    exibirNotasExcluidas()

})
// inicialização ---------------------------
loadTarefas()
atualizacaoDateAside()// fazer relógio que se atualiza automaticamente 
