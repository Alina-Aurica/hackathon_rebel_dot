from application import db
from application.model.models import User


class UserRepository:
    @staticmethod
    def add_user(user):  # create user
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def delete_user(id_user):
        user = User.query.get(id_user)
        if user:
            db.session.delete(user)
            db.session.commit()
            return True
        return False

    @staticmethod
    def update_user(id_user, data):  # edit profile
        user = User.query.get(id_user)
        if user:
            user.name = data.get('name', user.name)
            user.email = data.get('email', user.email)
            user.password = data.get('password', user.password)
            user.country = data.get('country', user.country)
            db.session.commit()
        return user

    @staticmethod
    def find_user_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def find_user_by_name(name):
        return User.query.filter_by(name=name).first()

    @staticmethod
    def find_user_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def find_user_by_email_and_password(email, password):
        return User.query.filter_by(email=email, password=password).first()

    @staticmethod
    def find_all_users():
        return User.query.all()
