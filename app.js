// app.js

// Переменные интерфейса (теперь объявлены в самом верху, баг исправлен!)
const messagesBox = document.getElementById('messagesBox');
const messageInput = document.getElementById('messageInput');
const callWindow = document.getElementById('callWindow');

let currentChatName = "Лалина ✨";
let currentChatInitials = "ЛА";
let isMuted = false;

// Подключаемся к стабильному бесплатному глобальному сокету
const socket = new WebSocket('wss://://piesocket.com');

// Ловим входящие сообщения от Лалины со всего мира
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
        // Игнорируем системные сообщения сокет-сервера
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

// Отправка сообщений в облако
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    createMessageElement(text, 'outgoing');

    // Отправляем Лалине через интернет
    socket.send(JSON.stringify({ type: 'text', text: text }));

    messageInput.value = '';
}

// Слушаем Enter в поле ввода
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendTelegramStar() {
    createMessageElement(`🌟 Отправлено 50 Telegram Stars!`, 'outgoing star-donate');
    createStarExplosion();

    // Отправляем сигнал доната Лалине
    socket.send(JSON.stringify({ type: 'star' }));
}

function createStarExplosion() {
    const pCount = 25;
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;

    for (let i = 0; i < pCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = Math.random() > 0.5 ? '⭐' : '✨';
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';

        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 180;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1200);
    }
}

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
