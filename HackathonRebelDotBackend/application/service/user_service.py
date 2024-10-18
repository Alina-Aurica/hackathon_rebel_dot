from application.dto.user_dto import UserDTO
from application.model.models import User
from werkzeug.security import generate_password_hash

from application.repository.user_repository import UserRepository


class UserService:
    @staticmethod
    def create_user(**data):
        user_DTO = UserDTO()
        user_data = user_DTO.load(data)

        hashed_password = generate_password_hash(user_data.get('password'))
        user_new = User(name=user_data.get('name'),
                        email=user_data.get('email'),
                        password=hashed_password,
                        birthdate=user_data.get('birthdate'),
                        country=user_data.get('country'),
                        maternal_language=user_data.get('maternal_language'),
                        foreign_language = user_data.get('foreign_language')
                        )

        if UserRepository.find_user_by_email(user_data.get('email')) is None:
            return UserRepository.add_user(user_new)
        return None

    @staticmethod
    def get_user_by_id(id_user):
        return UserRepository.find_user_by_id(id_user)

    @staticmethod
    def get_maternal_language_for_user(id_user):
        user = UserRepository.find_user_by_id(id_user)
        maternal_language = user.maternal_language
        return maternal_language

    @staticmethod
    def get_user_by_email(email):
        return UserRepository.find_user_by_email(email)

    @staticmethod
    def get_user_by_email_and_password(email, password):
        return UserRepository.find_user_by_email_and_password(email, password)

    @staticmethod
    def get_all_user(id_user):
        users = []
        for user in UserRepository.find_all_users():
            if user.id != id_user:
                users.append(user)
        return [user.repr() for user in users]