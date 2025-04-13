// ===== ADIÇÕES PARA DARK MODE =====
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const icon = document.querySelector('#toggle-dark i');
    
    if (body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
    
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
}

// Carregar tema ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#toggle-dark i');
        icon.classList.replace('fa-moon', 'fa-sun');
    }
});

// Envio com tecla Enter (sem Shift)
document.getElementById('user-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Impede quebra de linha
        sendMessage();
    }
});

// Enviar mensagem para o backend
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (!message) {
        alert('Por favor, digite uma mensagem.');
        return;
    }

    appendMessageToChat('user', message);
    userInput.value = '';

    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`Erro do servidor: ${response.status}`);
        }

        const data = await response.json();
        const formattedResponse = data.response.replace(/\n/g, '<br>');
        appendMessageToChat('bot', formattedResponse, true);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        alert('Erro ao enviar a mensagem. Verifique a conexão com o servidor e tente novamente.');
    }
}

// Adiciona mensagens no histórico
function appendMessageToChat(sender, message, isHTML = false) {
    const chatHistory = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    if (isHTML) {
        messageDiv.innerHTML = message;
    } else {
        messageDiv.textContent = message;
    }

    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll automático
}

// Limpa o histórico do chat
function resetChat() {
    const chatHistory = document.getElementById('chat-history');
    chatHistory.innerHTML = '';
}
