# Smart Assist AI

O **Smart Assist AI** é um chatbot inteligente que utiliza a API da Groq e o modelo `llama-3.3-70b-versatile` para fornecer respostas dinâmicas e contextualizadas. O projeto inclui um backend em Flask, um frontend com HTML/CSS/JavaScript, e suporte para containerização com Docker. O chatbot é capaz de detectar o idioma do usuário e responder no mesmo idioma, mantendo um histórico de conversas para melhorar a experiência do usuário.

---

## Funcionalidades

- **Chat interativo**: O usuário pode digitar mensagens e receber respostas do chatbot em tempo real.
- **Suporte a múltiplos idiomas**: Detecta automaticamente o idioma da mensagem do usuário e responde no mesmo idioma.
- **Histórico de conversas**: Mantém o contexto da conversa para respostas mais precisas e naturais.
- **Interface amigável**: Design moderno e responsivo para uma experiência de usuário agradável.
- **Containerização**: Facilita o deploy e desenvolvimento com Docker e Docker Compose.
- **Segurança**: Utiliza variáveis de ambiente para armazenar chaves de API e segredos.

---

## Tecnologias Utilizadas

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **API**: Groq (`llama-3.3-70b-versatile`)
- **Detecção de idioma**: `langdetect`
- **Containerização**: Docker, Docker Compose
- **Gerenciamento de dependências**: Pip (Python)

---

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Uma chave de API da Groq (obtenha em [Groq Cloud](https://groq.com/)).

---

## Como Executar o Projeto

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/DouglasWillianBasilio/SmartAssistAI.git
   cd SmartAssistAI

2. **Configure as variáveis de ambiente:**:

    GROQ_API_KEY=sua_chave_aqui
    FLASK_SECRET_KEY=uma_chave_secreta_forte

3. **Construa e execute os contêineres:**:

    docker-compose up --build

4. **Acesse a interface do chatbot:**:

    Abra o navegador e acesse http://localhost:5000 para interagir com o chatbot.


## Estrutura do Projeto

smart-assist-ai/
├── app/
│   ├── static/          # Arquivos estáticos (CSS, JS)
│   │   ├── styles.css   # Estilos CSS
│   │   └── script.js    # Lógica JavaScript
│   ├── templates/       # Arquivos HTML
│   │   └── index.html   # Página principal do chat
│   ├── chatbot.py       # Backend Flask
│   └── requirements.txt # Dependências do Python
├── docker-compose.yml   # Configuração do Docker Compose
├── Dockerfile           # Instruções para construir a imagem Docker
├── .env                 # Variáveis de ambiente
└── README.md            # Documentação do projeto

#### Backend (Flask)

O backend é responsável por:

- Receber mensagens do usuário via POST.
- Detectar o idioma da mensagem usando `langdetect`.
- Enviar a mensagem para a API da Groq e receber a resposta.
- Manter um histórico de mensagens para contexto.
- Retornar a resposta formatada para o frontend.

#### Frontend (HTML/CSS/JavaScript)

O frontend inclui:

- Uma interface de chat responsiva.
- Um campo de entrada para o usuário digitar mensagens.
- Exibição do histórico de mensagens (usuário e chatbot).
- Estilos modernos com CSS e interações dinâmicas com JavaScript.

#### Docker

O projeto é containerizado com:

- **Dockerfile**: Define a imagem base, instala dependências e configura o ambiente.
- **docker-compose.yml**: Facilita a execução do projeto com um único comando.

### Como Contribuir

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

### Contato

Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato:

- **Email**: douglasbso12@gmail.com