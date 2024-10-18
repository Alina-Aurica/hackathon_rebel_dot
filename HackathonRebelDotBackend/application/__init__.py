from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

from application.model.models import db
from config import Config

# # Initialize SocketIO (no app attached yet)
# socketio = SocketIO()
def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    with app.app_context():
        db.create_all()

    CORS(app, resources={r"/*": {"origins":"http://localhost:3000"}})


    from .controller.user_controller import user_controller
    app.register_blueprint(user_controller)
    from .controller.message_controller import message_controller
    app.register_blueprint(message_controller)
    from .externalAPI.rag import query_controller
    app.register_blueprint(query_controller)
    # from .controller.websocket_controller import ws_controller
    # app.register_blueprint(ws_controller)
    from .controller.auth_controller import auth_controller
    app.register_blueprint(auth_controller)

    # socketio.init_app(app, cors_allowed_origins="*")

    return app