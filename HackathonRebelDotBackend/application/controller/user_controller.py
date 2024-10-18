from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from application.service.user_service import UserService
from werkzeug.security import check_password_hash

user_controller = Blueprint('user_controller', __name__, url_prefix='/user')


@user_controller.route('/people/<int:id_user>', methods=['GET'])
def get_all_users(id_user):
    return UserService.get_all_user(id_user)