from flask import Flask, request, jsonify, render_template
from groq import Groq
from dotenv import load_dotenv
import os
from langdetect import detect
import logging
from datetime import datetime
from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy

# Configurações iniciais
load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config['UPLOAD_FOLDER'] = 'uploads'

# Extensões
db = SQLAlchemy(app)
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache'})
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Modelos
class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_message = db.Column(db.Text)
    bot_response = db.Column(db.Text)
    language = db.Column(db.String(10))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Helpers
def get_initial_prompt(language):
    prompts = {
        "pt": "Você é um assistente especializado...",  # Seu prompt em PT
        "en": "You are a specialized assistant..."    # Seu prompt em EN
    }
    return {
        "role": "system",
        "content": prompts.get(language, prompts["en"])
    }

# Rotas
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
@cache.cached(timeout=60, key_prefix=lambda: request.json.get('message'))
def chat():
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        
        if not user_message or len(user_message) > 1000:
            return jsonify({"response": "❌ Mensagem inválida"}), 400

        # Detecção de idioma
        try:
            user_language = detect(user_message)
        except:
            user_language = "en"

        # Gerenciamento de histórico
        global message_history
        if len(message_history) == 0 or message_history[0]["content"] != get_initial_prompt(user_language)["content"]:
            message_history = [get_initial_prompt(user_language)]

        message_history.append({"role": "user", "content": user_message})

        # Chamada à API
        response = client.chat.completions.create(
            messages=message_history,
            model="llama-3.3-70b-versatile",
            temperature=0.7
        )

        chatbot_response = response.choices[0].message.content
        message_history.append({"role": "assistant", "content": chatbot_response})

        # Persistência
        new_conversation = Conversation(
            user_message=user_message,
            bot_response=chatbot_response,
            language=user_language
        )
        db.session.add(new_conversation)
        db.session.commit()

        return jsonify({
            "response": chatbot_response.replace('\n', '<br>'),
            "language": user_language
        })

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"response": "⚠️ Service unavailable"}), 503

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)