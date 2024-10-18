import socketio
from flask import Blueprint
from flask_socketio import join_room, emit
# from app import socketio
from application.service.message_for_translate_service import MessageForTranslateService

ws_controller = Blueprint('ws_controller', __name__, "/ws")
@socketio.on('connect')
def handle_connect():
    print("Client connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

@socketio.on('join')
def on_join(data):
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    room = f"{min(sender_id, receiver_id)}-{max(sender_id, receiver_id)}"
    join_room(room)
    print(f"User {sender_id} joined room {room}")

@socketio.on('send_message')
def handle_send_message(data):
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']

    room = f"{min(sender_id, receiver_id)}-{max(sender_id, receiver_id)}"

    new_message = MessageForTranslateService.create_message(**data)

    emit('receive_message', new_message.repr(), room=room)