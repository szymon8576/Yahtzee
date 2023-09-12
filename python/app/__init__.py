from flask import Flask
from flask_socketio import SocketIO

socketio = SocketIO()

def create_app(debug=False):
    app = Flask(__name__)
    app.debug = debug

    from .game import routes as game_routes
    from .speech_recognition import routes as sr_routes

    app.register_blueprint(game_routes.game_bp, url_prefix='/game')
    app.register_blueprint(sr_routes.speech_recognition_bp, url_prefix='/speech-recognition')

    socketio.init_app(app, cors_allowed_origins="*")
    return app