// app.js

// 1. Сначала железно объявляем элементы интерфейса
const messagesBox = document.getElementById('messagesBox');
const messageInput = document.getElementById('messageInput');
const callWindow = document.getElementById('callWindow');

let currentChatName = "Лалина ✨";
let currentChatInitials = "ЛА";
let isMuted = false;

// 2. Глобальный бесплатный интернет-сокет (работает без VPN)
const socket = new WebSocket('wss://://piesocket.com');

// Ловим сообщения от Лалины
socket.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);
        if (data.type === 'text') {
            createMessageElement(data.text, 'incoming');
        } else if (data.type === 'star') {
            createMessageElement(`🌟 Отправлено 50 Telegram Stars!`, 'incoming star-donate');
            createStarExplosion();
        }
    } catch (e) {
        // Игнорируем системный мусор сокет-сервера
    }
};

function createMessageElement(text, typeClass) {
    if (!messagesBox) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${typeClass}`;
    msgDiv.textContent = text;
    messagesBox.appendChild(msgDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

// Функция отправки сообщений
function sendMessage() {
    if (!messageInput) return;
    const text = messageInput.value.trim();
    if (!text) return;

    // Рисуем у себя
    createMessageElement(text, 'outgoing');

    // Отправляем в интернет
    socket.send(JSON.stringify({ type: 'text', text: text }));

    messageInput.value = '';
}

// ЖЕЛЕЗНЫЙ ОТКЛИК НА ENTER
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Запрещаем перенос строки
        sendMessage();      // Вызываем отправку текста
    }
});

function sendTelegramStar() {
    createMessageElement(`🌟 Отправлено 50 Telegram Stars!`, 'outgoing star-donate');
    createStarExplosion();
    socket.send(JSON.stringify({ type: 'star' }));
}

// ОЧИЩЕННЫЙ КРАСИВЫЙ САЛЮТ
function createStarExplosion() {
    const pCount = 15; // Уменьшили количество, чтобы не спамить
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
        
        // Жесткое удаление частицы из памяти через 1 секунду
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// --- УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ ---
function startCall(type) {
    document.getElementById('callName').textContent = currentChatName;
    document.getElementById('callAvatar').textContent = currentChatInitials;
    document.getElementById('callStatus').textContent = type === 'video' ? 'Видеовызов...' : 'Аудиовызов...';
    callWindow.classList.add('active');
}

function endCall() { 
    callWindow.classList.remove('active'); 
}

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('muteBtn');
    if (isMuted) { 
        muteBtn.classList.add('muted'); 
        muteBtn.textContent = "🔇"; 
    } else { 
        muteBtn.classList.remove('muted'); 
        muteBtn.textContent = "🎙️"; 
    }
}
