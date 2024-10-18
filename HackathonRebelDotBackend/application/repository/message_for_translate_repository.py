from application import db
from application.model.models import User, MessageForTranslate


class MessageForTranslateRepository:
    @staticmethod
    def add_message(message):
        db.session.add(message)
        db.session.commit()
        return message

    @staticmethod
    def delete_message(id_message):
        message = MessageForTranslate.query.get(id_message)
        if message:
            db.session.delete(message)
            db.session.commit()
            return True
        return False

    @staticmethod
    def update_message(id_message, data):
        message = MessageForTranslate.query.get(id_message)
        if message:
            message.name = data.get('message', message.message)
            db.session.commit()
        return message
