from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
from datetime import date, datetime

from application.model.role import Role

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    photo = db.Column(db.String(), nullable=True)
    name = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    password = db.Column(db.String(), nullable=False)
    birthdate = db.Column(db.Date, nullable=False, default=date.today)
    country = db.Column(db.String(), nullable=False)
    maternal_language = db.Column(db.String(), nullable=False)
    foreign_language = db.Column(db.String(), nullable=True)

    def repr(self):
        return {
            "id": self.id,
            "photo": self.photo,
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "birthdate": self.birthdate.strftime("%d/%m/%Y"),
            "country": self.country,
            "maternal_language": self.maternal_language,
            "foreign_language": self.foreign_language
            # "role": self.role.name
        }


class MessageForTranslate(db.Model):
    __tablename__ = 'messages_for_translate'

    id = db.Column(db.Integer, primary_key=True)
    id_sender = db.Column(db.Integer, db.ForeignKey('users.id'))
    id_receiver = db.Column(db.Integer, db.ForeignKey('users.id'))
    original_message = db.Column(db.String(), nullable=False)
    translated_message = db.Column(db.String(), nullable=True)
    message_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    source_language = db.Column(db.String(), nullable=True)
    target_language = db.Column(db.String(), nullable=False)

    def repr(self):
        return {
            "id": self.id,
            "id_sender": self.id_sender,
            "id_receiver": self.id_receiver,
            "original_message": self.original_message,
            "translated_message": self.translated_message,
            "message_date": self.message_date,
            "source_language": self.source_language,
            "target_language": self.target_language
        }


# class MessageTranslated(db.Model):
#     __tablename__ = 'messages_translated'
#
#     id = db.Column(db.Integer, primary_key=True)
#     id_sender = db.Column(db.Integer, db.ForeignKey('users.id'))
#     id_receiver = db.Column(db.Integer, db.ForeignKey('users.id'))
#     message = db.Column(db.String(), nullable=False)
#     original_message = db.Column(db.String(), nullable=False)
#     message_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
#
#     def repr(self):
#         return {
#             "id": self.id,
#             "id_sender": self.id_sender,
#             "id_receiver": self.id_receiver,
#             "message": self.message,
#             "original_message": self.original_message,
#             "message_date": self.message_date
#         }
