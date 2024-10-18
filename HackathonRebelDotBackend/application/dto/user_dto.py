from datetime import date

from marshmallow import fields, Schema, validate


class UserDTO(Schema):
    id = fields.Int(dump_only=True)
    photo = fields.Str(required=False)
    name = fields.Str(required=True, validate=validate.Length(min=1))
    email = fields.Str(required=True, validate=validate.Regexp('^[a-zA-Z0-9_. +-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$'))
    password = fields.Str(required=True, validate=validate.Length(min=5))
    birthdate = fields.Date(required=True, validate=validate.Range(max=date.today()))
    country = fields.Str(required=True, validate=validate.Length(min=1))
    maternal_language = fields.Str(required=True, validate=validate.Length(min=1))
    foreign_language = fields.Str(required=False, validate=validate.Length(min=1))
