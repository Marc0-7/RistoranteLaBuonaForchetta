// Menù dati (con immagini, descrizione, categoria, prezzo)
const menuData = [
    {
        nome: "Bruschette miste",
        descrizione: "Pane tostato con pomodorini, olive, patè e salumi.",
        prezzo: 5,
        categoria: "antipasti",
        img: "./img/bruschette.jpg"
    },
    {
        nome: "Tagliere salumi e formaggi",
        descrizione: "Selezione di salumi e formaggi regionali.",
        prezzo: 9,
        categoria: "antipasti",
        img: "./img/tagliere.jpg"
    },
    {
        nome: "Lasagne alla bolognese",
        descrizione: "Pasta fresca, ragù di manzo, besciamella e parmigiano.",
        prezzo: 10,
        categoria: "primi",
        img: "./img/lasagne.jpg"
    },
    {
        nome: "Risotto ai funghi porcini",
        descrizione: "Riso carnaroli con porcini freschi e prezzemolo.",
        prezzo: 12,
        categoria: "primi",
        img: "./img/risotto.jpg"
    },
    {
        nome: "Tagliata di manzo con rucola",
        descrizione: "Controfiletto scottato, servito con rucola e grana.",
        prezzo: 16,
        categoria: "secondi",
        img: "./img/tagliata.jpg"
    },
    {
        nome: "Filetto di orata al forno",
        descrizione: "Orata fresca al forno con erbe aromatiche.",
        prezzo: 15,
        categoria: "secondi",
        img: "./img/orata.jpg"
    },
    {
        nome: "Tiramisù della casa",
        descrizione: "Classico dolce al cucchiaio con caffè, mascarpone e cacao.",
        prezzo: 5,
        categoria: "dolci",
        img: "./img/tiramisu.jpg"
    },
    {
        nome: "Panna cotta ai frutti di bosco",
        descrizione: "Dolce delicato con salsa ai frutti di bosco freschi.",
        prezzo: 5,
        categoria: "dolci",
        img: "./img/pannacotta.jpg"
    }
];

// Popola il menù dinamicamente
function renderMenu(lista = menuData) {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = '';
    if(lista.length === 0) {
        menuList.innerHTML = '<p>Nessun piatto trovato.</p>';
        return;
    }
    lista.forEach((piatto, idx) => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.setAttribute('data-idx', idx);

        card.innerHTML = `
            <img src="${piatto.img}" alt="Foto ${piatto.nome}">
            <h4>${piatto.nome}</h4>
            <p>${piatto.descrizione.slice(0,50)}...</p>
            <div class="price">€${piatto.prezzo}</div>
        `;
        card.addEventListener('click', () => showDishModal(piatto));
        menuList.appendChild(card);
    });
}

// Filtra e cerca nel menù
const filterCategory = document.getElementById('filter-category');
const searchMenu = document.getElementById('search-menu');
filterCategory.addEventListener('change', updateMenuFilter);
searchMenu.addEventListener('input', updateMenuFilter);

function updateMenuFilter() {
    const cat = filterCategory.value;
    const search = searchMenu.value.toLowerCase();
    const filtered = menuData.filter(p =>
        (cat === 'tutti' || p.categoria === cat) &&
        (p.nome.toLowerCase().includes(search) || p.descrizione.toLowerCase().includes(search))
    );
    renderMenu(filtered);
}

// Modale piatto
const modal = document.getElementById('dish-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const closeModalBtn = document.querySelector('.modal .close');

function showDishModal(piatto) {
    modalImg.src = piatto.img;
    modalTitle.textContent = piatto.nome;
    modalDesc.textContent = piatto.descrizione;
    modalPrice.textContent = `Prezzo: €${piatto.prezzo}`;
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
    modal.classList.add('hidden');
}
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
});

// Prenotazioni (salvate in localStorage)
const bookingForm = document.getElementById('booking-form');
const bookingResult = document.getElementById('booking-result');
const prenotazioniList = document.getElementById('prenotazioni-list');

function loadPrenotazioni() {
    return JSON.parse(localStorage.getItem('prenotazioni') || '[]');
}

function savePrenotazioni(arr) {
    localStorage.setItem('prenotazioni', JSON.stringify(arr));
}

function renderPrenotazioni() {
    const prenotazioni = loadPrenotazioni();
    prenotazioniList.innerHTML = '';
    if(prenotazioni.length === 0) {
        prenotazioniList.innerHTML = '<li>Nessuna prenotazione.</li>';
        return;
    }
    prenotazioni.forEach((pr, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>
                ${pr.data} ${pr.ora} - <b>${pr.nome}</b> (${pr.persone} persone)
                ${pr.note ? '<br><em>Note: ' + pr.note + '</em>' : ''}
            </span>
            <button class="delete-btn" data-idx="${idx}">Elimina</button>
        `;
        prenotazioniList.appendChild(li);
    });
    // Aggiungi evento elimina
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = +this.getAttribute('data-idx');
            let pren = loadPrenotazioni();
            pren.splice(idx,1);
            savePrenotazioni(pren);
            renderPrenotazioni();
        });
    });
}

// Gestione invio prenotazione
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const persone = document.getElementById('persone').value;
    const data = document.getElementById('data').value;
    const ora = document.getElementById('ora').value;
    const note = document.getElementById('note').value.trim();

    if (nome && persone && data && ora) {
        // Salva prenotazione
        let prenotazioni = loadPrenotazioni();
        prenotazioni.push({ nome, persone, data, ora, note });
        savePrenotazioni(prenotazioni);

        bookingResult.style.color = '#228b22';
        bookingResult.textContent = `Grazie ${nome}, prenotazione per ${persone} persone il ${data} alle ${ora} registrata!`;
        bookingForm.reset();
        renderPrenotazioni();
    } else {
        bookingResult.textContent = "Per favore, compila tutti i campi obbligatori.";
        bookingResult.style.color = '#b22222';
    }
});

// Menu navigation smooth scroll
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e){
        e.preventDefault();
        const id = this.getAttribute('href').slice(1);
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    });
});

// Inizializzazione
renderMenu();
renderPrenotazioni();
