// --- CONFIGURACIÓN DE DATOS ---

const familyMembers = [
    { name: "Abue", date: "09-17", image: "img/madre_gothel.png", style: "adventurer" },
    { name: "Abuelo", date: "11-13", image: "img/tim_lockwood.png", style: "adventurer" },
    { name: "Vero", date: "05-30", image: "img/la_baronesa.png", style: "adventurer" },
    { name: "Efra", date: "08-17", image: "img/gordon_freeman.png", style: "adventurer" },
    { name: "Lola", date: "07-15", image: "img/morticia.png", style: "adventurer" },
    { name: "Fabi", date: "11-19", image: "img/Anastasia.png", style: "adventurer" },
    { name: "Dani", date: "03-20", image: "img/veronica_lodge.png", style: "adventurer" },
    { name: "Michelle", date: "08-15", image: "img/vanessa.png", style: "adventurer" },
    { name: "José", date: "01-11", image: "img/gerald_johanssen.png", style: "adventurer" },
    { name: "Pau", date: "06-24", image: "img/misato_katsuragi.png", style: "adventurer" },
    { name: "Fer", date: "01-28", image: "img/hipo.png", style: "adventurer" },
    { name: "Diego", date: "10-07", image: "img/gus.png", style: "adventurer" },
    { name: "Sebas", date: "12-26", image: "img/kevin.png", style: "adventurer" }
];

// EVENTOS INDEPENDIENTES (YYYY-MM-DD)
// El código buscará el más cercano a HOY
const events = [
    { date: "2026-01-18", title: "Celebración de José 🍖", time: "3:00 PM" },
    { date: "2026-02-02", title: "Tamales Candelaria 🫔", time: "6:00 PM" }
];

// --- LÓGICA ---

const currentYear = new Date().getFullYear();
const today = new Date();
today.setHours(0, 0, 0, 0); // Normalizar hora para comparaciones

const amountPerPerson = 100;
const totalMembers = familyMembers.length;
const totalPrize = (totalMembers - 1) * amountPerPerson;

// Rellenar datos de dinero
document.getElementById('total-members').textContent = totalMembers;
document.getElementById('total-amount').textContent = `$${totalPrize} MXN`;

// 1. Procesar fechas de cumpleaños
const sortedMembers = familyMembers.map(member => {
    const [month, day] = member.date.split('-').map(Number);
    let nextBirthday = new Date(currentYear, month - 1, day);

    // Si ya pasó, sumar un año
    if (nextBirthday < today) {
        nextBirthday.setFullYear(currentYear + 1);
    }

    return { ...member, nextDate: nextBirthday };
}).sort((a, b) => a.nextDate - b.nextDate);

function getMemberImage(member) {
    if (member.image && member.image.trim() !== "") {
        return member.image;
    } else {
        return `https://api.dicebear.com/7.x/${member.style || 'avataaars'}/svg?seed=${member.name}`;
    }
}

