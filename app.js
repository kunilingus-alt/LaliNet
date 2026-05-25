// app.js

const messagesBox = document.getElementById('messagesBox');
const messageInput = document.getElementById('messageInput');
const callWindow = document.getElementById('callWindow');

let currentChatName = "Лалина ✨";
let currentChatInitials = "ЛА";
let isMuted = false;
let lastMessageTime = 0;

// Уникальный ключ для вашей комнаты с Лалиной (можно изменить на любой секретный набор букв)
const chatRoomKey = "lalinet_secret_room_2026";
const cloudUrl = `https://keyvalue.xyz{chatRoomKey}/chat`;

// --- ЛОГИКА ОТПРАВКИ В ОБЛАКО ---
async function sendMessage() {
    if (!messageInput) return;
    const text = messageInput.value.trim();
    if (!text) return;

    createMessageElement(text, 'outgoing');
    messageInput.value = '';

    const payload = {
        type: 'text',
        text: text,
        time: Date.now()
    };

    // Сохраняем сообщение в глобальный интернет
    try {
        await fetch(cloudUrl, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        lastMessageTime = payload.time;
    } catch (e) {
        console.log("Ошибка отправки в облако");
    }
}

async function sendTelegramStar() {
    createMessageElement(`🌟 Отправлено 50 Telegram Stars!`, 'outgoing star-donate');
    createStarExplosion();

    const payload = {
        type: 'star',
        time: Date.now()
    };

    try {
        await fetch(cloudUrl, { method: 'POST', body: JSON.stringify(payload) });
        lastMessageTime = payload.time;
    } catch (e) {}
}

// --- АВТОМАТИЧЕСКАЯ ПРОВЕРКА ДЛЯ ИНТЕРНЕТА ---
async function checkNewMessages() {
    try {
        const response = await fetch(cloudUrl);
        if (!response.ok) return;
        
        const data = await response.json();
        
        // Если появилось новое сообщение от собеседника
        if (data && data.time > lastMessageTime) {
            lastMessageTime = data.time;
            
            if (data.type === 'text') {
                createMessageElement(data.text, 'incoming');
            } else if (data.type === 'star') {
                createMessageElement(`🌟 Отправлено 50 Telegram Stars!`, 'incoming star-donate');
                createStarExplosion();
            }
        }
    } catch (e) {
        // База данных пустая при первом запуске, это нормально
    }
}

// Каждую секунду проверяем, не написала ли Лалина с другого конца города
setInterval(checkNewMessages, 1500);

function createMessageElement(text, typeClass) {
    if (!messagesBox) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${typeClass}`;
    msgDiv.textContent = text;
    messagesBox.appendChild(msgDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

// Слушаем Enter
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

// Эффект салюта (15 звездочек, удаляются без накопления)
function createStarExplosion() {
    const pCount = 15;
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;

    for (let i = 0; i < pCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = Math.random() > 0.5 ? '⭐' : '✨';
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';

        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 140;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);

        document.body.appendChild(particle);
        setTimeout(() => { particle.remove(); }, 1000);
    }
}

// --- УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ ---
function startCall(type) {
    document.getElementById('callName').textContent = currentChatName;
    document.getElementById('callStatus').textContent = type === 'video' ? 'Видеовызов...' : 'Аудиовызов...';
    callWindow.classList.add('active');
}

function endCall() { callWindow.classList.remove('active'); }

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('muteBtn');
    if (isMuted) { muteBtn.classList.add('muted'); muteBtn.textContent = "🔇"; }
    else { muteBtn.classList.remove('muted'); muteBtn.textContent = "🎙️"; }
}

