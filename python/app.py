from app import create_app, socketio
from flask_cors import CORS

app = create_app(debug=True)
app.config.from_pyfile('config.py')
CORS(app)

# if __name__ == '__main__':
# socketio.run(app, host='0.0.0.0', port=5000)