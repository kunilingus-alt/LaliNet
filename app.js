// app.js

// Глобальные бесплатные ключи для теста облачного чата LaliNet
const pubnub = new PubNub({
    publishKey: 'pub-c-4fa2b415-dc8e-49b8-a764-bd47dfbc9d9b',
    subscribeKey: 'sub-c-ee3f9821-4ea7-42c2-841f-132d73f40f09',
    userId: "user_" + Math.random().toString(36).substring(2, 9)
});

let currentChatName = "Лалина ✨";
let currentChatInitials = "ЛА";
let isMuted = false;

const messagesBox = document.getElementById('messagesBox');
const messageInput = document.getElementById('messageInput');
const callWindow = document.getElementById('callWindow');

// Подписываемся на секретный интернет-канал LaliNet
pubnub.subscribe({ channels: ['lalinet_global_chat'] });

// Слушаем сообщения со всего мира
pubnub.addListener({
    message: function(event) {
        if (event.publisher !== pubnub.getUserId()) {
            if (event.message.type === 'text') {
                createMessageElement(event.message.text, 'incoming');
            } else if (event.message.type === 'star') {
                createMessageElement(`🌟 Отправлено 50 Telegram Stars!`, 'incoming star-donate');
                createStarExplosion();
            }
        }
    }
});

function createMessageElement(text, typeClass) {
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

    pubnub.publish({
        channel: 'lalinet_global_chat',
        message: { type: 'text', text: text }
    });

    messageInput.value = '';
}

// Слушаем Enter в поле ввода
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendTelegramStar() {
    createMessageElement(`🌟 Отправлено 50 Telegram Stars!`, 'outgoing star-donate');
    createStarExplosion();

    pubnub.publish({
        channel: 'lalinet_global_chat',
        message: { type: 'star' }
    });
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

// --- ИСПРАВЛЕННЫЕ КНОПКИ ЗВЕНЬЕВ И ЧАТОВ ---
function switchChat(name, initials) {
    currentChatName = name;
    currentChatInitials = initials;
    document.getElementById('active-chat-name').textContent = name;
    
    document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
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
