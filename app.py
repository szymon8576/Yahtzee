from flask import Flask
from game import routes as game_routes
from speech_recognition import routes as sr_routes

app = Flask(__name__)

app.register_blueprint(game_routes.game_bp, url_prefix='/game')
app.register_blueprint(sr_routes.speech_recognition_bp, url_prefix='/speech-recognition')

if __name__ == '__main__':
    app.run(debug=True)