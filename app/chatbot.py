from flask import Flask, request, jsonify, render_template
from groq import Groq
from dotenv import load_dotenv
import os
from langdetect import detect  

# Carregar variáveis de ambiente
load_dotenv()

# Configurar GROQ
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

app = Flask(__name__)

# Definir a chave secreta para sessões do Flask
app.secret_key = os.getenv("FLASK_SECRET_KEY")

# Histórico de mensagens
message_history = []

# Pré-definir um prompt inicial dinâmico
def get_initial_prompt(language):
    """Retorna o prompt inicial no idioma detectado."""
    if language == "pt":
        return {
            "role": "system",
            "content": (
                "Você é um assistente especializado em tirar dúvidas. Seu nome é Smart Assist. "
                "Sua função é responder às perguntas dos usuários de forma natural, agradável e respeitosa. "
                "Seja objetivo nas respostas, fornecendo informações claras e diretas. "
                "Foque em manter um diálogo humanizado, como uma conversa comum entre duas pessoas. "
                "Você deve responder na mesma língua em que o usuário digitar a pergunta. "
                "Se o usuário mudar de idioma durante a conversa, você também deve mudar."
            )
        }
    else:  # Default para inglês
        return {
            "role": "system",
            "content": (
                "You are a specialized assistant for answering questions. Your name is Smart Assist. "
                "Your role is to respond to user questions in a natural, pleasant, and respectful manner. "
                "Be objective in your answers, providing clear and direct information. "
                "Focus on maintaining a humanized dialogue, like a common conversation between two people. "
                "You must respond in the same language as the user's question. "
                "If the user switches languages during the conversation, you must switch as well."
            )
        }

# Adicionar o prompt inicial ao histórico (idioma padrão: inglês)
message_history.append(get_initial_prompt("en"))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    global message_history

    data = request.json
    user_message = data.get('message')

    # Detectar o idioma da mensagem do usuário
    try:
        user_language = detect(user_message)
    except:
        user_language = "en"  # Default para inglês se a detecção falhar

    # Atualizar o prompt inicial se o idioma mudar
    if len(message_history) > 0 and message_history[0]["content"] != get_initial_prompt(user_language)["content"]:
        message_history[0] = get_initial_prompt(user_language)

    # Adicionar a mensagem do usuário ao histórico
    message_history.append({"role": "user", "content": user_message})

    # Obter resposta do GROQ
    response = client.chat.completions.create(
        messages=message_history,
        model="llama-3.3-70b-versatile",  # Modelo atualizado
    )

    chatbot_response = response.choices[0].message.content

    # Formatar a resposta do bot para melhorar a exibição no front-end
    formatted_response = chatbot_response.replace('\n', '<br>')  # Substituir quebras de linha por <br>

    # Adicionar a resposta do chatbot ao histórico
    message_history.append({"role": "assistant", "content": chatbot_response})

    return jsonify({"response": formatted_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)