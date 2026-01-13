// --- CONFIGURACIÓN DE DATOS ---

// style: 'micah', 'avataaars', 'bottts', 'notionists', 'adventurer'
const familyMembers = [
    { name: "Abue", date: "09-17", style: "micah" }, // Puse fecha de HOY (ejemplo) para que veas el confeti
    { name: "Abuelo", date: "11-13", style: "micah" },
    { name: "Vero", date: "05-30", style: "croodles" },
    { name: "Efra", date: "08-17", style: "avataaars" },
    { name: "Lola", date: "07-15", style: "adventurer" },
    { name: "Fabi", date: "11-19", style: "bottts" },
    { name: "Dani", date: "03-20", style: "notionists" },
    { name: "Michelle", date: "08-15", style: "notionists" },
    { name: "José", date: "01-11", style: "notionists" },
    { name: "Pau", date: "06-24", style: "notionists" },
    { name: "Fer", date: "01-28", style: "notionists" },
    { name: "Diego", date: "10-07", style: "notionists" },
    { name: "Sebas", date: "12-26", style: "notionists" }
];

// Eventos (YYYY-MM-DD)
const events = [
    { date: "2026-01-18", title: "Cumple de José y Santi" },
    { date: "2026-01-31", title: "Fiesta de Fer" }
];

// --- LÓGICA ---

const currentYear = new Date().getFullYear();
const today = new Date();

const amountPerPerson = 100;
const totalMembers = familyMembers.length;
const totalPrize = (totalMembers - 1) * amountPerPerson;

// Rellenar datos de dinero
document.getElementById('total-members').textContent = totalMembers;
document.getElementById('total-amount').textContent = `$${totalPrize} MXN`;

// 1. Procesar fechas y ordenar
const sortedMembers = familyMembers.map(member => {
    const [month, day] = member.date.split('-').map(Number);
    let nextBirthday = new Date(currentYear, month - 1, day);

    // Si ya pasó, sumar un año
    if (nextBirthday < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        nextBirthday.setFullYear(currentYear + 1);
    }

    return { ...member, nextDate: nextBirthday };
}).sort((a, b) => a.nextDate - b.nextDate);

// 2. Renderizar PRÓXIMO CUMPLEAÑERO (Sección Hero)
const nextBday = sortedMembers[0];
const diffTime = nextBday.nextDate - new Date(today.getFullYear(), today.getMonth(), today.getDate());
const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
const isToday = daysUntil === 0;

const nextContainer = document.getElementById('next-birthday-container');
const avatarUrlLarge = `https://api.dicebear.com/7.x/${nextBday.style}/svg?seed=${nextBday.name}&backgroundColor=transparent`;

// Mensaje WhatsApp
const waMessage = `¡Hola familia! Recuerden que ${isToday ? 'HOY' : 'pronto'} es el cumple de ${nextBday.name}. Hay que ir juntando los $100 pesos. 🥳`;
const waLink = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

// HTML con clases de Tailwind
nextContainer.innerHTML = `
    <div class="relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-fiesta-red to-orange-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
        <img src="${avatarUrlLarge}" alt="${nextBday.name}" class="relative w-40 h-40 rounded-full bg-orange-50 border-4 border-white shadow-md mb-4">
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

// Mostrar alerta si hay evento próximo
const upcomingEvent = events.find(e => e.date === nextBday.nextDate.toISOString().split('T')[0]);
if (upcomingEvent) {
    const alertBox = document.getElementById('event-alert');
    alertBox.classList.remove('hidden');
    alertBox.innerHTML = `
        <p class="font-bold">🚨 ¡Atención Familia!</p>
        <p>${upcomingEvent.title}</p>
    `;
}

// Disparar confeti si es hoy
if (isToday) {
    var count = 200;
    var defaults = {
        origin: { y: 0.7 }
    };

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


// 3. Renderizar CALENDARIO (Grid)
const grid = document.getElementById('calendar-grid');

// Ordenar por mes para el calendario visual
const chronologicalMembers = [...familyMembers].sort((a, b) => a.date.localeCompare(b.date));

chronologicalMembers.forEach(member => {
    const [m, d] = member.date.split('-');
    const avatarUrl = `https://api.dicebear.com/7.x/${member.style}/svg?seed=${member.name}`;

    // Buscar evento
    const evt = events.find(e => e.date.endsWith(member.date));

    // Checar si es hoy para estilo especial
    const isMemberBirthdayToday = (parseInt(m) === today.getMonth() + 1 && parseInt(d) === today.getDate());

    const card = document.createElement('div');
    // Clases base de Tailwind
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
        ${evt ? `
            <div class="mt-4 w-full bg-yellow-50 border border-yellow-200 p-2 rounded-lg text-xs text-yellow-800 text-center">
                📍 ${evt.title}
            </div>
        ` : ''}
    `;
    grid.appendChild(card);
});


// Funciones Auxiliares
function formatDateES(date) {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

function getMonthName(monthNumber) {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return months[parseInt(monthNumber) - 1];
}