function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
  
  document.getElementById('user-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
  
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
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
  
      if (!response.ok) throw new Error(`Erro do servidor: ${response.status}`);
  
      const data = await response.json();
      const formattedResponse = data.response;
      await typeMessage('bot', formattedResponse);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  }
  
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
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
  
  async function typeMessage(sender, fullMessage) {
    const chatHistory = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    chatHistory.appendChild(messageDiv);
  
    let i = 0;
    const delay = 15;
    let buffer = '';
    let tagOpen = false;
  
    while (i < fullMessage.length) {
      const char = fullMessage[i];
  
      if (char === '<') tagOpen = true;
      if (tagOpen) {
        buffer += char;
        if (char === '>') {
          messageDiv.innerHTML += buffer;
          buffer = '';
          tagOpen = false;
        }
      } else {
        messageDiv.innerHTML += char;
      }
  
      i++;
      chatHistory.scrollTop = chatHistory.scrollHeight;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  function resetChat() {
    document.getElementById('chat-history').innerHTML = '';
  }
  