from flask import Blueprint, request, jsonify

from application.service.message_for_translate_service import MessageForTranslateService

message_controller = Blueprint('message_controller', __name__, url_prefix='/message')


@message_controller.route('/messageCreate', methods=['POST'])
def message_create():
    data = request.get_json()

    translated_message = MessageForTranslateService.create_message(**data)
    if translated_message:
        return jsonify(translated_message.repr()), 200
    else:
        return jsonify({'message': 'Error - message not created'}), 404
