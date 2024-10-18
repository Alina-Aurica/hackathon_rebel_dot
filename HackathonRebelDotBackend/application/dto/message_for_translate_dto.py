from datetime import date, datetime

from marshmallow import fields, Schema, validate


class MessageForTranslateDTO(Schema):
    id = fields.Int(dump_only=True)
    id_sender = fields.Integer(required=True, validate=validate.Range(min=1))
    id_receiver = fields.Integer(required=True, validate=validate.Range(min=1))
    original_message = fields.Str(required=True, validate=validate.Length(min=1))
    translated_message = fields.Str(required=False, validate=validate.Length(min=1))
    message_date = fields.Date(required=False, validate=validate.Range(min=datetime.now()))
    source_language = fields.Str(required=False, validate=validate.Length(min=1))
    target_language = fields.Str(required=False, validate=validate.Length(min=1))