function formatDateES(date) {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// 2. Renderizar PRÓXIMO CUMPLEAÑERO (Sección Hero)
const nextBday = sortedMembers[0];
const diffTime = nextBday.nextDate - today;
const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
const isToday = daysUntil === 0;

const nextContainer = document.getElementById('next-birthday-container');
const nextImageSrc = getMemberImage(nextBday);

const waMessage = `¡Hola familia! Recuerden que ${isToday ? 'HOY' : 'pronto'} es el cumple de ${nextBday.name}. Hay que ir juntando los $100 pesos. 🥳`;
const waLink = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

nextContainer.innerHTML = `
    <div class="relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-fiesta-red to-orange-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
        <img src="${nextImageSrc}" alt="${nextBday.name}" class="relative w-40 h-40 rounded-full bg-orange-50 border-4 border-white shadow-md mb-4 object-cover">
    </div>
    
    <h3 class="text-3xl font-bold text-gray-800 mb-1">${nextBday.name}</h3>
    <span class="inline-block bg-fiesta-teal text-white px-4 py-1 rounded-full text-sm font-semibold mb-4 shadow-sm">
        ${formatDateES(nextBday.nextDate)}
    </span>

    <div class="bg-gray-50 rounded-xl p-4 w-full max-w-sm mb-6 border border-gray-100">
        <p class="text-gray-600 mb-1">Estado:</p>
        <p class="text-xl font-bold ${isToday ? 'text-fiesta-red' : 'text-gray-800'}">
            ${isToday ? '¡Es hoy! 🎉' : `Faltan ${daysUntil} días`}
        </p>
    </div>

    <a href="${waLink}" target="_blank" class="inline-flex items-center bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-200 transform transition hover:-translate-y-1 hover:scale-105">
        <span class="mr-2">💬</span> Recordar en WhatsApp
    </a>
`;

// 3. Renderizar NUEVO BANNER DE EVENTOS (Rectángulo intermedio)
const bannerSection = document.getElementById('event-banner-section');

// Buscar próximo evento (independiente de cumpleaños)
const upcomingEvents = events
    .map(e => {
        const parts = e.date.split('-');
        // Crear fecha local (sin restar zona horaria)
        const evtDate = new Date(parts[0], parts[1] - 1, parts[2]);
        return { ...e, fullDate: evtDate };
    })
    .filter(e => e.fullDate >= today) // Solo futuros o de hoy
    .sort((a, b) => a.fullDate - b.fullDate); // Ordenar por fecha

if (upcomingEvents.length > 0) {
    const nextEvent = upcomingEvents[0];
    const diffEvt = nextEvent.fullDate - today;
    const daysEvt = Math.ceil(diffEvt / (1000 * 60 * 60 * 24));

    bannerSection.classList.remove('hidden');

    // Diseño del rectángulo: Fondo blanco, borde lateral morado
    bannerSection.innerHTML = `
        <div class="bg-white rounded-2xl shadow-md border-l-8 border-fiesta-purple p-6 w-full flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div class="flex items-center gap-4">
                <div class="bg-purple-100 text-fiesta-purple p-3 rounded-full">
                    <span class="text-2xl">🎉</span>
                </div>
                <div class="text-left">
                    <h3 class="font-bold text-gray-800 text-lg md:text-xl">${nextEvent.title}</h3>
                    <p class="text-gray-500 text-sm">📅 ${formatDateES(nextEvent.fullDate)} - 🕒 ${nextEvent.time || 'Hora por definir'}</p>
                </div>
            </div>

            <div class="bg-purple-50 text-fiesta-purple font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                ${daysEvt === 0 ? '¡ES HOY!' : `Faltan ${daysEvt} días`}
            </div>
            
        </div>
    `;
}

// Confeti
if (isToday) {
    var count = 200;
    var defaults = { origin: { y: 0.7 } };
    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }
    fire(0.25, { spread: 26, startVelocity: 55, });
    fire(0.2, { spread: 60, });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45, });
}


// 4. Renderizar CALENDARIO
const grid = document.getElementById('calendar-grid');
const chronologicalMembers = [...familyMembers].sort((a, b) => a.date.localeCompare(b.date));

function getMonthName(monthNumber) {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return months[parseInt(monthNumber) - 1];
}

chronologicalMembers.forEach(member => {
    const [m, d] = member.date.split('-');
    const avatarUrl = getMemberImage(member);

    // NOTA: Ya no mostramos eventos aquí adentro para no saturar,
    // ya que ahora tienen su propio rectángulo destacado arriba.

    const isMemberBirthdayToday = (parseInt(m) === today.getMonth() + 1 && parseInt(d) === today.getDate());

    const card = document.createElement('div');
    let cardClasses = "bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center relative group";
    if (isMemberBirthdayToday) {
        cardClasses += " ring-4 ring-fiesta-teal ring-offset-2 transform scale-105 z-10";
    }

    card.className = cardClasses;
    card.innerHTML = `
        <div class="w-20 h-20 rounded-full bg-gray-100 mb-4 overflow-hidden border-2 border-white shadow-sm group-hover:scale-110 transition duration-300">
            <img src="${avatarUrl}" alt="${member.name}" class="w-full h-full object-cover">
        </div>
        <h4 class="font-bold text-lg text-gray-800">${member.name}</h4>
        <div class="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mt-2">
            ${getMonthName(m)} ${d}
        </div>
    `;
    grid.appendChild(card);
});