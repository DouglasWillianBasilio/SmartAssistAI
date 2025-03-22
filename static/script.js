// Adicionar evento de teclado ao campo de entrada
document.getElementById('user-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Impede a quebra de linha padrão
        sendMessage(); 
    }
    
});

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim(); // Remove espaços em branco no início e no final

    if (message === '') {
        alert('Por favor, digite uma mensagem.');
        return;
    }

    // Adicionar mensagem do usuário ao histórico
    const chatHistory = document.getElementById('chat-history');
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.textContent = message; // Exibe a mensagem com quebras de linha
    chatHistory.appendChild(userMessage);

    // Limpar o campo de entrada
    userInput.value = '';

    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar a mensagem');
        }

        const data = await response.json();

        // Adicionar resposta do chatbot ao histórico
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';

        // Formatar a resposta do bot
        const formattedResponse = data.response.replace(/\n/g, '<br>'); // Substituir quebras de linha por <br>
        botMessage.innerHTML = formattedResponse;

        chatHistory.appendChild(botMessage);

        // Rolagem automática para a última mensagem
        chatHistory.scrollTop = chatHistory.scrollHeight;
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao enviar a mensagem. Tente novamente.');
    }
}

function resetChat() {
    const chatHistory = document.getElementById('chat-history');
    chatHistory.innerHTML = ''; // Limpa o histórico de mensagens
}